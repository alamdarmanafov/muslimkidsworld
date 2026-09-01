// supabase/functions/redeem-family-code/index.ts
//
// THIS FUNCTION IS THE OTHER HALF OF THE SERVER-SIDE "ONE DEVICE PER
// FAMILY CODE" ENFORCEMENT.
//
// mobile/src/lib/deviceBinding.ts explicitly documents that, on its
// own, a device can only remember that *it* believes itself bound to
// a code — it has no way to stop a second device from also entering
// the same code. This function is the actual enforcement: it is the
// only thing in the whole system allowed to set
// `family_codes.bound_device_id` / `bound_at`, and it refuses to
// rebind a code that is already bound to a *different* device id.
// Call it once, right after `bindDeviceToFamilyCode()` writes the
// code locally, so the local "I'm bound" state and the server's are
// established together.
//
// Codes also rotate every 30 seconds (generate-family-code revokes
// the previous one each time it mints a new one, and every code
// carries a 30s expires_at) — a code entered after its window closes
// is treated the same as an invalid one, "404 Invalid or expired
// code", unless it's the same device retrying a code it already
// successfully bound.
//
// Request (no parent session required — a child's device calls this
// with the project's anon key, which satisfies default JWT
// verification, plus the code the parent shared with them):
//   POST /functions/v1/redeem-family-code
//   { "code": "583214", "deviceId": "dev_abc123" }
//
// Response:
//   200 { familyId, children: [...] }               — bound (or already
//                                                       bound to this
//                                                       same device)
//   404 { error: "Invalid or expired code" }
//   409 { error: "This code is already linked to another device" }
//   400 { error: "..." }                             — bad request body

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type RedeemBody = {
  code?: unknown;
  deviceId?: unknown;
};

function isValidCode(code: unknown): code is string {
  return typeof code === "string" && /^[0-9]{6}$/.test(code);
}

function isValidDeviceId(deviceId: unknown): deviceId is string {
  return typeof deviceId === "string" && deviceId.length > 0 && deviceId.length <= 256;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: RedeemBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!isValidCode(body.code)) {
    return jsonResponse({ error: "code must be a 6-digit string" }, 400);
  }
  if (!isValidDeviceId(body.deviceId)) {
    return jsonResponse({ error: "deviceId is required" }, 400);
  }
  const code = body.code;
  const deviceId = body.deviceId;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  // Service-role client: redeeming a code has to be able to read and
  // bind a family_codes row that belongs to a family the caller has
  // no session for, which is exactly what parent-scoped RLS forbids —
  // this function is the deliberate, narrow exception, and it only
  // ever acts on the single row matching the submitted code.
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: familyCode, error: lookupError } = await adminClient
    .from("family_codes")
    .select("id, family_id, bound_device_id, expires_at")
    .eq("code", code)
    .is("revoked_at", null)
    .maybeSingle();

  if (lookupError) {
    return jsonResponse({ error: lookupError.message }, 500);
  }
  if (!familyCode) {
    return jsonResponse({ error: "Invalid or expired code" }, 404);
  }

  // The 30-second rotation window: a code that already bound *this*
  // device stays honored even past expiry (a retry from the same
  // device shouldn't fail just because it happened a moment late),
  // but a fresh redemption attempt on an expired code is rejected —
  // this is the actual enforcement, not just a UI countdown.
  const isExpired = new Date(familyCode.expires_at).getTime() < Date.now();
  if (isExpired && familyCode.bound_device_id !== deviceId) {
    return jsonResponse({ error: "Invalid or expired code" }, 404);
  }

  if (familyCode.bound_device_id && familyCode.bound_device_id !== deviceId) {
    // The whole point of this function: a second device with the
    // right code still cannot take over a family already bound to
    // someone else's device.
    return jsonResponse(
      { error: "This code is already linked to another device" },
      409,
    );
  }

  if (!familyCode.bound_device_id) {
    const { data: updatedRows, error: bindError } = await adminClient
      .from("family_codes")
      .update({ bound_device_id: deviceId, bound_at: new Date().toISOString() })
      .eq("id", familyCode.id)
      // Re-check bound_device_id is still null at write time so two
      // concurrent redemptions from different devices can't both win.
      .is("bound_device_id", null)
      .select("id");

    if (bindError) {
      return jsonResponse({ error: bindError.message }, 500);
    }

    if (!updatedRows || updatedRows.length === 0) {
      // Another request bound this code between our lookup above and
      // this write — find out who won and only proceed if it was us
      // (e.g. a retried request from the same device).
      const { data: recheck, error: recheckError } = await adminClient
        .from("family_codes")
        .select("bound_device_id")
        .eq("id", familyCode.id)
        .maybeSingle();

      if (recheckError) {
        return jsonResponse({ error: recheckError.message }, 500);
      }
      if (!recheck || recheck.bound_device_id !== deviceId) {
        return jsonResponse(
          { error: "This code is already linked to another device" },
          409,
        );
      }
    }
  }

  const { data: children, error: childrenError } = await adminClient
    .from("children")
    .select(
      "id, name, age, emoji, color, child_progress ( level, xp, streak, accuracy )",
    )
    .eq("family_id", familyCode.family_id);

  if (childrenError) {
    return jsonResponse({ error: childrenError.message }, 500);
  }

  return jsonResponse({ familyId: familyCode.family_id, children: children ?? [] });
});
