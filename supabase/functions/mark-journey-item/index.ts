// supabase/functions/mark-journey-item/index.ts
//
// Marks one "Today's Journey" item (Quran, Dua, Story, or Game) as
// done for today, on the same device-bound-child resolution pattern
// as record-quiz-result / get-child-progress. Called once when a
// child opens that item's screen (app/child/quran/[id].tsx,
// app/child/dua.tsx, app/child/stories/[id].tsx, the three
// app/child/games/*.tsx screens) — opening counts as "done" here,
// same generous interpretation the Quran/Dua/Story screens already
// have no separate "finished reading" gesture to hang a stricter
// definition on.
//
// Reads the existing row first (like record-quiz-result does for
// child_daily_activity) so this never clobbers today's
// questions_answered/xp_earned or the other three journey flags —
// only the one item passed in changes.
//
// Request:
//   POST /functions/v1/mark-journey-item
//   { "deviceId": "dev_abc123", "item": "quran" }
//
// Response:
//   200 { ok: true }
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

const VALID_ITEMS = ["quran", "dua", "story", "game"] as const;
type JourneyItem = (typeof VALID_ITEMS)[number];

type Body = { deviceId?: unknown; item?: unknown };

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
}
function isValidItem(v: unknown): v is JourneyItem {
  return typeof v === "string" && (VALID_ITEMS as readonly string[]).includes(v);
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
  if (!isValidItem(body.item)) {
    return jsonResponse({ error: "item must be one of quran, dua, story, game" }, 400);
  }
  const deviceId = body.deviceId;
  const item = body.item;

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
    .is("revoked_at", null)
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

  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: existing, error: existingError } = await adminClient
    .from("child_daily_activity")
    .select("questions_answered, xp_earned, quran_done, dua_done, story_done, game_done")
    .eq("child_id", child.id)
    .eq("activity_date", todayStr)
    .maybeSingle();
  if (existingError) {
    return jsonResponse({ error: existingError.message }, 500);
  }

  const { error: upsertError } = await adminClient.from("child_daily_activity").upsert(
    {
      child_id: child.id,
      activity_date: todayStr,
      questions_answered: existing?.questions_answered ?? 0,
      xp_earned: existing?.xp_earned ?? 0,
      quran_done: existing?.quran_done ?? false,
      dua_done: existing?.dua_done ?? false,
      story_done: existing?.story_done ?? false,
      game_done: existing?.game_done ?? false,
      [`${item}_done`]: true,
    },
    { onConflict: "child_id,activity_date" },
  );
  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  return jsonResponse({ ok: true });
});
