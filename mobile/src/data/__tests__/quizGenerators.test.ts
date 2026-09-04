import {
  generateAnimalFactQuestions,
  generateDivineNameQuestions,
  generateGoodDeedQuestions,
  generateMathQuestions,
  generateMathWordProblemQuestions,
  generatePlanetCompareQuestions,
  generatePlanetOrderQuestions,
  generateSurahCompareQuestions,
  generateSurahFactQuestions,
  generateSurahOrderQuestions,
  generateSurahRevelationQuestions,
  generateVocabPictureQuestions,
  generateVocabWordQuestions,
  getDifficulty,
  getQuizQuestions,
  type QuizQuestion,
} from "../mock";

/**
 * Every generator builds a question the same shape: exactly 4 options, and
 * a correctOptionId that actually names one of them. A generator that ever
 * violates this ships a quiz question with no right answer — this is the
 * one invariant worth enforcing across all of them.
 */
function assertWellFormedQuestion(q: QuizQuestion) {
  expect(q.options).toHaveLength(4);
  const optionIds = q.options.map((o) => o.id);
  expect(new Set(optionIds).size).toBe(4);
  expect(optionIds).toContain(q.correctOptionId);
}

/**
 * Stricter check, applied only to generators whose source data is verified
 * duplicate-free per field (see the per-generator dataset checks below) —
 * divineNames.json is known to contain a few genuinely repeated name/meaning
 * strings across its 99 entries, so this is deliberately not part of the
 * base invariant every generator must satisfy.
 */
function assertDistinctOptionContents(q: QuizQuestion) {
  const contents = q.options.map((o) => o.text ?? o.textKey ?? o.emoji);
  expect(new Set(contents).size).toBe(4);
}

function assertAllWellFormed(questions: QuizQuestion[], expectedCount?: number) {
  if (expectedCount !== undefined) expect(questions).toHaveLength(expectedCount);
  expect(questions.length).toBeGreaterThan(0);
  const ids = questions.map((q) => q.id);
  expect(new Set(ids).size).toBe(ids.length);
  questions.forEach(assertWellFormedQuestion);
}

describe("getDifficulty", () => {
  it("uses the explicit difficulty when set", () => {
    expect(getDifficulty({ id: "q1", difficulty: "hard" })).toBe("hard");
  });

  it("falls back to the legacy DIFFICULTY_BY_ID table", () => {
    expect(getDifficulty({ id: "q1" })).toBe("easy");
    expect(getDifficulty({ id: "d6" })).toBe("hard");
  });

  it("defaults to medium for unknown ids with no difficulty", () => {
    expect(getDifficulty({ id: "totally-unknown-id" })).toBe("medium");
  });
});

describe("generateMathQuestions", () => {
  it("generates the requested count of well-formed, unique riyaziyyat questions", () => {
    const questions = generateMathQuestions(15, "medium");
    assertAllWellFormed(questions, 15);
    questions.forEach((q) => {
      expect(q.category).toBe("riyaziyyat");
      expect(q.difficulty).toBe("medium");
      expect(q.promptText).toMatch(/=\s*\?$/);
      assertDistinctOptionContents(q);
    });
  });

  it("never generates negative numbers for easy subtraction", () => {
    const questions = generateMathQuestions(30, "easy");
    questions
      .filter((q) => q.promptText?.includes(" - "))
      .forEach((q) => {
        const [a, , b] = q.promptText!.split(" ");
        expect(Number(a) - Number(b)).toBeGreaterThanOrEqual(0);
      });
  });

  it("keeps the labeled correct option's numeric value equal to the real answer", () => {
    const questions = generateMathQuestions(20, "hard");
    questions.forEach((q) => {
      const [a, op, b] = q.promptText!.replace(" = ?", "").split(" ");
      const na = Number(a);
      const nb = Number(b);
      const expected =
        op === "+" ? na + nb : op === "-" ? na - nb : op === "×" ? na * nb : na / nb;
      const correct = q.options.find((o) => o.id === q.correctOptionId)!;
      expect(Number(correct.emoji)).toBe(expected);
    });
  });
});

