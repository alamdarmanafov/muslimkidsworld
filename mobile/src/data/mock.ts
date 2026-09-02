export type Child = {
  id: string;
  name: string;
  age: number;
  emoji: string;
  color: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
};

export const children: Child[] = [
  {
    id: "ali",
    name: "Ali",
    age: 8,
    emoji: "👦",
    color: "#DBEAFE",
    level: 12,
    xp: 850,
    streak: 7,
    accuracy: 87,
  },
  {
    id: "leyla",
    name: "Leyla",
    age: 6,
    emoji: "👧",
    color: "#FCE7F3",
    level: 9,
    xp: 620,
    streak: 12,
    accuracy: 92,
  },
  {
    id: "murad",
    name: "Murad",
    age: 11,
    emoji: "🧒",
    color: "#DCFCE7",
    level: 7,
    xp: 410,
    streak: 3,
    accuracy: 75,
  },
];

export const activeChild = children[0];

export type QuizOption = { id: string; label: string; emoji: string };

export type QuizCategory = "din" | "riyaziyyat" | "yaxsiEmeller" | "elm" | "xariciDil";

export type ForeignTargetLang = "en" | "ru";

export type QuizQuestion = {
  id: string;
  category: QuizCategory;
  targetLang?: ForeignTargetLang;
  options: QuizOption[];
  correctOptionId: string;
  xp: number;
};

/** Which foreign languages a child can be quizzed on, based on the app's current UI language. */
export const foreignLanguageAvailability: Record<string, ForeignTargetLang[]> = {
  az: ["en", "ru"],
  ru: ["en"],
  tr: ["en"],
  en: [],
};

