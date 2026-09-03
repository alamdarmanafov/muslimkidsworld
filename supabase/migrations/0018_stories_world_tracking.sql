-- 0018_stories_world_tracking.sql
-- Gives book-lover / storyteller (stories_read) and mosque-visitor
-- (world_visited) — seeded onto achievements back in
-- 0008_achievement_criteria.sql but never awardable since nothing
-- recorded which stories a child had read or which "world" site
-- they'd visited — something to actually award against.
--
-- One row per (child, story/site) the child has opened, keyed so a
-- re-read/re-visit is a no-op (ON CONFLICT DO NOTHING at the call
-- site) rather than a duplicate — awardAchievements only needs the
-- distinct count.

create table public.child_story_reads (
  child_id uuid not null references public.children (id) on delete cascade,
  story_slug text not null,
  first_read_at timestamptz not null default now(),
  primary key (child_id, story_slug)
);

alter table public.child_story_reads enable row level security;

create policy "Parents can view their family's child story reads"
  on public.child_story_reads for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

create table public.child_world_visits (
  child_id uuid not null references public.children (id) on delete cascade,
  world_slug text not null,
  first_visited_at timestamptz not null default now(),
  primary key (child_id, world_slug)
);

alter table public.child_world_visits enable row level security;

create policy "Parents can view their family's child world visits"
  on public.child_world_visits for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

-- No insert/update/delete policy on either table: written only by
-- mark-story-read / mark-world-visit using the service role key, same
-- pattern as child_daily_activity.
