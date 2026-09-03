// supabase/functions/register-push-token/index.ts
//
// Saves an Expo push token so record-quiz-result (achievement earned)
// and send-daily-reminders can later notify the right device. Called
// by mobile/src/lib/pushNotifications.ts for both:
//   - a signed-in parent (Authorization bearer token holds their
//     session — same auth.getUser(bearerToken) pattern as
//     set-parent-pin) → owner_type "parent", owner_id = auth.users.id
//   - a child device with no session, calling with just the anon key
//     (so auth.getUser fails) → falls back to deviceId, resolved to
//     its bound family's child the same way get-child-progress does
//
// Request:
//   POST /functions/v1/register-push-token
//   { "token": "ExponentPushToken[...]", "deviceId": "dev_abc123" }
//   (deviceId only required when there's no parent session)
//
// Response:
//   200 { ok: true }
//   400 { error: "..." }
//   404 { error: "Device is not bound to a family" | "No child found for this family" }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { isResolveError, resolveDeviceChild } from "../_shared/resolveChild.ts";

type Body = { token?: unknown; deviceId?: unknown };

function isValidToken(v: unknown): v is string {
  return typeof v === "string" && v.startsWith("ExponentPushToken[") && v.length <= 200;
}
function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
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

  if (!isValidToken(body.token)) {
    return jsonResponse({ error: "token is required" }, 400);
  }
  const token = body.token;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");

  let ownerType: "parent" | "child";
  let ownerId: string;

  const callerClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
  let authenticatedUserId: string | null = null;
  if (bearerToken) {
    const { data } = await callerClient.auth.getUser(bearerToken);
    authenticatedUserId = data.user?.id ?? null;
  }

  if (authenticatedUserId) {
    ownerType = "parent";
    ownerId = authenticatedUserId;
  } else {
    if (!isValidDeviceId(body.deviceId)) {
      return jsonResponse({ error: "deviceId is required" }, 400);
    }

    const resolved = await resolveDeviceChild(adminClient, body.deviceId);
    if (isResolveError(resolved)) {
      return jsonResponse({ error: resolved.error }, resolved.status);
    }

    ownerType = "child";
    ownerId = resolved.childId;
  }

  const { error: upsertError } = await adminClient.from("push_tokens").upsert(
    {
      owner_type: ownerType,
      owner_id: ownerId,
      expo_push_token: token,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "expo_push_token" },
  );
  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  return jsonResponse({ ok: true });
});
