-- 0024_daily_bonus_question.sql
--
-- Backs the child home screen's "daily bonus question" card: one
-- extra, higher-XP question a child can answer once per day. Reuses
-- record-quiz-result (isBonus: true) rather than a new function or
-- table — a bonus answer is still a real quiz answer for accuracy
-- purposes, it just also has to be rejected once already claimed
-- today, which this column makes a single indexed lookup.

alter table public.child_daily_activity
  add column if not exists bonus_question_done boolean not null default false;
