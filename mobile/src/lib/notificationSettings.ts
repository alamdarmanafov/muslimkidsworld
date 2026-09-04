// mobile/src/lib/notificationSettings.ts
//
// Parent-configurable "quiet hours" for push notifications
// (app/parent/notification-quiet-hours.tsx) — see 0026_quiet_hours.sql
// and supabase/functions/_shared/quietHours.ts for how the backend
// applies them. Reads/writes `families` directly under the signed-in
// parent's own RLS-scoped session, same pattern as
// screenTime.ts's daily limit.
//
// timezone_offset_minutes is captured from *this* device at save
// time — there's no stored IANA timezone anywhere else in this app
// either, so a parent who travels needs to reopen and re-save this
// screen from their new timezone for quiet hours to stay accurate.

import { getSupabaseClient } from "./supabase";

export type QuietHours = { start: number; end: number } | null;

/** The signed-in parent's family's current quiet hours, or null if unset, undefined on failure. */
export async function fetchQuietHours(): Promise<QuietHours | undefined> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("families")
      .select("quiet_hours_start, quiet_hours_end")
      .maybeSingle();
    if (error || !data) return undefined;
    if (data.quiet_hours_start == null || data.quiet_hours_end == null) return null;
    return { start: data.quiet_hours_start, end: data.quiet_hours_end };
  } catch {
    return undefined;
  }
}

/** Sets (or clears, passing null) the signed-in parent's family's quiet hours. Returns whether it succeeded. */
export async function setQuietHours(hours: QuietHours): Promise<boolean> {
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
      .update({
        quiet_hours_start: hours?.start ?? null,
        quiet_hours_end: hours?.end ?? null,
        timezone_offset_minutes: hours ? -new Date().getTimezoneOffset() : null,
      })
      .eq("id", parent.family_id);
    return !error;
  } catch {
    return false;
  }
}
