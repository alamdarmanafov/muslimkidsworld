// supabase/functions/record-quiz-result/index.ts
//
// Called once per finished quiz session (mobile/app/child/quiz.tsx,
// when the session reaches its reward screen) to fold that session's
// score into the child's lifetime child_progress row and today's
// child_daily_activity row. Uses the same device-id resolution as
// get-child-progress (_shared/resolveChild.ts) — see that function's
// header comment for why a service-role function is the only way a
// child device (no auth session) can write here at all.
//
// What it computes, all server-side so a compromised client can't
// forge XP or accuracy:
//   - xp:        lifetime total + this session's xpEarned
//   - level:     floor(xp / 100) + 1 — 5 correct answers (20xp each,
//                see the `xp` field on every question in
//                mobile/src/data/mock.ts) per level
//   - accuracy:  round(lifetime correct / lifetime answered * 100)
//   - streak:    +1 if the child's last activity was yesterday (UTC
//               date), unchanged if already recorded today, reset to
//               1 otherwise (including first-ever session)
//   - active_days_count: +1 only the first time a given UTC date is
//                recorded, mirrored into child_daily_activity's
//                per-day upsert so the two never disagree
//   - badges_count: recomputed from child_achievements after awarding
//                any newly-met achievements (see awardAchievements
//                below) — always the real row count, never guessed
//
// `category` (optional — one of QuizCategory in mobile/src/data/mock.ts)
// also folds into child_category_stats, so the parent's Weekly Report
// (app/parent/(tabs)/progress.tsx) can show a real strongest/weakest
// subject instead of only a lifetime accuracy number. Omitted or
// unrecognized categories are skipped, not errored, so this stays
// backward compatible with any client that doesn't send one yet.
//
// Request:
//   POST /functions/v1/record-quiz-result
//   { "deviceId": "dev_abc123", "correct": 4, "total": 5, "xpEarned": 80, "category": "din" }
//
// Response:
//   200 { progress: {...} }                          — updated child_progress row
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }                              — bad request body

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { achievementNotification, awardAchievements } from "../_shared/achievements.ts";
import { notifyFamilyParents } from "../_shared/notifyParents.ts";
import { isResolveError, resolveDeviceChild } from "../_shared/resolveChild.ts";

type Body = {
  deviceId?: unknown;
  correct?: unknown;
  total?: unknown;
  xpEarned?: unknown;
  category?: unknown;
};

