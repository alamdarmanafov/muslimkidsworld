// supabase/scripts/import-quran-audio.mjs
//
// One-time import of per-verse recitation audio URLs into
// quran_verses.audio_url (supabase/migrations/0027_quran_audio.sql).
// Run this *after* import-quran.mjs — it only updates rows that
// import-quran.mjs already created (chapter, verse_number), it never
// inserts a verse on its own.
//
// Pulls from api.alquran.cloud (the same public Quran API
// import-quran.mjs already uses for text/translations) via its
// "ar.alafasy" audio edition — Sheikh Mishary Rashid Alafasy's
// recitation, one of the API's standard, widely-used editions. Run
// this from a machine with real internet access (the sandbox this was
// written in has none to external APIs, same constraint as
// import-quran.mjs — see that script's header comment).
//
// Usage:
//   cd supabase/scripts
//   npm install @supabase/supabase-js
//   SUPABASE_URL=https://<project-ref>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<service role key, NOT the anon key> \
//   node import-quran-audio.mjs
//
// Safe to re-run: every write is an upsert keyed on
// (chapter, verse_number), so running it again just re-syncs the same
// URLs instead of duplicating anything.

import { createClient } from "@supabase/supabase-js";

const API_BASE = "https://api.alquran.cloud/v1";
const AUDIO_EDITION = "ar.alafasy";
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
  console.log(`Fetching recitation audio (${AUDIO_EDITION})...`);
  const audioData = await fetchJson(`${API_BASE}/quran/${AUDIO_EDITION}`);

  console.log("Building quran_verses audio_url rows...");
  const rows = audioData.surahs.flatMap((s) =>
    s.ayahs
      .filter((a) => typeof a.audio === "string" && a.audio.length > 0)
      .map((a) => ({
        chapter: s.number,
        verse_number: a.numberInSurah,
        audio_url: a.audio,
      })),
  );
  if (rows.length === 0) {
    throw new Error("No audio URLs found in the API response — its shape may have changed.");
  }
  await upsertInBatches("quran_verses", rows, "chapter,verse_number");

  console.log(`Done. Recitation audio linked for ${rows.length} verses.`);
}

main().catch((err) => {
  console.error("\nImport failed:", err.message);
  process.exit(1);
});
