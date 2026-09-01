-- 0001_core_schema.sql
-- Core account/family/billing schema: families, parents (linked to
-- Supabase auth.users), children, family_codes (server-side device
-- binding), subscription_plans, subscriptions, child_progress.
--
-- Mirrors the shapes already used by the mobile app's mock data in
-- mobile/src/data/mock.ts (see the `Child`, `familyCode`, and `plans`
-- exports) so that replacing mock data with real queries later is a
-- small diff rather than a rewrite.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Shared helper: keep an `updated_at` column current on every UPDATE.
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- families
-- ---------------------------------------------------------------------
create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_families_updated_at
  before update on public.families
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- parents — one row per Supabase auth user that owns/co-owns a family.
-- The row's primary key IS the auth.users id, so a parent's identity
-- and their family membership are always in lockstep with auth.
-- ---------------------------------------------------------------------
create table public.parents (
  id uuid primary key references auth.users (id) on delete cascade,
  family_id uuid not null references public.families (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_parents_family_id on public.parents (family_id);

create trigger set_parents_updated_at
  before update on public.parents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- children — one row per child profile in a family.
-- Field names/shape mirror mobile/src/data/mock.ts `Child`.
-- ---------------------------------------------------------------------
create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  age smallint check (age is null or (age between 1 and 18)),
  emoji text not null default '🧒',
  color text not null default '#DBEAFE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_children_family_id on public.children (family_id);

create trigger set_children_updated_at
  before update on public.children
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- child_progress — mutable gamification state for a child, split out
-- from the `children` identity row. Matches the level/xp/streak/accuracy
-- fields on mock.ts `Child`, plus the badges/stars/days seen in
-- mock.ts `childStats`. One row per child, created automatically
-- (see trigger below) and updated as the child plays.
-- ---------------------------------------------------------------------
create table public.child_progress (
  child_id uuid primary key references public.children (id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  accuracy numeric(5, 2) not null default 0 check (accuracy >= 0 and accuracy <= 100),
  badges_count integer not null default 0 check (badges_count >= 0),
  stars_count integer not null default 0 check (stars_count >= 0),
  active_days_count integer not null default 0 check (active_days_count >= 0),
  last_activity_at timestamptz,
  updated_at timestamptz not null default now()
);

create trigger set_child_progress_updated_at
  before update on public.child_progress
  for each row execute function public.set_updated_at();

-- Every new child automatically gets a starting progress row so the
-- app can always assume `child_progress` exists for a given child.
create or replace function public.handle_new_child()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.child_progress (child_id)
  values (new.id)
  on conflict (child_id) do nothing;
  return new;
end;
$$;

create trigger on_child_created
  after insert on public.children
  for each row execute function public.handle_new_child();

-- ---------------------------------------------------------------------
-- family_codes — the 6-digit code a parent shares with a child's
-- device. This is the server-side half of the device binding started
-- client-side in mobile/src/lib/deviceBinding.ts: that file can only
-- remember a binding locally, it cannot enforce that a code is bound
-- to exactly one device. `bound_device_id` + `bound_at` are set by the
-- `redeem-family-code` edge function (supabase/functions/redeem-family-code)
-- the first time a device redeems the code, and every later redemption
-- attempt with a different device id is rejected there.
-- ---------------------------------------------------------------------
create table public.family_codes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  code text not null check (code ~ '^[0-9]{6}$'),
  created_by uuid references public.parents (id) on delete set null,
  bound_device_id text,
  bound_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint bound_pair_check check (
    (bound_device_id is null and bound_at is null)
    or (bound_device_id is not null and bound_at is not null)
  )
);

create index idx_family_codes_family_id on public.family_codes (family_id);

-- A code can be reused only after it has been revoked/expired: the
-- uniqueness constraint applies to the currently-active codes only.
create unique index idx_family_codes_code_active
  on public.family_codes (code)
  where revoked_at is null;

-- ---------------------------------------------------------------------
-- subscription_plans — mirrors mock.ts `plans`. Public-read (see RLS
-- migration), admin-write only (no client insert/update policy).
-- ---------------------------------------------------------------------
create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  period text not null default 'month',
  max_children smallint not null check (max_children >= 1),
  features jsonb not null default '[]'::jsonb,
  best_value boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_subscription_plans_updated_at
  before update on public.subscription_plans
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- subscriptions — one current-state row per family. Historical/billing
-- events (renewals, provider webhooks) are out of scope for this
-- scaffold; this row represents "the family's subscription right now".
-- ---------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null unique references public.families (id) on delete cascade,
  plan_id uuid not null references public.subscription_plans (id),
  status text not null default 'trial' check (status in ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  external_provider text,
  external_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_family_id on public.subscriptions (family_id);

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- New-parent onboarding: when a person signs up through Supabase Auth,
-- automatically give them a family, a parent row, and a trial
-- subscription on the cheapest active plan (falls back to no
-- subscription row if no plan has been seeded yet).
-- ---------------------------------------------------------------------
create or replace function public.handle_new_parent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family_id uuid;
  starter_plan_id uuid;
begin
  insert into public.families default values
  returning id into new_family_id;

  insert into public.parents (id, family_id, email)
  values (new.id, new_family_id, new.email);

  select id into starter_plan_id
  from public.subscription_plans
  where is_active = true
  order by price_cents asc, sort_order asc
  limit 1;

  if starter_plan_id is not null then
    insert into public.subscriptions (family_id, plan_id, status, trial_ends_at)
    values (new_family_id, starter_plan_id, 'trial', now() + interval '14 days');
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_parent();
