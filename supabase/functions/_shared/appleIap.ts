// supabase/functions/_shared/appleIap.ts
//
// Everything verify-apple-purchase and apple-server-notifications both
// need to talk to Apple's App Store Server API: signing our own
// ES256 JWT (Apple's required auth for that API — a completely
// separate credential from Sign in with Apple's, see
// supabase/README.md's "In-app purchases" section for how to obtain
// it), calling "Get All Subscription Statuses", decoding the JWS
// payloads Apple's API returns, and mapping Apple's numeric status
// enum onto this app's subscriptions.status values. Extracted here so
// the notifications webhook can reuse the exact same
// "ask Apple directly, don't trust anything else" logic instead of
// duplicating it.

export const APPLE_BUNDLE_ID = "com.muslimkidsworld.app";

export function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// deno-lint-ignore no-explicit-any
export function base64urlDecodeToJson(segment: string): any {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const withPadding = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  return JSON.parse(atob(withPadding));
}

// deno-lint-ignore no-explicit-any
export function decodeJwsPayload(jws: string): any {
  const [, payloadSegment] = jws.split(".");
  return base64urlDecodeToJson(payloadSegment);
}

export async function signAppleServerJwt(): Promise<string> {
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
    bid: APPLE_BUNDLE_ID,
  };

  const encoder = new TextEncoder();
  const signingInput = `${base64urlEncode(encoder.encode(JSON.stringify(header)))}.${base64urlEncode(encoder.encode(JSON.stringify(payload)))}`;
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    encoder.encode(signingInput),
  );
  // Web Crypto's ECDSA signatures are already the raw r||s (IEEE
  // P1363) format JWS ES256 needs — no DER-to-raw conversion needed.
  return `${signingInput}.${base64urlEncode(new Uint8Array(signature))}`;
}

// Apple's numeric subscription statuses (App Store Server API docs):
// 1 active, 2 expired, 3 in billing retry, 4 in billing grace period,
// 5 revoked. We treat 1/3/4 as still-entitled ("active") since Apple's
// own guidance is to keep serving content through retry/grace periods.
export function mapAppleStatus(appleStatus: number): "active" | "expired" | "cancelled" {
  if (appleStatus === 1 || appleStatus === 3 || appleStatus === 4) return "active";
  if (appleStatus === 5) return "cancelled";
  return "expired";
}

/**
 * Calls Apple's "Get All Subscription Statuses" endpoint for a given
 * transaction id, trying production first and falling back to sandbox
 * on a 404 (a sandbox/TestFlight purchase doesn't exist in
 * production). Returns null if Apple doesn't recognize the
 * transaction in either environment.
 */
// deno-lint-ignore no-explicit-any
export async function fetchSubscriptionStatuses(transactionId: string, jwt: string): Promise<any> {
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

export type ResolvedSubscription = {
  status: "active" | "expired" | "cancelled";
  planAppleProductId: string;
  originalTransactionId: string;
  periodStart: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /**
   * The value the client passed as appAccountToken when it initiated
   * the purchase (mobile/app/parent/(tabs)/premium.tsx's requestPurchase
   * call sets this to the signed-in parent's own auth user id) — Apple
   * signs it into the transaction, so it can't be forged by whoever
   * calls verify-apple-purchase afterwards. null if the purchase was
   * made without one (a real transaction id from an *unrelated*
   * account, with no way to prove who actually bought it).
   */
  appAccountToken: string | null;
};

/**
 * The full "ask Apple, don't trust the caller" flow: signs our own
 * JWT, asks Apple for this transaction's subscription group, and
 * decodes the (Apple-signed, Apple-served-over-HTTPS) transaction and
 * renewal info into the fields subscriptions needs. Returns null if
 * Apple doesn't recognize the transaction at all.
 */
export async function resolveSubscriptionFromApple(
  transactionId: string,
): Promise<ResolvedSubscription | null> {
  const jwt = await signAppleServerJwt();
  const appleResponse = await fetchSubscriptionStatuses(transactionId, jwt);
  if (!appleResponse) return null;

  // data: [{ subscriptionGroupIdentifier, lastTransactions: [{ status, signedTransactionInfo, signedRenewalInfo }] }]
  const group = appleResponse.data?.[0];
  // deno-lint-ignore no-explicit-any
  const lastTransaction = group?.lastTransactions?.find((t: any) => t.signedTransactionInfo);
  if (!lastTransaction) return null;

  const transactionInfo = decodeJwsPayload(String(lastTransaction.signedTransactionInfo));
  if (transactionInfo.bundleId !== APPLE_BUNDLE_ID) {
    throw new Error("Transaction belongs to a different app");
  }

  let cancelAtPeriodEnd = false;
  if (lastTransaction.signedRenewalInfo) {
    try {
      const renewalInfo = decodeJwsPayload(String(lastTransaction.signedRenewalInfo));
      cancelAtPeriodEnd = renewalInfo.autoRenewStatus === 0;
    } catch {
      // Renewal info is a nice-to-have for the cancel-at-period-end
      // flag; a decode failure there shouldn't fail the whole request.
    }
  }

  return {
    status: mapAppleStatus(lastTransaction.status),
    planAppleProductId: transactionInfo.productId,
    originalTransactionId: String(transactionInfo.originalTransactionId ?? transactionId),
    periodStart: transactionInfo.purchaseDate ? new Date(transactionInfo.purchaseDate).toISOString() : null,
    periodEnd: transactionInfo.expiresDate ? new Date(transactionInfo.expiresDate).toISOString() : null,
    cancelAtPeriodEnd,
    appAccountToken:
      typeof transactionInfo.appAccountToken === "string" ? transactionInfo.appAccountToken : null,
  };
}
