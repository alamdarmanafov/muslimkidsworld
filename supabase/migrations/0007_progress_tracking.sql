-- ---------------------------------------------------------------------
-- 0007_progress_tracking.sql
--
-- Backs the real (non-mock) Progress and Rewards screens
-- (mobile/app/child/(tabs)/progress.tsx, rewards.tsx) and the new
-- record-quiz-result / get-child-progress edge functions.
--
-- child_progress already stores a running `accuracy` percentage but
-- had no lifetime counts to compute it from — every quiz result would
-- have had to overwrite it with just that session's accuracy. Adding
-- total_questions_answered / total_correct_answers lets the edge
-- function keep a true lifetime accuracy.
--
-- child_daily_activity is new: one row per child per day, upserted by
-- record-quiz-result, giving progress.tsx a real "this week" chart
-- instead of the hard-coded bar values it had before.
-- ---------------------------------------------------------------------

alter table public.child_progress
  add column if not exists total_questions_answered integer not null default 0,
  add column if not exists total_correct_answers integer not null default 0;

create table if not exists public.child_daily_activity (
  child_id uuid not null references public.children (id) on delete cascade,
  activity_date date not null,
  questions_answered integer not null default 0,
  xp_earned integer not null default 0,
  primary key (child_id, activity_date)
);

alter table public.child_daily_activity enable row level security;

create policy "Parents can view their family's child daily activity"
  on public.child_daily_activity for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

-- No insert/update/delete policy: every row is written by the
-- record-quiz-result edge function using the service role key, the
-- same pattern child_progress itself already uses.
