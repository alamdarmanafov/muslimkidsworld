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

export type QuizOption = {
  id: string;
  label: string;
  emoji: string;
  /** Translation key for a static text option (city/person names). */
  textKey?: string;
  /** Already-resolved text for a dynamically generated option (e.g. from divineNames data). */
  text?: string;
};

export type QuizCategory = "din" | "riyaziyyat" | "yaxsiEmeller" | "elm" | "xariciDil";

export type ForeignTargetLang = "en" | "ru";

export type QuizDifficulty = "easy" | "medium" | "hard";

/** Difficulty for hand-authored questions that predate the `difficulty` field. */
const DIFFICULTY_BY_ID: Record<string, QuizDifficulty> = {
  q1: "easy", q2: "easy", q3: "easy", q8: "easy",
  q4: "medium", q6: "medium", q7: "medium", q9: "medium", q10: "medium",
  q15: "medium", q18: "medium", q19: "medium", q20: "medium",
  q5: "hard", q11: "hard", q12: "hard", q13: "hard", q14: "hard", q16: "hard", q17: "hard",
  p1: "hard", p2: "medium", p3: "medium", p4: "hard", p5: "easy", p6: "easy", p7: "easy",
  p8: "easy", p9: "medium", p10: "medium", p11: "medium", p12: "medium", p13: "hard",
  d1: "easy", d2: "easy", d3: "easy", d4: "easy", d5: "medium", d6: "hard",
  e1: "easy", e2: "easy", e3: "easy", e4: "easy", e5: "easy", e6: "easy", e7: "easy",
  e8: "easy", e9: "easy", e10: "easy", e11: "easy", e12: "easy", e13: "easy", e14: "easy", e15: "easy",
  sc1: "medium", sc2: "medium", sc3: "hard", sc4: "easy", sc5: "easy", sc6: "easy",
  sc7: "medium", sc8: "easy", sc9: "easy", sc10: "hard", sc11: "medium", sc12: "easy",
  sc13: "easy", sc14: "easy", sc15: "easy", sc16: "easy", sc17: "easy", sc18: "easy",
  m16: "medium", m17: "medium", m18: "medium",
  f1: "easy", f2: "easy", f3: "easy", f4: "easy", f5: "easy", f6: "easy",
  f7: "easy", f8: "easy", f9: "easy", f10: "easy", f11: "easy", f12: "easy",
  g1: "easy", g2: "easy", g3: "easy", g4: "easy", g5: "easy",
  g6: "easy", g7: "easy", g8: "easy", g9: "easy", g10: "easy",
};

export function getDifficulty(question: { id: string; difficulty?: QuizDifficulty }): QuizDifficulty {
  return question.difficulty ?? DIFFICULTY_BY_ID[question.id] ?? "medium";
}

