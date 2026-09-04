// mobile/src/lib/quran.ts
//
// Real Quran data — all 114 surahs, from the quran_surahs /
// quran_verses / quran_translations tables added in
// supabase/migrations/0010_quran_verses.sql and populated by
// supabase/scripts/import-quran.mjs (a real Quran API, not anything
// hand-typed — see that script's header for why). Public-read tables,
// no auth needed, so this works the same for a parent's session or a
// child device's bare anon key.
//
// Replaces mobile/src/data/quran/*.json + mock.ts's quranSurahs,
// which only ever covered 4 demo surahs bundled into the app itself.

import { getSupabaseClient } from "./supabase";

export type QuranSurahListItem = {
  slug: string;
  chapter: number;
  name: string;
  arabicName: string;
  juz: string;
};

/** All 114 surahs in Quran order. Returns null on failure. */
export async function fetchQuranSurahList(): Promise<QuranSurahListItem[] | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("quran_surahs")
      .select("slug, chapter, name, arabic_name, juz")
      .order("sort_order", { ascending: true });
    if (error || !data) return null;
    return data
      .filter((r): r is typeof r & { chapter: number } => r.chapter != null)
      .map((r) => ({
        slug: r.slug,
        chapter: r.chapter,
        name: r.name,
        arabicName: r.arabic_name,
        juz: r.juz,
      }));
  } catch {
    return null;
  }
}

export type QuranVerse = {
  verseNumber: number;
  arabic: string;
  translation: string;
  /** Recitation audio URL, or null until supabase/scripts/import-quran-audio.mjs has been run. */
  audioUrl: string | null;
};

export type QuranSurahDetail = {
  slug: string;
  chapter: number;
  name: string;
  arabicName: string;
  translator: string;
  verses: QuranVerse[];
};

/**
 * One surah's full text — Arabic plus a translation in `lang`
 * (falls back to "en" if that language has no translation row).
 * Returns null on failure or if the surah doesn't exist.
 */
export async function fetchSurahDetail(
  slug: string,
  lang: string,
): Promise<QuranSurahDetail | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: surah, error: surahError } = await supabase
      .from("quran_surahs")
      .select("slug, chapter, name, arabic_name")
      .eq("slug", slug)
      .maybeSingle();
    if (surahError || !surah || surah.chapter == null) return null;

    const { data: verses, error: versesError } = await supabase
      .from("quran_verses")
      .select("verse_number, arabic_text, audio_url")
      .eq("chapter", surah.chapter)
      .order("verse_number", { ascending: true });
    if (versesError || !verses) return null;

    let { data: translations } = await supabase
      .from("quran_translations")
      .select("verse_number, translator, translation_text")
      .eq("chapter", surah.chapter)
      .eq("lang", lang)
      .order("verse_number", { ascending: true });
    if (!translations || translations.length === 0) {
      const fallback = await supabase
        .from("quran_translations")
        .select("verse_number, translator, translation_text")
        .eq("chapter", surah.chapter)
        .eq("lang", "en")
        .order("verse_number", { ascending: true });
      translations = fallback.data;
    }

    const translationByVerse = new Map(
      (translations ?? []).map((t) => [t.verse_number, t.translation_text]),
    );
    const translator = translations?.[0]?.translator ?? "";

    return {
      slug: surah.slug,
      chapter: surah.chapter,
      name: surah.name,
      arabicName: surah.arabic_name,
      translator,
      verses: verses.map((v) => ({
        verseNumber: v.verse_number,
        arabic: v.arabic_text,
        translation: translationByVerse.get(v.verse_number) ?? "",
        audioUrl: v.audio_url,
      })),
    };
  } catch {
    return null;
  }
}
