// supabase/functions/record-quiz-result/index.ts
//
// Called once per finished quiz session (mobile/app/child/quiz.tsx,
// when the session reaches its reward screen) to fold that session's
// score into the child's lifetime child_progress row and today's
// child_daily_activity row. Uses the same device-id → family_codes →
// children resolution as get-child-progress — see that function's
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
//
// Request:
//   POST /functions/v1/record-quiz-result
//   { "deviceId": "dev_abc123", "correct": 4, "total": 5, "xpEarned": 80 }
//
// Response:
//   200 { progress: {...} }                          — updated child_progress row
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }                              — bad request body

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type Body = {
  deviceId?: unknown;
  correct?: unknown;
  total?: unknown;
  xpEarned?: unknown;
};

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: boundCode, error: codeError } = await adminClient
    .from("family_codes")
    .select("family_id")
    .eq("bound_device_id", deviceId)
    .order("bound_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (codeError) {
    return jsonResponse({ error: codeError.message }, 500);
  }
  if (!boundCode) {
    return jsonResponse({ error: "Device is not bound to a family" }, 404);
  }

  const { data: child, error: childError } = await adminClient
    .from("children")
    .select("id")
    .eq("family_id", boundCode.family_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (childError) {
    return jsonResponse({ error: childError.message }, 500);
  }
  if (!child) {
    return jsonResponse({ error: "No child found for this family" }, 404);
  }

  const { data: existing, error: existingError } = await adminClient
    .from("child_progress")
    .select("*")
    .eq("child_id", child.id)
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

  const { data: updatedProgress, error: upsertError } = await adminClient
    .from("child_progress")
    .upsert(
      {
        child_id: child.id,
        level: newLevel,
        xp: newXp,
        streak: newStreak,
        accuracy: newAccuracy,
        badges_count: existing?.badges_count ?? 0,
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
    .eq("child_id", child.id)
    .eq("activity_date", todayStr)
    .maybeSingle();

  if (existingDayError) {
    return jsonResponse({ error: existingDayError.message }, 500);
  }

  const { error: dayError } = await adminClient.from("child_daily_activity").upsert(
    {
      child_id: child.id,
      activity_date: todayStr,
      questions_answered: (existingDay?.questions_answered ?? 0) + total,
      xp_earned: (existingDay?.xp_earned ?? 0) + xpEarned,
    },
    { onConflict: "child_id,activity_date" },
  );

  if (dayError) {
    return jsonResponse({ error: dayError.message }, 500);
  }

  return jsonResponse({ progress: updatedProgress });
});
