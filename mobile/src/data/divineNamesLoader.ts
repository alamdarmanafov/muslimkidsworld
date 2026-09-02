import raw from "./divineNames.json";

export type DivineName = {
  id: string;
  number: number;
  arabic: string;
  name: string;
  meaning: string;
};

type RawDivineName = {
  id: string;
  number: number;
  arabic: string;
  name: Record<string, string>;
  meaning: Record<string, string>;
};

const data = raw as RawDivineName[];

export function getDivineNames(lang: string): DivineName[] {
  return data.map((d) => ({
    id: d.id,
    number: d.number,
    arabic: d.arabic,
    name: d.name[lang] ?? d.name.en,
    meaning: d.meaning[lang] ?? d.meaning.en,
  }));
}
