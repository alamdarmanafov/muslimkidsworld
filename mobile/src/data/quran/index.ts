import ar from "./ar.json";
import az from "./az.json";
import en from "./en.json";
import tr from "./tr.json";
import ru from "./ru.json";

export type QuranTranslationSource = {
  translator: string;
  language: string;
  source: string;
  chapters: Record<string, string[]>;
};

const arabic = ar as QuranTranslationSource;

const translations: Record<string, QuranTranslationSource> = {
  az: az as QuranTranslationSource,
  en: en as QuranTranslationSource,
  tr: tr as QuranTranslationSource,
  ru: ru as QuranTranslationSource,
};

export function getArabicVerses(chapter: number): string[] {
  return arabic.chapters[String(chapter)] ?? [];
}

export function getSurahVerses(chapter: number, lang: string): string[] {
  const data = translations[lang] ?? translations.en;
  return data.chapters[String(chapter)] ?? [];
}

export function getTranslatorName(lang: string): string {
  const data = translations[lang] ?? translations.en;
  return data.translator;
}
