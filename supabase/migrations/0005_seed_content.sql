-- 0005_seed_content.sql
-- Seeds subscription_plans and the content tables with the same data
-- currently hard-coded in mobile/src/data/mock.ts, so a freshly-linked
-- Supabase project already has something real to query instead of an
-- empty database. Every insert is keyed off the unique `slug`/`code`
-- columns and guarded with ON CONFLICT DO NOTHING, so re-running this
-- migration (or `supabase db push` again) is a no-op rather than a
-- duplicate-row error.

-- ---------------------------------------------------------------------
-- subscription_plans — from mock.ts `plans`
-- ---------------------------------------------------------------------
insert into public.subscription_plans
  (slug, name, price_cents, currency, period, max_children, features, best_value, sort_order)
values
  (
    'single',
    'Single Child',
    2999,
    'usd',
    'year',
    1,
    '["Unlimited Daily 10", "Full World Access", "Basic Reports"]'::jsonb,
    false,
    1
  ),
  (
    'family',
    'Family',
    4999,
    'usd',
    'year',
    3,
    '["Unlimited Daily 10", "Full World Access", "Advanced Progress & Reports", "Premium Rewards", "Cancel Anytime"]'::jsonb,
    true,
    2
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- quran_surahs — from mock.ts `quranSurahs`
-- ---------------------------------------------------------------------
insert into public.quran_surahs (slug, name, arabic_name, juz, unlock_level, sort_order)
values
  ('al-fatiha', 'Al-Fatiha', 'الفاتحة', 'Juz Amma', 1, 1),
  ('an-nas', 'An-Nas', 'الناس', 'Juz Amma', 2, 2),
  ('al-falaq', 'Al-Falaq', 'الفلق', 'Juz Amma', 3, 3),
  ('al-ikhlas', 'Al-Ikhlas', 'الإخلاص', 'Juz Amma', 4, 4)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- duas — from mock.ts `duas`
-- ---------------------------------------------------------------------
insert into public.duas (slug, title, category, arabic, transliteration, sort_order)
values
  (
    'morning',
    'Morning Dua',
    'Morning',
    'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
    'Allahumma bika asbahna wa bika amsaina',
    1
  ),
  (
    'evening',
    'Evening Dua',
    'Evening',
    'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا',
    'Allahumma bika amsaina wa bika asbahna',
    2
  ),
  (
    'sleep',
    'Before Sleep',
    'Sleep',
    'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    'Bismika Allahumma amutu wa ahya',
    3
  ),
  (
    'eat',
    'Before Eating',
    'Eat',
    'بِسْمِ اللَّهِ',
    'Bismillah',
    4
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- stories — from mock.ts `stories`
-- ---------------------------------------------------------------------
insert into public.stories (slug, title, subtitle, icon, tone, unlock_level, sort_order)
values
  ('yunus', 'The Story of Prophet Yunus (AS)', 'Inside the whale', 'globe', 'blue', 1, 1),
  ('ibrahim', 'Prophet Ibrahim (AS)', 'The friend of Allah', 'mosque', 'gold', 1, 2),
  ('musa', 'Prophet Musa (AS)', 'The staff and the sea', 'star', 'teal', 5, 3)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- games — from mock.ts `games`
-- ---------------------------------------------------------------------
insert into public.games (slug, title, subtitle, icon, tone, sort_order)
values
  ('find-pair', 'Find the Pair', 'Match Islamic landmarks', 'mosque', 'blue', 1),
  ('memory', 'Memory', 'Train your memory', 'quiz', 'purple', 2),
  ('word-puzzle', 'Islamic Word Puzzle', 'Arrange the Arabic letters', 'puzzle', 'green', 3)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- achievements — from mock.ts `achievements` (the `earned` flag there
-- is per-child, so it isn't seeded here — see child_achievements)
-- ---------------------------------------------------------------------
insert into public.achievements (slug, label, icon, tone, sort_order)
values
  ('first-star', 'First Star', 'star', 'gold', 1),
  ('book-lover', 'Book Lover', 'book', 'purple', 2),
  ('mosque-visitor', 'Mosque Visitor', 'mosque', 'blue', 3),
  ('week-streak', '7 Day Streak', 'flame', 'red', 4),
  ('quiz-master', 'Quiz Master', 'quiz', 'pink', 5),
  ('storyteller', 'Storyteller', 'globe', 'teal', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- quizzes / quiz_questions — from mock.ts `dailyTen`
-- ---------------------------------------------------------------------
insert into public.quizzes (slug, title, description, sort_order)
values ('daily-ten', 'Daily 10', 'The Daily 10 quiz shown on the child home screen', 1)
on conflict (slug) do nothing;

insert into public.quiz_questions (quiz_id, prompt, options, correct_option_id, xp, sort_order)
select
  q.id,
  question.prompt,
  question.options,
  question.correct_option_id,
  question.xp,
  question.sort_order
from public.quizzes q
cross join (
  values
    (
      'Which one is a mosque?',
      '[{"id":"a","label":"A","emoji":"🏠"},{"id":"b","label":"B","emoji":"🕌"},{"id":"c","label":"C","emoji":"⛪"},{"id":"d","label":"D","emoji":"🏢"}]'::jsonb,
      'b',
      20,
      1
    ),
    (
      'How many times a day do Muslims pray?',
      '[{"id":"a","label":"A","emoji":"3️⃣"},{"id":"b","label":"B","emoji":"4️⃣"},{"id":"c","label":"C","emoji":"5️⃣"},{"id":"d","label":"D","emoji":"6️⃣"}]'::jsonb,
      'c',
      20,
      2
    ),
    (
      'What is the holy book of Islam called?',
      '[{"id":"a","label":"A","emoji":"📖"},{"id":"b","label":"B","emoji":"📗"},{"id":"c","label":"C","emoji":"📘"},{"id":"d","label":"D","emoji":"📙"}]'::jsonb,
      'a',
      20,
      3
    )
) as question (prompt, options, correct_option_id, xp, sort_order)
where q.slug = 'daily-ten'
  and not exists (
    select 1
    from public.quiz_questions qq
    where qq.quiz_id = q.id
      and qq.prompt = question.prompt
  );
