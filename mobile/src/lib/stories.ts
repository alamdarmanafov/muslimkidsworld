// mobile/src/lib/stories.ts
//
// Real story data — from the stories / story_translations tables
// added in supabase/migrations/0002_content_tables.sql and 0029_dua_
// story_content.sql. Public-read tables, no auth needed, same
// pattern as quran.ts/duas.ts. Replaces mobile/src/data/mock.ts's
// `stories` array plus the content.stories.<id>.title/subtitle and
// content.storyContent.<id> i18n keys.
//
// `locked` is now computed from the real unlock_level column against
// the child's current level, instead of mock.ts's hardcoded flags —
// unlock_level already existed in the schema for exactly this, just
// unused until now.

import type { IconName } from "../components/icons";
import { tones, type IconBadgeTone } from "../components/IconBadge";
import { getSupabaseClient } from "./supabase";

export type Story = {
  /** story slug, e.g. "nuh" — used for routing and markStoryRead, matching mock.ts's old `id`. */
  id: string;
  icon: IconName;
  tone: IconBadgeTone;
  unlockLevel: number;
  title: string;
  subtitle: string;
  paragraphs: string[];
};

type StoryListItem = Omit<Story, "paragraphs">;

const toneBySlug: Record<string, IconBadgeTone> = {
  yunus: tones.blue,
  ibrahim: tones.gold,
  nuh: tones.green,
  musa: tones.teal,
  yusuf: tones.purple,
};

/** All stories (list view), with title/subtitle in `lang` (falls back to "en"). */
export async function fetchStories(lang: string): Promise<StoryListItem[] | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: stories, error } = await supabase
      .from("stories")
      .select("id, slug, icon, unlock_level")
      .order("sort_order", { ascending: true });
    if (error || !stories) return null;

    let { data: translations } = await supabase
      .from("story_translations")
      .select("story_id, title, subtitle")
      .eq("lang", lang);
    if (!translations || translations.length === 0) {
      const fallback = await supabase
        .from("story_translations")
        .select("story_id, title, subtitle")
        .eq("lang", "en");
      translations = fallback.data;
    }
    const byStoryId = new Map((translations ?? []).map((t) => [t.story_id, t]));

    return stories.map((s) => ({
      id: s.slug,
      icon: s.icon as IconName,
      tone: toneBySlug[s.slug] ?? tones.indigo,
      unlockLevel: s.unlock_level,
      title: byStoryId.get(s.id)?.title ?? "",
      subtitle: byStoryId.get(s.id)?.subtitle ?? "",
    }));
  } catch {
    return null;
  }
}

/** One story's full text, with paragraphs in `lang` (falls back to "en"). */
export async function fetchStoryDetail(slug: string, lang: string): Promise<Story | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: story, error } = await supabase
      .from("stories")
      .select("id, slug, icon, unlock_level")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !story) return null;

    let translation = (
      await supabase
        .from("story_translations")
        .select("title, subtitle, paragraphs")
        .eq("story_id", story.id)
        .eq("lang", lang)
        .maybeSingle()
    ).data;
    if (!translation) {
      translation = (
        await supabase
          .from("story_translations")
          .select("title, subtitle, paragraphs")
          .eq("story_id", story.id)
          .eq("lang", "en")
          .maybeSingle()
      ).data;
    }
    if (!translation) return null;

    return {
      id: story.slug,
      icon: story.icon as IconName,
      tone: toneBySlug[story.slug] ?? tones.indigo,
      unlockLevel: story.unlock_level,
      title: translation.title,
      subtitle: translation.subtitle,
      paragraphs: (translation.paragraphs as string[]) ?? [],
    };
  } catch {
    return null;
  }
}
