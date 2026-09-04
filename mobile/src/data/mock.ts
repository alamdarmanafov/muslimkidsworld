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
      { id: "b", label: "B", emoji: "⛪" },
      { id: "c", label: "C", emoji: "🏢" },
      { id: "d", label: "D", emoji: "🕌" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "q2",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "3" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "q3",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "📘" },
      { id: "b", label: "B", emoji: "📖" },
      { id: "c", label: "C", emoji: "📙" },
      { id: "d", label: "D", emoji: "📗" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "q4",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "3" },
      { id: "d", label: "D", emoji: "", text: "5" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "q5",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "120" },
      { id: "b", label: "B", emoji: "", text: "100" },
      { id: "c", label: "C", emoji: "", text: "114" },
      { id: "d", label: "D", emoji: "", text: "110" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q6",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "2" },
      { id: "c", label: "C", emoji: "", text: "3" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q7",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "q8",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizSymbols.sun" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizSymbols.star" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizSymbols.moon" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizSymbols.lightning" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q9",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "1" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "4" },
      { id: "d", label: "D", emoji: "", text: "2" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "q10",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "12" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "11" },
      { id: "d", label: "D", emoji: "", text: "13" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q11",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "30" },
      { id: "b", label: "B", emoji: "", text: "35" },
      { id: "c", label: "C", emoji: "", text: "20" },
      { id: "d", label: "D", emoji: "", text: "25" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q12",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "2" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "4" },
      { id: "d", label: "D", emoji: "", text: "1" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q13",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "8" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q14",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "5" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "q15",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "2" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "1" },
      { id: "d", label: "D", emoji: "", text: "3" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q16",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "q17",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "5" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q18",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "2" },
      { id: "d", label: "D", emoji: "", text: "1" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "q19",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "3" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "2" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "q20",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "3" },
      { id: "d", label: "D", emoji: "", text: "2" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p1",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p2",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "45" },
      { id: "b", label: "B", emoji: "", text: "50" },
      { id: "c", label: "C", emoji: "", text: "40" },
      { id: "d", label: "D", emoji: "", text: "35" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "p3",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "65" },
      { id: "b", label: "B", emoji: "", text: "63" },
      { id: "c", label: "C", emoji: "", text: "70" },
      { id: "d", label: "D", emoji: "", text: "60" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p4",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "9" },
      { id: "c", label: "C", emoji: "", text: "11" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p5",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.damascus" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.taif" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p6",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.damascus" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.taif" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p7",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPeople.abbas" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPeople.hamza" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPeople.abuTalib" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPeople.abdullah" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "p8",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPeople.fatimah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPeople.khadijah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPeople.aminah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPeople.aisha" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "p9",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPeople.aisha" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPeople.khadijah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPeople.fatimah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPeople.zaynab" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p10",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMonths.rajab" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMonths.muharram" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMonths.safar" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMonths.shawwal" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "p11",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMonths.muharram" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMonths.rajab" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMonths.shawwal" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMonths.ramadan" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "p12",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMonths.dhulhijjah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMonths.rajab" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMonths.muharram" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMonths.shawwal" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "p13",
    category: "din",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizConcepts.place" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizConcepts.amount" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizConcepts.intention" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizConcepts.time" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d1",
    category: "din",
    explanationKey: "content.quizExplanations.d1",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.damascus" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d2",
    category: "din",
    explanationKey: "content.quizExplanations.d2",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWorship.sacrifice" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWorship.fasting" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWorship.zakat" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWorship.hajj" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d3",
    category: "din",
    explanationKey: "content.quizExplanations.d3",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPhrases.bismillah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPhrases.subhanallah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPhrases.alhamdulillah" },
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
      { id: "a", label: "A", emoji: "", textKey: "content.quizPurposes.play" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPurposes.shop" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPurposes.cook" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPurposes.worship" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d5",
    category: "din",
    explanationKey: "content.quizExplanations.d5",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizFestivals.novruz" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizFestivals.christmas" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizFestivals.eidaladha" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizFestivals.eidalfitr" },
    ],
    correctOptionId: "d",
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
      { id: "b", label: "B", emoji: "", textKey: "content.quizDirections.moon" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizDirections.sun" },
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
      { id: "a", label: "A", emoji: "", textKey: "content.quizSurahNames.ikhlas" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizSurahNames.fatiha" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizSurahNames.yasin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizSurahNames.baqara" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d9",
    category: "din",
    explanationKey: "content.quizExplanations.d9",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPhrases.subhanallah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPhrases.astaghfirullah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPhrases.alhamdulillah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPhrases.bismillah" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d10",
    category: "din",
    explanationKey: "content.quizExplanations.d10",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPhrases.subhanallah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPhrases.bismillah" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPhrases.alhamdulillah" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPhrases.inshallah" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d11",
    category: "din",
    explanationKey: "content.quizExplanations.d11",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizFestivals.eidaladha" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizFestivals.christmas" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizFestivals.eidalfitr" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizFestivals.novruz" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d12",
    category: "din",
    explanationKey: "content.quizExplanations.d12",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWorship.sahur" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWorship.zakat" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWorship.iftar" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWorship.hajj" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d13",
    category: "din",
    explanationKey: "content.quizExplanations.d13",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWorship.sadaqah" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWorship.hajj" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWorship.zakat" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWorship.prayer" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d14",
    category: "din",
    explanationKey: "content.quizExplanations.d14",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizRoles.angel" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizRoles.scholar" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizRoles.firstHumanProphet" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizRoles.king" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d15",
    category: "din",
    explanationKey: "content.quizExplanations.d15",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizStructures.mosque" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizStructures.bridge" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizStructures.ship" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizStructures.house" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d16",
    category: "din",
    explanationKey: "content.quizExplanations.d16",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizTraits.wealth" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizTraits.strongFaith" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizTraits.strength" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizTraits.speed" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d17",
    category: "din",
    explanationKey: "content.quizExplanations.d17",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizRelations.son" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizRelations.friend" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizRelations.uncle" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizRelations.brother" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d18",
    category: "din",
    explanationKey: "content.quizExplanations.d18",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAttitudes.impatient" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAttitudes.kindCaring" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAttitudes.indifferent" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAttitudes.strict" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d19",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d19",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.damascus" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d20",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d20",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.damascus" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d21",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d21",
    options: [
      { id: "a", label: "A", emoji: "", text: "3" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "5" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d22",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d22",
    options: [
      { id: "a", label: "A", emoji: "", text: "15" },
      { id: "b", label: "B", emoji: "", text: "19" },
      { id: "c", label: "C", emoji: "", text: "17" },
      { id: "d", label: "D", emoji: "", text: "21" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d23",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d23",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "12" },
      { id: "d", label: "D", emoji: "", text: "7" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d24",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d24",
    options: [
      { id: "a", label: "A", emoji: "", text: "3" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "5" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d25",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d25",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizProphets.musa" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizProphets.nuh" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizProphets.yunus" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizProphets.yusuf" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d26",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d26",
    options: [
      { id: "a", label: "A", emoji: "", text: "1" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "2" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d27",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d27",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGroups.everyone" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGroups.believers" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGroups.richOnly" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGroups.noOne" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d28",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d28",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizProphets.nuh" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizProphets.yusuf" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizProphets.musa" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizProphets.yunus" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d29",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d29",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMiracleForms.bird" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMiracleForms.fire" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMiracleForms.snake" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMiracleForms.stone" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d30",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d30",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.damascus" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.egypt" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.medina" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.taif" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d31",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d31",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizCreatures.bird" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizCreatures.lion" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizCreatures.rabbit" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizCreatures.fish" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d32",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d32",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizYunusActions.prayed" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizYunusActions.slept" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizYunusActions.sang" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizYunusActions.cried" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d33",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d33",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "18" },
      { id: "c", label: "C", emoji: "", text: "10" },
      { id: "d", label: "D", emoji: "", text: "12" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d34",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d34",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizYusufFate.desert" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizYusufFate.sea" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizYusufFate.well" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizYusufFate.cave" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d35",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d35",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "18" },
      { id: "d", label: "D", emoji: "", text: "12" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d36",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d36",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizProphets.nuh" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizProphets.musa" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizProphets.ibrahim" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizProphets.yaqub" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d37",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d37",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "3" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d38",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d38",
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
    id: "d39",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d39",
    options: [
      { id: "a", label: "A", emoji: "", text: "100" },
      { id: "b", label: "B", emoji: "", text: "99" },
      { id: "c", label: "C", emoji: "", text: "114" },
      { id: "d", label: "D", emoji: "", text: "120" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d40",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d40",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.egypt" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.damascus" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.taif" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.mecca" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d41",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d41",
    options: [
      { id: "a", label: "A", emoji: "", text: "Osman" },
      { id: "b", label: "B", emoji: "", text: "Abdullah" },
      { id: "c", label: "C", emoji: "", text: "Xalid" },
      { id: "d", label: "D", emoji: "", text: "Əbu Talib" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d42",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d42",
    options: [
      { id: "a", label: "A", emoji: "", text: "Əminə" },
      { id: "b", label: "B", emoji: "", text: "Xədicə" },
      { id: "c", label: "C", emoji: "", text: "Fatimə" },
      { id: "d", label: "D", emoji: "", text: "Aişə" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d43",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d43",
    options: [
      { id: "a", label: "A", emoji: "", text: "İncil" },
      { id: "b", label: "B", emoji: "", text: "Tövrat" },
      { id: "c", label: "C", emoji: "", text: "Zəbur" },
      { id: "d", label: "D", emoji: "", text: "Quran" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d44",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d44",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlaces.damascus" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlaces.egypt" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlaces.mecca" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlaces.taif" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d45",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d45",
    options: [
      { id: "a", label: "A", emoji: "", text: "Səyahət edirlər" },
      { id: "b", label: "B", emoji: "", text: "Oruc tuturlar" },
      { id: "c", label: "C", emoji: "", text: "Yatırlar" },
      { id: "d", label: "D", emoji: "", text: "İş görmürlər" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d46",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d46",
    options: [
      { id: "a", label: "A", emoji: "", text: "Fars dilində" },
      { id: "b", label: "B", emoji: "", text: "Türk dilində" },
      { id: "c", label: "C", emoji: "", text: "Ərəb dilində" },
      { id: "d", label: "D", emoji: "", text: "Urdu dilində" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d47",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d47",
    options: [
      { id: "a", label: "A", emoji: "", text: "Məscid" },
      { id: "b", label: "B", emoji: "", text: "Kilsə" },
      { id: "c", label: "C", emoji: "", text: "Sinaqoq" },
      { id: "d", label: "D", emoji: "", text: "Məbəd" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d48",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d48",
    options: [
      { id: "a", label: "A", emoji: "", text: "Sağol" },
      { id: "b", label: "B", emoji: "", text: "Görüşərik" },
      { id: "c", label: "C", emoji: "", text: "Bağışla" },
      { id: "d", label: "D", emoji: "", text: "Sülh, əmin-amanlıq" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d49",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d49",
    options: [
      { id: "a", label: "A", emoji: "", text: "Musa və Harun" },
      { id: "b", label: "B", emoji: "", text: "İbrahim və İsmail" },
      { id: "c", label: "C", emoji: "", text: "Nuh və oğulları" },
      { id: "d", label: "D", emoji: "", text: "Davud və Süleyman" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d50",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d50",
    options: [
      { id: "a", label: "A", emoji: "", text: "Hira mağarası" },
      { id: "b", label: "B", emoji: "", text: "Sur mağarası" },
      { id: "c", label: "C", emoji: "", text: "Kəhf mağarası" },
      { id: "d", label: "D", emoji: "", text: "Cudi mağarası" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d51",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d51",
    options: [
      { id: "a", label: "A", emoji: "", text: "Əl-Bəqərə" },
      { id: "b", label: "B", emoji: "", text: "Ən-Nas" },
      { id: "c", label: "C", emoji: "", text: "Əl-Fatihə" },
      { id: "d", label: "D", emoji: "", text: "Əl-İxlas" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d52",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d52",
    options: [
      { id: "a", label: "A", emoji: "", text: "Əl-Fatihə" },
      { id: "b", label: "B", emoji: "", text: "Əl-İxlas" },
      { id: "c", label: "C", emoji: "", text: "Ən-Nas" },
      { id: "d", label: "D", emoji: "", text: "Əl-Bəqərə" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d53",
    category: "din",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.d53",
    options: [
      { id: "a", label: "A", emoji: "", text: "İsa (ə.s.)" },
      { id: "b", label: "B", emoji: "", text: "Musa (ə.s.)" },
      { id: "c", label: "C", emoji: "", text: "Nuh (ə.s.)" },
      { id: "d", label: "D", emoji: "", text: "Yusuf (ə.s.)" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d54",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d54",
    options: [
      { id: "a", label: "A", emoji: "", text: "Fil" },
      { id: "b", label: "B", emoji: "", text: "Aslan" },
      { id: "c", label: "C", emoji: "", text: "Pələng" },
      { id: "d", label: "D", emoji: "", text: "Tülkü" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d55",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d55",
    options: [
      { id: "a", label: "A", emoji: "", text: "Ev tikmək" },
      { id: "b", label: "B", emoji: "", text: "Sədəqə almaq" },
      { id: "c", label: "C", emoji: "", text: "Var-dövlətin bir hissəsini kasıblara vermək" },
      { id: "d", label: "D", emoji: "", text: "Pul saxlamaq" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d56",
    category: "din",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.d56",
    options: [
      { id: "a", label: "A", emoji: "", text: "Məcburi vergi" },
      { id: "b", label: "B", emoji: "", text: "Bank haqqı" },
      { id: "c", label: "C", emoji: "", text: "Miras" },
      { id: "d", label: "D", emoji: "", text: "Könüllü xeyriyyəçilik" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "d57",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d57",
    options: [
      { id: "a", label: "A", emoji: "", text: "Həcc ziyarəti" },
      { id: "b", label: "B", emoji: "", text: "Məkkədən Mədinəyə köç" },
      { id: "c", label: "C", emoji: "", text: "Oruc tutmaq" },
      { id: "d", label: "D", emoji: "", text: "Namaz qılmaq" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "d58",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d58",
    options: [
      { id: "a", label: "A", emoji: "", text: "Hicrət" },
      { id: "b", label: "B", emoji: "", text: "Peyğəmbərin doğumu" },
      { id: "c", label: "C", emoji: "", text: "Bədr döyüşü" },
      { id: "d", label: "D", emoji: "", text: "Məkkənin fəthi" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "d59",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d59",
    options: [
      { id: "a", label: "A", emoji: "", text: "Məscidün-Nəbəvi" },
      { id: "b", label: "B", emoji: "", text: "Məscidül-Əqsa" },
      { id: "c", label: "C", emoji: "", text: "Məscidül-Haram" },
      { id: "d", label: "D", emoji: "", text: "Sultanəhməd məscidi" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "d60",
    category: "din",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.d60",
    options: [
      { id: "a", label: "A", emoji: "", text: "İncil" },
      { id: "b", label: "B", emoji: "", text: "Zəbur" },
      { id: "c", label: "C", emoji: "", text: "Quran" },
      { id: "d", label: "D", emoji: "", text: "Tövrat" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  // Riyaziyyat — söz məsələləri
  {
    id: "m16",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "2" },
      { id: "d", label: "D", emoji: "", text: "5" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m17",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "", text: "11" },
      { id: "b", label: "B", emoji: "", text: "13" },
      { id: "c", label: "C", emoji: "", text: "10" },
      { id: "d", label: "D", emoji: "", text: "12" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m18",
    category: "riyaziyyat",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "3" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "m19",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m19",
    options: [
      { id: "a", label: "A", emoji: "", text: "11" },
      { id: "b", label: "B", emoji: "", text: "12" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "10" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m20",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m20",
    options: [
      { id: "a", label: "A", emoji: "", text: "24" },
      { id: "b", label: "B", emoji: "", text: "25" },
      { id: "c", label: "C", emoji: "", text: "30" },
      { id: "d", label: "D", emoji: "", text: "22" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m21",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m21",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "11" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m22",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m22",
    options: [
      { id: "a", label: "A", emoji: "", text: "7" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "5" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m23",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m23",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "15" },
      { id: "c", label: "C", emoji: "", text: "20" },
      { id: "d", label: "D", emoji: "", text: "12" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m24",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m24",
    options: [
      { id: "a", label: "A", emoji: "", text: "2" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "4" },
      { id: "d", label: "D", emoji: "", text: "3" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m25",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m25",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "8" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m26",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m26",
    options: [
      { id: "a", label: "A", emoji: "", text: "28" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "24" },
      { id: "d", label: "D", emoji: "", text: "20" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m27",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m27",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "10000" },
      { id: "c", label: "C", emoji: "", text: "1000" },
      { id: "d", label: "D", emoji: "", text: "100" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m28",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m28",
    options: [
      { id: "a", label: "A", emoji: "", text: "24" },
      { id: "b", label: "B", emoji: "", text: "30" },
      { id: "c", label: "C", emoji: "", text: "20" },
      { id: "d", label: "D", emoji: "", text: "12" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "m29",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m29",
    options: [
      { id: "a", label: "A", emoji: "", text: "20" },
      { id: "b", label: "B", emoji: "", text: "17" },
      { id: "c", label: "C", emoji: "", text: "16" },
      { id: "d", label: "D", emoji: "", text: "18" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m30",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m30",
    options: [
      { id: "a", label: "A", emoji: "", text: "12" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "10" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m31",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m31",
    options: [
      { id: "a", label: "A", emoji: "", text: "12" },
      { id: "b", label: "B", emoji: "", text: "14" },
      { id: "c", label: "C", emoji: "", text: "16" },
      { id: "d", label: "D", emoji: "", text: "10" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m32",
    category: "riyaziyyat",
    explanationKey: "content.quizExplanations.m32",
    options: [
      { id: "a", label: "A", emoji: "", text: "7" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "8" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m33",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m33",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "8" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m34",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m34",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "7" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m35",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m35",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m36",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m36",
    options: [
      { id: "a", label: "A", emoji: "", text: "9" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "11" },
      { id: "d", label: "D", emoji: "", text: "12" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m37",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m37",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "10" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m38",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m38",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "9" },
      { id: "c", label: "C", emoji: "", text: "12" },
      { id: "d", label: "D", emoji: "", text: "3" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m39",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m39",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "2" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m40",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m40",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "8" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m41",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m41",
    options: [
      { id: "a", label: "A", emoji: "", text: "9" },
      { id: "b", label: "B", emoji: "", text: "16" },
      { id: "c", label: "C", emoji: "", text: "20" },
      { id: "d", label: "D", emoji: "", text: "24" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m42",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m42",
    options: [
      { id: "a", label: "A", emoji: "", text: "3" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "5" },
      { id: "d", label: "D", emoji: "", text: "10" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m43",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m43",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "8" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m44",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m44",
    options: [
      { id: "a", label: "A", emoji: "", text: "120" },
      { id: "b", label: "B", emoji: "", text: "150" },
      { id: "c", label: "C", emoji: "", text: "180" },
      { id: "d", label: "D", emoji: "", text: "200" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m45",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m45",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "9" },
      { id: "c", label: "C", emoji: "", text: "12" },
      { id: "d", label: "D", emoji: "", text: "27" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m46",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m46",
    options: [
      { id: "a", label: "A", emoji: "", text: "2" },
      { id: "b", label: "B", emoji: "", text: "4" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m47",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m47",
    options: [
      { id: "a", label: "A", emoji: "", text: "11" },
      { id: "b", label: "B", emoji: "", text: "13" },
      { id: "c", label: "C", emoji: "", text: "16" },
      { id: "d", label: "D", emoji: "", text: "17" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m48",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m48",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "20" },
      { id: "c", label: "C", emoji: "", text: "30" },
      { id: "d", label: "D", emoji: "", text: "40" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m49",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m49",
    options: [
      { id: "a", label: "A", emoji: "", text: "13" },
      { id: "b", label: "B", emoji: "", text: "36" },
      { id: "c", label: "C", emoji: "", text: "42" },
      { id: "d", label: "D", emoji: "", text: "49" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m50",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m50",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "9" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m51",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m51",
    options: [
      { id: "a", label: "A", emoji: "", text: "48" },
      { id: "b", label: "B", emoji: "", text: "54" },
      { id: "c", label: "C", emoji: "", text: "56" },
      { id: "d", label: "D", emoji: "", text: "64" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m52",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m52",
    options: [
      { id: "a", label: "A", emoji: "", text: "53" },
      { id: "b", label: "B", emoji: "", text: "63" },
      { id: "c", label: "C", emoji: "", text: "67" },
      { id: "d", label: "D", emoji: "", text: "73" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m53",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m53",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "13" },
      { id: "c", label: "C", emoji: "", text: "16" },
      { id: "d", label: "D", emoji: "", text: "20" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m54",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m54",
    options: [
      { id: "a", label: "A", emoji: "", text: "64" },
      { id: "b", label: "B", emoji: "", text: "72" },
      { id: "c", label: "C", emoji: "", text: "81" },
      { id: "d", label: "D", emoji: "", text: "56" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m55",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m55",
    options: [
      { id: "a", label: "A", emoji: "", text: "90" },
      { id: "b", label: "B", emoji: "", text: "100" },
      { id: "c", label: "C", emoji: "", text: "110" },
      { id: "d", label: "D", emoji: "", text: "150" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m56",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m56",
    options: [
      { id: "a", label: "A", emoji: "", text: "21" },
      { id: "b", label: "B", emoji: "", text: "28" },
      { id: "c", label: "C", emoji: "", text: "42" },
      { id: "d", label: "D", emoji: "", text: "56" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m57",
    category: "riyaziyyat",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.m57",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "12" },
      { id: "d", label: "D", emoji: "", text: "16" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m58",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m58",
    options: [
      { id: "a", label: "A", emoji: "", text: "7" },
      { id: "b", label: "B", emoji: "", text: "8" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m59",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m59",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "m60",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m60",
    options: [
      { id: "a", label: "A", emoji: "", text: "16" },
      { id: "b", label: "B", emoji: "", text: "18" },
      { id: "c", label: "C", emoji: "", text: "20" },
      { id: "d", label: "D", emoji: "", text: "15" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m61",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m61",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m62",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m62",
    options: [
      { id: "a", label: "A", emoji: "", text: "18" },
      { id: "b", label: "B", emoji: "", text: "24" },
      { id: "c", label: "C", emoji: "", text: "14" },
      { id: "d", label: "D", emoji: "", text: "21" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m63",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m63",
    options: [
      { id: "a", label: "A", emoji: "", text: "9" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m64",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m64",
    options: [
      { id: "a", label: "A", emoji: "", text: "19" },
      { id: "b", label: "B", emoji: "", text: "20" },
      { id: "c", label: "C", emoji: "", text: "21" },
      { id: "d", label: "D", emoji: "", text: "22" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m65",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m65",
    options: [
      { id: "a", label: "A", emoji: "", text: "16" },
      { id: "b", label: "B", emoji: "", text: "17" },
      { id: "c", label: "C", emoji: "", text: "19" },
      { id: "d", label: "D", emoji: "", text: "18" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m66",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m66",
    options: [
      { id: "a", label: "A", emoji: "", text: "35" },
      { id: "b", label: "B", emoji: "", text: "40" },
      { id: "c", label: "C", emoji: "", text: "45" },
      { id: "d", label: "D", emoji: "", text: "30" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m67",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m67",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m68",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m68",
    options: [
      { id: "a", label: "A", emoji: "", text: "24" },
      { id: "b", label: "B", emoji: "", text: "21" },
      { id: "c", label: "C", emoji: "", text: "30" },
      { id: "d", label: "D", emoji: "", text: "28" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m69",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m69",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m70",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m70",
    options: [
      { id: "a", label: "A", emoji: "", text: "30" },
      { id: "b", label: "B", emoji: "", text: "31" },
      { id: "c", label: "C", emoji: "", text: "33" },
      { id: "d", label: "D", emoji: "", text: "32" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m71",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m71",
    options: [
      { id: "a", label: "A", emoji: "", text: "40" },
      { id: "b", label: "B", emoji: "", text: "45" },
      { id: "c", label: "C", emoji: "", text: "50" },
      { id: "d", label: "D", emoji: "", text: "35" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m72",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m72",
    options: [
      { id: "a", label: "A", emoji: "", text: "4" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "5" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "m73",
    category: "riyaziyyat",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.m73",
    options: [
      { id: "a", label: "A", emoji: "", text: "20" },
      { id: "b", label: "B", emoji: "", text: "22" },
      { id: "c", label: "C", emoji: "", text: "26" },
      { id: "d", label: "D", emoji: "", text: "24" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "m74",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m74",
    options: [
      { id: "a", label: "A", emoji: "", text: "25" },
      { id: "b", label: "B", emoji: "", text: "27" },
      { id: "c", label: "C", emoji: "", text: "29" },
      { id: "d", label: "D", emoji: "", text: "23" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "m75",
    category: "riyaziyyat",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.m75",
    options: [
      { id: "a", label: "A", emoji: "", text: "40" },
      { id: "b", label: "B", emoji: "", text: "44" },
      { id: "c", label: "C", emoji: "", text: "42" },
      { id: "d", label: "D", emoji: "", text: "38" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  // Yaxşı Əməllər
  {
    id: "e1",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🙈" },
      { id: "b", label: "B", emoji: "🤗" },
      { id: "c", label: "C", emoji: "😂" },
      { id: "d", label: "D", emoji: "😡" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e2",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "😤" },
      { id: "b", label: "B", emoji: "🙅" },
      { id: "c", label: "C", emoji: "😏" },
      { id: "d", label: "D", emoji: "🤝" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e3",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🙉" },
      { id: "b", label: "B", emoji: "🙋" },
      { id: "c", label: "C", emoji: "🎮" },
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
      { id: "c", label: "C", emoji: "😆" },
      { id: "d", label: "D", emoji: "😠" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e5",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🙊" },
      { id: "b", label: "B", emoji: "🤲" },
      { id: "c", label: "C", emoji: "🗑️" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e6",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "😤" },
      { id: "b", label: "B", emoji: "🙋" },
      { id: "c", label: "C", emoji: "😂" },
      { id: "d", label: "D", emoji: "🙉" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e7",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "📢" },
      { id: "b", label: "B", emoji: "🏃" },
      { id: "c", label: "C", emoji: "😤" },
      { id: "d", label: "D", emoji: "🤫" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e8",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤝" },
      { id: "b", label: "B", emoji: "😢" },
      { id: "c", label: "C", emoji: "😠" },
      { id: "d", label: "D", emoji: "🙈" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e9",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "🤥" },
      { id: "b", label: "B", emoji: "🙏" },
      { id: "c", label: "C", emoji: "😆" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e10",
    category: "yaxsiEmeller",
    options: [
      { id: "a", label: "A", emoji: "😢" },
      { id: "b", label: "B", emoji: "😌" },
      { id: "c", label: "C", emoji: "👊" },
      { id: "d", label: "D", emoji: "🗣️" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e11",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e11",
    options: [
      { id: "a", label: "A", emoji: "🙈" },
      { id: "b", label: "B", emoji: "😠" },
      { id: "c", label: "C", emoji: "🤗" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e12",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e12",
    options: [
      { id: "a", label: "A", emoji: "😏" },
      { id: "b", label: "B", emoji: "😊" },
      { id: "c", label: "C", emoji: "😐" },
      { id: "d", label: "D", emoji: "😞" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e13",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e13",
    options: [
      { id: "a", label: "A", emoji: "😊" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😞" },
      { id: "d", label: "D", emoji: "😐" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e14",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e14",
    options: [
      { id: "a", label: "A", emoji: "😒" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😇" },
      { id: "d", label: "D", emoji: "😐" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e15",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e15",
    options: [
      { id: "a", label: "A", emoji: "😴" },
      { id: "b", label: "B", emoji: "😐" },
      { id: "c", label: "C", emoji: "😊" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e16",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e16",
    options: [
      { id: "a", label: "A", emoji: "😂" },
      { id: "b", label: "B", emoji: "🍞" },
      { id: "c", label: "C", emoji: "😠" },
      { id: "d", label: "D", emoji: "🙈" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e17",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e17",
    options: [
      { id: "a", label: "A", emoji: "🤝" },
      { id: "b", label: "B", emoji: "😂" },
      { id: "c", label: "C", emoji: "🙈" },
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
      { id: "a", label: "A", emoji: "😏" },
      { id: "b", label: "B", emoji: "🤝" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😡" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e19",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e19",
    options: [
      { id: "a", label: "A", emoji: "🙏" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😒" },
      { id: "d", label: "D", emoji: "😐" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e20",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e20",
    options: [
      { id: "a", label: "A", emoji: "🙈" },
      { id: "b", label: "B", emoji: "🤗" },
      { id: "c", label: "C", emoji: "😂" },
      { id: "d", label: "D", emoji: "😒" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e21",
    category: "yaxsiEmeller",
    explanationKey: "content.quizExplanations.e21",
    options: [
      { id: "a", label: "A", emoji: "😊" },
      { id: "b", label: "B", emoji: "😡" },
      { id: "c", label: "C", emoji: "😒" },
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
      { id: "b", label: "B", emoji: "", textKey: "content.quizRewards.praise" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizRewards.gift" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizRewards.money" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e23",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e23",
    options: [
      { id: "a", label: "A", emoji: "🙋" },
      { id: "b", label: "B", emoji: "😏" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e24",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e24",
    options: [
      { id: "a", label: "A", emoji: "😤" },
      { id: "b", label: "B", emoji: "😊" },
      { id: "c", label: "C", emoji: "🙄" },
      { id: "d", label: "D", emoji: "🙅" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e25",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e25",
    options: [
      { id: "a", label: "A", emoji: "😐" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "🤗" },
      { id: "d", label: "D", emoji: "😏" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e26",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e26",
    options: [
      { id: "a", label: "A", emoji: "😴" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😏" },
      { id: "d", label: "D", emoji: "🤝" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e27",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e27",
    options: [
      { id: "a", label: "A", emoji: "😇" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😅" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e28",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e28",
    options: [
      { id: "a", label: "A", emoji: "🙅" },
      { id: "b", label: "B", emoji: "🤝" },
      { id: "c", label: "C", emoji: "😒" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e29",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e29",
    options: [
      { id: "a", label: "A", emoji: "😴" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😊" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e30",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e30",
    options: [
      { id: "a", label: "A", emoji: "😂" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😏" },
      { id: "d", label: "D", emoji: "🙋" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e31",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e31",
    options: [
      { id: "a", label: "A", emoji: "🤲" },
      { id: "b", label: "B", emoji: "😋" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e32",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e32",
    options: [
      { id: "a", label: "A", emoji: "😡" },
      { id: "b", label: "B", emoji: "😊" },
      { id: "c", label: "C", emoji: "😤" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e33",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e33",
    options: [
      { id: "a", label: "A", emoji: "😏" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "🗑️" },
      { id: "d", label: "D", emoji: "😂" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e34",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e34",
    options: [
      { id: "a", label: "A", emoji: "🙄" },
      { id: "b", label: "B", emoji: "😏" },
      { id: "c", label: "C", emoji: "🏃" },
      { id: "d", label: "D", emoji: "🤗" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e35",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e35",
    options: [
      { id: "a", label: "A", emoji: "🙅" },
      { id: "b", label: "B", emoji: "😂" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😏" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e36",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e36",
    options: [
      { id: "a", label: "A", emoji: "😡" },
      { id: "b", label: "B", emoji: "🤝" },
      { id: "c", label: "C", emoji: "🙄" },
      { id: "d", label: "D", emoji: "😒" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e37",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e37",
    options: [
      { id: "a", label: "A", emoji: "😴" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "🧹" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e38",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e38",
    options: [
      { id: "a", label: "A", emoji: "😴" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "😤" },
      { id: "d", label: "D", emoji: "😊" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e39",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e39",
    options: [
      { id: "a", label: "A", emoji: "😇" },
      { id: "b", label: "B", emoji: "😏" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😂" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e40",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e40",
    options: [
      { id: "a", label: "A", emoji: "😒" },
      { id: "b", label: "B", emoji: "🤗" },
      { id: "c", label: "C", emoji: "🙄" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e41",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e41",
    options: [
      { id: "a", label: "A", emoji: "😐" },
      { id: "b", label: "B", emoji: "🙄" },
      { id: "c", label: "C", emoji: "🙏" },
      { id: "d", label: "D", emoji: "😏" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e42",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e42",
    options: [
      { id: "a", label: "A", emoji: "😤" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😂" },
      { id: "d", label: "D", emoji: "😊" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e43",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e43",
    options: [
      { id: "a", label: "A", emoji: "🤗" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😏" },
      { id: "d", label: "D", emoji: "🏃" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e44",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e44",
    options: [
      { id: "a", label: "A", emoji: "😡" },
      { id: "b", label: "B", emoji: "😊" },
      { id: "c", label: "C", emoji: "🙄" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e45",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e45",
    options: [
      { id: "a", label: "A", emoji: "🙅" },
      { id: "b", label: "B", emoji: "😒" },
      { id: "c", label: "C", emoji: "🤝" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e46",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e46",
    options: [
      { id: "a", label: "A", emoji: "😤" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😏" },
      { id: "d", label: "D", emoji: "🤫" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e47",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e47",
    options: [
      { id: "a", label: "A", emoji: "🤐" },
      { id: "b", label: "B", emoji: "🗣️" },
      { id: "c", label: "C", emoji: "😏" },
      { id: "d", label: "D", emoji: "🙈" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e48",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e48",
    options: [
      { id: "a", label: "A", emoji: "😴" },
      { id: "b", label: "B", emoji: "😊" },
      { id: "c", label: "C", emoji: "🙄" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e49",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e49",
    options: [
      { id: "a", label: "A", emoji: "😏" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "🤗" },
      { id: "d", label: "D", emoji: "😡" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e50",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e50",
    options: [
      { id: "a", label: "A", emoji: "😏" },
      { id: "b", label: "B", emoji: "🙈" },
      { id: "c", label: "C", emoji: "😴" },
      { id: "d", label: "D", emoji: "🙏" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e51",
    category: "yaxsiEmeller",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.e51",
    options: [
      { id: "a", label: "A", emoji: "🤗" },
      { id: "b", label: "B", emoji: "😂" },
      { id: "c", label: "C", emoji: "🙈" },
      { id: "d", label: "D", emoji: "😒" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e52",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e52",
    options: [
      { id: "a", label: "A", emoji: "😂" },
      { id: "b", label: "B", emoji: "🤫" },
      { id: "c", label: "C", emoji: "🏃" },
      { id: "d", label: "D", emoji: "😤" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e53",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e53",
    options: [
      { id: "a", label: "A", emoji: "😡" },
      { id: "b", label: "B", emoji: "😤" },
      { id: "c", label: "C", emoji: "😊" },
      { id: "d", label: "D", emoji: "🙄" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e54",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e54",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.getAngry" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.forgive" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.revenge" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.ignore" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e55",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e55",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.respectfully" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.impatient" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.ignoreThem" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.rude" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e56",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e56",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.hideIt" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.sayNothing" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.apologizeAndReplace" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.lie" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e57",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e57",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.breaksPromises" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.forgetsPromises" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.changesMind" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.keepsWord" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e58",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e58",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.talkAndHelp" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.lookAway" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.laugh" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.walkAway" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e59",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e59",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.watchTv" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.shout" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.washHands" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.sleep" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e60",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e60",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.forget" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.change" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.deny" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.keepIt" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e61",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e61",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGoodDeeds.breakTrees" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGoodDeeds.wasteWater" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGoodDeeds.throwTrashProperly" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGoodDeeds.hurtAnimals" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e62",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e62",
    options: [
      { id: "a", label: "A", emoji: "", text: "Salamını almaq" },
      { id: "b", label: "B", emoji: "", text: "Görməzdən gəlmək" },
      { id: "c", label: "C", emoji: "", text: "Qaçmaq" },
      { id: "d", label: "D", emoji: "", text: "Susmaq" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e63",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e63",
    options: [
      { id: "a", label: "A", emoji: "", text: "Səsini ucaltmaq" },
      { id: "b", label: "B", emoji: "", text: "Salamlaşmaq" },
      { id: "c", label: "C", emoji: "", text: "Onu görməzdən gəlmək" },
      { id: "d", label: "D", emoji: "", text: "Qaçmaq" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e64",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e64",
    options: [
      { id: "a", label: "A", emoji: "", text: "Heç nə deməmək" },
      { id: "b", label: "B", emoji: "", text: "Şikayət etmək" },
      { id: "c", label: "C", emoji: "", text: "Təşəkkür etmək" },
      { id: "d", label: "D", emoji: "", text: "Uzaqlaşmaq" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e65",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e65",
    options: [
      { id: "a", label: "A", emoji: "", text: "Ağlamaq və dayanmaq" },
      { id: "b", label: "B", emoji: "", text: "Qəzəblənmək" },
      { id: "c", label: "C", emoji: "", text: "Hər şeyi atmaq" },
      { id: "d", label: "D", emoji: "", text: "Kömək istəmək" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e66",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e66",
    options: [
      { id: "a", label: "A", emoji: "", text: "Yaxşı əxlaqlı olması" },
      { id: "b", label: "B", emoji: "", text: "Zəngin olması" },
      { id: "c", label: "C", emoji: "", text: "Məşhur olması" },
      { id: "d", label: "D", emoji: "", text: "Çox oyuncağı olması" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e67",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e67",
    options: [
      { id: "a", label: "A", emoji: "", text: "Kobudluqla" },
      { id: "b", label: "B", emoji: "", text: "Mehribanlıqla və qorumaqla" },
      { id: "c", label: "C", emoji: "", text: "Əhəmiyyət verməməklə" },
      { id: "d", label: "D", emoji: "", text: "Onlarla mübahisə etməklə" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e68",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e68",
    options: [
      { id: "a", label: "A", emoji: "", text: "Tələsmək" },
      { id: "b", label: "B", emoji: "", text: "Ərinmək" },
      { id: "c", label: "C", emoji: "", text: "Səbir və çalışqanlıq" },
      { id: "d", label: "D", emoji: "", text: "Şikayət etmək" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e69",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e69",
    options: [
      { id: "a", label: "A", emoji: "", text: "Qışqırmalıyıq" },
      { id: "b", label: "B", emoji: "", text: "Ayağa qalxıb qaçmalıyıq" },
      { id: "c", label: "C", emoji: "", text: "Susmalıyıq" },
      { id: "d", label: "D", emoji: "", text: "Əlimizi qaldırmalıyıq" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e70",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e70",
    options: [
      { id: "a", label: "A", emoji: "", text: "Sakit olmalıyıq" },
      { id: "b", label: "B", emoji: "", text: "Qışqırmalıyıq" },
      { id: "c", label: "C", emoji: "", text: "Qaçmalıyıq" },
      { id: "d", label: "D", emoji: "", text: "Mahnı oxumalıyıq" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e71",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e71",
    options: [
      { id: "a", label: "A", emoji: "", text: "Heç nə deməməliyik" },
      { id: "b", label: "B", emoji: "", text: "Əlhəmdülillah deməliyik" },
      { id: "c", label: "C", emoji: "", text: "Sağol özümə deməliyik" },
      { id: "d", label: "D", emoji: "", text: "Görüşərik deməliyik" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e72",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e72",
    options: [
      { id: "a", label: "A", emoji: "", text: "Qorxutmaqla" },
      { id: "b", label: "B", emoji: "", text: "Daş ataraq" },
      { id: "c", label: "C", emoji: "", text: "Mərhəmətlə, incitmədən" },
      { id: "d", label: "D", emoji: "", text: "Əhəmiyyət verməyərək" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e73",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e73",
    options: [
      { id: "a", label: "A", emoji: "", text: "Xəsislik" },
      { id: "b", label: "B", emoji: "", text: "Tənbəllik" },
      { id: "c", label: "C", emoji: "", text: "Qəzəb" },
      { id: "d", label: "D", emoji: "", text: "Səxavət" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "e74",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e74",
    options: [
      { id: "a", label: "A", emoji: "", text: "Məsuliyyət" },
      { id: "b", label: "B", emoji: "", text: "Tənbəllik" },
      { id: "c", label: "C", emoji: "", text: "Unutqanlıq" },
      { id: "d", label: "D", emoji: "", text: "Səhlənkarlıq" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "e75",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e75",
    options: [
      { id: "a", label: "A", emoji: "", text: "Qaçaraq keçməliyik" },
      { id: "b", label: "B", emoji: "", text: "Ətrafa baxıb keçməliyik" },
      { id: "c", label: "C", emoji: "", text: "Gözümüzü yumub keçməliyik" },
      { id: "d", label: "D", emoji: "", text: "Telefona baxaraq keçməliyik" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "e76",
    category: "yaxsiEmeller",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.e76",
    options: [
      { id: "a", label: "A", emoji: "", text: "Lazımsız" },
      { id: "b", label: "B", emoji: "", text: "Vaxt itkisi" },
      { id: "c", label: "C", emoji: "", text: "Gözəl və faydalı" },
      { id: "d", label: "D", emoji: "", text: "Səhv" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "e77",
    category: "yaxsiEmeller",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.e77",
    options: [
      { id: "a", label: "A", emoji: "", text: "Öyünmək" },
      { id: "b", label: "B", emoji: "", text: "İnanmamaq" },
      { id: "c", label: "C", emoji: "", text: "Əhəmiyyət verməmək" },
      { id: "d", label: "D", emoji: "", text: "Təşəkkür etmək və təvazökar olmaq" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  // Elm və Təbiət
  {
    id: "sc1",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "8" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "9" },
      { id: "d", label: "D", emoji: "", text: "7" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc2",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "5°" },
      { id: "b", label: "B", emoji: "0°" },
      { id: "c", label: "C", emoji: "-5°" },
      { id: "d", label: "D", emoji: "10°" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc3",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "220" },
      { id: "b", label: "B", emoji: "", text: "210" },
      { id: "c", label: "C", emoji: "", text: "200" },
      { id: "d", label: "D", emoji: "", text: "206" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc4",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "7" },
      { id: "b", label: "B", emoji: "", text: "8" },
      { id: "c", label: "C", emoji: "", text: "5" },
      { id: "d", label: "D", emoji: "", text: "6" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc5",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "10" },
      { id: "b", label: "B", emoji: "", text: "12" },
      { id: "c", label: "C", emoji: "", text: "11" },
      { id: "d", label: "D", emoji: "", text: "13" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc6",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "3" },
      { id: "b", label: "B", emoji: "", text: "2" },
      { id: "c", label: "C", emoji: "", text: "1" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc7",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "90°" },
      { id: "b", label: "B", emoji: "120°" },
      { id: "c", label: "C", emoji: "110°" },
      { id: "d", label: "D", emoji: "100°" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc8",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "70" },
      { id: "b", label: "B", emoji: "", text: "50" },
      { id: "c", label: "C", emoji: "", text: "80" },
      { id: "d", label: "D", emoji: "", text: "60" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc9",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "70" },
      { id: "b", label: "B", emoji: "", text: "80" },
      { id: "c", label: "C", emoji: "", text: "60" },
      { id: "d", label: "D", emoji: "", text: "50" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc10",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "30" },
      { id: "b", label: "B", emoji: "", text: "7" },
      { id: "c", label: "C", emoji: "", text: "15" },
      { id: "d", label: "D", emoji: "", text: "60" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc11",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "10" },
      { id: "c", label: "C", emoji: "", text: "12" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc12",
    category: "elm",
    options: [
      { id: "a", label: "A", emoji: "", text: "6" },
      { id: "b", label: "B", emoji: "", text: "3" },
      { id: "c", label: "C", emoji: "", text: "5" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc13",
    category: "elm",
    explanationKey: "content.quizExplanations.sc13",
    options: [
      { id: "a", label: "A", emoji: "", text: "7" },
      { id: "b", label: "B", emoji: "", text: "5" },
      { id: "c", label: "C", emoji: "", text: "6" },
      { id: "d", label: "D", emoji: "", text: "8" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc14",
    category: "elm",
    explanationKey: "content.quizExplanations.sc14",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizCelestial.star" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizCelestial.comet" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizCelestial.moon" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizCelestial.sun" },
    ],
    correctOptionId: "c",
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
      { id: "a", label: "A", emoji: "", textKey: "content.quizProducts.milk" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizProducts.wool" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizProducts.egg" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizProducts.honey" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc17",
    category: "elm",
    explanationKey: "content.quizExplanations.sc17",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.eagle" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.peacock" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.sparrow" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.penguin" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc18",
    category: "elm",
    explanationKey: "content.quizExplanations.sc18",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizThings.forest" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizThings.street" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizThings.water" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizThings.trashcan" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc19",
    category: "elm",
    explanationKey: "content.quizExplanations.sc19",
    options: [
      { id: "a", label: "A", emoji: "", text: "22" },
      { id: "b", label: "B", emoji: "", text: "24" },
      { id: "c", label: "C", emoji: "", text: "26" },
      { id: "d", label: "D", emoji: "", text: "20" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc20",
    category: "elm",
    explanationKey: "content.quizExplanations.sc20",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.camel" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.lion" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.giraffe" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc21",
    category: "elm",
    explanationKey: "content.quizExplanations.sc21",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.kangaroo" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.zebra" },
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
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.rabbit" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.zebra" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.penguin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.panda" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc23",
    category: "elm",
    explanationKey: "content.quizExplanations.sc23",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.kangaroo" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.panda" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.camel" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc24",
    category: "elm",
    explanationKey: "content.quizExplanations.sc24",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.camel" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.kangaroo" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.giraffe" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc25",
    category: "elm",
    explanationKey: "content.quizExplanations.sc25",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.panda" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.camel" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.zebra" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc26",
    category: "elm",
    explanationKey: "content.quizExplanations.sc26",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.peacock" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.eagle" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.owl" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.sparrow" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc27",
    category: "elm",
    explanationKey: "content.quizExplanations.sc27",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.fish" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.penguin" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.dolphin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.eagle" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc28",
    category: "elm",
    explanationKey: "content.quizExplanations.sc28",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizCelestial.comet" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizCelestial.sun" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizCelestial.earth" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizCelestial.moon" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc29",
    category: "elm",
    explanationKey: "content.quizExplanations.sc29",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizWeather.snow" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizWeather.fog" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizWeather.cloud" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizWeather.ice" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc30",
    category: "elm",
    explanationKey: "content.quizExplanations.sc30",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizDirections.west" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizDirections.south" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizDirections.north" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizDirections.east" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc31",
    category: "elm",
    explanationKey: "content.quizExplanations.sc31",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizDirections.south" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizDirections.north" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizDirections.east" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizDirections.west" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc32",
    category: "elm",
    explanationKey: "content.quizExplanations.sc32",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.turtle" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.dolphin" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.whale" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.fish" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc33",
    category: "elm",
    explanationKey: "content.quizExplanations.sc33",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyParts.beak" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyParts.legs" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyParts.wings" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyParts.tail" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc34",
    category: "elm",
    explanationKey: "content.quizExplanations.sc34",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyParts.lungs" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyParts.gills" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyParts.nose" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyParts.skin" },
    ],
    correctOptionId: "b",
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
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimals.rabbit" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimals.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimals.lion" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimals.turtle" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc37",
    category: "elm",
    explanationKey: "content.quizExplanations.sc37",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizNatureFacts.blooms" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizNatureFacts.leavesChangeFall" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizNatureFacts.staysGreen" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizNatureFacts.grows" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc38",
    category: "elm",
    explanationKey: "content.quizExplanations.sc38",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizYesNo.yes" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizYesNo.sometimes" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizYesNo.no" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizYesNo.unknown" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc39",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc39",
    options: [
      { id: "a", label: "A", emoji: "", text: "1" },
      { id: "b", label: "B", emoji: "", text: "2" },
      { id: "c", label: "C", emoji: "", text: "3" },
      { id: "d", label: "D", emoji: "", text: "4" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc40",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc40",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlantNeeds.darkness" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlantNeeds.sunlight" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlantNeeds.cold" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlantNeeds.salt" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc41",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc41",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizSeasons.summer" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizSeasons.spring" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizSeasons.winter" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizSeasons.autumn" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc42",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc42",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyOrgans.heart" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyOrgans.skin" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyOrgans.liver" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyOrgans.lung" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc43",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc43",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBearActs.migrates" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBearActs.hibernates" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBearActs.swims" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBearActs.flies" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc44",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc44",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimalNames.lion" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimalNames.elephant" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimalNames.turtle" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimalNames.cheetah" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc45",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc45",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizProcesses.photosynthesis" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizProcesses.respiration" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizProcesses.digestion" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizProcesses.evaporation" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc46",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc46",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlanetNames.venus" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlanetNames.mercury" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlanetNames.mars" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlanetNames.saturn" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc47",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc47",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyOrgans.lung" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyOrgans.skin" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyOrgans.liver" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyOrgans.heart" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc48",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc48",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGases.carbonDioxide" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGases.nitrogen" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGases.oxygen" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGases.hydrogen" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc49",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc49",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlanetNames.mars" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlanetNames.saturn" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlanetNames.jupiter" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlanetNames.venus" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc50",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc50",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizLightSound.sound" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizLightSound.light" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizLightSound.equal" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizLightSound.neither" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc51",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc51",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyOrgans.skin" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyOrgans.heart" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyOrgans.liver" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyOrgans.lung" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc52",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc52",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizAnimalNames.lion" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizAnimalNames.chameleon" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizAnimalNames.elephant" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizAnimalNames.turtle" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc53",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc53",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizMountains.kilimanjaro" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizMountains.elbrus" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizMountains.fuji" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizMountains.everest" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc54",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc54",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyOrgans.heart" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyOrgans.liver" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyOrgans.skin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyOrgans.lung" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc55",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc55",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlantNeeds.darkness" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlantNeeds.sunlight" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlantNeeds.cold" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlantNeeds.salt" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc56",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc56",
    options: [
      { id: "a", label: "A", emoji: "", text: "Buz" },
      { id: "b", label: "B", emoji: "", text: "Duman" },
      { id: "c", label: "C", emoji: "", text: "Yağış" },
      { id: "d", label: "D", emoji: "", text: "Buxar" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc57",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc57",
    options: [
      { id: "a", label: "A", emoji: "", text: "Yarpaqdan" },
      { id: "b", label: "B", emoji: "", text: "Çiçək nektarından" },
      { id: "c", label: "C", emoji: "", text: "Sudan" },
      { id: "d", label: "D", emoji: "", text: "Torpaqdan" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc58",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc58",
    options: [
      { id: "a", label: "A", emoji: "", text: "Mars" },
      { id: "b", label: "B", emoji: "", text: "Yer" },
      { id: "c", label: "C", emoji: "", text: "Venera" },
      { id: "d", label: "D", emoji: "", text: "Yupiter" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc59",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc59",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizBodyOrgans.heart" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizBodyOrgans.liver" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizBodyOrgans.skin" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizBodyOrgans.lung" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc60",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc60",
    options: [
      { id: "a", label: "A", emoji: "", text: "5" },
      { id: "b", label: "B", emoji: "", text: "6" },
      { id: "c", label: "C", emoji: "", text: "7" },
      { id: "d", label: "D", emoji: "", text: "10" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc61",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc61",
    options: [
      { id: "a", label: "A", emoji: "", text: "Qurbağa" },
      { id: "b", label: "B", emoji: "", text: "Tırtıl" },
      { id: "c", label: "C", emoji: "", text: "Balıq" },
      { id: "d", label: "D", emoji: "", text: "Quş" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc62",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc62",
    options: [
      { id: "a", label: "A", emoji: "", text: "Beyin" },
      { id: "b", label: "B", emoji: "", text: "Ürək" },
      { id: "c", label: "C", emoji: "", text: "Qaraciyər" },
      { id: "d", label: "D", emoji: "", text: "Mədə" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc63",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc63",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizGases.nitrogen" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizGases.oxygen" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizGases.carbonDioxide" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizGases.hydrogen" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc64",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc64",
    options: [
      { id: "a", label: "A", emoji: "", text: "Bir gün" },
      { id: "b", label: "B", emoji: "", text: "Bir il" },
      { id: "c", label: "C", emoji: "", text: "Bir ay" },
      { id: "d", label: "D", emoji: "", text: "Bir həftə" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc65",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc65",
    options: [
      { id: "a", label: "A", emoji: "", text: "Buz" },
      { id: "b", label: "B", emoji: "", text: "Duman" },
      { id: "c", label: "C", emoji: "", text: "Yağış" },
      { id: "d", label: "D", emoji: "", text: "Buxar" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc66",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc66",
    options: [
      { id: "a", label: "A", emoji: "", text: "206" },
      { id: "b", label: "B", emoji: "", text: "150" },
      { id: "c", label: "C", emoji: "", text: "300" },
      { id: "d", label: "D", emoji: "", text: "100" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc67",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc67",
    options: [
      { id: "a", label: "A", emoji: "", text: "Ceyran" },
      { id: "b", label: "B", emoji: "", text: "Fil" },
      { id: "c", label: "C", emoji: "", text: "Dovşan" },
      { id: "d", label: "D", emoji: "", text: "Meymun" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc68",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc68",
    options: [
      { id: "a", label: "A", emoji: "", text: "Köpək balığı" },
      { id: "b", label: "B", emoji: "", text: "Delfin" },
      { id: "c", label: "C", emoji: "", text: "Mavi balina" },
      { id: "d", label: "D", emoji: "", text: "Ahtapot" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc69",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc69",
    options: [
      { id: "a", label: "A", emoji: "", text: "Uçmaq" },
      { id: "b", label: "B", emoji: "", text: "Səs çıxarmaq" },
      { id: "c", label: "C", emoji: "", text: "İşıq saçmaq" },
      { id: "d", label: "D", emoji: "", text: "Su və qida almaq" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc70",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc70",
    options: [
      { id: "a", label: "A", emoji: "", text: "Yaz" },
      { id: "b", label: "B", emoji: "", text: "Payız" },
      { id: "c", label: "C", emoji: "", text: "Qış" },
      { id: "d", label: "D", emoji: "", text: "Yay" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc71",
    category: "elm",
    difficulty: "hard",
    explanationKey: "content.quizExplanations.sc71",
    options: [
      { id: "a", label: "A", emoji: "", text: "20" },
      { id: "b", label: "B", emoji: "", text: "32" },
      { id: "c", label: "C", emoji: "", text: "28" },
      { id: "d", label: "D", emoji: "", text: "40" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc72",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc72",
    options: [
      { id: "a", label: "A", emoji: "", textKey: "content.quizPlanetNames.venus" },
      { id: "b", label: "B", emoji: "", textKey: "content.quizPlanetNames.jupiter" },
      { id: "c", label: "C", emoji: "", textKey: "content.quizPlanetNames.mars" },
      { id: "d", label: "D", emoji: "", textKey: "content.quizPlanetNames.saturn" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc73",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc73",
    options: [
      { id: "a", label: "A", emoji: "", text: "Külək" },
      { id: "b", label: "B", emoji: "", text: "Şimşək" },
      { id: "c", label: "C", emoji: "", text: "Duman" },
      { id: "d", label: "D", emoji: "", text: "Bulud" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "sc74",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc74",
    options: [
      { id: "a", label: "A", emoji: "", text: "Kök" },
      { id: "b", label: "B", emoji: "", text: "Çiçək" },
      { id: "c", label: "C", emoji: "", text: "Meyvə" },
      { id: "d", label: "D", emoji: "", text: "Gövdə" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "sc75",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc75",
    options: [
      { id: "a", label: "A", emoji: "", text: "Göz" },
      { id: "b", label: "B", emoji: "", text: "Qulaq" },
      { id: "c", label: "C", emoji: "", text: "Burun" },
      { id: "d", label: "D", emoji: "", text: "Dil" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "sc76",
    category: "elm",
    difficulty: "easy",
    explanationKey: "content.quizExplanations.sc76",
    options: [
      { id: "a", label: "A", emoji: "", text: "Ulduzlar" },
      { id: "b", label: "B", emoji: "", text: "Buludlar" },
      { id: "c", label: "C", emoji: "", text: "Ay" },
      { id: "d", label: "D", emoji: "", text: "Planetlər" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "sc77",
    category: "elm",
    difficulty: "medium",
    explanationKey: "content.quizExplanations.sc77",
    options: [
      { id: "a", label: "A", emoji: "", text: "Ağciyər ilə" },
      { id: "b", label: "B", emoji: "", text: "Dəri ilə" },
      { id: "c", label: "C", emoji: "", text: "Burun ilə" },
      { id: "d", label: "D", emoji: "", text: "Qəlsəmə ilə" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  // Xarici Dil — English
  {
    id: "f1",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🍌" },
      { id: "b", label: "B", emoji: "🍇" },
      { id: "c", label: "C", emoji: "🍐" },
      { id: "d", label: "D", emoji: "🍎" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "f2",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🐰" },
      { id: "b", label: "B", emoji: "🐶" },
      { id: "c", label: "C", emoji: "🐱" },
      { id: "d", label: "D", emoji: "🐭" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "f3",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🌙" },
      { id: "b", label: "B", emoji: "⭐" },
      { id: "c", label: "C", emoji: "🌧️" },
      { id: "d", label: "D", emoji: "☀️" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "f4",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🖊️" },
      { id: "b", label: "B", emoji: "🎒" },
      { id: "c", label: "C", emoji: "📕" },
      { id: "d", label: "D", emoji: "📱" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "f5",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "💧" },
      { id: "b", label: "B", emoji: "🌳" },
      { id: "c", label: "C", emoji: "🪨" },
      { id: "d", label: "D", emoji: "🔥" },
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
      { id: "b", label: "B", emoji: "🐭" },
      { id: "c", label: "C", emoji: "🐱" },
      { id: "d", label: "D", emoji: "🐰" },
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
      { id: "b", label: "B", emoji: "☀️" },
      { id: "c", label: "C", emoji: "🌧️" },
      { id: "d", label: "D", emoji: "🌙" },
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
      { id: "b", label: "B", emoji: "🍂" },
      { id: "c", label: "C", emoji: "🌵" },
      { id: "d", label: "D", emoji: "🌸" },
    ],
    correctOptionId: "a",
    xp: 20,
  },
  {
    id: "f9",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🐦" },
      { id: "b", label: "B", emoji: "🦋" },
      { id: "c", label: "C", emoji: "🐟" },
      { id: "d", label: "D", emoji: "🐍" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "f10",
    category: "xariciDil",
    targetLang: "en",
    options: [
      { id: "a", label: "A", emoji: "🏠" },
      { id: "b", label: "B", emoji: "🏰" },
      { id: "c", label: "C", emoji: "🏥" },
      { id: "d", label: "D", emoji: "🏫" },
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
      { id: "b", label: "B", emoji: "🍯" },
      { id: "c", label: "C", emoji: "🧃" },
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
      { id: "a", label: "A", emoji: "☀️" },
      { id: "b", label: "B", emoji: "🌙" },
      { id: "c", label: "C", emoji: "🌈" },
      { id: "d", label: "D", emoji: "⭐" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  // Xarici Dil — Russian
  {
    id: "g1",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🐶" },
      { id: "b", label: "B", emoji: "🐭" },
      { id: "c", label: "C", emoji: "🐱" },
      { id: "d", label: "D", emoji: "🐰" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "g2",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🍇" },
      { id: "b", label: "B", emoji: "🍐" },
      { id: "c", label: "C", emoji: "🍎" },
      { id: "d", label: "D", emoji: "🍌" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "g3",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🎒" },
      { id: "b", label: "B", emoji: "🖊️" },
      { id: "c", label: "C", emoji: "📕" },
      { id: "d", label: "D", emoji: "📱" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "g4",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🪨" },
      { id: "b", label: "B", emoji: "💧" },
      { id: "c", label: "C", emoji: "🌳" },
      { id: "d", label: "D", emoji: "🔥" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "g5",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🐰" },
      { id: "b", label: "B", emoji: "🐶" },
      { id: "c", label: "C", emoji: "🐭" },
      { id: "d", label: "D", emoji: "🐱" },
    ],
    correctOptionId: "b",
    xp: 20,
  },
  {
    id: "g6",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🌙" },
      { id: "b", label: "B", emoji: "⭐" },
      { id: "c", label: "C", emoji: "☀️" },
      { id: "d", label: "D", emoji: "🌧️" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "g7",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🌳" },
      { id: "b", label: "B", emoji: "🍂" },
      { id: "c", label: "C", emoji: "🌸" },
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
      { id: "a", label: "A", emoji: "🦋" },
      { id: "b", label: "B", emoji: "🐦" },
      { id: "c", label: "C", emoji: "🐍" },
      { id: "d", label: "D", emoji: "🐟" },
    ],
    correctOptionId: "d",
    xp: 20,
  },
  {
    id: "g9",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "🏫" },
      { id: "b", label: "B", emoji: "🏰" },
      { id: "c", label: "C", emoji: "🏠" },
      { id: "d", label: "D", emoji: "🏥" },
    ],
    correctOptionId: "c",
    xp: 20,
  },
  {
    id: "g10",
    category: "xariciDil",
    targetLang: "ru",
    options: [
      { id: "a", label: "A", emoji: "⭐" },
      { id: "b", label: "B", emoji: "☀️" },
      { id: "c", label: "C", emoji: "🌙" },
      { id: "d", label: "D", emoji: "🌈" },
    ],
    correctOptionId: "c",
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

type WordProblemOp = "add" | "subtract" | "multiply" | "divide";

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
  { promptKey: "content.quiz.mathWordKittens", op: "add" },
  { promptKey: "content.quiz.mathWordMarbles", op: "add" },
  { promptKey: "content.quiz.mathWordShells", op: "add" },
  { promptKey: "content.quiz.mathWordPencils", op: "subtract" },
  { promptKey: "content.quiz.mathWordToys", op: "subtract" },
  { promptKey: "content.quiz.mathWordSweets", op: "subtract" },
  { promptKey: "content.quiz.mathWordChairs", op: "multiply" },
  { promptKey: "content.quiz.mathWordPlates", op: "multiply" },
  { promptKey: "content.quiz.mathWordPens", op: "divide" },
  { promptKey: "content.quiz.mathWordOranges", op: "divide" },
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
  if (template.op === "add") {
    a = randInt(1, range);
    b = randInt(1, range);
    answer = a + b;
  } else if (template.op === "subtract") {
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
export function generatePlanetOrderQuestions(
  count: number,
  lang: string,
  difficulty: QuizDifficulty = "medium",
): QuizQuestion[] {
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
        difficulty,
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
      difficulty,
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
export function generatePlanetCompareQuestions(
  count: number,
  lang: string,
  difficulty: QuizDifficulty = "medium",
): QuizQuestion[] {
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
      difficulty,
      promptKey: mode.promptKey,
      options: planetNameOptions(group, lang),
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    });
  }
  return questions;
}

type AnimalMeta = {
  id: string;
  emoji: string;
  habitat: "land" | "water" | "air";
  diet: "herbivore" | "carnivore" | "omnivore";
  name: Record<string, string>;
};
const animalIndex = animalData as AnimalMeta[];

function animalName(a: AnimalMeta, lang: string): string {
  return a.name[lang] ?? a.name.en;
}

function animalNameOptions(pool: AnimalMeta[], lang: string): QuizOption[] {
  return pool.map((a, idx) => ({
    id: optionLetters[idx],
    label: optionLetters[idx].toUpperCase(),
    emoji: "",
    text: animalName(a, lang),
  }));
}

type AnimalQuestionMode = {
  promptKey: string;
  field: "habitat" | "diet";
  value: string;
};

const ANIMAL_MODES: AnimalQuestionMode[] = [
  { promptKey: "content.quiz.elmAnimalWater", field: "habitat", value: "water" },
  { promptKey: "content.quiz.elmAnimalLand", field: "habitat", value: "land" },
  { promptKey: "content.quiz.elmAnimalAir", field: "habitat", value: "air" },
  { promptKey: "content.quiz.elmAnimalCarnivore", field: "diet", value: "carnivore" },
  { promptKey: "content.quiz.elmAnimalHerbivore", field: "diet", value: "herbivore" },
  { promptKey: "content.quiz.elmAnimalOmnivore", field: "diet", value: "omnivore" },
];

/**
 * "Which of these 4 animals lives in water / eats meat / ...?" — one animal
 * matching the asked trait plus 3 that don't, drawn from a curated
 * 30-animal habitat+diet table (animals.json, simple well-known facts
 * only — no obscure or contested species). 6 modes × groupings from a
 * 30-entry table give a large, factually safe pool the same way
 * generateSurahRevelationQuestions does for Meccan/Madinan surahs — this
 * was elm's smallest generator (planets only, 8 entries) before this.
 */
export function generateAnimalFactQuestions(
  count: number,
  lang: string,
  difficulty: QuizDifficulty = "easy",
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();
  let attempts = 0;

  while (questions.length < count && attempts < count * 20) {
    attempts++;
    const mode = shuffle(ANIMAL_MODES)[0];
    const matching = animalIndex.filter((a) => a[mode.field] === mode.value);
    const nonMatching = animalIndex.filter((a) => a[mode.field] !== mode.value);
    if (matching.length === 0 || nonMatching.length < 3) continue;

    const correct = shuffle(matching)[0];
    const distractors = shuffle(nonMatching).slice(0, 3);
    const dedupeKey = `${mode.promptKey}-${[correct, ...distractors].map((a) => a.id).sort().join(",")}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const group = shuffle([correct, ...distractors]);
    const correctIndex = group.findIndex((a) => a.id === correct.id);
    questions.push({
      id: `animal-${mode.field}-${mode.value}-${questions.length}-${group.map((a) => a.id).join("-")}`,
      category: "elm",
      difficulty,
      promptKey: mode.promptKey,
      options: animalNameOptions(group, lang),
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
  difficulty: QuizDifficulty = "easy",
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
      difficulty,
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
  difficulty: QuizDifficulty = "easy",
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
      difficulty,
      promptKey: "content.quiz.xariciDilWordMatch",
      promptParams: { emoji: entry.emoji, lang: langLabel },
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    };
  });
}

type GoodDeedTemplate = { promptKey: string; correctKey: string };

/**
 * Each template pairs one "what's the right thing to do" scenario with the
 * one correct behavior (a key into content.quizGoodDeeds.*) — the 76
 * hand-authored yaxsiEmeller questions (e1-e77) predate this generator, so
 * these 25 are new prompts, not duplicates. Distractors are drawn at
 * generation time from GOOD_DEED_WRONG_POOL below rather than being fixed
 * per template, which is what turns 25 sentences into a combinatorial pool
 * instead of 25 fixed questions — same idea as WORD_PROBLEM_TEMPLATES.
 */
const GOOD_DEED_TEMPLATES: GoodDeedTemplate[] = [
  { promptKey: "content.quiz.goodDeed1", correctKey: "forgive" },
  { promptKey: "content.quiz.goodDeed2", correctKey: "respectfully" },
  { promptKey: "content.quiz.goodDeed3", correctKey: "apologizeAndReplace" },
  { promptKey: "content.quiz.goodDeed4", correctKey: "keepsWord" },
  { promptKey: "content.quiz.goodDeed5", correctKey: "talkAndHelp" },
  { promptKey: "content.quiz.goodDeed6", correctKey: "washHands" },
  { promptKey: "content.quiz.goodDeed7", correctKey: "keepIt" },
  { promptKey: "content.quiz.goodDeed8", correctKey: "throwTrashProperly" },
  { promptKey: "content.quiz.goodDeed9", correctKey: "shareFood" },
  { promptKey: "content.quiz.goodDeed10", correctKey: "tellTruth" },
  { promptKey: "content.quiz.goodDeed11", correctKey: "helpElderly" },
  { promptKey: "content.quiz.goodDeed12", correctKey: "bePatient" },
  { promptKey: "content.quiz.goodDeed13", correctKey: "sayBismillah" },
  { promptKey: "content.quiz.goodDeed14", correctKey: "cleanUpAfterSelf" },
  { promptKey: "content.quiz.goodDeed15", correctKey: "waitYourTurn" },
  { promptKey: "content.quiz.goodDeed16", correctKey: "includeOthers" },
  { promptKey: "content.quiz.goodDeed17", correctKey: "beGrateful" },
  { promptKey: "content.quiz.goodDeed18", correctKey: "workHard" },
  { promptKey: "content.quiz.goodDeed19", correctKey: "protectEnvironment" },
  { promptKey: "content.quiz.goodDeed20", correctKey: "admitMistake" },
  { promptKey: "content.quiz.goodDeed21", correctKey: "careForSiblings" },
  { promptKey: "content.quiz.goodDeed22", correctKey: "respectTeacher" },
  { promptKey: "content.quiz.goodDeed23", correctKey: "prayOnTime" },
  { promptKey: "content.quiz.goodDeed24", correctKey: "comfortSad" },
  { promptKey: "content.quiz.goodDeed25", correctKey: "listenCarefully" },
];

// Generic "wrong" behaviors, broad enough to work as a plausible-but-wrong
// distractor against almost any of the templates above (already translated
// in content.quizGoodDeeds.* — see 0-index batches of yaxsiEmeller content).
const GOOD_DEED_WRONG_POOL = [
  "getAngry", "revenge", "ignore", "rude", "impatient", "ignoreThem", "hideIt",
  "sayNothing", "lie", "breaksPromises", "forgetsPromises", "changesMind",
  "lookAway", "laugh", "walkAway", "watchTv", "shout", "sleep", "forget",
  "change", "deny", "breakTrees", "wasteWater", "hurtAnimals",
];

/**
 * 25 situation templates × freshly-sampled distractor triples from a
 * 24-entry wrong-answer pool every time (C(24,3) = 2,024 combinations per
 * template) — the same "small hand-written bank, endless recombination"
 * idea as the math/word-problem generators, applied to yaxsiEmeller.
 */
export function generateGoodDeedQuestions(
  count: number,
  difficulty: QuizDifficulty = "easy",
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();
  let attempts = 0;

  while (questions.length < count && attempts < count * 20) {
    attempts++;
    const template = shuffle(GOOD_DEED_TEMPLATES)[0];
    const wrongKeys = shuffle(
      GOOD_DEED_WRONG_POOL.filter((k) => k !== template.correctKey),
    ).slice(0, 3);
    const dedupeKey = `${template.promptKey}-${wrongKeys.slice().sort().join(",")}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const allKeys = shuffle([template.correctKey, ...wrongKeys]);
    const correctIndex = allKeys.indexOf(template.correctKey);
    const options: QuizOption[] = allKeys.map((key, idx) => ({
      id: optionLetters[idx],
      label: optionLetters[idx].toUpperCase(),
      emoji: "",
      textKey: `content.quizGoodDeeds.${key}`,
    }));

    questions.push({
      id: `good-deed-${questions.length}-${allKeys.join("-")}`,
      category: "yaxsiEmeller",
      difficulty,
      promptKey: template.promptKey,
      options,
      correctOptionId: optionLetters[correctIndex],
      xp: 20,
    });
  }

  return questions;
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
  if (category === "yaxsiEmeller") {
    const staticGood = quizBank
      .filter((q) => q.category === "yaxsiEmeller")
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    // Scenario difficulty doesn't really vary by tier (same reading level
    // either way), same reasoning as elm's planet generator below.
    const generated = generateGoodDeedQuestions(20, difficulty ?? "easy");
    return shuffle([...staticGood, ...generated]);
  }
  if (category === "elm") {
    const staticElm = quizBank
      .filter((q) => q.category === "elm")
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    // Planet facts don't get inherently harder by difficulty tier (same
    // table either way), so unlike din/riyaziyyat these are generated for
    // every tier — otherwise "hard" would have only the 2 hand-authored
    // elm questions tagged hard, an almost-empty, repeating quiz.
    const genDifficulty = difficulty ?? "medium";
    const generated = [
      ...generatePlanetOrderQuestions(10, lang, genDifficulty),
      ...generatePlanetCompareQuestions(10, lang, genDifficulty),
      ...generateAnimalFactQuestions(10, lang, genDifficulty),
    ];
    return shuffle([...staticElm, ...generated]);
  }
  if (category === "xariciDil") {
    const tl = targetLang ?? "en";
    const staticForeign = quizBank
      .filter((q) => q.category === "xariciDil" && q.targetLang === tl)
      .filter((q) => !difficulty || getDifficulty(q) === difficulty);
    // All hand-authored xariciDil questions are tagged "easy" — without
    // this, picking medium/hard here returned zero questions (a crash,
    // since quiz.tsx indexes into an empty array). Vocabulary matching
    // doesn't really get harder by tier either, so generate for whatever
    // tier was requested rather than only "easy".
    const genDifficulty = difficulty ?? "easy";
    const generated = [
      ...generateVocabPictureQuestions(12, tl, genDifficulty),
      ...generateVocabWordQuestions(12, tl, lang, genDifficulty),
    ];
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
import animalData from "./animals.json";
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

export type WorldSite = {
  id: string;
  icon: IconName;
  tone: IconBadgeTone;
};

// Content (name/fact) lives in i18n under content.worldSites.<id>, same
// deliberate mock.ts+i18n pattern Stories/Dua used to follow before
// 0029_dua_story_content.sql moved them into the database (see
// supabase/README.md) — World stays a mock.ts+i18n pair since it's
// not admin-editable either. `id` doubles as the
// `worldSlug` mark-world-visit expects and mosque-visitor's criteria
// checks against ({"type":"world_visited","world":"mosque"},
// 0008_achievement_criteria.sql) — keep the two lists in sync if a
// site is ever added or renamed.
export const worldSites: WorldSite[] = [
  { id: "mosque", icon: "mosque", tone: tones.gold },
  { id: "medina", icon: "moon", tone: tones.green },
  { id: "al-aqsa", icon: "shield", tone: tones.blue },
  { id: "istanbul", icon: "crown", tone: tones.purple },
  { id: "andalusia", icon: "book", tone: tones.teal },
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

// `done` here is just the initial-render fallback (false, honestly) —
// app/child/(tabs)/index.tsx overrides all five from today's actual
// child_daily_activity row before rendering (quiz from
// questions_answered, the rest from the booleans mark-journey-item
// sets when that item's screen is opened), via
// mobile/src/lib/childProgress.ts.
export const dailyJourney: JourneyItem[] = [
  { id: "quran", label: "Quran", icon: "book", minutes: 15, href: "/child/quran", done: false },
  { id: "dua", label: "Dua", icon: "heart", minutes: 10, href: "/child/dua", done: false },
  { id: "story", label: "Story", icon: "star", minutes: 15, href: "/child/stories", done: false },
  { id: "quiz", label: "Quiz", icon: "quiz", minutes: 10, href: "/child/quiz-categories", done: false },
  { id: "game", label: "Game", icon: "controller", minutes: 10, href: "/child/games", done: false },
];

// Just the preset choices shown on app/parent/daily-limit.tsx — the
// actual current value lives server-side now (families.daily_limit_minutes,
// see mobile/src/lib/screenTime.ts), not here.
export const dailyLimitOptions = [30, 45, 60, 90] as const;

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
