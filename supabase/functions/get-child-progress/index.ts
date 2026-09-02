// supabase/functions/get-child-progress/index.ts
//
// Lets a child's device fetch its own progress without a Supabase
// auth session — the same problem redeem-family-code solves for
// binding, applied to reads. child_progress and child_daily_activity
// are RLS-locked to the parent's authenticated session (see
// 0004_rls_policies.sql, 0007_progress_tracking.sql), so a child
// device (which never signs in) has no way to read them directly.
// This function is the deliberate, narrow exception: given a device
// id, it resolves the family that device is bound to
// (family_codes.bound_device_id, set once by redeem-family-code) and
// returns that family's first child's progress using the service
// role key.
//
// Today's UI (mobile/app/child/(tabs)/progress.tsx, rewards.tsx)
// assumes a single active child per device, matching the mock
// `activeChild` it replaces — a family with more than one child
// always gets its oldest (first-created) child here. Multi-child
// device selection is a follow-up, not something this function
// decides on its own.
//
// Request:
//   POST /functions/v1/get-child-progress
//   { "deviceId": "dev_abc123" }
//
// Response:
//   200 { child: {...}, progress: {...}, week: [...] }
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }                             — bad request body

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

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
    .select("id, name, age, emoji, color")
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

  const { data: progress, error: progressError } = await adminClient
    .from("child_progress")
    .select("*")
    .eq("child_id", child.id)
    .maybeSingle();

  if (progressError) {
    return jsonResponse({ error: progressError.message }, 500);
  }

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: week, error: weekError } = await adminClient
    .from("child_daily_activity")
    .select("activity_date, questions_answered, xp_earned")
    .eq("child_id", child.id)
    .gte("activity_date", sevenDaysAgoStr)
    .order("activity_date", { ascending: true });

  if (weekError) {
    return jsonResponse({ error: weekError.message }, 500);
  }

  return jsonResponse({
    child,
    progress: progress ?? {
      child_id: child.id,
      level: 1,
      xp: 0,
      streak: 0,
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
