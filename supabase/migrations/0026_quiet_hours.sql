-- 0026_quiet_hours.sql
--
-- Lets a parent set a do-not-disturb window for push notifications
-- (app/parent/notification-quiet-hours.tsx) — before this,
-- send-daily-reminders fired at whatever single hour the cron job
-- happens to be scheduled for (see that function's own header
-- comment), and notifyFamilyParents (achievement / daily-limit-
-- reached pushes) fired the instant the triggering event happened,
-- with no way for a parent to avoid a 2am buzz.
--
-- Local hours, not UTC — the parent picks e.g. 22:00-07:00 meaning
-- *their* clock. This app has no stored IANA timezone anywhere (see
-- families.daily_limit_minutes' sibling comments for the same
-- "no real geo/tz data" constraint), so timezone_offset_minutes is
-- just -Date().getTimezoneOffset() captured from the parent's device
-- when they save the setting — good enough to compute "is it quiet
-- hours right now" without a timezone database, but it won't
-- self-correct across a DST change or the family moving timezones
-- until they open this screen and save again.

alter table public.families
  add column if not exists quiet_hours_start smallint,
  add column if not exists quiet_hours_end smallint,
  add column if not exists timezone_offset_minutes integer;

alter table public.families
  add constraint families_quiet_hours_range check (
    (quiet_hours_start is null or (quiet_hours_start >= 0 and quiet_hours_start <= 23))
    and (quiet_hours_end is null or (quiet_hours_end >= 0 and quiet_hours_end <= 23))
  );
