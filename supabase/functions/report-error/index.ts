// supabase/functions/report-error/index.ts
//
// Own-infrastructure crash/error reporting — no Sentry account or SDK
// needed, since the app already has this exact
// "edge function writes with service role, admin panel reads" shape
// for everything else (see 0021_error_reports.sql). Called two ways:
//
// 1. Automatically, by a global JS error handler + ErrorBoundary
//    (mobile/src/lib/errorReporting.ts), which can fire before a
//    parent has ever signed in or a device has been bound to a
//    family — so this function accepts a report with no auth session
//    and no deviceId at all, and only opportunistically resolves
//    parent_id when a real parent bearer token is present.
// 2. Manually, when a user shakes the device or taps "Report a
//    problem" in Profile (mobile/src/lib/bugReport.ts) — kind:
//    "user_report", with a screenshot of what they were looking at
//    (see 0023_bug_screenshots.sql), uploaded here to a private
//    bucket rather than trusting the client to manage storage access.
//
// Request (no auth required — the anon key alone satisfies verify_jwt):
//   POST /functions/v1/report-error
//   { "source": "parent" | "child", "message": "...", "stack"?: "...",
//     "kind"?: "crash" | "user_report", "screenshotBase64"?: "...",
//     "deviceId"?: "...", "appVersion"?: "...", "platform"?: "..." }
//
// Response:
//   200 { ok: true }
//   400 { error: "..." }
//   500 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

// Generous but bounded — this exists to stop a runaway retry loop or
// a hostile caller from filling the table with multi-megabyte rows,
// not to fit any real stack trace or a legitimately large screenshot.
const MAX_MESSAGE_LENGTH = 2000;
const MAX_STACK_LENGTH = 8000;
const MAX_SHORT_FIELD_LENGTH = 200;
const MAX_SCREENSHOT_BASE64_LENGTH = 6_000_000; // ~4.5MB decoded

type Body = {
  source?: unknown;
  message?: unknown;
  stack?: unknown;
  kind?: unknown;
  screenshotBase64?: unknown;
  deviceId?: unknown;
  appVersion?: unknown;
  platform?: unknown;
};

function isValidSource(v: unknown): v is "parent" | "child" {
  return v === "parent" || v === "child";
}
function isValidKind(v: unknown): v is "crash" | "user_report" {
  return v === undefined || v === "crash" || v === "user_report";
}
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}
function truncate(v: unknown, max: number): string | null {
  if (typeof v !== "string" || v.length === 0) return null;
  return v.length > max ? v.slice(0, max) : v;
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
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

  if (!isValidSource(body.source)) {
    return jsonResponse({ error: "source must be 'parent' or 'child'" }, 400);
  }
  if (!isNonEmptyString(body.message)) {
    return jsonResponse({ error: "message is required" }, 400);
  }
  if (!isValidKind(body.kind)) {
    return jsonResponse({ error: "kind must be 'crash' or 'user_report'" }, 400);
  }
  if (
    typeof body.screenshotBase64 === "string" &&
    body.screenshotBase64.length > MAX_SCREENSHOT_BASE64_LENGTH
  ) {
    return jsonResponse({ error: "screenshotBase64 is too large" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  // Best-effort: a parent-side crash after login carries a real user
  // bearer token, which we use only to attach parent_id. A child
  // device (no session) or a crash before login sends the anon key
  // instead — getUser() then just fails to resolve a user, which is
  // expected and not an error worth reporting to the caller.
  let parentId: string | null = null;
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");
  if (bearerToken) {
    const callerClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });
    const { data } = await callerClient.auth.getUser(bearerToken);
    if (data?.user) parentId = data.user.id;
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  let screenshotPath: string | null = null;
  if (typeof body.screenshotBase64 === "string" && body.screenshotBase64.length > 0) {
    let bytes: Uint8Array;
    try {
      bytes = decodeBase64(body.screenshotBase64);
    } catch {
      return jsonResponse({ error: "screenshotBase64 is not valid base64" }, 400);
    }
    const path = `${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await adminClient.storage
      .from("bug-screenshots")
      .upload(path, bytes, { contentType: "image/jpeg" });
    if (uploadError) {
      return jsonResponse({ error: uploadError.message }, 500);
    }
    screenshotPath = path;
  }

  const { error } = await adminClient.from("error_reports").insert({
    source: body.source,
    kind: body.kind ?? "crash",
    device_id: truncate(body.deviceId, MAX_SHORT_FIELD_LENGTH),
    parent_id: parentId,
    message: truncate(body.message, MAX_MESSAGE_LENGTH),
    stack: truncate(body.stack, MAX_STACK_LENGTH),
    app_version: truncate(body.appVersion, MAX_SHORT_FIELD_LENGTH),
    platform: truncate(body.platform, MAX_SHORT_FIELD_LENGTH),
    screenshot_path: screenshotPath,
  });
  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ ok: true });
});
