-- 0027_quran_audio.sql
--
-- Adds a per-verse recitation audio URL, following the exact same
-- "schema here, real data via a script" split as 0010_quran_verses.sql
-- itself — a Quran audio file isn't something to fabricate a URL for,
-- so this migration only adds the column. Run
-- supabase/scripts/import-quran-audio.mjs afterward (from a machine
-- with real internet access) to actually populate it; until then the
-- app's play button simply doesn't show for a verse with no audio_url.

alter table public.quran_verses
  add column if not exists audio_url text;
