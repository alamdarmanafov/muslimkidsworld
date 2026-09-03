// supabase/functions/set-active-child/index.ts
//
// Lets a parent pick which child a shared device is currently acting
// as (mobile/app/child-select.tsx) — the write half of multi-child
// support. A child device never has a parent auth session (see
// get-child-progress's header comment on why), so this can't check
// "is the caller a parent" the way an authenticated-parent function
// would; instead it re-verifies the Parent Gate PIN itself, hashing
// and comparing against families.pin_hash exactly like
// verify-parent-pin does — the PIN is the authorization here, and
// nothing about it (hash or plaintext) ever reaches the client either
// way.
//
// Sets family_codes.active_child_id on this device's binding row;
// _shared/resolveChild.ts (used by get-child-progress,
// record-quiz-result, mark-journey-item, register-push-token) reads
// it back from there.
//
// Request:
//   POST /functions/v1/set-active-child
//   { "deviceId": "dev_abc123", "pin": "1234", "childId": "<uuid>" }
//
// Response:
//   200 { ok: true }
//   401 { error: "Incorrect PIN" | "No Parent Gate PIN has been set for this family" }
//   404 { error: "Device is not bound to a family" | "Child not found in this family" }
//   400 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type Body = { deviceId?: unknown; pin?: unknown; childId?: unknown };

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
}
function isValidPin(v: unknown): v is string {
  return typeof v === "string" && /^[0-9]{4}$/.test(v);
}
function isValidChildId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 64;
}

async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
  if (!isValidChildId(body.childId)) {
    return jsonResponse({ error: "childId is required" }, 400);
  }
  const deviceId = body.deviceId;
  const pin = body.pin;
  const childId = body.childId;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: boundCode, error: codeError } = await adminClient
    .from("family_codes")
    .select("id, family_id")
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
    .select("pin_hash")
    .eq("id", boundCode.family_id)
    .maybeSingle();
  if (familyError) {
    return jsonResponse({ error: familyError.message }, 500);
  }
  if (!family?.pin_hash) {
    return jsonResponse({ error: "No Parent Gate PIN has been set for this family" }, 401);
  }

  const submittedHash = await hashPin(pin);
  if (submittedHash !== family.pin_hash) {
    return jsonResponse({ error: "Incorrect PIN" }, 401);
  }

  const { data: child, error: childError } = await adminClient
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("family_id", boundCode.family_id)
    .maybeSingle();
  if (childError) {
    return jsonResponse({ error: childError.message }, 500);
  }
  if (!child) {
    return jsonResponse({ error: "Child not found in this family" }, 404);
  }

  const { error: updateError } = await adminClient
    .from("family_codes")
    .update({ active_child_id: childId })
    .eq("id", boundCode.id);
  if (updateError) {
    return jsonResponse({ error: updateError.message }, 500);
  }

  return jsonResponse({ ok: true });
});
