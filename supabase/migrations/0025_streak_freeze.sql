-- 0025_streak_freeze.sql
--
-- Lets a missed day not break a child's streak. Before this,
-- record-quiz-result reset `streak` to 1 the moment a single day was
-- skipped — harsh for a kids' app where a missed evening (a sick day,
-- a trip) shouldn't erase weeks of consistency. Each child starts with
-- one free "freeze"; missing exactly one day consumes a freeze
-- instead of resetting the streak, and a freeze is earned back every
-- full week of consecutive activity (capped — see MAX_FREEZES in
-- record-quiz-result/index.ts).

alter table public.child_progress
  add column if not exists streak_freezes_available integer not null default 1;
