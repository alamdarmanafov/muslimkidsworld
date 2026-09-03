// supabase/functions/apple-server-notifications/index.ts
//
// Closes the gap noted in supabase/README.md: verify-apple-purchase
// only ever runs when the app itself asks (a new purchase, or
// "Restore purchases") — a renewal, cancellation, refund, or billing
// failure Apple processes entirely on its own side never reached
// `subscriptions` before. App Store Server Notifications V2 is Apple
// POSTing here whenever any of that happens.
//
// On trust: Apple signs each notification as a JWS, and the fully
// correct way to trust it is to verify that signature against the
// x5c certificate chain in its header, walked up to Apple's own root
// CA — real X.509 chain validation, not something to hand-roll from
// memory in an environment with no way to run the result against a
// real notification before shipping it. So this function doesn't
// trust the notification's *contents* at all — it only reads the
// `originalTransactionId` out of the (unverified) payload as a
// pointer to "which subscription might have changed", looks up which
// family that transaction belongs to (only transactions
// verify-apple-purchase already wrote have a match — an unknown id is
// just a no-op), and then re-runs the exact same
// resolveSubscriptionFromApple() call verify-apple-purchase uses:
// asking Apple's App Store Server API directly, over HTTPS, with our
// own signed credentials. Whatever Apple's authenticated response
// says is what gets written — never anything decoded from the
// incoming request body. A forged POST here can at worst trigger a
// redundant, harmless re-check of a real transaction; it can never by
// itself change what subscriptions ends up holding.
//
// Configure this URL as the "Production Server URL" (and, if you
// want sandbox notifications too, "Sandbox Server URL") in App Store
// Connect → your app → App Information → App Store Server
// Notifications. Always responds 200 (even to a payload it can't use)
// so Apple doesn't retry — see supabase/README.md's "In-app purchases"
// section.

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { decodeJwsPayload, resolveSubscriptionFromApple } from "../_shared/appleIap.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let signedPayload: unknown;
  try {
    const body = await req.json();
    signedPayload = body?.signedPayload;
  } catch {
    // Malformed body from something that isn't actually Apple —
    // nothing to do, but still 200 so nothing retries forever.
    return jsonResponse({ ok: true });
  }
  if (typeof signedPayload !== "string" || signedPayload.split(".").length !== 3) {
    return jsonResponse({ ok: true });
  }

  let originalTransactionId: string | null = null;
  try {
    const notification = decodeJwsPayload(signedPayload);
    const transactionInfoJws = notification?.data?.signedTransactionInfo;
    if (typeof transactionInfoJws === "string") {
      const transactionInfo = decodeJwsPayload(transactionInfoJws);
      if (transactionInfo?.originalTransactionId) {
        originalTransactionId = String(transactionInfo.originalTransactionId);
      }
    }
  } catch {
    // Can't make sense of this payload — nothing to look up.
  }
  if (!originalTransactionId) {
    return jsonResponse({ ok: true });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: true });
  }
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Only a transaction verify-apple-purchase already recorded has a
  // family to update — an unrecognized id (a different app entirely,
  // or a notification for a purchase that somehow never got verified
  // client-side) is a safe no-op, not an error.
  const { data: existingSubscription } = await adminClient
    .from("subscriptions")
    .select("family_id")
    .eq("external_provider", "apple")
    .eq("external_subscription_id", originalTransactionId)
    .maybeSingle();
  if (!existingSubscription) {
    return jsonResponse({ ok: true });
  }

  try {
    const resolved = await resolveSubscriptionFromApple(originalTransactionId);
    if (!resolved) {
      return jsonResponse({ ok: true });
    }

    const { data: plan } = await adminClient
      .from("subscription_plans")
      .select("id")
      .eq("apple_product_id", resolved.planAppleProductId)
      .maybeSingle();
    if (!plan) {
      return jsonResponse({ ok: true });
    }

    await adminClient
      .from("subscriptions")
      .update({
        plan_id: plan.id,
        status: resolved.status,
        current_period_start: resolved.periodStart,
        current_period_end: resolved.periodEnd,
        cancel_at_period_end: resolved.cancelAtPeriodEnd,
      })
      .eq("family_id", existingSubscription.family_id);
  } catch (err) {
    console.error(
      "apple-server-notifications: re-verify failed",
      err instanceof Error ? err.message : String(err),
    );
    // Still 200 — Apple retrying won't help if e.g. our own
    // credentials are misconfigured, and we don't want it hammering
    // this endpoint on every notification until someone notices.
  }

  return jsonResponse({ ok: true });
});
