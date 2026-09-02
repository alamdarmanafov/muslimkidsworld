import azMusayev from "./az-musayev.json";

export type QuranTranslationSource = {
  translator: string;
  language: string;
  source: string;
  chapters: Record<string, string[]>;
};

const translations: Record<string, QuranTranslationSource> = {
  az: azMusayev as QuranTranslationSource,
};

export function getSurahVerses(chapter: number, lang: string = "az"): string[] {
  const data = translations[lang] ?? translations.az;
  return data.chapters[String(chapter)] ?? [];
}
