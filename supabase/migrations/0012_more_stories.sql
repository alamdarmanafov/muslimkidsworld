-- 0012_more_stories.sql
-- Adds Nuh and Yusuf to public.stories, matching the two new entries
-- in mobile/src/data/mock.ts `stories` (the client still reads story
-- content from mock.ts + i18n, not this table — see 0002_content_tables.sql's
-- comment on `stories` — this keeps the seed data honestly mirroring
-- the client's real content, same as the original 3-story seed did).

insert into public.stories (slug, title, subtitle, icon, tone, unlock_level, sort_order)
values
  ('nuh', 'The Story of Prophet Nuh (AS)', 'The great flood', 'shield', 'green', 1, 4),
  ('yusuf', 'The Story of Prophet Yusuf (AS)', 'From the well to the palace', 'crown', 'purple', 8, 5)
on conflict (slug) do nothing;
