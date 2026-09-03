-- 0015_admin_panel.sql
-- Backs the standalone admin panel (admin/index.html) — scoped to the
-- content that's actually live-read from the database today (Quran
-- text/translations, achievements). Duas/Stories/Quizzes still read
-- from mobile/src/data/mock.ts + i18n, not these tables (see
-- supabase/README.md's stub list), so an admin UI for them wouldn't
-- change anything in the app yet — out of scope here on purpose.
--
-- No new auth system: the same Supabase Auth used by parents, with
-- one added flag. To make your own account an admin, run this once
-- with your email:
--   update public.parents set is_admin = true where email = 'you@example.com';

alter table public.parents
  add column if not exists is_admin boolean not null default false;

-- ---------------------------------------------------------------------
-- Helper: whether the currently authenticated user is flagged an
-- admin. SECURITY DEFINER for the same reason current_family_id() is
-- (0004_rls_policies.sql) — so it can read `parents` regardless of
-- the caller's own RLS grants on that table.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.parents where id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to authenticated;

-- Each of these tables already has a public-read SELECT policy
-- (0004_rls_policies.sql / 0010_quran_verses.sql) — Postgres RLS
-- policies for the same command are OR'd together, so this adds
-- write access for admins without touching that read policy.
create policy "Admins can manage quran surahs"
  on public.quran_surahs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage quran verses"
  on public.quran_verses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage quran translations"
  on public.quran_translations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage achievements"
  on public.achievements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
