// supabase/scripts/import-quran.mjs
//
// One-time import of the full 114-surah Quran (Arabic + 4
// translations) into the tables added by
// supabase/migrations/0010_quran_verses.sql. Run this from a machine
// with real internet access (the sandbox this was written in has none
// to external APIs) — it pulls from alquran.cloud, a long-established
// public Quran API, rather than having any Quran text typed from
// memory: verse-level transcription errors in a religious text are
// not an acceptable risk to take on faith.
//
// The 4 translation editions below (az.musayev, en.sahih, ru.kuliev,
// tr.diyanet) were picked to match the translators already named in
// mobile/src/data/quran/{az,en,ru,tr}.json ("Alikhan Musayev", "Saheeh
// International", "Elmir Kuliev", "Diyanet Isleri") — same source,
// just now covering all 114 surahs instead of 4, and living in the
// database instead of the app bundle.
//
// Usage:
//   cd supabase/scripts
//   npm install @supabase/supabase-js
//   SUPABASE_URL=https://<project-ref>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<service role key, NOT the anon key> \
//   node import-quran.mjs
//
// Safe to re-run: every write is an upsert keyed on (chapter[,
// verse_number[, lang]]), so running it again just re-syncs the same
// rows instead of duplicating them.

import { createClient } from "@supabase/supabase-js";

const API_BASE = "https://api.alquran.cloud/v1";
const TRANSLATION_EDITIONS = {
  az: { edition: "az.musayev", translator: "Alikhan Musayev" },
  en: { edition: "en.sahih", translator: "Saheeh International" },
  ru: { edition: "ru.kuliev", translator: "Elmir Kuliev" },
  tr: { edition: "tr.diyanet", translator: "Diyanet Isleri" },
};
const BATCH_SIZE = 500;

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const body = await res.json();
  if (body.code !== 200 || !body.data) {
    throw new Error(`${url} -> unexpected response shape: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body.data;
}

function slugify(englishName) {
  return englishName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertInBatches(table, rows, onConflict) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) throw new Error(`upsert into ${table} failed at row ${i}: ${error.message}`);
    process.stdout.write(`\r  ${table}: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
  }
  console.log();
}

async function main() {
  console.log("Fetching surah list...");
  const surahList = await fetchJson(`${API_BASE}/surah`);
  if (surahList.length !== 114) {
    throw new Error(`Expected 114 surahs, got ${surahList.length} — API shape may have changed.`);
  }

  console.log("Fetching Arabic text (quran-uthmani)...");
  const arabicData = await fetchJson(`${API_BASE}/quran/quran-uthmani`);

  const translationData = {};
  for (const [lang, { edition }] of Object.entries(TRANSLATION_EDITIONS)) {
    console.log(`Fetching ${lang} translation (${edition})...`);
    translationData[lang] = await fetchJson(`${API_BASE}/quran/${edition}`);
  }

  console.log("Building quran_surahs rows...");
  const arabicByChapter = new Map(arabicData.surahs.map((s) => [s.number, s]));
  const surahRows = surahList.map((s) => {
    const arabicSurah = arabicByChapter.get(s.number);
    const firstAyahJuz = arabicSurah?.ayahs?.[0]?.juz ?? 1;
    return {
      chapter: s.number,
      slug: slugify(s.englishName),
      name: s.englishName,
      arabic_name: s.name,
      juz: `Juz ${firstAyahJuz}`,
      unlock_level: 1,
      sort_order: s.number,
    };
  });
  await upsertInBatches("quran_surahs", surahRows, "chapter");

  console.log("Building quran_verses rows...");
  const verseRows = arabicData.surahs.flatMap((s) =>
    s.ayahs.map((a) => ({
      chapter: s.number,
      verse_number: a.numberInSurah,
      arabic_text: a.text,
    })),
  );
  await upsertInBatches("quran_verses", verseRows, "chapter,verse_number");

  for (const [lang, { translator }] of Object.entries(TRANSLATION_EDITIONS)) {
    console.log(`Building quran_translations rows (${lang})...`);
    const data = translationData[lang];
    const rows = data.surahs.flatMap((s) =>
      s.ayahs.map((a) => ({
        chapter: s.number,
        verse_number: a.numberInSurah,
        lang,
        translator,
        translation_text: a.text,
      })),
    );
    await upsertInBatches("quran_translations", rows, "chapter,verse_number,lang");
  }

  console.log("Done. 114 surahs, Arabic text, and 4 translations are now in Supabase.");
}

main().catch((err) => {
  console.error("\nImport failed:", err.message);
  process.exit(1);
});
