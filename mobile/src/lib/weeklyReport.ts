// mobile/src/lib/weeklyReport.ts
//
// Backs app/parent/(tabs)/progress.tsx — until now a bare
// PlaceholderScreen even though every table it needs already exists
// and is already RLS-scoped to the signed-in parent's own family
// (children, child_progress, child_daily_activity,
// child_category_stats, child_achievements — see
// supabase/migrations/0004_rls_policies.sql, 0007_progress_tracking.sql,
// 0017_category_stats.sql), same as mobile/src/lib/children.ts. No
// edge function needed, direct queries only.

import { getSupabaseClient } from "./supabase";

export type WeeklyDay = {
  activityDate: string;
  questionsAnswered: number;
  minutesSpent: number;
};

export type CategoryStat = {
  category: string;
  questionsAnswered: number;
  accuracy: number;
};

export type ChildWeeklyReport = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  level: number;
  accuracy: number;
  streak: number;
  week: WeeklyDay[];
  categoryStats: CategoryStat[];
  badgesEarnedThisWeek: number;
};

/**
 * A weekly report for every child in the signed-in parent's family.
 * Returns [] on failure or if there are no children yet — callers
 * should render an empty state, not an error screen.
 */
export async function fetchWeeklyReport(): Promise<ChildWeeklyReport[]> {
  try {
    const supabase = getSupabaseClient();

    const { data: children, error: childrenError } = await supabase
      .from("children")
      .select("id, name, emoji, color")
      .order("created_at", { ascending: true });
    if (childrenError || !children || children.length === 0) return [];

    const childIds = children.map((c) => c.id);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

    const [{ data: progressRows }, { data: dayRows }, { data: categoryRows }, { data: badgeRows }] =
      await Promise.all([
        supabase
          .from("child_progress")
          .select("child_id, level, accuracy, streak")
          .in("child_id", childIds),
        supabase
          .from("child_daily_activity")
          .select("child_id, activity_date, questions_answered, minutes_spent")
          .in("child_id", childIds)
          .gte("activity_date", sevenDaysAgoStr),
        supabase
          .from("child_category_stats")
          .select("child_id, category, questions_answered, correct_answers")
          .in("child_id", childIds),
        supabase
          .from("child_achievements")
          .select("child_id")
          .in("child_id", childIds)
          .gte("earned_at", sevenDaysAgo.toISOString()),
      ]);

    const progressByChild = new Map((progressRows ?? []).map((p) => [p.child_id, p]));

    const daysByChild = new Map<string, WeeklyDay[]>();
    for (const row of dayRows ?? []) {
      const list = daysByChild.get(row.child_id) ?? [];
      list.push({
        activityDate: row.activity_date,
        questionsAnswered: row.questions_answered,
        minutesSpent: row.minutes_spent,
      });
      daysByChild.set(row.child_id, list);
    }

    const categoriesByChild = new Map<string, CategoryStat[]>();
    for (const row of categoryRows ?? []) {
      const list = categoriesByChild.get(row.child_id) ?? [];
      list.push({
        category: row.category,
        questionsAnswered: row.questions_answered,
        accuracy:
          row.questions_answered > 0
            ? Math.round((row.correct_answers / row.questions_answered) * 100)
            : 0,
      });
      categoriesByChild.set(row.child_id, list);
    }

    const badgesByChild = new Map<string, number>();
    for (const row of badgeRows ?? []) {
      badgesByChild.set(row.child_id, (badgesByChild.get(row.child_id) ?? 0) + 1);
    }

    return children.map((child) => {
      const progress = progressByChild.get(child.id);
      return {
        id: child.id,
        name: child.name,
        emoji: child.emoji,
        color: child.color,
        level: progress?.level ?? 1,
        accuracy: progress?.accuracy ?? 0,
        streak: progress?.streak ?? 0,
        week: daysByChild.get(child.id) ?? [],
        categoryStats: categoriesByChild.get(child.id) ?? [],
        badgesEarnedThisWeek: badgesByChild.get(child.id) ?? 0,
      };
    });
  } catch {
    return [];
  }
}
