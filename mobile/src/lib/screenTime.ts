// mobile/src/lib/screenTime.ts
//
// Real screen-time: families.daily_limit_minutes is a real,
// parent-set, server-side setting now (0019_screen_time.sql) — see
// that migration's comment for why the old mock.ts
// getDailyLimitMinutes()/setDailyLimitMinutes() were an illusion that
// could never actually sync between a parent's device and a child's.
//
// Parent side (app/parent/daily-limit.tsx) reads/writes families
// directly — it's RLS-scoped to the signed-in parent's own family
// (0004_rls_policies.sql), no edge function needed, same as other
// parent-authenticated writes in this app (e.g. mobile/src/lib/children.ts).
// Child side (ScreenTimeTracker.tsx) has no session, so it goes
// through record-screen-time like every other child-device write.

import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

/** The signed-in parent's family's current daily limit, or null on failure. */
export async function fetchDailyLimitMinutes(): Promise<number | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("families")
      .select("daily_limit_minutes")
      .maybeSingle();
    if (error || !data) return null;
    return data.daily_limit_minutes;
  } catch {
    return null;
  }
}

/** Updates the signed-in parent's family's daily limit. Returns whether it succeeded. */
export async function setFamilyDailyLimitMinutes(minutes: number): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: parent } = await supabase
      .from("parents")
      .select("family_id")
      .eq("id", user.id)
      .maybeSingle();
    if (!parent) return false;

    const { error } = await supabase
      .from("families")
      .update({ daily_limit_minutes: minutes })
      .eq("id", parent.family_id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Reports ~1 minute of foreground time on a child device. Fails
 * silently like markJourneyItem — a missed tick shouldn't interrupt
 * whatever the child is doing, it just makes that one minute not
 * count. Returns the family's current limit and the child's
 * minutes-spent-today, if the call succeeded, so the caller can act
 * on crossing the limit without a separate fetch.
 */
export async function recordScreenTime(
  minutes: number,
): Promise<{ minutesSpent: number; dailyLimitMinutes: number } | null> {
  try {
    const deviceId = await getDeviceId();
    const { data, error } = await getSupabaseClient().functions.invoke<{
      minutesSpent: number;
      dailyLimitMinutes: number;
    }>("record-screen-time", { body: { deviceId, minutes } });
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}