describe("generateMathWordProblemQuestions", () => {
  it("generates well-formed questions carrying a translatable promptKey and params", () => {
    const questions = generateMathWordProblemQuestions(12, "medium");
    assertAllWellFormed(questions, 12);
    questions.forEach((q) => {
      expect(q.category).toBe("riyaziyyat");
      expect(q.promptKey).toMatch(/^content\.quiz\.mathWord/);
      expect(q.promptParams).toEqual(
        expect.objectContaining({ a: expect.any(Number), b: expect.any(Number) }),
      );
      assertDistinctOptionContents(q);
    });
  });
});

describe("generateGoodDeedQuestions", () => {
  it("generates well-formed yaxsiEmeller questions with distractors that never equal the correct key", () => {
    const questions = generateGoodDeedQuestions(20, "easy");
    assertAllWellFormed(questions, 20);
    questions.forEach((q) => {
      expect(q.category).toBe("yaxsiEmeller");
      const correct = q.options.find((o) => o.id === q.correctOptionId)!;
      const wrongOptions = q.options.filter((o) => o.id !== q.correctOptionId);
      wrongOptions.forEach((o) => expect(o.textKey).not.toBe(correct.textKey));
      assertDistinctOptionContents(q);
    });
  });
});

describe("generateAnimalFactQuestions", () => {
  it("generates well-formed elm questions", () => {
    const questions = generateAnimalFactQuestions(15, "az", "easy");
    assertAllWellFormed(questions, 15);
    questions.forEach((q) => {
      expect(q.category).toBe("elm");
      assertDistinctOptionContents(q);
    });
  });
});

describe("generateSurahFactQuestions / generateSurahRevelationQuestions / generateSurahOrderQuestions / generateSurahCompareQuestions", () => {
  it("all generate well-formed din/hard questions grounded in surahIndex.json", () => {
    const generators = [
      generateSurahFactQuestions,
      generateSurahRevelationQuestions,
      generateSurahOrderQuestions,
      generateSurahCompareQuestions,
    ];
    generators.forEach((generate) => {
      const questions = generate(12);
      assertAllWellFormed(questions, 12);
      questions.forEach((q) => {
        expect(q.category).toBe("din");
        expect(q.difficulty).toBe("hard");
        assertDistinctOptionContents(q);
      });
    });
  });
});

describe("generateDivineNameQuestions", () => {
  it("generates well-formed din/hard questions from the 99-names dataset", () => {
    const questions = generateDivineNameQuestions(12, "az");
    assertAllWellFormed(questions, 12);
    questions.forEach((q) => {
      expect(q.category).toBe("din");
      expect(q.difficulty).toBe("hard");
    });
  });
});

describe("generatePlanetOrderQuestions / generatePlanetCompareQuestions", () => {
  it("generate well-formed elm questions from the 8-planet dataset", () => {
    [generatePlanetOrderQuestions, generatePlanetCompareQuestions].forEach((generate) => {
      const questions = generate(6, "az", "medium");
      assertAllWellFormed(questions, 6);
      questions.forEach((q) => {
        expect(q.category).toBe("elm");
        assertDistinctOptionContents(q);
      });
    });
  });
});

describe("generateVocabPictureQuestions / generateVocabWordQuestions", () => {
  it("generate well-formed xariciDil questions for a target language", () => {
    const picture = generateVocabPictureQuestions(10, "en", "easy");
    assertAllWellFormed(picture, 10);
    picture.forEach((q) => {
      expect(q.category).toBe("xariciDil");
      expect(q.targetLang).toBe("en");
      assertDistinctOptionContents(q);
    });

    const word = generateVocabWordQuestions(10, "ru", "az", "easy");
    assertAllWellFormed(word, 10);
    word.forEach((q) => {
      expect(q.category).toBe("xariciDil");
      expect(q.targetLang).toBe("ru");
      assertDistinctOptionContents(q);
    });
  });
});

describe("getQuizQuestions", () => {
  const categories = ["din", "riyaziyyat", "yaxsiEmeller", "elm", "xariciDil"] as const;

  it.each(categories)("returns a non-empty, well-formed, category-correct pool for %s", (category: (typeof categories)[number]) => {
    const questions = getQuizQuestions(category, "en", undefined, "az");
    expect(questions.length).toBeGreaterThan(0);
    questions.forEach((q) => {
      expect(q.category).toBe(category);
      assertWellFormedQuestion(q);
    });
  });

  it("never returns duplicate ids within a single pool, even mixing static and generated questions", () => {
    categories.forEach((category) => {
      const questions = getQuizQuestions(category, "en", undefined, "az");
      const ids = questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
