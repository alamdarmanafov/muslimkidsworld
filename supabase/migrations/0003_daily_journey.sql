-- 0003_daily_journey.sql
-- Per-child, per-day "Today's Journey" checklist, matching the
-- mobile app's Today's Journey feature (mobile/src/data/mock.ts
-- `dailyJourney`, `dailyLimitOptions`, `getDailyLimitMinutes`).

create table public.daily_journeys (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  journey_date date not null default current_date,
  daily_limit_minutes integer not null default 60 check (daily_limit_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (child_id, journey_date)
);

create index idx_daily_journeys_child_id on public.daily_journeys (child_id);

create trigger set_daily_journeys_updated_at
  before update on public.daily_journeys
  for each row execute function public.set_updated_at();

-- item_type intentionally matches the mock.ts JourneyItem ids
-- ("quran" | "dua" | "story" | "quiz" | "game"). `content_id` is a
-- loose (unconstrained) pointer into the matching content table
-- (quran_surahs / duas / stories / quizzes / games) — a single FK
-- can't target four different tables, so that link is enforced in
-- application code rather than in SQL.
create table public.daily_journey_items (
  id uuid primary key default gen_random_uuid(),
  daily_journey_id uuid not null references public.daily_journeys (id) on delete cascade,
  item_type text not null check (item_type in ('quran', 'dua', 'story', 'quiz', 'game')),
  label text not null,
  icon text not null,
  minutes integer not null default 10 check (minutes >= 0),
  content_id uuid,
  done boolean not null default false,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_daily_journey_items_journey_id on public.daily_journey_items (daily_journey_id);

create trigger set_daily_journey_items_updated_at
  before update on public.daily_journey_items
  for each row execute function public.set_updated_at();
