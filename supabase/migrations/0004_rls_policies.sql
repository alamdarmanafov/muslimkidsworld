-- 0004_rls_policies.sql
-- Row Level Security for every table.
--
-- Model:
--  * A parent (an authenticated Supabase user with a row in `parents`)
--    can read/write their own family's children, subscription, and
--    child progress, and can read (but not write) their family's
--    family_codes.
--  * There is no real "child session" yet — the mobile app's child
--    profile picker runs entirely on the parent's authenticated
--    session (or, once device binding is redeemed, on a session
--    minted for the family by the `redeem-family-code` edge
--    function). So "child access" here does NOT mean a separate
--    Supabase auth role: today it means either the parent's own RLS
--    above, or a service-role backend function (the two edge
--    functions in supabase/functions/) that bypasses RLS entirely.
--    Nothing below grants a bare "child" any table access — that's
--    intentional per the security section of the spec: a child must
--    never be able to read subscription/payment tables, and today the
--    only way to reach this database at all is either as the parent
--    or as service_role.
--  * subscription_plans and all content tables (quran_surahs, duas,
--    stories, quizzes, quiz_questions, games, achievements) are
--    public-read (anon + authenticated) and admin-write only: no
--    policy below grants anon/authenticated INSERT/UPDATE/DELETE on
--    them, so only the service_role key (used from the admin panel
--    or `supabase db push`/dashboard) can modify them.

-- ---------------------------------------------------------------------
-- Helper: the family_id of the currently authenticated parent, or
-- null if the current user isn't a parent. SECURITY DEFINER so it can
-- read `parents` regardless of the caller's own RLS grants on that
-- table, with a locked-down search_path per Postgres's
-- security-definer function guidance.
-- ---------------------------------------------------------------------
create or replace function public.current_family_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select family_id from public.parents where id = auth.uid();
$$;

grant execute on function public.current_family_id() to authenticated;

-- ---------------------------------------------------------------------
-- families
-- ---------------------------------------------------------------------
alter table public.families enable row level security;

create policy "Parents can view their own family"
  on public.families for select
  to authenticated
  using (id = public.current_family_id());

create policy "Parents can update their own family"
  on public.families for update
  to authenticated
  using (id = public.current_family_id())
  with check (id = public.current_family_id());

-- No insert/delete policy: families are created only by the
-- handle_new_parent() trigger (runs as SECURITY DEFINER) when someone
-- signs up, and deleted only via service_role/admin tooling.

-- ---------------------------------------------------------------------
-- parents
-- ---------------------------------------------------------------------
alter table public.parents enable row level security;

create policy "Parents can view their own row"
  on public.parents for select
  to authenticated
  using (id = auth.uid());

create policy "Parents can view co-parents in their family"
  on public.parents for select
  to authenticated
  using (family_id = public.current_family_id());

create policy "Parents can update their own row"
  on public.parents for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No insert/delete policy: rows are created only by
-- handle_new_parent() on signup and removed via service_role/admin
-- tooling (or cascades from auth.users deletion).

-- ---------------------------------------------------------------------
-- children
-- ---------------------------------------------------------------------
alter table public.children enable row level security;

create policy "Parents can view their family's children"
  on public.children for select
  to authenticated
  using (family_id = public.current_family_id());

create policy "Parents can add children to their family"
  on public.children for insert
  to authenticated
  with check (family_id = public.current_family_id());

create policy "Parents can update their family's children"
  on public.children for update
  to authenticated
  using (family_id = public.current_family_id())
  with check (family_id = public.current_family_id());

create policy "Parents can remove their family's children"
  on public.children for delete
  to authenticated
  using (family_id = public.current_family_id());

-- ---------------------------------------------------------------------
-- child_progress
-- ---------------------------------------------------------------------
alter table public.child_progress enable row level security;

create policy "Parents can view their family's child progress"
  on public.child_progress for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

create policy "Parents can update their family's child progress"
  on public.child_progress for update
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  )
  with check (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

-- No insert/delete policy: rows are created only by handle_new_child()
-- and removed via the owning child's on-delete-cascade.

-- ---------------------------------------------------------------------
-- family_codes — parents may look up their own codes (to display/
-- share them), but generating and binding a code is deliberately not
-- exposed to direct client writes: it goes through the
-- generate-family-code / redeem-family-code edge functions (running
-- as service_role) so the "one code, one device" rule can't be
-- bypassed by a client writing rows directly.
-- ---------------------------------------------------------------------
alter table public.family_codes enable row level security;

create policy "Parents can view their family's codes"
  on public.family_codes for select
  to authenticated
  using (family_id = public.current_family_id());

-- ---------------------------------------------------------------------
-- subscription_plans — public read, admin write only.
-- ---------------------------------------------------------------------
alter table public.subscription_plans enable row level security;

create policy "Anyone can view active plans"
  on public.subscription_plans for select
  to anon, authenticated
  using (is_active = true);

-- ---------------------------------------------------------------------
-- subscriptions — a family's billing status is visible only to that
-- family's parents; never public, never inserted/updated by clients
-- directly (a future billing webhook or edge function, running as
-- service_role, owns writes here).
-- ---------------------------------------------------------------------
alter table public.subscriptions enable row level security;

create policy "Parents can view their family's subscription"
  on public.subscriptions for select
  to authenticated
  using (family_id = public.current_family_id());

-- ---------------------------------------------------------------------
-- Content tables: public read, admin write only.
-- ---------------------------------------------------------------------
alter table public.quran_surahs enable row level security;
create policy "Anyone can view quran surahs"
  on public.quran_surahs for select
  to anon, authenticated
  using (true);

alter table public.duas enable row level security;
create policy "Anyone can view duas"
  on public.duas for select
  to anon, authenticated
  using (true);

alter table public.stories enable row level security;
create policy "Anyone can view stories"
  on public.stories for select
  to anon, authenticated
  using (true);

alter table public.quizzes enable row level security;
create policy "Anyone can view quizzes"
  on public.quizzes for select
  to anon, authenticated
  using (true);

alter table public.quiz_questions enable row level security;
create policy "Anyone can view quiz questions"
  on public.quiz_questions for select
  to anon, authenticated
  using (true);

alter table public.games enable row level security;
create policy "Anyone can view games"
  on public.games for select
  to anon, authenticated
  using (true);

alter table public.achievements enable row level security;
create policy "Anyone can view achievements"
  on public.achievements for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- child_achievements — visible to the owning family; not directly
-- writable by clients (a future server-side check awards these once
-- real per-child sessions exist, to prevent a device just granting
-- itself every badge).
-- ---------------------------------------------------------------------
alter table public.child_achievements enable row level security;

create policy "Parents can view their family's child achievements"
  on public.child_achievements for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

-- ---------------------------------------------------------------------
-- daily_journeys / daily_journey_items — visible to the owning
-- family; not directly writable by clients yet, for the same reason
-- as child_achievements (see the module comment at the top of this
-- file: today the only writers are the parent's own RLS-guarded
-- tables above, or service_role).
-- ---------------------------------------------------------------------
alter table public.daily_journeys enable row level security;

create policy "Parents can view their family's daily journeys"
  on public.daily_journeys for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

alter table public.daily_journey_items enable row level security;

create policy "Parents can view their family's daily journey items"
  on public.daily_journey_items for select
  to authenticated
  using (
    daily_journey_id in (
      select dj.id
      from public.daily_journeys dj
      join public.children c on c.id = dj.child_id
      where c.family_id = public.current_family_id()
    )
  );
