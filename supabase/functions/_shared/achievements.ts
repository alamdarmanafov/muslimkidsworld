// supabase/functions/_shared/achievements.ts
//
// Evaluates achievements.criteria (0008_achievement_criteria.sql)
// against a child's up-to-date stats and awards whichever newly
// qualify. Originally lived only in record-quiz-result, which is why
// "correct_answers"/"streak"/"questions_answered" were the only types
// it could ever satisfy — book-lover/storyteller (stories_read) and
// mosque-visitor (world_visited) were seeded but never awardable since
// nothing tracked reads/visits. Extracted here, with those two types
// now handled, so mark-story-read and mark-world-visit (new) can
// trigger the exact same evaluation record-quiz-result does, instead
// of each having its own copy that drifts.

// deno-lint-ignore no-explicit-any
type AdminClient = any;

// achievements.label is plain English (0005_seed_content.sql) — the
// app itself renders localized names by slug (see
// mobile/src/i18n/locales/*.json "achievements"). Mirrored here in
// Azerbaijani, the app's primary parent-facing language, so push
// notifications read naturally rather than switching to English.
export const ACHIEVEMENT_LABELS_AZ: Record<string, string> = {
  "first-star": "İlk Ulduz",
  "book-lover": "Kitabsevər",
  "mosque-visitor": "Məscid Ziyarətçisi",
  "week-streak": "7 Günlük Seriya",
  "quiz-master": "Test Ustası",
  storyteller: "Hekayəçi",
};

type AchievementCriteria =
  | { type: "correct_answers"; min: number }
  | { type: "streak"; min: number }
  | { type: "questions_answered"; min: number }
  | { type: "stories_read"; min: number }
  | { type: "world_visited"; world: string }
  | { type: string; [key: string]: unknown };

export type QuizStats = {
  totalCorrect: number;
  totalQuestions: number;
  streak: number;
};

type FullStats = QuizStats & {
  storiesRead: number;
  visitedWorldSlugs: string[];
};

function criteriaMet(criteria: AchievementCriteria, stats: FullStats): boolean {
  switch (criteria.type) {
    case "correct_answers":
      return stats.totalCorrect >= criteria.min;
    case "streak":
      return stats.streak >= criteria.min;
    case "questions_answered":
      return stats.totalQuestions >= criteria.min;
    case "stories_read":
      return stats.storiesRead >= criteria.min;
    case "world_visited":
      return stats.visitedWorldSlugs.includes(criteria.world as string);
    default:
      return false;
  }
}

// Awards every achievement whose criteria the child's current totals
// now satisfy and they don't already have, and returns their
// up-to-date total earned-achievement count (for
// child_progress.badges_count) plus the slugs newly earned this call,
// so the caller can notify the parent.
export async function awardAchievements(
  adminClient: AdminClient,
  childId: string,
  quizStats: QuizStats,
): Promise<{ count: number; newlyEarnedSlugs: string[] }> {
  const [{ data: allAchievements, error: achievementsError }, { data: earnedRows, error: earnedError }, { count: storiesRead, error: storiesError }, { data: worldRows, error: worldError }] =
    await Promise.all([
      adminClient.from("achievements").select("id, slug, criteria").not("criteria", "is", null),
      adminClient.from("child_achievements").select("achievement_id").eq("child_id", childId),
      adminClient
        .from("child_story_reads")
        .select("story_slug", { count: "exact", head: true })
        .eq("child_id", childId),
      adminClient.from("child_world_visits").select("world_slug").eq("child_id", childId),
    ]);
  if (achievementsError) throw achievementsError;
  if (earnedError) throw earnedError;
  if (storiesError) throw storiesError;
  if (worldError) throw worldError;

  const stats: FullStats = {
    ...quizStats,
    storiesRead: storiesRead ?? 0,
    visitedWorldSlugs: (worldRows ?? []).map((r: { world_slug: string }) => r.world_slug),
  };

  const earnedIds = new Set((earnedRows ?? []).map((r: { achievement_id: string }) => r.achievement_id));
  const newlyEarned = (allAchievements ?? [])
    .filter((a: { id: string }) => !earnedIds.has(a.id))
    .filter((a: { criteria: AchievementCriteria }) => criteriaMet(a.criteria, stats));

  if (newlyEarned.length > 0) {
    const { error: insertError } = await adminClient.from("child_achievements").insert(
      newlyEarned.map((a: { id: string }) => ({ child_id: childId, achievement_id: a.id })),
    );
    if (insertError) throw insertError;
  }

  return {
    count: earnedIds.size + newlyEarned.length,
    newlyEarnedSlugs: newlyEarned.map((a: { slug: string }) => a.slug),
  };
}

export function achievementNotification(slugs: string[]): { title: string; body: string } | null {
  if (slugs.length === 0) return null;
  const labels = slugs.map((slug) => ACHIEVEMENT_LABELS_AZ[slug] ?? slug);
  const body =
    labels.length === 1
      ? `Uşağınız "${labels[0]}" nailiyyətini qazandı!`
      : `Uşağınız ${labels.length} yeni nailiyyət qazandı!`;
  return { title: "Yeni nailiyyət! 🏆", body };
}
