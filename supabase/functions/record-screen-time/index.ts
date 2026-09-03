// supabase/functions/record-screen-time/index.ts
//
// Called every ~60 real seconds the child app spends in the
// foreground (mobile/src/components/ScreenTimeTracker.tsx, mounted
// once in app/child/_layout.tsx) to add a small increment to today's
// child_daily_activity.minutes_spent — the only place actual elapsed
// time gets recorded; see 0019_screen_time.sql for why that used to
// be entirely fake. `minutes` is capped low and validated server-side
// so a tampered client can't claim hours in one call.
//
// The first call that pushes minutes_spent at or past the family's
// families.daily_limit_minutes pushes one "daily limit reached" alert
// to the parents — not every call after, so hitting the limit doesn't
// spam them for the rest of the day.
//
// Request:
//   POST /functions/v1/record-screen-time
//   { "deviceId": "dev_abc123", "minutes": 1 }
//
// Response:
//   200 { minutesSpent: 23, dailyLimitMinutes: 60 }
//   404 { error: "Device is not bound to a family" | "No child found for this family" }
//   400 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { notifyFamilyParents } from "../_shared/notifyParents.ts";
import { isResolveError, resolveDeviceChild } from "../_shared/resolveChild.ts";

type Body = { deviceId?: unknown; minutes?: unknown };

function isValidDeviceId(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 256;
}
// One tracker tick is meant to be ~1 minute; capped at 2 to tolerate a
// slow flush without letting a single call claim an implausible chunk.
function isValidMinutes(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 2;
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
  if (!isValidMinutes(body.minutes)) {
    return jsonResponse({ error: "minutes must be an integer between 1 and 2" }, 400);
  }
  const deviceId = body.deviceId;
  const minutes = body.minutes;

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

  const todayStr = new Date().toISOString().slice(0, 10);

  const [{ data: existingDay, error: existingDayError }, { data: family, error: familyError }, { data: child, error: childError }] =
    await Promise.all([
      adminClient
        .from("child_daily_activity")
        .select("minutes_spent")
        .eq("child_id", childId)
        .eq("activity_date", todayStr)
        .maybeSingle(),
      adminClient.from("families").select("daily_limit_minutes").eq("id", familyId).maybeSingle(),
      adminClient.from("children").select("name").eq("id", childId).maybeSingle(),
    ]);

  if (existingDayError) return jsonResponse({ error: existingDayError.message }, 500);
  if (familyError) return jsonResponse({ error: familyError.message }, 500);
  if (childError) return jsonResponse({ error: childError.message }, 500);

  const prevMinutesSpent = existingDay?.minutes_spent ?? 0;
  const newMinutesSpent = prevMinutesSpent + minutes;
  const dailyLimitMinutes = family?.daily_limit_minutes ?? 60;

  const { error: dayError } = await adminClient.from("child_daily_activity").upsert(
    {
      child_id: childId,
      activity_date: todayStr,
      minutes_spent: newMinutesSpent,
    },
    { onConflict: "child_id,activity_date" },
  );
  if (dayError) {
    return jsonResponse({ error: dayError.message }, 500);
  }

  if (prevMinutesSpent < dailyLimitMinutes && newMinutesSpent >= dailyLimitMinutes) {
    const name = child?.name ?? "Uşağınız";
    await notifyFamilyParents(
      adminClient,
      familyId,
      "Gündəlik limit doldu ⏰",
      `${name} bugünkü ekran vaxtı limitinə (${dailyLimitMinutes} dəq) çatdı.`,
      { type: "daily_limit" },
    );
  }

  return jsonResponse({ minutesSpent: newMinutesSpent, dailyLimitMinutes });
});
