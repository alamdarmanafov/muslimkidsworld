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

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  xp: number;
};

export const dailyTen: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which one is a mosque?",
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
    prompt: "How many times a day do Muslims pray?",
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
    prompt: "What is the holy book of Islam called?",
    options: [
      { id: "a", label: "A", emoji: "📖" },
      { id: "b", label: "B", emoji: "📗" },
      { id: "c", label: "C", emoji: "📘" },
      { id: "d", label: "D", emoji: "📙" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
];

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
  name: string;
  icon: IconName;
  tone: IconBadgeTone;
  unlockLevel: number;
};

export const latestReward: Reward = {
  id: "blue-cap",
  name: "Blue Cap",
  icon: "gift",
  tone: tones.blue,
  unlockLevel: 12,
};

export type QuranSurah = {
  id: string;
  name: string;
  arabicName: string;
  juz: string;
  locked: boolean;
};

export const quranSurahs: QuranSurah[] = [
  { id: "al-fatiha", name: "Al-Fatiha", arabicName: "الفاتحة", juz: "Juz Amma", locked: false },
  { id: "an-nas", name: "An-Nas", arabicName: "الناس", juz: "Juz Amma", locked: true },
  { id: "al-falaq", name: "Al-Falaq", arabicName: "الفلق", juz: "Juz Amma", locked: true },
  { id: "al-ikhlas", name: "Al-Ikhlas", arabicName: "الإخلاص", juz: "Juz Amma", locked: true },
];

export type DuaCategory = "Morning" | "Evening" | "Sleep" | "Eat";

export type Dua = {
  id: string;
  title: string;
  category: DuaCategory;
  arabic: string;
  transliteration: string;
};

export const duas: Dua[] = [
  {
    id: "morning",
    title: "Morning Dua",
    category: "Morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    transliteration: "Allahumma bika asbahna wa bika amsaina",
  },
  {
    id: "evening",
    title: "Evening Dua",
    category: "Evening",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا",
    transliteration: "Allahumma bika amsaina wa bika asbahna",
  },
  {
    id: "sleep",
    title: "Before Sleep",
    category: "Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
  },
  {
    id: "eat",
    title: "Before Eating",
    category: "Eat",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
  },
];

export type Story = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  tone: IconBadgeTone;
  locked: boolean;
};

export const stories: Story[] = [
  {
    id: "yunus",
    title: "The Story of Prophet Yunus (AS)",
    subtitle: "Inside the whale",
    icon: "globe",
    tone: tones.blue,
    locked: false,
  },
  {
    id: "ibrahim",
    title: "Prophet Ibrahim (AS)",
    subtitle: "The friend of Allah",
    icon: "mosque",
    tone: tones.gold,
    locked: false,
  },
  {
    id: "musa",
    title: "Prophet Musa (AS)",
    subtitle: "The staff and the sea",
    icon: "star",
    tone: tones.teal,
    locked: true,
  },
];

export type Game = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  tone: IconBadgeTone;
};

export const games: Game[] = [
  {
    id: "find-pair",
    title: "Find the Pair",
    subtitle: "Match Islamic landmarks",
    icon: "mosque",
    tone: tones.blue,
  },
  {
    id: "memory",
    title: "Memory",
    subtitle: "Train your memory",
    icon: "quiz",
    tone: tones.purple,
  },
  {
    id: "word-puzzle",
    title: "Islamic Word Puzzle",
    subtitle: "Arrange the Arabic letters",
    icon: "puzzle",
    tone: tones.green,
  },
];

export type Achievement = {
  id: string;
  label: string;
  icon: IconName;
  tone: IconBadgeTone;
  earned: boolean;
};

export const achievements: Achievement[] = [
  { id: "first-star", label: "First Star", icon: "star", tone: tones.gold, earned: true },
  { id: "book-lover", label: "Book Lover", icon: "book", tone: tones.purple, earned: true },
  { id: "mosque-visitor", label: "Mosque Visitor", icon: "mosque", tone: tones.blue, earned: true },
  { id: "week-streak", label: "7 Day Streak", icon: "flame", tone: tones.red, earned: true },
  { id: "quiz-master", label: "Quiz Master", icon: "quiz", tone: tones.pink, earned: false },
  { id: "storyteller", label: "Storyteller", icon: "globe", tone: tones.teal, earned: false },
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
  { id: "quiz", label: "Quiz", icon: "quiz", minutes: 10, href: "/child/quiz", done: false },
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

export const familyCode = "583214";

export const plans = [
  {
    id: "single",
    name: "Single Child",
    price: "$4.99",
    period: "/month",
    childLimit: "1 Child",
    features: ["Unlimited Daily 10", "Full World Access", "Basic Reports"],
  },
  {
    id: "family",
    name: "Family",
    price: "$7.99",
    period: "/month",
    childLimit: "Up to 3 Children",
    features: [
      "Unlimited Daily 10",
      "Full World Access",
      "Advanced Progress & Reports",
      "Premium Rewards",
      "Cancel Anytime",
    ],
    bestValue: true,
  },
];
