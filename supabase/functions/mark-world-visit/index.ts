// supabase/functions/mark-world-visit/index.ts
//
// Called once when a child opens a "Muslim World" site
// (app/child/world/[id].tsx, mirroring mark-story-read for stories).
// Records one row per (child, site) — a re-visit is a harmless no-op —
// then re-evaluates achievements, since mosque-visitor
// ({"type":"world_visited","world":"mosque"}, 0008_achievement_criteria.sql)
// can now actually be earned once the "mosque" site (Masjid al-Haram)
// has been visited.
//
// worldSlug is checked against the same fixed list of sites the app
// ships (mobile/src/data/mock.ts `worldSites`) rather than a content
// table — see that file's comment for why this feature's content
// lives in mock.ts + i18n like Stories/Dua, not the database.
//
// Request:
//   POST /functions/v1/mark-world-visit
//   { "deviceId": "dev_abc123", "worldSlug": "mosque" }
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

type Body = { deviceId?: unknown; worldSlug?: unknown };

// Mirrors the `id` field of every entry in mobile/src/data/mock.ts's
// `worldSites` — keep these two lists in sync if a site is added.
const VALID_WORLD_SLUGS = new Set(["mosque", "medina", "al-aqsa", "istanbul", "andalusia"]);

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
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
  if (typeof body.worldSlug !== "string" || !VALID_WORLD_SLUGS.has(body.worldSlug)) {
    return jsonResponse({ error: "worldSlug is invalid" }, 400);
  }
  const deviceId = body.deviceId;
  const worldSlug = body.worldSlug;

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
    .from("child_world_visits")
    .upsert({ child_id: childId, world_slug: worldSlug }, { onConflict: "child_id,world_slug", ignoreDuplicates: true });
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
    await adminClient
      .from("child_progress")
      .update({ badges_count: awarded.count })
      .eq("child_id", childId);
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
