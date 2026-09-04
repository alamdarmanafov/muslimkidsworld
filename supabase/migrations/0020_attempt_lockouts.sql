-- 0020_attempt_lockouts.sql
-- Brute-force protection: verify-parent-pin (a 4-digit PIN — only
-- 10,000 possibilities) and redeem-family-code (a 6-digit code) had
-- no limit on how many times a device could guess before this. One
-- shared table, keyed by (device_id, action), backs both — see
-- supabase/functions/_shared/lockout.ts for the actual 3-strikes
-- logic that reads and writes it.
--
-- No RLS policies (but RLS is enabled) is deliberate: this table
-- should never be readable or writable by anon/authenticated at all,
-- only by the service-role edge functions that own it — same pattern
-- as child_daily_activity's write side.

create table public.device_lockouts (
  device_id text not null,
  action text not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now(),
  primary key (device_id, action)
);

alter table public.device_lockouts enable row level security;
