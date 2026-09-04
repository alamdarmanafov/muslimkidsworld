// supabase/functions/get-child-progress/index.ts
//
// Lets a child's device fetch its own progress without a Supabase
// auth session — the same problem redeem-family-code solves for
// binding, applied to reads. child_progress and child_daily_activity
// are RLS-locked to the parent's authenticated session (see
// 0004_rls_policies.sql, 0007_progress_tracking.sql), so a child
// device (which never signs in) has no way to read them directly.
// This function is the deliberate, narrow exception: given a device
// id, it resolves the family that device is bound to and which child
// is active on it (see _shared/resolveChild.ts — family_codes.
// active_child_id when a parent has set one via set-active-child,
// otherwise the family's oldest child) and returns that child's
// progress using the service role key.
//
// Request:
//   POST /functions/v1/get-child-progress
//   { "deviceId": "dev_abc123" }
//
// `dailyLimitMinutes` is the family's real, parent-set screen-time
// limit (families.daily_limit_minutes, 0019_screen_time.sql) — the
// child app used to have no way to read this at all, since it has no
// auth session and the setting used to just be an in-memory client
// constant that could never actually sync between a parent's device
// and a child's.
//
// `bonusQuestionDoneToday` mirrors today's row in `week` (see
// 0024_daily_bonus_question.sql) — pulled out separately so the child
// home screen doesn't have to re-derive "today" from the week array
// itself.
//
// Response:
//   200 { child: {...}, progress: {...}, week: [...], achievements: [...], dailyLimitMinutes: 60, bonusQuestionDoneToday: false }
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }                             — bad request body
//
// `achievements` is the list of achievement slugs
// (supabase/migrations/0002_content_tables.sql `achievements.slug`)
// this child has actually earned, per child_achievements — awarded by
// record-quiz-result, not decided here.

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { isResolveError, resolveDeviceChild } from "../_shared/resolveChild.ts";

type Body = {
  deviceId?: unknown;
};

function isValidDeviceId(deviceId: unknown): deviceId is string {
  return typeof deviceId === "string" && deviceId.length > 0 && deviceId.length <= 256;
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
  const deviceId = body.deviceId;

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
  const { childId } = resolved;

  const { data: child, error: childError } = await adminClient
    .from("children")
    .select("id, name, age, emoji, color")
    .eq("id", childId)
    .maybeSingle();

  if (childError) {
    return jsonResponse({ error: childError.message }, 500);
  }
  if (!child) {
    return jsonResponse({ error: "No child found for this family" }, 404);
  }

  const { data: progress, error: progressError } = await adminClient
    .from("child_progress")
    .select("*")
    .eq("child_id", child.id)
    .maybeSingle();

  if (progressError) {
    return jsonResponse({ error: progressError.message }, 500);
  }

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: week, error: weekError } = await adminClient
    .from("child_daily_activity")
    .select(
      "activity_date, questions_answered, xp_earned, quran_done, dua_done, story_done, game_done, minutes_spent, bonus_question_done",
    )
    .eq("child_id", child.id)
    .gte("activity_date", sevenDaysAgoStr)
    .order("activity_date", { ascending: true });

  if (weekError) {
    return jsonResponse({ error: weekError.message }, 500);
  }

  const bonusQuestionDoneToday =
    week?.find((d) => d.activity_date === todayStr)?.bonus_question_done ?? false;

  const { data: family, error: familyError } = await adminClient
    .from("families")
    .select("daily_limit_minutes")
    .eq("id", resolved.familyId)
    .maybeSingle();

  if (familyError) {
    return jsonResponse({ error: familyError.message }, 500);
  }

  const { data: earnedRows, error: earnedError } = await adminClient
    .from("child_achievements")
    .select("achievement:achievements(slug)")
    .eq("child_id", child.id);

  if (earnedError) {
    return jsonResponse({ error: earnedError.message }, 500);
  }

  const achievementSlugs = (earnedRows ?? [])
    .map((r) => (r.achievement as { slug: string } | null)?.slug)
    .filter((slug): slug is string => Boolean(slug));

  return jsonResponse({
    child,
    achievements: achievementSlugs,
    dailyLimitMinutes: family?.daily_limit_minutes ?? 60,
    bonusQuestionDoneToday,
    progress: progress ?? {
      child_id: child.id,
      level: 1,
      xp: 0,
      streak: 0,
      streak_freezes_available: 1,
      accuracy: 0,
      badges_count: 0,
      stars_count: 0,
      active_days_count: 0,
      total_questions_answered: 0,
      total_correct_answers: 0,
      last_activity_at: null,
    },
    week: week ?? [],
  });
});
