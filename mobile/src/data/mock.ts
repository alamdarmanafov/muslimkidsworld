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

export type WorldLocation = {
  id: string;
  name: string;
  emoji: string;
  tone: IconBadgeTone;
  unlockLevel: number;
};

export const worldLocations: WorldLocation[] = [
  { id: "home", name: "My Home", emoji: "🏠", tone: tones.brown, unlockLevel: 1 },
  { id: "mosque", name: "Mosque", emoji: "🕌", tone: tones.gold, unlockLevel: 5 },
  {
    id: "knowledge",
    name: "Knowledge Center",
    emoji: "📚",
    tone: tones.blue,
    unlockLevel: 8,
  },
  {
    id: "garden",
    name: "Good Deeds Garden",
    emoji: "🌳",
    tone: tones.green,
    unlockLevel: 1,
  },
  {
    id: "ramadan",
    name: "Ramadan Village",
    emoji: "🌙",
    tone: tones.indigo,
    unlockLevel: 15,
  },
];

export type Reward = {
  id: string;
  name: string;
  emoji: string;
  tone: IconBadgeTone;
  unlockLevel: number;
};

export const latestReward: Reward = {
  id: "blue-cap",
  name: "Blue Cap",
  emoji: "🧢",
  tone: tones.blue,
  unlockLevel: 12,
};

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
