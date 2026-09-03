-- 0009_parent_pin.sql
-- Backs a real parent-set "Parent Gate" PIN (mobile/app/parent-pin.tsx,
-- app/parent/parent-pin-setup.tsx), replacing the hard-coded "1234"
-- every install previously shared (mobile/src/data/mock.ts's
-- `parentPin`) — any child could look that up or just guess it.
--
-- One PIN per family (not per parent): any co-parent can set/change
-- it, and it gates the same child devices for the whole family.
-- Stored as a SHA-256 hash, hashed and compared only inside
-- set-parent-pin / verify-parent-pin (service role) — never read
-- directly by a client, parent or child.

alter table public.families
  add column if not exists pin_hash text;
