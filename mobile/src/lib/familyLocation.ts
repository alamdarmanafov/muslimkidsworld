// mobile/src/lib/familyLocation.ts
//
// The city a parent picks for prayer-time calculation
// (app/parent/prayer-city.tsx, families.prayer_city_id — see
// 0028_prayer_city.sql). Reads/writes `families` directly under the
// signed-in parent's own RLS-scoped session, same pattern as
// screenTime.ts's daily limit and notificationSettings.ts's quiet
// hours. The child side reads this through get-child-progress
// instead (see childProgress.ts's prayerCityId), since a child device
// has no session to read `families` directly with.

import { getSupabaseClient } from "./supabase";

/** The signed-in parent's family's chosen prayer city id, or null if unset, undefined on failure. */
export async function fetchPrayerCityId(): Promise<string | null | undefined> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("families")
      .select("prayer_city_id")
      .maybeSingle();
    if (error || !data) return undefined;
    return data.prayer_city_id;
  } catch {
    return undefined;
  }
}

/** Sets (or clears, passing null) the signed-in parent's family's prayer city. Returns whether it succeeded. */
export async function setPrayerCityId(cityId: string | null): Promise<boolean> {
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
      .update({ prayer_city_id: cityId })
      .eq("id", parent.family_id);
    return !error;
  } catch {
    return false;
  }
}
