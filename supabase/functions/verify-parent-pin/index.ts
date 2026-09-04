// supabase/functions/verify-parent-pin/index.ts
//
// Lets a child's device check a PIN against its family's real Parent
// Gate PIN (mobile/app/parent-pin.tsx) without ever handing the hash
// — or the plaintext PIN — to a device that has no auth session at
// all. Same device-id -> family_codes -> family resolution as
// get-child-progress / record-quiz-result; see that function's header
// comment for why this has to be a service-role edge function rather
// than a direct table read.
//
// Request:
//   POST /functions/v1/verify-parent-pin
//   { "deviceId": "dev_abc123", "pin": "1234" }
//
// Response:
//   200 { valid: boolean, pinSet: boolean }  — pinSet is false (valid
//                                              always false too) if no
//                                              parent has set a PIN
//                                              yet; the caller must
//                                              treat that as "denied",
//                                              never "no PIN needed"
//   404 { error: "Device is not bound to a family" }
//   400 { error: "..." }
//   429 { error: "...", locked: true, retryAfterSeconds: number }
//                                            — 3 wrong PINs in a row;
//                                              see _shared/lockout.ts

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { checkLockout, clearLockout, lockoutKeys, recordFailedAttempt } from "../_shared/lockout.ts";
import { hashPin } from "../_shared/pinHash.ts";

const LOCKOUT_ACTION = "pin";

type Body = { deviceId?: unknown; pin?: unknown };

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
}
function isValidPin(v: unknown): v is string {
  return typeof v === "string" && /^[0-9]{4}$/.test(v);
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

  if (!isValidDeviceId(body.deviceId)) {
    return jsonResponse({ error: "deviceId is required" }, 400);
  }
  if (!isValidPin(body.pin)) {
    return jsonResponse({ error: "pin must be exactly 4 digits" }, 400);
  }
  const deviceId = body.deviceId;
  const pin = body.pin;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const keys = lockoutKeys(deviceId, req);
  const lockout = await checkLockout(adminClient, keys, LOCKOUT_ACTION);
  if (lockout.locked) {
    return jsonResponse(
      { error: "Too many wrong PIN attempts. Try again later.", locked: true, retryAfterSeconds: lockout.retryAfterSeconds },
      429,
    );
  }

  const { data: boundCode, error: codeError } = await adminClient
    .from("family_codes")
    .select("family_id")
    .eq("bound_device_id", deviceId)
    .is("revoked_at", null)
    .order("bound_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (codeError) {
    return jsonResponse({ error: codeError.message }, 500);
  }
  if (!boundCode) {
    return jsonResponse({ error: "Device is not bound to a family" }, 404);
  }

  const { data: family, error: familyError } = await adminClient
    .from("families")
    .select("pin_hash, pin_salt")
    .eq("id", boundCode.family_id)
    .maybeSingle();
  if (familyError) {
    return jsonResponse({ error: familyError.message }, 500);
  }
  if (!family?.pin_hash) {
    return jsonResponse({ valid: false, pinSet: false });
  }

  const submittedHash = await hashPin(pin, family.pin_salt);
  const valid = submittedHash === family.pin_hash;
  if (valid) {
    await clearLockout(adminClient, keys, LOCKOUT_ACTION);
  } else {
    await recordFailedAttempt(adminClient, keys, LOCKOUT_ACTION);
  }
  return jsonResponse({ valid, pinSet: true });
});
