-- 0008_achievement_criteria.sql
-- Attaches machine-readable unlock criteria to the six achievements
-- seeded in 0005_seed_content.sql, so record-quiz-result
-- (supabase/functions/record-quiz-result/index.ts) can award them
-- automatically instead of the Rewards tab showing mock.ts's
-- hard-coded `earned: true/false` flags.
--
-- Only three criteria types are evaluated today, because only quiz
-- results and streaks are tracked by this backend yet:
--   - correct_answers:    lifetime total_correct_answers >= min
--   - streak:              current streak >= min
--   - questions_answered:  lifetime total_questions_answered >= min
--
-- book-lover, storyteller (stories_read) and mosque-visitor
-- (world_visited) describe intent for when Stories/the world map get
-- their own read/visit tracking (still mock.ts, see supabase/README.md)
-- — record-quiz-result skips any criteria type it doesn't recognize,
-- so seeding them now costs nothing and saves a migration later.

update public.achievements set criteria = '{"type":"correct_answers","min":1}'::jsonb
  where slug = 'first-star';
update public.achievements set criteria = '{"type":"streak","min":7}'::jsonb
  where slug = 'week-streak';
update public.achievements set criteria = '{"type":"questions_answered","min":50}'::jsonb
  where slug = 'quiz-master';
update public.achievements set criteria = '{"type":"stories_read","min":1}'::jsonb
  where slug = 'book-lover';
update public.achievements set criteria = '{"type":"stories_read","min":3}'::jsonb
  where slug = 'storyteller';
update public.achievements set criteria = '{"type":"world_visited","world":"mosque"}'::jsonb
  where slug = 'mosque-visitor';
