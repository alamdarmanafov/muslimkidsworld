// supabase/functions/verify-apple-purchase/index.ts
//
// After a parent completes an App Store purchase on-device (via
// expo-iap), the client sends us the transaction id instead of just
// trusting its own copy of the purchase. We ask Apple's App Store
// Server API directly — "what is this transaction, and is the
// subscription it belongs to currently active?" — using our own
// signed request, so the answer can't be forged by a jailbroken
// client or a replayed old receipt the way a client-supplied
// "trust me, I bought this" flag could be. See
// _shared/appleIap.ts for the actual Apple-calling logic, shared with
// apple-server-notifications (which re-runs this same "ask Apple"
// step whenever Apple reports a renewal/cancellation on its own).
//
// Confirming a transaction is *real* isn't confirming it's *theirs*:
// Apple will happily confirm any real transactionId regardless of who
// asks, and transaction ids are just numbers — nothing before this
// stopped signed-in Parent A from calling this with Parent B's real
// (observed, guessed, leaked) transaction id and getting Parent A's
// own family upgraded to premium off Parent B's payment, for free,
// forever. The fix is binding at purchase time, not just checking at
// verify time: mobile/app/parent/(tabs)/premium.tsx now passes the
// buying parent's own user id as `appAccountToken` on the
// requestPurchase call, Apple signs that into the transaction, and
// this function refuses to accept a transaction whose
// appAccountToken doesn't match the caller.
//
// Request (parent must be signed in — Authorization bearer token):
//   POST /functions/v1/verify-apple-purchase
//   { "transactionId": "<App Store transaction id>" }
//
// Response:
//   200 { ok: true, status: "active" | "expired" | "cancelled", planSlug: string }
//   400 { error: "..." }
//   401 { error: "Not authenticated" }
//   403 { error: "This purchase does not belong to your account" }
//   404 { error: "No family found for this account" | "Transaction not found" }
//   500 { error: "..." }
//
// Requires these Supabase secrets (see supabase/README.md's
// "In-app purchases (iOS)" section for how to obtain them):
//   APPLE_IAP_KEY_ID       — Key ID of an App Store Connect
//                            "In-App Purchase" API key
//   APPLE_IAP_ISSUER_ID    — Issuer ID shown on the same Keys page
//   APPLE_IAP_PRIVATE_KEY  — the .p8 file's contents, verbatim

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { resolveSubscriptionFromApple } from "../_shared/appleIap.ts";

type Body = { transactionId?: unknown };

function isValidTransactionId(v: unknown): v is string {
  return typeof v === "string" && /^[0-9]{1,32}$/.test(v);
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
  if (!isValidTransactionId(body.transactionId)) {
    return jsonResponse({ error: "transactionId is required" }, 400);
  }
  const transactionId = body.transactionId;

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

  let resolved: Awaited<ReturnType<typeof resolveSubscriptionFromApple>>;
  try {
    resolved = await resolveSubscriptionFromApple(transactionId);
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : "Apple verification failed" }, 500);
  }
  if (!resolved) {
    return jsonResponse({ error: "Transaction not found" }, 404);
  }
  if (resolved.appAccountToken !== user.id) {
    return jsonResponse({ error: "This purchase does not belong to your account" }, 403);
  }

  const { data: plan, error: planError } = await adminClient
    .from("subscription_plans")
    .select("id, slug")
    .eq("apple_product_id", resolved.planAppleProductId)
    .maybeSingle();
  if (planError) {
    return jsonResponse({ error: planError.message }, 500);
  }
  if (!plan) {
    return jsonResponse({ error: "Unknown product" }, 400);
  }

  const { error: upsertError } = await adminClient
    .from("subscriptions")
    .upsert(
      {
        family_id: parent.family_id,
        plan_id: plan.id,
        status: resolved.status,
        current_period_start: resolved.periodStart,
        current_period_end: resolved.periodEnd,
        cancel_at_period_end: resolved.cancelAtPeriodEnd,
        external_provider: "apple",
        external_subscription_id: resolved.originalTransactionId,
      },
      { onConflict: "family_id" },
    );
  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  return jsonResponse({ ok: true, status: resolved.status, planSlug: plan.slug });
});
