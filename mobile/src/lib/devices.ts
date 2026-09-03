// mobile/src/lib/devices.ts
//
// Lets a parent see which devices are connected to their family and
// disconnect one — app/parent/devices.tsx. Listing reads
// family_codes directly (parents already have SELECT RLS on it, see
// 0004_rls_policies.sql), same as family-code.tsx already implies;
// only the write (revoking) needs the revoke-device edge function,
// since parents have no direct UPDATE grant on family_codes.

import { getSupabaseClient } from "./supabase";

export type ConnectedDevice = {
  familyCodeId: string;
  deviceId: string;
  boundAt: string;
};

/**
 * Every currently-connected (bound, not revoked) device for the
 * signed-in parent's family, most recently connected first. Returns
 * an empty array on failure — callers should render an empty state,
 * not an error screen.
 */
export async function fetchConnectedDevices(): Promise<ConnectedDevice[]> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("family_codes")
      .select("id, bound_device_id, bound_at")
      .not("bound_device_id", "is", null)
      .is("revoked_at", null)
      .order("bound_at", { ascending: false });
    if (error || !data) return [];
    return data
      .filter((row): row is typeof row & { bound_device_id: string; bound_at: string } =>
        Boolean(row.bound_device_id && row.bound_at),
      )
      .map((row) => ({
        familyCodeId: row.id,
        deviceId: row.bound_device_id,
        boundAt: row.bound_at,
      }));
  } catch {
    return [];
  }
}

/** Disconnects a device — its next request gets treated as unbound. */
export async function revokeDevice(familyCodeId: string): Promise<boolean> {
  try {
    const { error } = await getSupabaseClient().functions.invoke("revoke-device", {
      body: { familyCodeId },
    });
    return !error;
  } catch {
    return false;
  }
}
