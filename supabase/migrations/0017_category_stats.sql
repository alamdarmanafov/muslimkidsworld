-- 0017_category_stats.sql
-- Backs the parent's real Weekly Report (app/parent/(tabs)/progress.tsx,
-- replacing its PlaceholderScreen) with a per-category accuracy
-- breakdown, so "strongest/weakest subject" is real data instead of
-- something this backend has no way to compute — record-quiz-result
-- only ever stored a session's score against the child's lifetime
-- total, with no memory of which quiz category it came from.

create table public.child_category_stats (
  child_id uuid not null references public.children (id) on delete cascade,
  category text not null,
  questions_answered integer not null default 0,
  correct_answers integer not null default 0,
  primary key (child_id, category)
);

alter table public.child_category_stats enable row level security;

create policy "Parents can view their family's child category stats"
  on public.child_category_stats for select
  to authenticated
  using (
    child_id in (
      select id from public.children where family_id = public.current_family_id()
    )
  );

-- No insert/update/delete policy: written only by record-quiz-result
-- using the service role key, same pattern as child_daily_activity.
