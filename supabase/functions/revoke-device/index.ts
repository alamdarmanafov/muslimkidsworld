// supabase/functions/revoke-device/index.ts
//
// Lets a signed-in parent cut off a specific child device's access —
// for a lost/stolen/reassigned device, or just to force it to
// re-pair. Sets family_codes.revoked_at on that device's binding row;
// get-child-progress, record-quiz-result, and register-push-token all
// filter on revoked_at is null when resolving a device to a family,
// so this takes effect immediately on that device's next request (it
// gets the same "Device is not bound to a family" 404 as one that was
// never paired — the client can't distinguish "never bound" from
// "revoked", which is intentional: nothing about a revocation should
// be observable from the device side beyond losing access).
//
// Request (parent must be signed in — Authorization bearer token):
//   POST /functions/v1/revoke-device
//   { "familyCodeId": "<uuid>" }
//
// Response:
//   200 { ok: true }
//   400 { error: "..." }
//   401 { error: "Not authenticated" }
//   404 { error: "No family found for this account" | "Device not found" }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type Body = { familyCodeId?: unknown };

function isValidId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 64;
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

  if (!isValidId(body.familyCodeId)) {
    return jsonResponse({ error: "familyCodeId is required" }, 400);
  }
  const familyCodeId = body.familyCodeId;

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

  const { data: parent, error: parentError } = await adminClient
    .from("parents")
    .select("family_id")
    .eq("id", user.id)
    .maybeSingle();
  if (parentError) {
    return jsonResponse({ error: parentError.message }, 500);
  }
  if (!parent) {
    return jsonResponse({ error: "No family found for this account" }, 404);
  }

  // Scoped to this parent's own family_id so one family can never
  // revoke another's device by guessing/enumerating a familyCodeId.
  const { data: updatedRows, error: revokeError } = await adminClient
    .from("family_codes")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", familyCodeId)
    .eq("family_id", parent.family_id)
    .not("bound_device_id", "is", null)
    .select("id");

  if (revokeError) {
    return jsonResponse({ error: revokeError.message }, 500);
  }
  if (!updatedRows || updatedRows.length === 0) {
    return jsonResponse({ error: "Device not found" }, 404);
  }

  return jsonResponse({ ok: true });
});
