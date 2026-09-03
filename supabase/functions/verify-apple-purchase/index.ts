// supabase/functions/verify-apple-purchase/index.ts
//
// After a parent completes an App Store purchase on-device (via
// expo-iap), the client sends us the transaction id instead of just
// trusting its own copy of the purchase. We ask Apple's App Store
// Server API directly — "what is this transaction, and is the
// subscription it belongs to currently active?" — using our own
// signed request, so the answer can't be forged by a jailbroken
// client or a replayed old receipt the way a client-supplied
// "trust me, I bought this" flag could be.
//
// Request (parent must be signed in — Authorization bearer token):
//   POST /functions/v1/verify-apple-purchase
//   { "transactionId": "<App Store transaction id>" }
//
// Response:
//   200 { ok: true, status: "active" | "expired" | "cancelled", planSlug: string }
//   400 { error: "..." }
//   401 { error: "Not authenticated" }
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

const BUNDLE_ID = "com.muslimkidsworld.app";

type Body = { transactionId?: unknown };

function isValidTransactionId(v: unknown): v is string {
  return typeof v === "string" && /^[0-9]{1,32}$/.test(v);
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecodeToJson(segment: string): any {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const withPadding = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  return JSON.parse(atob(withPadding));
}

async function signAppleServerJwt(): Promise<string> {
  const keyId = Deno.env.get("APPLE_IAP_KEY_ID");
  const issuerId = Deno.env.get("APPLE_IAP_ISSUER_ID");
  const privateKeyPem = Deno.env.get("APPLE_IAP_PRIVATE_KEY");
  if (!keyId || !issuerId || !privateKeyPem) {
    throw new Error("Apple IAP credentials are not configured");
  }

  const pkcs8 = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const keyBytes = Uint8Array.from(atob(pkcs8), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", kid: keyId, typ: "JWT" };
  // Apple caps App Store Server API tokens at 60 minutes; 5 minutes is
  // plenty since we sign a fresh one on every call.
  const payload = {
    iss: issuerId,
    iat: now,
    exp: now + 5 * 60,
    aud: "appstoreconnect-v1",
    bid: BUNDLE_ID,
  };

  const encoder = new TextEncoder();
  const signingInput = `${base64url(encoder.encode(JSON.stringify(header)))}.${base64url(encoder.encode(JSON.stringify(payload)))}`;
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    encoder.encode(signingInput),
  );
  // Web Crypto's ECDSA signatures are already the raw r||s (IEEE
  // P1363) format JWS ES256 needs — no DER-to-raw conversion needed.
  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

// Apple's numeric subscription statuses (App Store Server API docs):
// 1 active, 2 expired, 3 in billing retry, 4 in billing grace period,
// 5 revoked. We treat 1/3/4 as still-entitled ("active") since Apple's
// own guidance is to keep serving content through retry/grace periods.
function mapAppleStatus(appleStatus: number): "active" | "expired" | "cancelled" {
  if (appleStatus === 1 || appleStatus === 3 || appleStatus === 4) return "active";
  if (appleStatus === 5) return "cancelled";
  return "expired";
}

async function fetchSubscriptionStatuses(transactionId: string, jwt: string) {
  const hosts = [
    "https://api.storekit.itunes.apple.com",
    "https://api.storekit-sandbox.itunes.apple.com",
  ];
  for (const host of hosts) {
    const res = await fetch(`${host}/inApps/v1/subscriptions/${transactionId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (res.status === 404) continue;
    if (!res.ok) {
      throw new Error(`Apple returned ${res.status}`);
    }
    return await res.json();
  }
  return null;
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

  let appleResponse: any;
  try {
    const jwt = await signAppleServerJwt();
    appleResponse = await fetchSubscriptionStatuses(transactionId, jwt);
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : "Apple verification failed" }, 500);
  }
  if (!appleResponse) {
    return jsonResponse({ error: "Transaction not found" }, 404);
  }

  // data: [{ subscriptionGroupIdentifier, lastTransactions: [{ status, signedTransactionInfo, signedRenewalInfo }] }]
  const group = appleResponse.data?.[0];
  const lastTransaction = group?.lastTransactions?.find((t: any) =>
    t.signedTransactionInfo,
  );
  if (!lastTransaction) {
    return jsonResponse({ error: "Transaction not found" }, 404);
  }

  const [, transactionPayloadSegment] = String(lastTransaction.signedTransactionInfo).split(".");
  const transactionInfo = base64urlDecodeToJson(transactionPayloadSegment);

  if (transactionInfo.bundleId !== BUNDLE_ID) {
    return jsonResponse({ error: "Transaction belongs to a different app" }, 400);
  }

  let cancelAtPeriodEnd = false;
  if (lastTransaction.signedRenewalInfo) {
    try {
      const [, renewalPayloadSegment] = String(lastTransaction.signedRenewalInfo).split(".");
      const renewalInfo = base64urlDecodeToJson(renewalPayloadSegment);
      cancelAtPeriodEnd = renewalInfo.autoRenewStatus === 0;
    } catch {
      // Renewal info is a nice-to-have for the cancel-at-period-end
      // flag; a decode failure there shouldn't fail the whole request.
    }
  }

  const { data: plan, error: planError } = await adminClient
    .from("subscription_plans")
    .select("id, slug")
    .eq("apple_product_id", transactionInfo.productId)
    .maybeSingle();
  if (planError) {
    return jsonResponse({ error: planError.message }, 500);
  }
  if (!plan) {
    return jsonResponse({ error: "Unknown product" }, 400);
  }

  const status = mapAppleStatus(lastTransaction.status);
  const periodStart = transactionInfo.purchaseDate
    ? new Date(transactionInfo.purchaseDate).toISOString()
    : null;
  const periodEnd = transactionInfo.expiresDate
    ? new Date(transactionInfo.expiresDate).toISOString()
    : null;

  const { error: upsertError } = await adminClient
    .from("subscriptions")
    .upsert(
      {
        family_id: parent.family_id,
        plan_id: plan.id,
        status,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
        external_provider: "apple",
        external_subscription_id: String(
          transactionInfo.originalTransactionId ?? transactionId,
        ),
      },
      { onConflict: "family_id" },
    );
  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  return jsonResponse({ ok: true, status, planSlug: plan.slug });
});