export type QuizQuestion = {
  id: string;
  category: QuizCategory;
  targetLang?: ForeignTargetLang;
  /** Falls back to DIFFICULTY_BY_ID / "medium" via getDifficulty() when omitted. */
  difficulty?: QuizDifficulty;
  /** Set only for procedurally generated questions (e.g. math) — used instead of a content.quiz.* translation key. */
  promptText?: string;
  /** Set for generated questions whose prompt still needs translation (e.g. "How many verses in {{name}}?") — a top-level i18n key with interpolation params. */
  promptKey?: string;
  promptParams?: Record<string, string | number>;
  /** Optional translation key for a short, encouraging fact shown on the feedback screen. */
  explanationKey?: string;
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
  {
    id: "q11",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "20" },
      { id: "b", label: "B", emoji: "25" },
      { id: "c", label: "C", emoji: "30" },
      { id: "d", label: "D", emoji: "35" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q12",
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
    id: "q13",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "5️⃣" },
      { id: "b", label: "B", emoji: "6️⃣" },
      { id: "c", label: "C", emoji: "7️⃣" },
      { id: "d", label: "D", emoji: "8️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q14",
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
    id: "q15",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "1️⃣" },
      { id: "b", label: "B", emoji: "2️⃣" },
      { id: "c", label: "C", emoji: "3️⃣" },
      { id: "d", label: "D", emoji: "4️⃣" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q16",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "6️⃣" },
      { id: "b", label: "B", emoji: "7️⃣" },
      { id: "c", label: "C", emoji: "8️⃣" },
      { id: "d", label: "D", emoji: "9️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q17",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "5️⃣" },
      { id: "b", label: "B", emoji: "6️⃣" },
      { id: "c", label: "C", emoji: "7️⃣" },
      { id: "d", label: "D", emoji: "8️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q18",
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
    id: "q19",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "2️⃣" },
      { id: "b", label: "B", emoji: "3️⃣" },
      { id: "c", label: "C", emoji: "4️⃣" },
      { id: "d", label: "D", emoji: "5️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q20",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "2️⃣" },
      { id: "b", label: "B", emoji: "3️⃣" },
      { id: "c", label: "C", emoji: "4️⃣" },
      { id: "d", label: "D", emoji: "5️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "p1",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "6" },
      { id: "b", label: "B", emoji: "7" },
      { id: "c", label: "C", emoji: "8" },
      { id: "d", label: "D", emoji: "9" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p2",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "35" },
      { id: "b", label: "B", emoji: "40" },
      { id: "c", label: "C", emoji: "45" },
      { id: "d", label: "D", emoji: "50" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p3",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "60" },
      { id: "b", label: "B", emoji: "63" },
      { id: "c", label: "C", emoji: "65" },
      { id: "d", label: "D", emoji: "70" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p4",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "8" },
      { id: "b", label: "B", emoji: "9" },
      { id: "c", label: "C", emoji: "10" },
      { id: "d", label: "D", emoji: "11" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "p5",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.damascus" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p6",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.damascus" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p7",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPeople.abdullah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPeople.abuTalib" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPeople.hamza" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPeople.abbas" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p8",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPeople.aminah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPeople.khadijah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPeople.aisha" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPeople.fatimah" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p9",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPeople.khadijah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPeople.aisha" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPeople.fatimah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPeople.zaynab" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p10",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMonths.muharram" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMonths.safar" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMonths.rajab" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMonths.shawwal" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p11",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMonths.shawwal" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMonths.ramadan" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMonths.rajab" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMonths.muharram" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p12",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMonths.shawwal" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMonths.rajab" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMonths.dhulhijjah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMonths.muharram" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "p13",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizConcepts.intention" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizConcepts.time" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizConcepts.amount" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizConcepts.place" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d1",
    category: "din",
    explanationKey: "content.quizExplanations.d1",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.damascus" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d2",
    category: "din",
    explanationKey: "content.quizExplanations.d2",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWorship.fasting" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWorship.zakat" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWorship.hajj" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWorship.sacrifice" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d3",
    category: "din",
    explanationKey: "content.quizExplanations.d3",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPhrases.bismillah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPhrases.alhamdulillah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPhrases.subhanallah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPhrases.astaghfirullah" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d4",
    category: "din",
    explanationKey: "content.quizExplanations.d4",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPurposes.worship" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPurposes.play" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPurposes.cook" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPurposes.shop" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d5",
    category: "din",
    explanationKey: "content.quizExplanations.d5",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizFestivals.eidalfitr" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizFestivals.eidaladha" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizFestivals.novruz" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizFestivals.christmas" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d6",
    category: "din",
    explanationKey: "content.quizExplanations.d6",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.bee" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.dog" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.cat" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.fish" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d7",
    category: "din",
    explanationKey: "content.quizExplanations.d7",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizDirections.kaaba" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizDirections.sun" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizDirections.moon" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizDirections.east" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d8",
    category: "din",
    explanationKey: "content.quizExplanations.d8",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizSurahNames.fatiha" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizSurahNames.baqara" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizSurahNames.yasin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizSurahNames.ikhlas" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d9",
    category: "din",
    explanationKey: "content.quizExplanations.d9",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPhrases.bismillah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPhrases.alhamdulillah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPhrases.subhanallah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPhrases.astaghfirullah" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d10",
    category: "din",
    explanationKey: "content.quizExplanations.d10",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPhrases.inshallah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPhrases.alhamdulillah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPhrases.subhanallah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPhrases.bismillah" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d11",
    category: "din",
    explanationKey: "content.quizExplanations.d11",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizFestivals.eidaladha" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizFestivals.eidalfitr" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizFestivals.novruz" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizFestivals.christmas" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d12",
    category: "din",
    explanationKey: "content.quizExplanations.d12",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWorship.iftar" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWorship.sahur" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWorship.zakat" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWorship.hajj" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d13",
    category: "din",
    explanationKey: "content.quizExplanations.d13",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWorship.sadaqah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWorship.prayer" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWorship.zakat" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWorship.hajj" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d14",
    category: "din",
    explanationKey: "content.quizExplanations.d14",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizRoles.firstHumanProphet" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizRoles.angel" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizRoles.king" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizRoles.scholar" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d15",
    category: "din",
    explanationKey: "content.quizExplanations.d15",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizStructures.ship" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizStructures.house" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizStructures.mosque" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizStructures.bridge" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d16",
    category: "din",
    explanationKey: "content.quizExplanations.d16",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizTraits.strongFaith" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizTraits.wealth" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizTraits.strength" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizTraits.speed" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d17",
    category: "din",
    explanationKey: "content.quizExplanations.d17",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizRelations.son" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizRelations.brother" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizRelations.uncle" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizRelations.friend" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d18",
    category: "din",
    explanationKey: "content.quizExplanations.d18",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAttitudes.kindCaring" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAttitudes.strict" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAttitudes.indifferent" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAttitudes.impatient" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  // Riyaziyyat — söz məsələləri
  {
    id: "m16",
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
    id: "m17",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "11" },
      { id: "c", label: "C", emoji: "12" },
      { id: "d", label: "D", emoji: "13" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m18",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "3" },
      { id: "b", label: "B", emoji: "4" },
      { id: "c", label: "C", emoji: "5" },
      { id: "d", label: "D", emoji: "6" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m19",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m19",
    options: [
      { id: "a", label: "A", emoji: "9" },
      { id: "b", label: "B", emoji: "10" },
      { id: "c", label: "C", emoji: "11" },
      { id: "d", label: "D", emoji: "12" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m20",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m20",
    options: [
      { id: "a", label: "A", emoji: "22" },
      { id: "b", label: "B", emoji: "24" },
      { id: "c", label: "C", emoji: "25" },
      { id: "d", label: "D", emoji: "30" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m21",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m21",
    options: [
      { id: "a", label: "A", emoji: "8" },
      { id: "b", label: "B", emoji: "9" },
      { id: "c", label: "C", emoji: "10" },
      { id: "d", label: "D", emoji: "11" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m22",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m22",
    options: [
      { id: "a", label: "A", emoji: "4" },
      { id: "b", label: "B", emoji: "5" },
      { id: "c", label: "C", emoji: "6" },
      { id: "d", label: "D", emoji: "7" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m23",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m23",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "12" },
      { id: "c", label: "C", emoji: "15" },
      { id: "d", label: "D", emoji: "20" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m24",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m24",
    options: [
      { id: "a", label: "A", emoji: "2" },
      { id: "b", label: "B", emoji: "3" },
      { id: "c", label: "C", emoji: "4" },
      { id: "d", label: "D", emoji: "6" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m25",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m25",
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
    id: "m26",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m26",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "20" },
      { id: "c", label: "C", emoji: "24" },
      { id: "d", label: "D", emoji: "28" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m27",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m27",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "100" },
      { id: "c", label: "C", emoji: "1000" },
      { id: "d", label: "D", emoji: "10000" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m28",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m28",
    options: [
      { id: "a", label: "A", emoji: "12" },
      { id: "b", label: "B", emoji: "20" },
      { id: "c", label: "C", emoji: "24" },
      { id: "d", label: "D", emoji: "30" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m29",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m29",
    options: [
      { id: "a", label: "A", emoji: "16" },
      { id: "b", label: "B", emoji: "17" },
      { id: "c", label: "C", emoji: "18" },
      { id: "d", label: "D", emoji: "20" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m30",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m30",
    options: [
      { id: "a", label: "A", emoji: "5" },
      { id: "b", label: "B", emoji: "8" },
      { id: "c", label: "C", emoji: "10" },
      { id: "d", label: "D", emoji: "12" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m31",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m31",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "12" },
      { id: "c", label: "C", emoji: "14" },
      { id: "d", label: "D", emoji: "16" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m32",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m32",
    options: [
      { id: "a", label: "A", emoji: "6" },
      { id: "b", label: "B", emoji: "7" },
      { id: "c", label: "C", emoji: "8" },
      { id: "d", label: "D", emoji: "9" },
    ],
    correctOptionId: "c",
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
  {
    id: "e5",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤲" },
      { id: "b", label: "B", emoji: "🗑️" },
      { id: "c", label: "C", emoji: "🙊" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e6",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🙋" },
      { id: "b", label: "B", emoji: "🙉" },
      { id: "c", label: "C", emoji: "😤" },
      { id: "d", label: "D", emoji: "😂" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e7",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤫" },
      { id: "b", label: "B", emoji: "📢" },
      { id: "c", label: "C", emoji: "🏃" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e8",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤝" },
      { id: "b", label: "B", emoji: "😠" },
      { id: "c", label: "C", emoji: "😢" },
      { id: "d", label: "D", emoji: "🙈" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e9",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🙏" },
      { id: "b", label: "B", emoji: "🤥" },
      { id: "c", label: "C", emoji: "🏃" },
      { id: "d", label: "D", emoji: "😆" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e10",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "😌" },
      { id: "b", label: "B", emoji: "👊" },
      { id: "c", label: "C", emoji: "😢" },
      { id: "d", label: "D", emoji: "🗣️" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e11",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e11",
    options: [
      { id: "a", label: "A", emoji: "🤗" },
      { id: "b", label: "B", emoji: "😤" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😠" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e12",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e12",
    options: [
      { id: "a", label: "A", emoji: "😞" },
      { id: "b", label: "B", emoji: "😊" },
      { id: "c", label: "C", emoji: "😐" },
      { id: "d", label: "D", emoji: "😏" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e13",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e13",
    options: [
      { id: "a", label: "A", emoji: "😊" },
      { id: "b", label: "B", emoji: "😐" },
      { id: "c", label: "C", emoji: "😞" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e14",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e14",
    options: [
      { id: "a", label: "A", emoji: "😇" },
      { id: "b", label: "B", emoji: "😐" },
      { id: "c", label: "C", emoji: "😒" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e15",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e15",
    options: [
      { id: "a", label: "A", emoji: "😊" },
      { id: "b", label: "B", emoji: "😐" },
      { id: "c", label: "C", emoji: "😴" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e16",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e16",
    options: [
      { id: "a", label: "A", emoji: "🍞" },
      { id: "b", label: "B", emoji: "😠" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😂" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e17",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e17",
    options: [
      { id: "a", label: "A", emoji: "🤝" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😂" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e18",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e18",
    options: [
      { id: "a", label: "A", emoji: "🤝" },
      { id: "b", label: "B", emoji: "😏" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😡" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e19",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e19",
    options: [
      { id: "a", label: "A", emoji: "🙏" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😐" },
      { id: "d", label: "D", emoji: "😒" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e20",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e20",
    options: [
      { id: "a", label: "A", emoji: "🤗" },
      { id: "b", label: "B", emoji: "😂" },
      { id: "c", label: "C", emoji: "😒" },
      { id: "d", label: "D", emoji: "🙈" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e21",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e21",
    options: [
      { id: "a", label: "A", emoji: "😊" },
      { id: "b", label: "B", emoji: "😒" },
      { id: "c", label: "C", emoji: "😡" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e22",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e22",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizRewards.nothing" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizRewards.money" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizRewards.gift" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizRewards.praise" },
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
  {
    id: "sc5",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "10" },
      { id: "b", label: "B", emoji: "11" },
      { id: "c", label: "C", emoji: "12" },
      { id: "d", label: "D", emoji: "13" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc6",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "1️⃣" },
      { id: "b", label: "B", emoji: "2️⃣" },
      { id: "c", label: "C", emoji: "3️⃣" },
      { id: "d", label: "D", emoji: "4️⃣" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc7",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "90°" },
      { id: "b", label: "B", emoji: "100°" },
      { id: "c", label: "C", emoji: "110°" },
      { id: "d", label: "D", emoji: "120°" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc8",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "50" },
      { id: "b", label: "B", emoji: "60" },
      { id: "c", label: "C", emoji: "70" },
      { id: "d", label: "D", emoji: "80" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc9",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "50" },
      { id: "b", label: "B", emoji: "60" },
      { id: "c", label: "C", emoji: "70" },
      { id: "d", label: "D", emoji: "80" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc10",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "7" },
      { id: "b", label: "B", emoji: "15" },
      { id: "c", label: "C", emoji: "30" },
      { id: "d", label: "D", emoji: "60" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc11",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "6" },
      { id: "b", label: "B", emoji: "8" },
      { id: "c", label: "C", emoji: "10" },
      { id: "d", label: "D", emoji: "12" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc12",
    category: "elm",
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
    id: "sc13",
    category: "elm",
    explanationKey: "content.quizExplanations.sc13",
    options: [
      { id: "a", label: "A", emoji: "5️⃣" },
      { id: "b", label: "B", emoji: "6️⃣" },
      { id: "c", label: "C", emoji: "7️⃣" },
      { id: "d", label: "D", emoji: "8️⃣" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc14",
    category: "elm",
    explanationKey: "content.quizExplanations.sc14",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizCelestial.moon" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizCelestial.sun" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizCelestial.star" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizCelestial.comet" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc15",
    category: "elm",
    explanationKey: "content.quizExplanations.sc15",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.lion" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.rabbit" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.sparrow" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.fish" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc16",
    category: "elm",
    explanationKey: "content.quizExplanations.sc16",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizProducts.honey" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizProducts.milk" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizProducts.egg" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizProducts.wool" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc17",
    category: "elm",
    explanationKey: "content.quizExplanations.sc17",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.penguin" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.sparrow" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.eagle" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.peacock" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc18",
    category: "elm",
    explanationKey: "content.quizExplanations.sc18",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizThings.trashcan" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizThings.street" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizThings.water" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizThings.forest" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc19",
    category: "elm",
    explanationKey: "content.quizExplanations.sc19",
    options: [
      { id: "a", label: "A", emoji: "20" },
      { id: "b", label: "B", emoji: "22" },
      { id: "c", label: "C", emoji: "24" },
      { id: "d", label: "D", emoji: "26" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc20",
    category: "elm",
    explanationKey: "content.quizExplanations.sc20",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.giraffe" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.camel" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.lion" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc21",
    category: "elm",
    explanationKey: "content.quizExplanations.sc21",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.zebra" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.kangaroo" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.panda" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc22",
    category: "elm",
    explanationKey: "content.quizExplanations.sc22",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.zebra" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.panda" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.penguin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.rabbit" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc23",
    category: "elm",
    explanationKey: "content.quizExplanations.sc23",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.panda" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.camel" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.kangaroo" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc24",
    category: "elm",
    explanationKey: "content.quizExplanations.sc24",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.kangaroo" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.giraffe" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.camel" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc25",
    category: "elm",
    explanationKey: "content.quizExplanations.sc25",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.camel" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.zebra" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.panda" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc26",
    category: "elm",
    explanationKey: "content.quizExplanations.sc26",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.owl" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.sparrow" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.peacock" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.eagle" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc27",
    category: "elm",
    explanationKey: "content.quizExplanations.sc27",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.dolphin" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.fish" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.penguin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.eagle" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc28",
    category: "elm",
    explanationKey: "content.quizExplanations.sc28",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizCelestial.earth" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizCelestial.moon" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizCelestial.sun" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizCelestial.comet" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc29",
    category: "elm",
    explanationKey: "content.quizExplanations.sc29",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWeather.ice" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWeather.cloud" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWeather.fog" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWeather.snow" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc30",
    category: "elm",
    explanationKey: "content.quizExplanations.sc30",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizDirections.east" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizDirections.west" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizDirections.north" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizDirections.south" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc31",
    category: "elm",
    explanationKey: "content.quizExplanations.sc31",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizDirections.west" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizDirections.east" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizDirections.north" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizDirections.south" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc32",
    category: "elm",
    explanationKey: "content.quizExplanations.sc32",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.whale" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.dolphin" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.fish" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.turtle" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc33",
    category: "elm",
    explanationKey: "content.quizExplanations.sc33",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyParts.wings" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyParts.legs" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyParts.tail" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyParts.beak" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc34",
    category: "elm",
    explanationKey: "content.quizExplanations.sc34",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyParts.gills" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyParts.lungs" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyParts.skin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyParts.nose" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc35",
    category: "elm",
    explanationKey: "content.quizExplanations.sc35",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWeather.rainbow" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWeather.cloud" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWeather.fog" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWeather.snow" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc36",
    category: "elm",
    explanationKey: "content.quizExplanations.sc36",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.turtle" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.lion" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.rabbit" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc37",
    category: "elm",
    explanationKey: "content.quizExplanations.sc37",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizNatureFacts.leavesChangeFall" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizNatureFacts.staysGreen" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizNatureFacts.grows" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizNatureFacts.blooms" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc38",
    category: "elm",
    explanationKey: "content.quizExplanations.sc38",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizYesNo.yes" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizYesNo.no" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizYesNo.sometimes" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizYesNo.unknown" },
    ],
    correctOptionId: "a",
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
  {
    id: "f6",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🐶" },
      { id: "b", label: "B", emoji: "🐱" },
      { id: "c", label: "C", emoji: "🐰" },
      { id: "d", label: "D", emoji: "🐭" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f7",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "⭐" },
      { id: "b", label: "B", emoji: "🌙" },
      { id: "c", label: "C", emoji: "☀️" },
      { id: "d", label: "D", emoji: "🌧️" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f8",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🌳" },
      { id: "b", label: "B", emoji: "🌸" },
      { id: "c", label: "C", emoji: "🍂" },
      { id: "d", label: "D", emoji: "🌵" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f9",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🐟" },
      { id: "b", label: "B", emoji: "🐦" },
      { id: "c", label: "C", emoji: "🐍" },
      { id: "d", label: "D", emoji: "🦋" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f10",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🏠" },
      { id: "b", label: "B", emoji: "🏫" },
      { id: "c", label: "C", emoji: "🏥" },
      { id: "d", label: "D", emoji: "🏰" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f11",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🥛" },
      { id: "b", label: "B", emoji: "🧃" },
      { id: "c", label: "C", emoji: "🍯" },
      { id: "d", label: "D", emoji: "🍵" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f12",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🌙" },
      { id: "b", label: "B", emoji: "⭐" },
      { id: "c", label: "C", emoji: "☀️" },
      { id: "d", label: "D", emoji: "🌈" },
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
  {
    id: "g5",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🐶" },
      { id: "b", label: "B", emoji: "🐱" },
      { id: "c", label: "C", emoji: "🐰" },
      { id: "d", label: "D", emoji: "🐭" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g6",
    category: "xariciDil",
    targetLang: "ru",
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
    id: "g7",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🌳" },
      { id: "b", label: "B", emoji: "🌸" },
      { id: "c", label: "C", emoji: "🍂" },
      { id: "d", label: "D", emoji: "🌵" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g8",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🐟" },
      { id: "b", label: "B", emoji: "🐦" },
      { id: "c", label: "C", emoji: "🐍" },
      { id: "d", label: "D", emoji: "🦋" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g9",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🏠" },
      { id: "b", label: "B", emoji: "🏫" },
      { id: "c", label: "C", emoji: "🏥" },
      { id: "d", label: "D", emoji: "🏰" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "g10",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🌙" },
      { id: "b", label: "B", emoji: "⭐" },
      { id: "c", label: "C", emoji: "☀️" },
      { id: "d", label: "D", emoji: "🌈" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type MathOp = "+" | "-" | "×" | "÷";

function buildMathProblem(difficulty: QuizDifficulty): { promptText: string; answer: number } {
  const ops: MathOp[] =
    difficulty === "easy" ? ["+", "-"] : ["+", "-", "×", "÷"];
  const op = shuffle(ops)[0];
  const range = difficulty === "easy" ? 12 : difficulty === "medium" ? 30 : 100;
  const mulRange = difficulty === "hard" ? 12 : difficulty === "medium" ? 10 : 5;
  let a: number;
  let b: number;
  let answer: number;
  if (op === "+") {
    a = randInt(1, range);
    b = randInt(1, range);
    answer = a + b;
  } else if (op === "-") {
    a = randInt(Math.ceil(range / 2), range);
    b = randInt(1, a);
    answer = a - b;
  } else if (op === "×") {
    a = randInt(1, mulRange);
    b = randInt(1, mulRange);
    answer = a * b;
  } else {
    b = randInt(1, mulRange);
    answer = randInt(1, mulRange);
    a = b * answer;
  }
  return { promptText: `${a} ${op} ${b} = ?`, answer };
}

function buildMathDistractors(answer: number): number[] {
  const candidates = new Set<number>();
  for (const d of shuffle([1, -1, 2, -2, 3, -3, 4, -4, 5, -5])) {
    const val = answer + d;
    if (val >= 0 && val !== answer) candidates.add(val);
    if (candidates.size >= 3) break;
  }
  return Array.from(candidates);
}

const optionLetters = ["a", "b", "c", "d"];

/**
 * Generates fresh, never-repeating arithmetic questions on the fly instead of
 * storing thousands of near-identical entries — the combinatorial space of
 * possible problems (addition, subtraction, multiplication, division within
 * a kid-appropriate range) is already in the thousands.
 */
export function generateMathQuestions(
  count: number,
  difficulty: QuizDifficulty = "medium",
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const seenPrompts = new Set<string>();

  while (questions.length < count) {
    const { promptText, answer } = buildMathProblem(difficulty);
    if (seenPrompts.has(promptText)) continue;

    const distractors = buildMathDistractors(answer);
    if (distractors.length < 3) continue;
    seenPrompts.add(promptText);

    const values = shuffle([answer, ...distractors.slice(0, 3)]);
    const correctIndex = values.indexOf(answer);

    const options: QuizOption[] = values.map((v, i) => ({
      id: optionLetters[i],
      label: optionLetters[i].toUpperCase(),
      emoji: String(v),
    }));

    questions.push({
      id: `math-${questions.length}`,
      category: "riyaziyyat",
      difficulty,
      promptText,
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    });
  }

  return questions;
}

type WordProblemOp = "subtract" | "multiply" | "divide";

type WordProblemTemplate = {
  promptKey: string;
  op: WordProblemOp;
};

/**
 * Each template is written once per language (content.quiz.<key>, using
 * {{a}}/{{b}} interpolation) and reused with endless random number pairs —
 * the same "1 sentence → thousands of questions" idea behind the pure
 * arithmetic generator above, applied to word problems.
 */
const WORD_PROBLEM_TEMPLATES: WordProblemTemplate[] = [
  { promptKey: "content.quiz.mathWordApples", op: "subtract" },
  { promptKey: "content.quiz.mathWordBirds", op: "subtract" },
  { promptKey: "content.quiz.mathWordStudents", op: "subtract" },
  { promptKey: "content.quiz.mathWordEggs", op: "subtract" },
  { promptKey: "content.quiz.mathWordFish", op: "subtract" },
  { promptKey: "content.quiz.mathWordBoxes", op: "multiply" },
  { promptKey: "content.quiz.mathWordBaskets", op: "multiply" },
  { promptKey: "content.quiz.mathWordMilk", op: "multiply" },
  { promptKey: "content.quiz.mathWordStickers", op: "multiply" },
  { promptKey: "content.quiz.mathWordBalloons", op: "multiply" },
  { promptKey: "content.quiz.mathWordCandy", op: "divide" },
  { promptKey: "content.quiz.mathWordBooks", op: "divide" },
  { promptKey: "content.quiz.mathWordFlowers", op: "divide" },
  { promptKey: "content.quiz.mathWordCookies", op: "divide" },
];

function buildWordProblem(
  difficulty: QuizDifficulty,
): { promptKey: string; a: number; b: number; answer: number } {
  const template = shuffle(WORD_PROBLEM_TEMPLATES)[0];
  const range = difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 60;
  const mulRange = difficulty === "hard" ? 12 : difficulty === "medium" ? 9 : 5;
  let a: number;
  let b: number;
  let answer: number;
  if (template.op === "subtract") {
    a = randInt(Math.ceil(range / 2), range);
    b = randInt(1, a);
    answer = a - b;
  } else if (template.op === "multiply") {
    a = randInt(2, mulRange);
    b = randInt(2, mulRange);
    answer = a * b;
  } else {
    b = randInt(2, mulRange);
    answer = randInt(2, mulRange);
    a = b * answer;
  }
  return { promptKey: template.promptKey, a, b, answer };
}

/**
 * Word-problem counterpart to generateMathQuestions() — 8 reusable sentence
 * templates × the full range of number pairs for each difficulty, so the
 * combined pool (with the pure-arithmetic generator) comfortably clears
 * thousands of distinct questions per difficulty tier without hand-writing
 * more than a handful of sentences per language.
 */
export function generateMathWordProblemQuestions(
  count: number,
  difficulty: QuizDifficulty = "medium",
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();

  while (questions.length < count) {
    const { promptKey, a, b, answer } = buildWordProblem(difficulty);
    const dedupeKey = `${promptKey}-${a}-${b}`;
    if (seen.has(dedupeKey)) continue;

    const distractors = buildMathDistractors(answer);
    if (distractors.length < 3) continue;
    seen.add(dedupeKey);

    const values = shuffle([answer, ...distractors.slice(0, 3)]);
    const correctIndex = values.indexOf(answer);

    const options: QuizOption[] = values.map((v, i) => ({
      id: optionLetters[i],
      label: optionLetters[i].toUpperCase(),
      emoji: String(v),
    }));

    questions.push({
      id: `mathword-${questions.length}-${a}-${b}`,
      category: "riyaziyyat",
      difficulty,
      promptKey,
      promptParams: { a, b },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    });
  }

  return questions;
}

type SurahMeta = { chapter: number; name: string; verses: number; revelation: string };
const surahIndex = surahIndexData as SurahMeta[];

function buildCountDistractors(value: number): number[] {
  const step = Math.max(1, Math.round(value * 0.15));
  const candidates = new Set<number>();
  for (const mult of shuffle([1, -1, 2, -2, 3, -3])) {
    const val = value + step * mult;
    if (val > 0 && val !== value) candidates.add(val);
    if (candidates.size >= 3) break;
  }
  return Array.from(candidates);
}

/**
 * Generates "how many verses are in Surah X?" questions from real Quran
 * structural data (surahIndex.json — chapter numbers, verse counts, source:
 * tanzil.net via fawazahmed0/quran-api), so answers are always accurate and
 * the pool (114 surahs) is large enough to avoid repeats within a session.
 * Surah names stay in their English transliteration regardless of app
 * language — only the question sentence itself is translated.
 */
export function generateSurahFactQuestions(count: number): QuizQuestion[] {
  const pool = shuffle(surahIndex).slice(0, count);
  return pool.map((s, i) => {
    const distractors = buildCountDistractors(s.verses);
    const values = shuffle([s.verses, ...distractors.slice(0, 3)]);
    const correctIndex = values.indexOf(s.verses);
    const options: QuizOption[] = values.map((v, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: String(v),
    }));
    return {
      id: `surah-${s.chapter}-${i}`,
      category: "din",
      difficulty: "hard",
      promptKey: "content.quiz.dinVerseCount",
      promptParams: { name: s.name },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

function nameOptions(pool: SurahMeta[]): QuizOption[] {
  return pool.map((s, idx) => ({
    id: optionLetters[idx],
    label: optionLetters[idx].toUpperCase(),
    emoji: s.name,
  }));
}

/**
 * "Which of these was revealed in Mecca/Madina?" — one correct surah plus 3
 * distractors drawn from the opposite revelation place, so the question is
 * always answerable from surahIndex.json alone (86 Meccan / 28 Madinan
 * surahs give a large, accurate combinatorial space).
 */
export function generateSurahRevelationQuestions(count: number): QuizQuestion[] {
  const meccan = surahIndex.filter((s) => s.revelation === "Mecca");
  const madinan = surahIndex.filter((s) => s.revelation === "Madina");
  const pool = shuffle(surahIndex).slice(0, count);
  return pool.map((s, i) => {
    const isMeccan = s.revelation === "Mecca";
    const distractorSource = isMeccan ? madinan : meccan;
    const distractors = shuffle(distractorSource).slice(0, 3);
    const names = shuffle([s, ...distractors]);
    const correctIndex = names.findIndex((n) => n.chapter === s.chapter);
    return {
      id: `surah-rev-${s.chapter}-${i}`,
      category: "din",
      difficulty: "hard",
      promptKey: isMeccan ? "content.quiz.dinRevelationMecca" : "content.quiz.dinRevelationMadina",
      options: nameOptions(names),
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

/**
 * Chapter-order questions in both directions: "which surah is #N?" and
 * "what number is surah X?" — again grounded entirely in surahIndex.json.
 */
export function generateSurahOrderQuestions(count: number): QuizQuestion[] {
  const pool = shuffle(surahIndex).slice(0, count);
  return pool.map((s, i) => {
    const distractors = shuffle(surahIndex.filter((o) => o.chapter !== s.chapter)).slice(0, 3);
    const askForName = i % 2 === 0;

    if (askForName) {
      const names = shuffle([s, ...distractors]);
      const correctIndex = names.findIndex((n) => n.chapter === s.chapter);
      return {
        id: `surah-order-name-${s.chapter}-${i}`,
        category: "din",
        difficulty: "hard",
        promptKey: "content.quiz.dinOrderName",
        promptParams: { number: s.chapter } as Record<string, string | number>,
        options: nameOptions(names),
        correctOptionId: optionLetters[correctIndex],
        xp: 20,
      };
    }

    const numberPool = shuffle([s, ...distractors]);
    const correctIndex = numberPool.findIndex((n) => n.chapter === s.chapter);
    const options: QuizOption[] = numberPool.map((n, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: String(n.chapter),
    }));
    return {
      id: `surah-order-number-${s.chapter}-${i}`,
      category: "din",
      difficulty: "hard",
      promptKey: "content.quiz.dinOrderNumber",
      promptParams: { name: s.name },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

/**
 * "Which of these 4 surahs has the most/fewest verses?" — a pure numeric
 * comparison over verified verse counts, so any group of 4 surahs (~10
 * million possible combinations) makes a valid, accurate question.
 */
export function generateSurahCompareQuestions(count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const group = shuffle(surahIndex).slice(0, 4);
    const askMost = i % 2 === 0;
    const target = askMost
      ? group.reduce((max, s) => (s.verses > max.verses ? s : max))
      : group.reduce((min, s) => (s.verses < min.verses ? s : min));
    const correctIndex = group.findIndex((s) => s.chapter === target.chapter);
    questions.push({
      id: `surah-compare-${askMost ? "most" : "least"}-${i}-${group.map((s) => s.chapter).join("-")}`,
      category: "din",
      difficulty: "hard",
      promptKey: askMost ? "content.quiz.dinCompareMost" : "content.quiz.dinCompareLeast",
      options: nameOptions(group),
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    });
  }
  return questions;
}

type DivineNameEntry = {
  id: string;
  number: number;
  name: string;
  meaning: string;
};

/**
 * Questions built from the verified 99-Names dataset: "which name is
 * number N?" and "what does name X mean?" — 2 templates × 99 names give
 * ~200 grounded questions with zero risk of new, unverified religious
 * claims (every fact already lives in divineNames.json).
 */
export function generateDivineNameQuestions(count: number, lang: string): QuizQuestion[] {
  const names = getDivineNames(lang) as DivineNameEntry[];
  const pool = shuffle(names).slice(0, count);
  return pool.map((entry, i) => {
    const askForName = i % 2 === 0;
    const distractors = shuffle(names.filter((n) => n.id !== entry.id)).slice(0, 3);

    if (askForName) {
      const group = shuffle([entry, ...distractors]);
      const correctIndex = group.findIndex((n) => n.id === entry.id);
      const options: QuizOption[] = group.map((n, idx) => ({
        id: optionLetters[idx],
        label: optionLetters[idx].toUpperCase(),
        emoji: "",
        text: n.name,
      }));
      return {
        id: `divine-number-${entry.number}-${i}`,
        category: "din",
        difficulty: "hard",
        promptKey: "content.quiz.divineNameFromNumber",
        promptParams: { number: entry.number } as Record<string, string | number>,
        options,
        correctOptionId: optionLetters[correctIndex],
        xp: 20,
      };
    }

    const group = shuffle([entry, ...distractors]);
    const correctIndex = group.findIndex((n) => n.id === entry.id);
    const options: QuizOption[] = group.map((n, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: "",
      text: n.meaning,
    }));
    return {
      id: `divine-meaning-${entry.number}-${i}`,
      category: "din",
      difficulty: "hard",
      promptKey: "content.quiz.divineNameMeaning",
      promptParams: { name: entry.name },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

type PlanetMeta = { order: number; sizeRank: number; name: Record<string, string> };
const planetIndex = planetData as PlanetMeta[];

function planetName(p: PlanetMeta, lang: string): string {
  return p.name[lang] ?? p.name.en;
}

function planetNameOptions(pool: PlanetMeta[], lang: string): QuizOption[] {
  return pool.map((p, idx) => ({
    id: optionLetters[idx],
    label: optionLetters[idx].toUpperCase(),
    emoji: "",
    text: planetName(p, lang),
  }));
}

/**
 * "Which planet is #N from the Sun?" in both directions, built from a small
 * verified dataset (planets.json — real, stable order-from-Sun facts) so the
 * answers never need hand-checking beyond the 8-row source table.
 */
export function generatePlanetOrderQuestions(count: number, lang: string): QuizQuestion[] {
  const pool = shuffle(planetIndex).slice(0, count);
  return pool.map((p, i) => {
    const distractors = shuffle(planetIndex.filter((o) => o.order !== p.order)).slice(0, 3);
    const askForName = i % 2 === 0;

    if (askForName) {
      const group = shuffle([p, ...distractors]);
      const correctIndex = group.findIndex((n) => n.order === p.order);
      return {
        id: `planet-order-name-${p.order}-${i}`,
        category: "elm",
        difficulty: "medium",
        promptKey: "content.quiz.elmPlanetOrderName",
        promptParams: { number: p.order } as Record<string, string | number>,
        options: planetNameOptions(group, lang),
        correctOptionId: optionLetters[correctIndex],
        xp: 20,
      };
    }

    const group = shuffle([p, ...distractors]);
    const correctIndex = group.findIndex((n) => n.order === p.order);
    const options: QuizOption[] = group.map((n, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: String(n.order),
    }));
    return {
      id: `planet-order-number-${p.order}-${i}`,
      category: "elm",
      difficulty: "medium",
      promptKey: "content.quiz.elmPlanetOrderNumber",
      promptParams: { name: planetName(p, lang) },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

type PlanetCompareMode = {
  promptKey: string;
  field: "order" | "sizeRank";
  pick: "min" | "max";
};

const PLANET_COMPARE_MODES: PlanetCompareMode[] = [
  { promptKey: "content.quiz.elmPlanetCompareNearest", field: "order", pick: "min" },
  { promptKey: "content.quiz.elmPlanetCompareFarthest", field: "order", pick: "max" },
  { promptKey: "content.quiz.elmPlanetCompareBiggest", field: "sizeRank", pick: "min" },
  { promptKey: "content.quiz.elmPlanetCompareSmallest", field: "sizeRank", pick: "max" },
];

/**
 * "Which of these 4 planets is closest/farthest/biggest/smallest?" — pure
 * comparisons over the same verified table, giving C(8,4)=70 groupings per
 * mode without a single new fact to check by hand.
 */
export function generatePlanetCompareQuestions(count: number, lang: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const mode = shuffle(PLANET_COMPARE_MODES)[0];
    const group = shuffle(planetIndex).slice(0, 4);
    const target =
      mode.pick === "min"
        ? group.reduce((best, p) => (p[mode.field] < best[mode.field] ? p : best))
        : group.reduce((best, p) => (p[mode.field] > best[mode.field] ? p : best));
    const correctIndex = group.findIndex((p) => p.order === target.order);
    questions.push({
      id: `planet-compare-${i}-${group.map((p) => p.order).join("-")}`,
      category: "elm",
      difficulty: "medium",
      promptKey: mode.promptKey,
      options: planetNameOptions(group, lang),
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    });
  }
  return questions;
}

type VocabEntry = { id: string; emoji: string; en: string; ru: string };
const vocabIndex = vocabularyData as VocabEntry[];

const FOREIGN_LANG_LABEL: Record<string, Record<ForeignTargetLang, string>> = {
  az: { en: "İngiliscə", ru: "Rusca" },
  en: { en: "in English", ru: "in Russian" },
  tr: { en: "İngilizce", ru: "Rusça" },
  ru: { en: "по-английски", ru: "по-русски" },
};

/**
 * "Which picture matches this word?" — reuses the same emoji-flashcard
 * format as the hand-written f1-f12/g1-g10 questions, but drawn from a
 * 68-word vocabulary table instead of one-off translated strings, so the
 * pool scales with the dataset instead of with how many sentences were
 * hand-typed.
 */
export function generateVocabPictureQuestions(
  count: number,
  targetLang: ForeignTargetLang,
): QuizQuestion[] {
  const pool = shuffle(vocabIndex).slice(0, count);
  return pool.map((entry, i) => {
    const distractors = shuffle(vocabIndex.filter((v) => v.id !== entry.id)).slice(0, 3);
    const group = shuffle([entry, ...distractors]);
    const correctIndex = group.findIndex((v) => v.id === entry.id);
    const options: QuizOption[] = group.map((v, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: v.emoji,
    }));
    return {
      id: `vocab-picture-${targetLang}-${entry.id}-${i}`,
      category: "xariciDil",
      targetLang,
      difficulty: "easy",
      promptKey: "content.quiz.xariciDilPictureMatch",
      promptParams: { word: entry[targetLang] },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

/**
 * Reverse direction: shown the picture, pick the matching word — same
 * vocabulary table, so both directions of practice come from one dataset.
 */
export function generateVocabWordQuestions(
  count: number,
  targetLang: ForeignTargetLang,
  lang: string,
): QuizQuestion[] {
  const pool = shuffle(vocabIndex).slice(0, count);
  const langLabel = FOREIGN_LANG_LABEL[lang]?.[targetLang] ?? FOREIGN_LANG_LABEL.az[targetLang];
  return pool.map((entry, i) => {
    const distractors = shuffle(vocabIndex.filter((v) => v.id !== entry.id)).slice(0, 3);
    const group = shuffle([entry, ...distractors]);
    const correctIndex = group.findIndex((v) => v.id === entry.id);
    const options: QuizOption[] = group.map((v, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: "",
      text: v[targetLang],
    }));
    return {
      id: `vocab-word-${targetLang}-${entry.id}-${i}`,
      category: "xariciDil",
      targetLang,
      difficulty: "easy",
      promptKey: "content.quiz.xariciDilWordMatch",
      promptParams: { emoji: entry.emoji, lang: langLabel },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

export function getQuizQuestions(
  category: QuizCategory,
  targetLang?: ForeignTargetLang,
  difficulty?: QuizDifficulty,
  lang: string = "az",
): QuizQuestion[] {
  if (category === "riyaziyyat") {
    const staticMath = quizBank
      .filter((q) => q.category === "riyaziyyat")
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    const generated = generateMathQuestions(26, difficulty ?? "medium");
    const wordProblems = generateMathWordProblemQuestions(20, difficulty ?? "medium");
    return shuffle([...staticMath, ...generated, ...wordProblems]);
  }
  if (category === "din") {
    const staticDin = quizBank
      .filter((q) => q.category === "din")
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    const generated =
      !difficulty || difficulty === "hard"
        ? [
            ...generateSurahFactQuestions(10),
            ...generateSurahRevelationQuestions(10),
            ...generateSurahOrderQuestions(10),
            ...generateSurahCompareQuestions(10),
            ...generateDivineNameQuestions(10, lang),
          ]
        : [];
    return shuffle([...staticDin, ...generated]);
  }
  if (category === "elm") {
    const staticElm = quizBank
      .filter((q) => q.category === "elm")
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    const generated =
      !difficulty || difficulty === "medium"
        ? [...generatePlanetOrderQuestions(10, lang), ...generatePlanetCompareQuestions(10, lang)]
        : [];
    return shuffle([...staticElm, ...generated]);
  }
  if (category === "xariciDil") {
    const tl = targetLang ?? "en";
    const staticForeign = quizBank
      .filter((q) => q.category === "xariciDil" && q.targetLang === tl)
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    const generated =
      !difficulty || difficulty === "easy"
        ? [...generateVocabPictureQuestions(12, tl), ...generateVocabWordQuestions(12, tl, lang)]
        : [];
    return shuffle([...staticForeign, ...generated]);
  }
  return quizBank.filter(
    (q) => q.category === category && (!difficulty || getDifficulty(q) === difficulty),
  );
}

import { IconBadgeTone, tones } from "../components/IconBadge";
import type { IconName } from "../components/icons";
import surahIndexData from "./quran/surahIndex.json";
import { getDivineNames } from "./divineNamesLoader";
import vocabularyData from "./vocabulary.json";
import planetData from "./planets.json";

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
    id: "morning2",
    category: "Morning",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
  },
  {
    id: "morning3",
    category: "Morning",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni ilma",
  },
  {
    id: "evening",
    category: "Evening",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا",
    transliteration: "Allahumma bika amsaina wa bika asbahna",
  },
  {
    id: "evening2",
    category: "Evening",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
  },
  {
    id: "evening3",
    category: "Evening",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ",
    transliteration: "Rabbi awzi'ni an ashkura ni'mataka",
  },
  {
    id: "sleep",
    category: "Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
  },
  {
    id: "sleep2",
    category: "Sleep",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    transliteration: "Allahumma qini adhabaka yawma tab'athu 'ibadak",
  },
  {
    id: "sleep3",
    category: "Sleep",
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ",
    transliteration: "Bismika rabbi wada'tu janbi wa bika arfa'uh",
  },
  {
    id: "eat",
    category: "Eat",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
  },
  {
    id: "eat2",
    category: "Eat",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimeen",
  },
  {
    id: "eat3",
    category: "Eat",
    arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
    transliteration: "Bismillahi awwalahu wa akhirahu",
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
