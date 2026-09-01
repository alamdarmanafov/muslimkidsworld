-- 0006_family_code_expiry.sql
-- Turns family_codes from a single static code into a rotating one:
-- the parent's app now requests a fresh code every 30 seconds
-- (mobile/app/parent/family-code.tsx), and generate-family-code
-- revokes the family's previous code(s) each time it mints a new one.
-- expires_at is the server-side enforcement redeem-family-code checks
-- — a code a child device didn't manage to enter in time simply stops
-- working, narrowing the window a leaked/observed code is useful for.

alter table public.family_codes
  add column expires_at timestamptz not null default (now() + interval '30 seconds');

-- (The existing idx_family_codes_code_active index from 0001 already
-- covers the "code, unrevoked" lookup redeem-family-code performs;
-- redeem-family-code additionally checks expires_at in application
-- code rather than needing a second index for it.)
