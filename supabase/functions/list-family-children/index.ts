// supabase/functions/list-family-children/index.ts
//
// Lets a child's device list every child in the family it's bound to,
// and which one is currently active on this device — the read half of
// multi-child support (mobile/app/child-select.tsx). The list itself
// isn't sensitive (names/emojis siblings would see in the parent app
// anyway), so unlike set-active-child this doesn't require the Parent
// Gate PIN — only the write that actually switches the active child
// does, since that's the privileged action.
//
// Request:
//   POST /functions/v1/list-family-children
//   { "deviceId": "dev_abc123" }
//
// Response:
//   200 { children: [{id, name, age, emoji, color}, ...], activeChildId: string | null }
//   404 { error: "Device is not bound to a family" }
//   400 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type Body = { deviceId?: unknown };

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
    .select("family_id, active_child_id")
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

  const { data: children, error: childrenError } = await adminClient
    .from("children")
    .select("id, name, age, emoji, color")
    .eq("family_id", boundCode.family_id)
    .order("created_at", { ascending: true });
  if (childrenError) {
    return jsonResponse({ error: childrenError.message }, 500);
  }

  return jsonResponse({
    children: children ?? [],
    activeChildId: boundCode.active_child_id ?? null,
  });
});