export const quizBank: QuizQuestion[] = [
  // Din
  {
    id: "q1",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "🏠" },
      { id: "b", label: "B", emoji: "🕌" },
      { id: "c", label: "C", emoji: "⛪" },
      { id: "d", label: "D", emoji: "🏢" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "q2",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "3️⃣" },
      { id: "b", label: "B", emoji: "4️⃣" },
      { id: "c", label: "C", emoji: "5️⃣" },
      { id: "d", label: "D", emoji: "6️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q3",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "📖" },
      { id: "b", label: "B", emoji: "📗" },
      { id: "c", label: "C", emoji: "📘" },
      { id: "d", label: "D", emoji: "📙" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q4",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "3️⃣" },
      { id: "b", label: "B", emoji: "4️⃣" },
      { id: "c", label: "C", emoji: "5️⃣" },
      { id: "d", label: "D", emoji: "6️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q5",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "100" },
      { id: "b", label: "B", emoji: "110" },
      { id: "c", label: "C", emoji: "114" },
      { id: "d", label: "D", emoji: "120" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q6",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "2️⃣" },
      { id: "b", label: "B", emoji: "3️⃣" },
      { id: "c", label: "C", emoji: "4️⃣" },
      { id: "d", label: "D", emoji: "5️⃣" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "q7",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "4️⃣" },
      { id: "b", label: "B", emoji: "5️⃣" },
      { id: "c", label: "C", emoji: "6️⃣" },
      { id: "d", label: "D", emoji: "7️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q8",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "🌙" },
      { id: "b", label: "B", emoji: "⭐" },
      { id: "c", label: "C", emoji: "☀️" },
      { id: "d", label: "D", emoji: "⚡" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q9",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "1️⃣" },
      { id: "b", label: "B", emoji: "2️⃣" },
      { id: "c", label: "C", emoji: "3️⃣" },
      { id: "d", label: "D", emoji: "4️⃣" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "q10",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "11" },
      { id: "c", label: "C", emoji: "12" },
      { id: "d", label: "D", emoji: "13" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  // Riyaziyyat
  {
    id: "m1",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "6" },
      { id: "b", label: "B", emoji: "7" },
      { id: "c", label: "C", emoji: "8" },
      { id: "d", label: "D", emoji: "9" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m2",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "5" },
      { id: "b", label: "B", emoji: "6" },
      { id: "c", label: "C", emoji: "7" },
      { id: "d", label: "D", emoji: "8" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m3",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "5" },
      { id: "b", label: "B", emoji: "6" },
      { id: "c", label: "C", emoji: "7" },
      { id: "d", label: "D", emoji: "8" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m4",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "2" },
      { id: "b", label: "B", emoji: "3" },
      { id: "c", label: "C", emoji: "4" },
      { id: "d", label: "D", emoji: "5" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m5",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "12" },
      { id: "b", label: "B", emoji: "13" },
      { id: "c", label: "C", emoji: "14" },
      { id: "d", label: "D", emoji: "15" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  // Yaxşı Əməllər
  {
    id: "e1",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤗" },
      { id: "b", label: "B", emoji: "😂" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😡" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e2",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤝" },
      { id: "b", label: "B", emoji: "🙅" },
      { id: "c", label: "C", emoji: "😤" },
      { id: "d", label: "D", emoji: "😏" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e3",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🎮" },
      { id: "b", label: "B", emoji: "🙋" },
      { id: "c", label: "C", emoji: "🙉" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e4",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🗣️" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😠" },
      { id: "d", label: "D", emoji: "😆" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  // Elm və Təbiət
  {
    id: "sc1",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "7" },
      { id: "b", label: "B", emoji: "8" },
      { id: "c", label: "C", emoji: "9" },
      { id: "d", label: "D", emoji: "10" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc2",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "-5°" },
      { id: "b", label: "B", emoji: "0°" },
      { id: "c", label: "C", emoji: "5°" },
      { id: "d", label: "D", emoji: "10°" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc3",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "200" },
      { id: "b", label: "B", emoji: "206" },
      { id: "c", label: "C", emoji: "210" },
      { id: "d", label: "D", emoji: "220" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc4",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "5️⃣" },
      { id: "b", label: "B", emoji: "6️⃣" },
      { id: "c", label: "C", emoji: "7️⃣" },
      { id: "d", label: "D", emoji: "8️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  // Xarici Dil — English
  {
    id: "f1",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🍎" },
      { id: "b", label: "B", emoji: "🍐" },
      { id: "c", label: "C", emoji: "🍌" },
      { id: "d", label: "D", emoji: "🍇" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f2",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🐱" },
      { id: "b", label: "B", emoji: "🐶" },
      { id: "c", label: "C", emoji: "🐰" },
      { id: "d", label: "D", emoji: "🐭" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f3",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "☀️" },
      { id: "b", label: "B", emoji: "🌙" },
      { id: "c", label: "C", emoji: "⭐" },
      { id: "d", label: "D", emoji: "🌧️" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f4",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "📕" },
      { id: "b", label: "B", emoji: "🖊️" },
      { id: "c", label: "C", emoji: "📱" },
      { id: "d", label: "D", emoji: "🎒" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f5",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "💧" },
      { id: "b", label: "B", emoji: "🔥" },
      { id: "c", label: "C", emoji: "🌳" },
      { id: "d", label: "D", emoji: "🪨" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  // Xarici Dil — Russian
  {
    id: "g1",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🐱" },
      { id: "b", label: "B", emoji: "🐶" },
      { id: "c", label: "C", emoji: "🐰" },
      { id: "d", label: "D", emoji: "🐭" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g2",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🍎" },
      { id: "b", label: "B", emoji: "🍐" },
      { id: "c", label: "C", emoji: "🍌" },
      { id: "d", label: "D", emoji: "🍇" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g3",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "📕" },
      { id: "b", label: "B", emoji: "🖊️" },
      { id: "c", label: "C", emoji: "📱" },
      { id: "d", label: "D", emoji: "🎒" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g4",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "💧" },
      { id: "b", label: "B", emoji: "🔥" },
      { id: "c", label: "C", emoji: "🌳" },
      { id: "d", label: "D", emoji: "🪨" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
];

export function getQuizQuestions(category: QuizCategory, targetLang?: ForeignTargetLang): QuizQuestion[] {
  return quizBank.filter(
    (q) => q.category === category && (category !== "xariciDil" || q.targetLang === targetLang),
  );
}

import { IconBadgeTone, tones } from "../components/IconBadge";
import type { IconName } from "../components/icons";

export type WorldLocation = {
  id: string;
  name: string;
  icon: IconName;
  tone: IconBadgeTone;
  unlockLevel: number;
};

export const worldLocations: WorldLocation[] = [
  { id: "home", name: "My Home", icon: "home", tone: tones.brown, unlockLevel: 1 },
  { id: "mosque", name: "Mosque", icon: "mosque", tone: tones.gold, unlockLevel: 5 },
  {
    id: "knowledge",
    name: "Knowledge Center",
    icon: "book",
    tone: tones.blue,
    unlockLevel: 8,
  },
  {
    id: "garden",
    name: "Good Deeds Garden",
    icon: "tree",
    tone: tones.green,
    unlockLevel: 1,
  },
  {
    id: "ramadan",
    name: "Ramadan Village",
    icon: "moon",
    tone: tones.indigo,
    unlockLevel: 15,
  },
];

export type Reward = {
  id: string;
  icon: IconName;
  tone: IconBadgeTone;
  unlockLevel: number;
};

export const latestReward: Reward = {
  id: "blue-cap",
  icon: "gift",
  tone: tones.blue,
  unlockLevel: 12,
};

export type QuranSurah = {
  id: string;
  chapter: number;
  arabicName: string;
  locked: boolean;
};

export const quranSurahs: QuranSurah[] = [
  { id: "al-fatiha", chapter: 1, arabicName: "الفاتحة", locked: false },
  { id: "an-nas", chapter: 114, arabicName: "الناس", locked: true },
  { id: "al-falaq", chapter: 113, arabicName: "الفلق", locked: true },
  { id: "al-ikhlas", chapter: 112, arabicName: "الإخلاص", locked: true },
];

export type DuaCategory = "Morning" | "Evening" | "Sleep" | "Eat";

export type Dua = {
  id: string;
  category: DuaCategory;
  arabic: string;
  transliteration: string;
};

export const duas: Dua[] = [
  {
    id: "morning",
    category: "Morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    transliteration: "Allahumma bika asbahna wa bika amsaina",
  },
  {
    id: "evening",
    category: "Evening",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا",
    transliteration: "Allahumma bika amsaina wa bika asbahna",
  },
  {
    id: "sleep",
    category: "Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
  },
  {
    id: "eat",
    category: "Eat",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
  },
];

export type Story = {
  id: string;
  icon: IconName;
  tone: IconBadgeTone;
  locked: boolean;
};

export const stories: Story[] = [
  { id: "yunus", icon: "globe", tone: tones.blue, locked: false },
  { id: "ibrahim", icon: "mosque", tone: tones.gold, locked: false },
  { id: "musa", icon: "star", tone: tones.teal, locked: true },
];

export type Game = {
  id: string;
  icon: IconName;
  tone: IconBadgeTone;
};

export const games: Game[] = [
  { id: "find-pair", icon: "mosque", tone: tones.blue },
  { id: "memory", icon: "quiz", tone: tones.purple },
  { id: "word-puzzle", icon: "puzzle", tone: tones.green },
];

export type Achievement = {
  id: string;
  icon: IconName;
  tone: IconBadgeTone;
  earned: boolean;
};

export const achievements: Achievement[] = [
  { id: "first-star", icon: "star", tone: tones.gold, earned: true },
  { id: "book-lover", icon: "book", tone: tones.purple, earned: true },
  { id: "mosque-visitor", icon: "mosque", tone: tones.blue, earned: true },
  { id: "week-streak", icon: "flame", tone: tones.red, earned: true },
  { id: "quiz-master", icon: "quiz", tone: tones.pink, earned: false },
  { id: "storyteller", icon: "globe", tone: tones.teal, earned: false },
];

export const childStats = { badges: 12, stars: 120, days: 15 };

export type JourneyItem = {
  id: string;
  label: string;
  icon: IconName;
  minutes: number;
  href: string;
  done: boolean;
};

export const dailyJourney: JourneyItem[] = [
  { id: "quran", label: "Quran", icon: "book", minutes: 15, href: "/child/quran", done: true },
  { id: "dua", label: "Dua", icon: "heart", minutes: 10, href: "/child/dua", done: true },
  { id: "story", label: "Story", icon: "star", minutes: 15, href: "/child/stories", done: false },
  { id: "quiz", label: "Quiz", icon: "quiz", minutes: 10, href: "/child/quiz-categories", done: false },
  { id: "game", label: "Game", icon: "controller", minutes: 10, href: "/child/games", done: false },
];

export const dailyLimitOptions = [30, 45, 60, 90] as const;

let _dailyLimitMinutes = 60;

export function getDailyLimitMinutes() {
  return _dailyLimitMinutes;
}

export function setDailyLimitMinutes(minutes: number) {
  _dailyLimitMinutes = minutes;
}

export const dailyMinutesDone = dailyJourney
  .filter((i) => i.done)
  .reduce((sum, i) => sum + i.minutes, 0);
export const parentPin = "1234";

export const plans = [
  {
    id: "single",
    price: "$4.99",
    period: "/month",
  },
  {
    id: "family",
    price: "$7.99",
    period: "/month",
    bestValue: true,
  },
];
