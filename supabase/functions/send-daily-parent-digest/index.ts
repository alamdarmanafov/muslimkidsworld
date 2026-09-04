// supabase/functions/send-daily-parent-digest/index.ts
//
// Meant to run once a day via a Supabase Cron job (same pg_cron +
// pg_net setup as send-daily-reminders — see that function's header
// comment and supabase/README.md's "Push notifications" section for
// the exact SQL, just with this function's name/URL instead), a bit
// later than send-daily-reminders so it reports the day's actual
// activity rather than nudging children who haven't started yet.
//
// Unlike send-daily-reminders (nudges an INACTIVE child), this sends
// one push per child who WAS active today, straight to their
// parents — "what your child did today", not just a Weekly Report a
// parent has to remember to open. Skipped entirely for a child with
// no activity today (child_daily_activity.questions_answered = 0 or
// no row at all), so a quiet day doesn't produce a notification.
//
// notifyFamilyParents already skips a family currently inside its
// configured quiet hours (0026_quiet_hours.sql), so this needs no
// quiet-hours logic of its own.
//
// Not user-authenticated — protected by requiring the service role
// key itself as the bearer token, same as send-daily-reminders.
//
// Request:
//   POST /functions/v1/send-daily-parent-digest
//   Authorization: Bearer <service role key>
//
// Response:
//   200 { sent: number }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { notifyFamilyParents } from "../_shared/notifyParents.ts";

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

  const { data: activeToday, error: activeError } = await adminClient
    .from("child_daily_activity")
    .select("child_id, questions_answered, xp_earned")
    .eq("activity_date", todayStr)
    .gt("questions_answered", 0);
  if (activeError) {
    return jsonResponse({ error: activeError.message }, 500);
  }
  if (!activeToday || activeToday.length === 0) {
    return jsonResponse({ sent: 0 });
  }

  const { data: children, error: childrenError } = await adminClient
    .from("children")
    .select("id, name, family_id")
    .in("id", activeToday.map((r) => r.child_id));
  if (childrenError) {
    return jsonResponse({ error: childrenError.message }, 500);
  }
  const childById = new Map((children ?? []).map((c) => [c.id, c]));

  let sent = 0;
  for (const row of activeToday) {
    const child = childById.get(row.child_id);
    if (!child) continue;

    const title = `${child.name} bu gün necə idi? 🌟`;
    const body = `${row.questions_answered} sual həll etdi və ${row.xp_earned} XP qazandı!`;
    await notifyFamilyParents(adminClient, child.family_id, title, body, {
      type: "daily_digest",
    });
    sent++;
  }

  return jsonResponse({ sent });
});
