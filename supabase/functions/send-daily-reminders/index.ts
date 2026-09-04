// supabase/functions/send-daily-reminders/index.ts
//
// Meant to run once a day via a Supabase Cron job (pg_cron + pg_net
// calling this function's URL — see supabase/README.md for the
// one-time SQL to schedule it, and to pick what time it fires).
//
// "Hasn't done anything today" is defined by the only real per-day
// signal this backend has: child_daily_activity.questions_answered
// for today's date (written by record-quiz-result) — Quran/Dua/Story
// completion isn't tracked server-side yet (see daily_journeys, still
// a stub), so this can't reason about those, only quiz activity.
//
// Skips a child whose family is currently inside its configured quiet
// hours (0026_quiet_hours.sql) — this cron only runs once, at
// whatever fixed hour it's scheduled for, so "skip" is the only lever
// available here (there's no per-family reschedule).
//
// Not user-authenticated — protected by requiring the service role
// key itself as the bearer token, since only the cron job (which
// holds it as a secret, never shipped to the app) should call this.
//
// Request:
//   POST /functions/v1/send-daily-reminders
//   Authorization: Bearer <service role key>
//
// Response:
//   200 { sent: number }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { sendExpoPush } from "../_shared/push.ts";
import { isWithinQuietHours } from "../_shared/quietHours.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${serviceRoleKey}`) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: children, error: childrenError } = await adminClient
    .from("children")
    .select("id, family_id");
  if (childrenError) {
    return jsonResponse({ error: childrenError.message }, 500);
  }

  const { data: activeToday, error: activeError } = await adminClient
    .from("child_daily_activity")
    .select("child_id")
    .eq("activity_date", todayStr)
    .gt("questions_answered", 0);
  if (activeError) {
    return jsonResponse({ error: activeError.message }, 500);
  }

  const activeIds = new Set((activeToday ?? []).map((r) => r.child_id as string));
  const inactiveChildren = (children ?? []).filter(
    (c: { id: string }) => !activeIds.has(c.id),
  );

  if (inactiveChildren.length === 0) {
    return jsonResponse({ sent: 0 });
  }

  const familyIds = [...new Set(inactiveChildren.map((c: { family_id: string }) => c.family_id))];
  const { data: families, error: familiesError } = await adminClient
    .from("families")
    .select("id, quiet_hours_start, quiet_hours_end, timezone_offset_minutes")
    .in("id", familyIds);
  if (familiesError) {
    return jsonResponse({ error: familiesError.message }, 500);
  }
  const familyById = new Map((families ?? []).map((f: { id: string }) => [f.id, f]));

  const inactiveChildIds = inactiveChildren
    .filter((c: { family_id: string }) => {
      const family = familyById.get(c.family_id);
      return !family || !isWithinQuietHours(
        family.quiet_hours_start,
        family.quiet_hours_end,
        family.timezone_offset_minutes,
      );
    })
    .map((c: { id: string }) => c.id);

  if (inactiveChildIds.length === 0) {
    return jsonResponse({ sent: 0 });
  }

  const { data: tokenRows, error: tokenError } = await adminClient
    .from("push_tokens")
    .select("expo_push_token")
    .eq("owner_type", "child")
    .in("owner_id", inactiveChildIds);
  if (tokenError) {
    return jsonResponse({ error: tokenError.message }, 500);
  }

  const tokens = (tokenRows ?? []).map((r) => r.expo_push_token as string);
  await sendExpoPush(
    tokens,
    "Bugünkü səyahətini unutma! 🌙",
    "Hələ bugünkü tapşırığını bitirməmisən — indi davam et!",
    { type: "daily_reminder" },
  );

  return jsonResponse({ sent: tokens.length });
});
