// mobile/src/lib/parentPin.ts
//
// The Parent Gate PIN — set by a signed-in parent
// (app/parent/parent-pin-setup.tsx), checked by a child's device
// (app/parent-pin.tsx) before it's allowed into /parent. The two
// halves use different auth contexts (a real parent session vs. no
// session at all), so — like childProgress.ts — the actual PIN check
// happens server-side in an edge function; see
// supabase/functions/set-parent-pin and verify-parent-pin for why.

import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

/** Sets/changes the signed-in parent's family PIN. Requires a parent session. */
export async function setParentPin(pin: string): Promise<boolean> {
  try {
    const { error } = await getSupabaseClient().functions.invoke("set-parent-pin", {
      body: { pin },
    });
    return !error;
  } catch {
    return false;
  }
}

export type VerifyParentPinResult = { valid: boolean; pinSet: boolean };

/**
 * Checks a PIN typed on a child's device against its family's real
 * PIN. Returns { valid: false, pinSet: false } on any failure
 * (network error, device not bound, no PIN set yet) — every one of
 * those must deny entry to parent mode, never allow it.
 */
export async function verifyParentPin(pin: string): Promise<VerifyParentPinResult> {
  try {
    const deviceId = await getDeviceId();
    const { data, error } = await getSupabaseClient().functions.invoke<VerifyParentPinResult>(
      "verify-parent-pin",
      { body: { deviceId, pin } },
    );
    if (error || !data) return { valid: false, pinSet: false };
    return data;
  } catch {
    return { valid: false, pinSet: false };
  }
}
