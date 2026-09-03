// supabase/functions/mark-story-read/index.ts
//
// Called once when a child opens a story (app/child/stories/[id].tsx),
// alongside the existing markJourneyItem("story") call — that one
// only flips today's child_daily_activity.story_done boolean (used by
// the home screen's Today's Journey checklist), it has no memory of
// *which* story, so it could never answer "has this child read 3
// distinct stories" for the storyteller achievement. This records one
// row per (child, story) — a re-read is a harmless no-op (ON CONFLICT
// DO NOTHING keeps the original first_read_at) — then re-evaluates
// achievements the same way record-quiz-result does, since book-lover
// / storyteller can now actually be earned.
//
// Request:
//   POST /functions/v1/mark-story-read
//   { "deviceId": "dev_abc123", "storySlug": "yunus" }
//
// Response:
//   200 { ok: true }
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { achievementNotification, awardAchievements } from "../_shared/achievements.ts";
import { notifyFamilyParents } from "../_shared/notifyParents.ts";
import { isResolveError, resolveDeviceChild } from "../_shared/resolveChild.ts";

type Body = { deviceId?: unknown; storySlug?: unknown };

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
}
function isValidSlug(v: unknown): v is string {
  return typeof v === "string" && /^[a-z0-9-]{1,64}$/.test(v);
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
  if (!isValidSlug(body.storySlug)) {
    return jsonResponse({ error: "storySlug is required" }, 400);
  }
  const deviceId = body.deviceId;
  const storySlug = body.storySlug;

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

  const { error: insertError } = await adminClient
    .from("child_story_reads")
    .upsert({ child_id: childId, story_slug: storySlug }, { onConflict: "child_id,story_slug", ignoreDuplicates: true });
  if (insertError) {
    return jsonResponse({ error: insertError.message }, 500);
  }

  const { data: progress, error: progressError } = await adminClient
    .from("child_progress")
    .select("total_correct_answers, total_questions_answered, streak")
    .eq("child_id", childId)
    .maybeSingle();
  if (progressError) {
    return jsonResponse({ error: progressError.message }, 500);
  }

  try {
    const awarded = await awardAchievements(adminClient, childId, {
      totalCorrect: progress?.total_correct_answers ?? 0,
      totalQuestions: progress?.total_questions_answered ?? 0,
      streak: progress?.streak ?? 0,
    });
    if (awarded.count !== undefined) {
      await adminClient
        .from("child_progress")
        .update({ badges_count: awarded.count })
        .eq("child_id", childId);
    }
    const notification = achievementNotification(awarded.newlyEarnedSlugs);
    if (notification) {
      await notifyFamilyParents(adminClient, familyId, notification.title, notification.body, {
        type: "achievement",
      });
    }
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }

  return jsonResponse({ ok: true });
});
