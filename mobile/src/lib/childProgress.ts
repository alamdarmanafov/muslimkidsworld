// mobile/src/lib/childProgress.ts
//
// Client-side calls into the get-child-progress / record-quiz-result
// edge functions (see their header comments in
// supabase/functions/<name>/index.ts for why a child device — no
// Supabase auth session — has to go through a service-role function
// rather than querying child_progress / child_daily_activity
// directly). Used by:
//   - app/child/(tabs)/progress.tsx and rewards.tsx, to fetch real
//     stats instead of the static mock.ts activeChild
//   - app/child/quiz.tsx, to report a finished session's score
//
// Every function here returns null (fetch) or silently no-ops
// (record) on any failure — a network error, the device not yet
// being bound to a family, or the backend not being deployed yet —
// so a screen can fall back to a friendly empty state instead of
// crashing. Callers should treat null as "no data available", not
// distinguish the specific cause.

import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

export type ChildInfo = {
  id: string;
  name: string;
  age: number | null;
  emoji: string;
  color: string;
};

export type ChildProgressStats = {
  child_id: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  badges_count: number;
  stars_count: number;
  active_days_count: number;
  total_questions_answered: number;
  total_correct_answers: number;
  last_activity_at: string | null;
};

export type DailyActivity = {
  activity_date: string;
  questions_answered: number;
  xp_earned: number;
};

export type ChildProgressResult = {
  child: ChildInfo;
  progress: ChildProgressStats;
  week: DailyActivity[];
  /** Slugs of achievements this child has actually earned (achievements.slug). */
  achievements: string[];
};

/**
 * Fetches the signed-in device's child and their current progress.
 * Returns null if the device isn't bound to a family yet, the backend
 * isn't reachable, or EXPO_PUBLIC_SUPABASE_* env vars aren't set —
 * callers should render an empty/loading state, not an error screen,
 * since this is expected before onboarding completes.
 */
export async function fetchChildProgress(): Promise<ChildProgressResult | null> {
  try {
    const deviceId = await getDeviceId();
    const { data, error } = await getSupabaseClient().functions.invoke("get-child-progress", {
      body: { deviceId },
    });
    if (error || !data) return null;
    return data as ChildProgressResult;
  } catch {
    return null;
  }
}

/**
 * Reports one finished quiz session's score. Fire-and-forget from the
 * caller's point of view — failures are swallowed (logged in dev)
 * rather than surfaced, since a missed progress update shouldn't
 * block a child from seeing their reward screen.
 */
export async function recordQuizResult(
  correct: number,
  total: number,
  xpEarned: number,
): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    await getSupabaseClient().functions.invoke("record-quiz-result", {
      body: { deviceId, correct, total, xpEarned },
    });
  } catch (err) {
    if (__DEV__) {
      console.warn("recordQuizResult failed", err);
    }
  }
}
