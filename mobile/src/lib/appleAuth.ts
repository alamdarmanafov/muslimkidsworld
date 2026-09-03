// mobile/src/lib/appleAuth.ts
//
// Native Sign in with Apple for the parent app (app/parent-auth.tsx).
// Uses expo-apple-authentication to get an identity token from iOS,
// then hands it to Supabase's signInWithIdToken — no web redirect, no
// Services ID/redirect-URL setup, just the app's own bundle
// identifier registered as an authorized client ID on Supabase's
// Apple provider (see supabase/README.md).
//
// handle_new_parent() (0001_core_schema.sql) fires on any new
// auth.users row regardless of how it was created, so a first-time
// Apple sign-in gets a family + parents row the same way email/password
// signup does — nothing extra needed there. The one thing Apple does
// differently: it only ever hands back the user's name on their very
// first authorization, never again — so that's the only moment this
// can save it to parents.full_name.

import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { getSupabaseClient } from "./supabase";

export type AppleSignInResult = { ok: true } | { ok: false; cancelled: boolean; error?: string };

/**
 * Runs the native Apple sign-in sheet and exchanges the result with
 * Supabase. Returns `{ ok: false, cancelled: true }` when the user
 * dismisses Apple's sheet themselves — callers should treat that as a
 * silent no-op, not an error to show.
 */
export async function signInWithApple(): Promise<AppleSignInResult> {
  // A random value Apple signs into the identity token's `nonce`
  // claim (hashed) and Supabase re-hashes to compare — standard OIDC
  // replay protection, see signInWithIdToken's `nonce` param.
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (err) {
    const code = (err as { code?: string } | null)?.code;
    if (code === "ERR_REQUEST_CANCELED") return { ok: false, cancelled: true };
    return { ok: false, cancelled: false, error: err instanceof Error ? err.message : String(err) };
  }

  if (!credential.identityToken) {
    return { ok: false, cancelled: false, error: "Apple did not return an identity token" };
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) return { ok: false, cancelled: false, error: error.message };

  // Only present on this user's very first Apple sign-in ever.
  const fullName = credential.fullName
    ? AppleAuthentication.formatFullName(credential.fullName)
    : null;
  if (fullName && data.user) {
    await supabase.from("parents").update({ full_name: fullName }).eq("id", data.user.id);
  }

  return { ok: true };
}
