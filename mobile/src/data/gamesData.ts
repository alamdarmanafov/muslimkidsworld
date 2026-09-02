export type MemoryCardDef = { id: string; emoji: string };

export const memoryDeck: MemoryCardDef[] = [
  { id: "mosque", emoji: "🕌" },
  { id: "moon", emoji: "🌙" },
  { id: "star", emoji: "⭐" },
  { id: "book", emoji: "📖" },
  { id: "kaaba", emoji: "🕋" },
  { id: "dua", emoji: "🤲" },
];

export type IslamicSymbolDef = { id: string; emoji: string };

export const islamicSymbols: IslamicSymbolDef[] = [
  { id: "kaaba", emoji: "🕋" },
  { id: "mosque", emoji: "🕌" },
  { id: "quran", emoji: "📖" },
  { id: "crescent", emoji: "🌙" },
  { id: "lantern", emoji: "🏮" },
  { id: "zamzam", emoji: "💧" },
];

export type ArabicWordDef = { id: string; letters: string[] };

export const arabicWords: ArabicWordDef[] = [
  { id: "allah", letters: ["ا", "ل", "ل", "ه"] },
  { id: "quran", letters: ["ق", "ر", "آ", "ن"] },
  { id: "salah", letters: ["ص", "ل", "ا", "ة"] },
  { id: "hajj", letters: ["ح", "ج"] },
  { id: "sawm", letters: ["ص", "و", "م"] },
  { id: "zakat", letters: ["ز", "ك", "ا", "ة"] },
];
