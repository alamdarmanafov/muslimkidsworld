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
import { toast } from "./toast";

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
  /** Free "skip a missed day" tokens — see 0025_streak_freeze.sql. */
  streak_freezes_available: number;
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
  quran_done: boolean;
  dua_done: boolean;
  story_done: boolean;
  game_done: boolean;
  minutes_spent: number;
  bonus_question_done: boolean;
};

export type ChildProgressResult = {
  child: ChildInfo;
  progress: ChildProgressStats;
  week: DailyActivity[];
  /** Slugs of achievements this child has actually earned (achievements.slug). */
  achievements: string[];
  /** The family's real, parent-set screen-time limit (families.daily_limit_minutes). */
  dailyLimitMinutes: number;
  /** The parent-chosen city for prayer-time calculation (families.prayer_city_id), or null if unset. */
  prayerCityId: string | null;
  /** Whether today's once-a-day bonus question (child/quiz.tsx's ?bonus=1) has already been answered. */
  bonusQuestionDoneToday: boolean;
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

async function readServerErrorMessage(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response } | null)?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (typeof body?.error === "string") return body.error;
    } catch {
      // fall through
    }
  }
  return null;
}

/**
 * Reports one finished quiz session's score. Doesn't block the reward
 * screen on failure, but does surface one via toast — this used to
 * swallow the edge function's own error responses entirely (only a
 * network-level exception would reach the catch block; `.invoke()`
 * resolving with a non-null `error` was never checked), so a session
 * could silently fail to record with nothing to debug from.
 */
export async function recordQuizResult(
  correct: number,
  total: number,
  xpEarned: number,
  category?: string,
  isBonus?: boolean,
): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    const { error } = await getSupabaseClient().functions.invoke("record-quiz-result", {
      body: { deviceId, correct, total, xpEarned, category, isBonus },
    });
    if (error) {
      const serverMessage = await readServerErrorMessage(error);
      const message = serverMessage ?? error.message ?? "record-quiz-result failed";
      if (__DEV__) console.warn("recordQuizResult failed", message);
      toast.error(message);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (__DEV__) console.warn("recordQuizResult failed", message);
    toast.error(message);
  }
}

/**
 * Marks one "Today's Journey" item as done for today (Quran, Dua,
 * Story, or Game — quiz is tracked separately via recordQuizResult).
 * Fails silently: a missed journey-tracking write shouldn't interrupt
 * a child reading a surah or a dua, unlike a quiz result losing its
 * reward.
 */
export async function markJourneyItem(item: "quran" | "dua" | "story" | "game"): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    const { error } = await getSupabaseClient().functions.invoke("mark-journey-item", {
      body: { deviceId, item },
    });
    if (error && __DEV__) {
      console.warn("markJourneyItem failed", error.message);
    }
  } catch (err) {
    if (__DEV__) {
      console.warn("markJourneyItem failed", err instanceof Error ? err.message : String(err));
    }
  }
}

/**
 * Records that a child opened a specific story (by stories.slug) —
 * separate from markJourneyItem("story"), which only flips today's
 * done flag and has no memory of *which* story. This is what lets
 * book-lover/storyteller ever actually be earned. Fails silently, same
 * reasoning as markJourneyItem.
 */
export async function markStoryRead(storySlug: string): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    const { error } = await getSupabaseClient().functions.invoke("mark-story-read", {
      body: { deviceId, storySlug },
    });
    if (error && __DEV__) {
      console.warn("markStoryRead failed", error.message);
    }
  } catch (err) {
    if (__DEV__) {
      console.warn("markStoryRead failed", err instanceof Error ? err.message : String(err));
    }
  }
}
