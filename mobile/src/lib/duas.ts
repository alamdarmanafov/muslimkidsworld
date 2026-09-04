// mobile/src/lib/duas.ts
//
// Real dua data — from the duas / dua_translations tables added in
// supabase/migrations/0002_content_tables.sql and 0029_dua_story_
// content.sql. Public-read tables, no auth needed, same pattern as
// quran.ts. Replaces mobile/src/data/mock.ts's `duas` array plus the
// content.dua.<id> / content.duaMeaning.<id> i18n keys.

import { getSupabaseClient } from "./supabase";

export type DuaCategory = "Morning" | "Evening" | "Sleep" | "Eat";

export type Dua = {
  /** dua slug, e.g. "morning2" — used for routing/lookups like mock.ts's old `id`. */
  id: string;
  category: DuaCategory;
  arabic: string;
  transliteration: string;
  title: string;
  meaning: string;
};

/** All duas, with title/meaning in `lang` (falls back to "en" if that language has no rows yet). */
export async function fetchDuas(lang: string): Promise<Dua[] | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: duas, error } = await supabase
      .from("duas")
      .select("id, slug, category, arabic, transliteration")
      .order("sort_order", { ascending: true });
    if (error || !duas) return null;

    let { data: translations } = await supabase
      .from("dua_translations")
      .select("dua_id, title, meaning")
      .eq("lang", lang);
    if (!translations || translations.length === 0) {
      const fallback = await supabase
        .from("dua_translations")
        .select("dua_id, title, meaning")
        .eq("lang", "en");
      translations = fallback.data;
    }
    const byDuaId = new Map((translations ?? []).map((t) => [t.dua_id, t]));

    return duas.map((d) => ({
      id: d.slug,
      category: d.category as DuaCategory,
      arabic: d.arabic,
      transliteration: d.transliteration,
      title: byDuaId.get(d.id)?.title ?? "",
      meaning: byDuaId.get(d.id)?.meaning ?? "",
    }));
  } catch {
    return null;
  }
}
