-- 0010_quran_verses.sql
-- Expands the Quran feature from the 4 demo surahs bundled in
-- mobile/src/data/quran/*.json to the full 114, with verse text
-- stored here instead of in the app bundle. `quran_surahs` (from
-- 0002_content_tables.sql) had no `chapter` number at all — only
-- `slug` — because it was only ever seeded with 4 hand-picked rows;
-- verses need a stable numeric key to join against, so this adds one
-- (unique, since every downstream table keys off it).
--
-- This migration only creates schema. The verse text itself is not
-- typed into a migration file — the Quran's exact Arabic text and
-- verified translations aren't something to hand-transcribe from
-- memory, so it's imported by a script
-- (supabase/scripts/import-quran.mjs) that pulls from a real,
-- verified Quran API and upserts here. Run that script once after
-- this migration to actually populate all 114 surahs; until then
-- quran_surahs/quran_verses/quran_translations simply keep whatever
-- rows already exist (the 4 demo ones, if this project already seeded
-- them).

alter table public.quran_surahs
  add column if not exists chapter smallint;

-- Backfill the 4 existing demo rows (safe/idempotent: only touches
-- rows that already match by slug, no-ops if they don't exist yet).
update public.quran_surahs set chapter = 1 where slug = 'al-fatiha' and chapter is null;
update public.quran_surahs set chapter = 114 where slug = 'an-nas' and chapter is null;
update public.quran_surahs set chapter = 113 where slug = 'al-falaq' and chapter is null;
update public.quran_surahs set chapter = 112 where slug = 'al-ikhlas' and chapter is null;

-- Plain (non-partial) unique index: Postgres already allows any number
-- of NULLs through a plain unique index (NULLs never compare equal to
-- each other), so this doesn't need a `where chapter is not null`
-- predicate — and NOT having one matters here, because a predicate
-- would stop `upsert(..., { onConflict: "chapter" })` from matching
-- it at all (ON CONFLICT can't infer a partial index unless the
-- conflict target repeats the same predicate, which supabase-js has
-- no option to do).
create unique index if not exists idx_quran_surahs_chapter
  on public.quran_surahs (chapter);

-- ---------------------------------------------------------------------
-- quran_verses — the Arabic text, one row per ayah. chapter/verse_number
-- match the numbering every Quran edition uses, so this doesn't need
-- an FK to quran_surahs.id — the import script and the app both just
-- join on `chapter`.
-- ---------------------------------------------------------------------
create table public.quran_verses (
  chapter smallint not null,
  verse_number smallint not null,
  arabic_text text not null,
  primary key (chapter, verse_number)
);

alter table public.quran_verses enable row level security;
create policy "Anyone can view quran verses"
  on public.quran_verses for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- quran_translations — one row per (ayah, language). `lang` matches
-- the app's i18n language codes (az/en/ru/tr); `translator` is shown
-- in the app as an attribution line under each surah.
-- ---------------------------------------------------------------------
create table public.quran_translations (
  chapter smallint not null,
  verse_number smallint not null,
  lang text not null,
  translator text not null,
  translation_text text not null,
  primary key (chapter, verse_number, lang)
);

alter table public.quran_translations enable row level security;
create policy "Anyone can view quran translations"
  on public.quran_translations for select
  to anon, authenticated
  using (true);
