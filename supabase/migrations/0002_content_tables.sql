-- 0002_content_tables.sql
-- Curated app content: Quran surahs, duas, stories, quizzes, games,
-- achievements. These mirror the shapes exported from
-- mobile/src/data/mock.ts (QuranSurah, Dua, Story, QuizQuestion, Game,
-- Achievement) and are public-read / admin-write (see the RLS
-- migration) — no parent or child ever writes to these tables
-- directly, they're managed from the admin panel or the dashboard.
--
-- Every content table has a `slug` unique text column that matches
-- the string ids already used in mock.ts (e.g. "al-fatiha", "yunus"),
-- so the frontend can keep looking things up by slug during the
-- transition even though the primary key is a uuid.
--
-- Where mock.ts has a static `locked: boolean` on a content item,
-- these tables instead store `unlock_level` and let the client (or a
-- future view) derive "locked" by comparing it against the child's
-- child_progress.level — a static boolean can't express "unlocked
-- once you reach level 5", which is what the app's world/level
-- progression actually needs.

-- ---------------------------------------------------------------------
-- quran_surahs
-- ---------------------------------------------------------------------
create table public.quran_surahs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  arabic_name text not null,
  juz text not null,
  unlock_level integer not null default 1 check (unlock_level >= 1),
  audio_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_quran_surahs_updated_at
  before update on public.quran_surahs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- duas
-- ---------------------------------------------------------------------
create table public.duas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('Morning', 'Evening', 'Sleep', 'Eat')),
  arabic text not null,
  transliteration text not null,
  translation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_duas_updated_at
  before update on public.duas
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- stories
-- ---------------------------------------------------------------------
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  icon text not null,
  tone text not null,
  unlock_level integer not null default 1 check (unlock_level >= 1),
  content jsonb,
  audio_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_stories_updated_at
  before update on public.stories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- quizzes / quiz_questions — mock.ts `dailyTen` is one quiz's worth of
-- questions; quizzes lets there eventually be more than one quiz.
-- ---------------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_quizzes_updated_at
  before update on public.quizzes
  for each row execute function public.set_updated_at();

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  prompt text not null,
  -- array of { id, label, emoji } — matches mock.ts `QuizOption`
  options jsonb not null,
  correct_option_id text not null,
  xp integer not null default 10 check (xp >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quiz_questions_options_is_array check (jsonb_typeof(options) = 'array')
);

create index idx_quiz_questions_quiz_id on public.quiz_questions (quiz_id);

create trigger set_quiz_questions_updated_at
  before update on public.quiz_questions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- games
-- ---------------------------------------------------------------------
create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  icon text not null,
  tone text not null,
  unlock_level integer not null default 1 check (unlock_level >= 1),
  config jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_games_updated_at
  before update on public.games
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- achievements — the catalog of badges. mock.ts's per-item `earned`
-- boolean is really per-child state, so it lives in the
-- child_achievements join table below, not on this table.
-- ---------------------------------------------------------------------
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  icon text not null,
  tone text not null,
  -- optional machine-readable unlock rule, e.g. {"type":"streak","value":7}
  criteria jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_achievements_updated_at
  before update on public.achievements
  for each row execute function public.set_updated_at();

create table public.child_achievements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (child_id, achievement_id)
);

create index idx_child_achievements_child_id on public.child_achievements (child_id);
