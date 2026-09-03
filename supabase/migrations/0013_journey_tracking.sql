-- 0013_journey_tracking.sql
-- Real per-day tracking for the "Today's Journey" checklist
-- (mobile/app/child/(tabs)/index.tsx). Until now only "quiz" had a
-- real signal (child_daily_activity.questions_answered); Quran/Dua/
-- Story/Game always showed not-done regardless of what the child
-- actually did (see mock.ts dailyJourney's comment on this). Adds one
-- boolean per remaining journey item to the same per-child-per-day
-- row record-quiz-result already writes, set by the new
-- mark-journey-item edge function when a child opens that item's
-- screen.

alter table public.child_daily_activity
  add column if not exists quran_done boolean not null default false,
  add column if not exists dua_done boolean not null default false,
  add column if not exists story_done boolean not null default false,
  add column if not exists game_done boolean not null default false;
