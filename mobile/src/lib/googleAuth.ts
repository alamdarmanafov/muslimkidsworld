// mobile/src/lib/googleAuth.ts
//
// Native Google Sign-In for the parent app (app/parent-auth.tsx), iOS only.
// Uses @react-native-google-signin/google-signin to get an identity token
// from Google, then hands it to Supabase's signInWithIdToken — the same
// native token-exchange pattern as ./appleAuth.ts, no web redirect involved.
//
// Requires EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID to be set (the iOS OAuth client
// ID from Google Cloud Console) and the matching iosUrlScheme configured on
// the @react-native-google-signin/google-signin plugin in app.json — see
// supabase/README.md.

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { getSupabaseClient } from "./supabase";

export type GoogleSignInResult = { ok: true } | { ok: false; cancelled: boolean; error?: string };

const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

/** Whether EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID is set — callers use this to hide the button entirely until it is. */
export function isGoogleSignInConfigured(): boolean {
  return !!iosClientId;
}

let configured = false;
function ensureConfigured() {
  if (configured || !iosClientId) return;
  GoogleSignin.configure({ iosClientId });
  configured = true;
}

/**
 * Runs the native Google sign-in sheet and exchanges the result with
 * Supabase. Returns `{ ok: false, cancelled: true }` when the user
 * dismisses Google's sheet themselves — callers should treat that as a
 * silent no-op, not an error to show.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (!iosClientId) {
    return { ok: false, cancelled: false, error: "Google Sign-In is not configured" };
  }
  ensureConfigured();

  let idToken: string | null;
  try {
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      return { ok: false, cancelled: true };
    }
    idToken = response.data.idToken;
  } catch (err) {
    if (isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED) {
      return { ok: false, cancelled: true };
    }
    return { ok: false, cancelled: false, error: err instanceof Error ? err.message : String(err) };
  }

  if (!idToken) {
    return { ok: false, cancelled: false, error: "Google did not return an identity token" };
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
  if (error) return { ok: false, cancelled: false, error: error.message };

  return { ok: true };
}
