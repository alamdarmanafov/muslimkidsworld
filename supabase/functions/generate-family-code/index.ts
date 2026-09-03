// supabase/functions/generate-family-code/index.ts
//
// THIS FUNCTION IS ONE HALF OF THE SERVER-SIDE "ONE DEVICE PER FAMILY
// CODE" ENFORCEMENT.
//
// mobile/src/lib/deviceBinding.ts explicitly documents that it can
// only *remember* a family code binding locally on one device — it
// has no way to know whether that same code has already been bound
// to a different device, because that requires a single shared source
// of truth. This function (called by an authenticated parent) and its
// counterpart `redeem-family-code` (called by a child's device) are
// that shared source of truth: codes live in the `family_codes`
// table, and only `redeem-family-code` is allowed to set
// `bound_device_id`/`bound_at` on a row, exactly once.
//
// Request (parent must be signed in — send their Supabase session's
// access token as the Authorization bearer):
//   POST /functions/v1/generate-family-code
//   (no body required)
//
// The code rotates: every call revokes the family's previous
// unrevoked code (if any) and mints a new one good for 30 seconds.
// Callers (the parent app) are expected to call this again roughly
// every 30 seconds while the "connect a child" screen is open.
//
// Response:
//   200 { code: "583214", familyCodeId: "<uuid>", expiresAt: "<ISO 8601>" }
//   401 { error: "..." }  — caller is not an authenticated parent
//   500 { error: "..." }  — could not generate a unique code

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const MAX_ATTEMPTS = 10;

function randomSixDigitCode(): string {
  // 000000-999999, zero-padded, using a cryptographically strong
  // random source rather than Math.random().
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return n.toString().padStart(6, "0");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

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

  // A client scoped to the caller's own JWT, used only to identify
  // who is calling (auth.uid()) — it never bypasses RLS. Matches the
  // pattern from Supabase's own Edge Function auth-context docs:
  // pass the bearer token to getUser() explicitly rather than relying
  // on it being picked up implicitly.
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

  // Service-role client for the privileged reads/writes below — the
  // parent's own RLS grants only let them SELECT family_codes, not
  // INSERT, so this function has to do the write on their behalf
  // (after confirming above who they are).
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

  // This code rotates every 30 seconds (see
  // mobile/app/parent/family-code.tsx, which calls this function on
  // that cadence): revoke whatever the family's previous *unbound*
  // code was before minting a new one, so only ever one rotating code
  // per family is usable at a time and old codes stop working the
  // moment a fresh one is issued, not just when their 30s expiry
  // passes. Deliberately excludes rows that already have a
  // bound_device_id — those are a connected child device, not a
  // stale rotation code, and must survive a parent reopening this
  // screen to connect a second child. Revoking an already-connected
  // device is revoke-device's job, not this one's.
  const { error: revokeError } = await adminClient
    .from("family_codes")
    .update({ revoked_at: new Date().toISOString() })
    .eq("family_id", parent.family_id)
    .is("revoked_at", null)
    .is("bound_device_id", null);

  if (revokeError) {
    return jsonResponse({ error: revokeError.message }, 500);
  }

  const expiresAt = new Date(Date.now() + 30_000).toISOString();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = randomSixDigitCode();
    const { data: inserted, error: insertError } = await adminClient
      .from("family_codes")
      .insert({
        family_id: parent.family_id,
        code,
        created_by: user.id,
        expires_at: expiresAt,
      })
      .select("id, code, expires_at")
      .single();

    if (!insertError && inserted) {
      return jsonResponse({
        code: inserted.code,
        familyCodeId: inserted.id,
        expiresAt: inserted.expires_at,
      });
    }

    // 23505 = unique_violation. Only the "code already active" index
    // is expected to collide (extremely rare at 1-in-a-million odds);
    // any other error should surface immediately instead of retrying.
    const isUniqueViolation =
      insertError &&
      "code" in insertError &&
      (insertError as { code?: string }).code === "23505";

    if (!isUniqueViolation) {
      return jsonResponse(
        { error: insertError?.message ?? "Failed to create family code" },
        500,
      );
    }
    // else: collided with an active code, loop and try a new one.
  }

  return jsonResponse(
    { error: "Could not generate a unique family code, please retry" },
    500,
  );
});