const VALID_CATEGORIES = new Set(["din", "riyaziyyat", "yaxsiEmeller", "elm", "xariciDil"]);

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
}
function isNonNegInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!isValidDeviceId(body.deviceId)) {
    return jsonResponse({ error: "deviceId is required" }, 400);
  }
  if (!isNonNegInt(body.correct)) {
    return jsonResponse({ error: "correct must be a non-negative integer" }, 400);
  }
  if (!isNonNegInt(body.total) || body.total < body.correct) {
    return jsonResponse({ error: "total must be a non-negative integer >= correct" }, 400);
  }
  if (!isNonNegInt(body.xpEarned)) {
    return jsonResponse({ error: "xpEarned must be a non-negative integer" }, 400);
  }

  const deviceId = body.deviceId;
  const correct = body.correct;
  const total = body.total;
  const xpEarned = body.xpEarned;
  const category = typeof body.category === "string" && VALID_CATEGORIES.has(body.category)
    ? body.category
    : null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const resolved = await resolveDeviceChild(adminClient, deviceId);
  if (isResolveError(resolved)) {
    return jsonResponse({ error: resolved.error }, resolved.status);
  }
  const { familyId, childId } = resolved;

  const { data: existing, error: existingError } = await adminClient
    .from("child_progress")
    .select("*")
    .eq("child_id", childId)
    .maybeSingle();

  if (existingError) {
    return jsonResponse({ error: existingError.message }, 500);
  }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const prevTotalQuestions = existing?.total_questions_answered ?? 0;
  const prevTotalCorrect = existing?.total_correct_answers ?? 0;
  const prevXp = existing?.xp ?? 0;
  const prevStreak = existing?.streak ?? 0;
  const prevActiveDays = existing?.active_days_count ?? 0;
  const lastActivityDateStr = existing?.last_activity_at
    ? new Date(existing.last_activity_at).toISOString().slice(0, 10)
    : null;

  const newTotalQuestions = prevTotalQuestions + total;
  const newTotalCorrect = prevTotalCorrect + correct;
  const newXp = prevXp + xpEarned;
  const newLevel = Math.floor(newXp / 100) + 1;
  const newAccuracy =
    newTotalQuestions > 0 ? Math.round((newTotalCorrect / newTotalQuestions) * 100) : 0;

  let newStreak: number;
  let isNewActiveDay: boolean;
  if (lastActivityDateStr === todayStr) {
    newStreak = prevStreak || 1;
    isNewActiveDay = false;
  } else if (lastActivityDateStr === yesterdayStr) {
    newStreak = prevStreak + 1;
    isNewActiveDay = true;
  } else {
    newStreak = 1;
    isNewActiveDay = true;
  }
  const newActiveDaysCount = prevActiveDays + (isNewActiveDay ? 1 : 0);

  let newBadgesCount = existing?.badges_count ?? 0;
  let newlyEarnedSlugs: string[] = [];
  try {
    const awarded = await awardAchievements(adminClient, childId, {
      totalCorrect: newTotalCorrect,
      totalQuestions: newTotalQuestions,
      streak: newStreak,
    });
    newBadgesCount = awarded.count;
    newlyEarnedSlugs = awarded.newlyEarnedSlugs;
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }

  const { data: updatedProgress, error: upsertError } = await adminClient
    .from("child_progress")
    .upsert(
      {
        child_id: childId,
        level: newLevel,
        xp: newXp,
        streak: newStreak,
        accuracy: newAccuracy,
        badges_count: newBadgesCount,
        stars_count: existing?.stars_count ?? 0,
        active_days_count: newActiveDaysCount,
        total_questions_answered: newTotalQuestions,
        total_correct_answers: newTotalCorrect,
        last_activity_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      { onConflict: "child_id" },
    )
    .select()
    .maybeSingle();

  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  const { data: existingDay, error: existingDayError } = await adminClient
    .from("child_daily_activity")
    .select("questions_answered, xp_earned")
    .eq("child_id", childId)
    .eq("activity_date", todayStr)
    .maybeSingle();

  if (existingDayError) {
    return jsonResponse({ error: existingDayError.message }, 500);
  }

  const { error: dayError } = await adminClient.from("child_daily_activity").upsert(
    {
      child_id: childId,
      activity_date: todayStr,
      questions_answered: (existingDay?.questions_answered ?? 0) + total,
      xp_earned: (existingDay?.xp_earned ?? 0) + xpEarned,
    },
    { onConflict: "child_id,activity_date" },
  );

  if (dayError) {
    return jsonResponse({ error: dayError.message }, 500);
  }

  if (category) {
    const { data: existingCategory, error: existingCategoryError } = await adminClient
      .from("child_category_stats")
      .select("questions_answered, correct_answers")
      .eq("child_id", childId)
      .eq("category", category)
      .maybeSingle();

    if (existingCategoryError) {
      return jsonResponse({ error: existingCategoryError.message }, 500);
    }

    const { error: categoryError } = await adminClient.from("child_category_stats").upsert(
      {
        child_id: childId,
        category,
        questions_answered: (existingCategory?.questions_answered ?? 0) + total,
        correct_answers: (existingCategory?.correct_answers ?? 0) + correct,
      },
      { onConflict: "child_id,category" },
    );

    if (categoryError) {
      return jsonResponse({ error: categoryError.message }, 500);
    }
  }

  const notification = achievementNotification(newlyEarnedSlugs);
  if (notification) {
    await notifyFamilyParents(adminClient, familyId, notification.title, notification.body, {
      type: "achievement",
    });
  }

  return jsonResponse({ progress: updatedProgress });
});
