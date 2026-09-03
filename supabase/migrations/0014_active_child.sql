-- 0014_active_child.sql
-- Lets a parent pick which child a shared device is currently acting
-- as, for families with more than one child. Lives on family_codes
-- (one row per device binding, see 0001_core_schema.sql) rather than
-- on the device binding itself, since that's already the row every
-- device-resolution function keys off bound_device_id from — see
-- supabase/functions/_shared/resolveChild.ts, which now reads this
-- column and falls back to the family's oldest child when it's null
-- (the only behavior that existed before this migration).
--
-- Set only by set-active-child, which re-verifies the Parent Gate PIN
-- itself (the same hash check as verify-parent-pin) before writing —
-- a child device never has a parent auth session to authorize this
-- with otherwise.

alter table public.family_codes
  add column if not exists active_child_id uuid references public.children (id) on delete set null;
