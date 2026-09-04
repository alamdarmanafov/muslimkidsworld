// supabase/functions/_shared/quietHours.ts
//
// Shared by notifyParents.ts (real-time achievement / daily-limit
// pushes) and send-daily-reminders (the once-a-day cron nudge) to
// decide whether a family's configured do-not-disturb window
// (0026_quiet_hours.sql) currently covers `now`.

export function isWithinQuietHours(
  quietStart: number | null | undefined,
  quietEnd: number | null | undefined,
  timezoneOffsetMinutes: number | null | undefined,
  now: Date = new Date(),
): boolean {
  if (quietStart == null || quietEnd == null || quietStart === quietEnd) return false;

  const offset = timezoneOffsetMinutes ?? 0;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const localMinutes = ((utcMinutes + offset) % 1440 + 1440) % 1440;
  const localHour = Math.floor(localMinutes / 60);

  if (quietStart < quietEnd) {
    return localHour >= quietStart && localHour < quietEnd;
  }
  // Wraps past midnight, e.g. 22 -> 7.
  return localHour >= quietStart || localHour < quietEnd;
}
