// mobile/src/lib/childSelect.ts
//
// Client side of multi-child device support — app/child-select.tsx.
// Listing is unauthenticated (deviceId only, see list-family-children);
// switching requires the Parent Gate PIN, re-verified server-side by
// set-active-child, since a child device has no parent session to
// authorize the write with otherwise.

import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

export type FamilyChild = {
  id: string;
  name: string;
  age: number | null;
  emoji: string;
  color: string;
};

export type FamilyChildrenResult = {
  children: FamilyChild[];
  activeChildId: string | null;
};

/** Returns null if the device isn't bound yet or the request fails. */
export async function fetchFamilyChildren(): Promise<FamilyChildrenResult | null> {
  try {
    const deviceId = await getDeviceId();
    const { data, error } = await getSupabaseClient().functions.invoke<FamilyChildrenResult>(
      "list-family-children",
      { body: { deviceId } },
    );
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export type SetActiveChildResult = { ok: true } | { ok: false; error: string };

/** Switches which child this device is currently acting as. */
export async function setActiveChild(childId: string, pin: string): Promise<SetActiveChildResult> {
  try {
    const deviceId = await getDeviceId();
    const { error } = await getSupabaseClient().functions.invoke("set-active-child", {
      body: { deviceId, pin, childId },
    });
    if (error) {
      const context = (error as { context?: Response } | null)?.context;
      if (context && typeof context.json === "function") {
        try {
          const body = await context.json();
          if (typeof body?.error === "string") return { ok: false, error: body.error };
        } catch {
          // fall through
        }
      }
      return { ok: false, error: error.message ?? "set-active-child failed" };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
