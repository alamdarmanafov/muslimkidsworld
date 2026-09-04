// supabase/functions/admin-broadcast-notification/index.ts
//
// Sends a real push notification to a real audience of parents and
// logs the send to admin_broadcasts (0030_admin_broadcasts.sql) —
// backs app/admin/notifications/page.tsx's "Yeni bildiriş yarat" form
// in the root Next.js admin dashboard. Reuses the same sendExpoPush
// helper record-quiz-result/send-daily-reminders already use, so this
// is the same real Expo push path, not a separate mock one.
//
// Requires the caller to be a signed-in admin (parents.is_admin —
// same auth pattern set-parent-pin uses to identify the caller, plus
// an is_admin check like admin/index.html's RLS-backed writes rely
// on) — this function bypasses RLS via the service-role client, so it
// has to enforce that check itself rather than leaning on a policy.
//
// Request (admin must be signed in — Authorization bearer token):
//   POST /functions/v1/admin-broadcast-notification
//   { "title": "...", "body": "...", "audience": "all_parents" | "premium_parents" }
//
// Response:
//   200 { ok: true, sentCount: 128 }
//   400 { error: "title and body are required" }
//   401 { error: "Not authenticated" }
//   403 { error: "Not an admin" }
//   500 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { sendExpoPush } from "../_shared/push.ts";

type Audience = "all_parents" | "premium_parents";
type Body = { title?: unknown; body?: unknown; audience?: unknown };

function isAudience(v: unknown): v is Audience {
  return v === "all_parents" || v === "premium_parents";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message = typeof body.body === "string" ? body.body.trim() : "";
  if (!title || !message) {
    return jsonResponse({ error: "title and body are required" }, 400);
  }
  if (!isAudience(body.audience)) {
    return jsonResponse({ error: "audience must be all_parents or premium_parents" }, 400);
  }
  const audience = body.audience;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");
  if (!bearerToken) {
    return jsonResponse({ error: "Not authenticated" }, 401);
  }

  const callerClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser(bearerToken);
  if (userError || !user) {
    return jsonResponse({ error: "Not authenticated" }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: caller, error: callerError } = await adminClient
    .from("parents")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (callerError) {
    return jsonResponse({ error: callerError.message }, 500);
  }
  if (!caller?.is_admin) {
    return jsonResponse({ error: "Not an admin" }, 403);
  }

  let parentIds: string[];
  if (audience === "premium_parents") {
    const { data: activeSubs, error: subsError } = await adminClient
      .from("subscriptions")
      .select("family_id")
      .eq("status", "active");
    if (subsError) return jsonResponse({ error: subsError.message }, 500);
    const familyIds = (activeSubs ?? []).map((s: { family_id: string }) => s.family_id);
    if (familyIds.length === 0) {
      parentIds = [];
    } else {
      const { data: parentRows, error: parentsError } = await adminClient
        .from("parents")
        .select("id")
        .in("family_id", familyIds);
      if (parentsError) return jsonResponse({ error: parentsError.message }, 500);
      parentIds = (parentRows ?? []).map((p: { id: string }) => p.id);
    }
  } else {
    const { data: parentRows, error: parentsError } = await adminClient.from("parents").select("id");
    if (parentsError) return jsonResponse({ error: parentsError.message }, 500);
    parentIds = (parentRows ?? []).map((p: { id: string }) => p.id);
  }

  let tokens: string[] = [];
  if (parentIds.length > 0) {
    const { data: tokenRows, error: tokensError } = await adminClient
      .from("push_tokens")
      .select("expo_push_token")
      .eq("owner_type", "parent")
      .in("owner_id", parentIds);
    if (tokensError) return jsonResponse({ error: tokensError.message }, 500);
    tokens = (tokenRows ?? []).map((r: { expo_push_token: string }) => r.expo_push_token);
  }

  await sendExpoPush(tokens, title, message);

  const { error: insertError } = await adminClient.from("admin_broadcasts").insert({
    title,
    body: message,
    audience,
    sent_count: tokens.length,
    created_by: user.id,
  });
  if (insertError) {
    return jsonResponse({ error: insertError.message }, 500);
  }

  return jsonResponse({ ok: true, sentCount: tokens.length });
});
