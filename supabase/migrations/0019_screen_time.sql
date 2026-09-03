-- 0019_screen_time.sql
-- Real screen-time tracking. Until now, "daily limit" was entirely a
-- client-side illusion: mobile/src/data/mock.ts held
-- getDailyLimitMinutes()/setDailyLimitMinutes() as an in-memory JS
-- variable, which a parent's device changing it could never actually
-- affect — the child's app is a *separate* process/install with its
-- own copy of that same starting default. Nothing measured real
-- elapsed time either; the child home screen faked "minutes done" by
-- summing a fixed per-item constant for whichever Today's Journey
-- items happened to be marked done.
--
-- families.daily_limit_minutes makes the limit a real, shared,
-- family-level setting a parent sets once (families already has a
-- "parents can update their own family" RLS policy, so no new edge
-- function is needed for parents to change it — see
-- app/parent/daily-limit.tsx). child_daily_activity.minutes_spent is
-- where record-screen-time (new function) accumulates a child
-- device's actual foreground time, a little at a time.

alter table public.families
  add column if not exists daily_limit_minutes integer not null default 60
    check (daily_limit_minutes > 0);

alter table public.child_daily_activity
  add column if not exists minutes_spent integer not null default 0;

-- ---------------------------------------------------------------------
-- Hardening noticed in passing while touching this table's RLS: the
-- existing "Parents can update their own family" policy
-- (0004_rls_policies.sql) is a blanket per-row UPDATE grant with no
-- per-column restriction, which — technically, if unintentionally —
-- lets a parent's own authenticated session overwrite families.pin_hash
-- directly from the client, bypassing set-parent-pin's server-side
-- hashing (a client could write an unhashed value straight into the
-- column meant to only ever hold a SHA-256 hash). This trigger closes
-- that specific gap without touching the policy itself: any update
-- that isn't running as service_role (i.e. not through an edge
-- function like set-parent-pin) has pin_hash silently pinned back to
-- its previous value, no matter what the client sent.
-- ---------------------------------------------------------------------
create or replace function public.protect_pin_hash()
returns trigger
language plpgsql
as $$
begin
  if new.pin_hash is distinct from old.pin_hash and auth.role() <> 'service_role' then
    new.pin_hash := old.pin_hash;
  end if;
  return new;
end;
$$;

create trigger protect_pin_hash_on_update
  before update on public.families
  for each row execute function public.protect_pin_hash();
