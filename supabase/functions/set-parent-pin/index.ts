// supabase/functions/set-parent-pin/index.ts
//
// Lets a signed-in parent set or change their family's Parent Gate PIN
// (mobile/app/parent/parent-pin-setup.tsx). The parent's own RLS
// grants don't include UPDATE on `families` (see
// 0004_rls_policies.sql), and even if they did, hashing has to happen
// here, not on the client, so the raw PIN is never stored — this
// function is both the write path and the only place the hash logic
// lives (verify-parent-pin re-derives the same hash to compare).
//
// Request (parent must be signed in — Authorization bearer token):
//   POST /functions/v1/set-parent-pin
//   { "pin": "1234" }
//
// Response:
//   200 { ok: true }
//   400 { error: "pin must be exactly 4 digits" }
//   401 { error: "Not authenticated" }
//   404 { error: "No family found for this account" }
//   500 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type Body = { pin?: unknown };

function isValidPin(v: unknown): v is string {
  return typeof v === "string" && /^[0-9]{4}$/.test(v);
}

async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

  if (!isValidPin(body.pin)) {
    return jsonResponse({ error: "pin must be exactly 4 digits" }, 400);
  }
  const pin = body.pin;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");
  if (!bearerToken) {
    return jsonResponse({ error: "Not authenticated" }, 401);
  }

  const callerClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser(bearerToken);
  if (userError || !user) {
    return jsonResponse({ error: "Not authenticated" }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: parent, error: parentError } = await adminClient
    .from("parents")
    .select("family_id")
    .eq("id", user.id)
    .maybeSingle();
  if (parentError) {
    return jsonResponse({ error: parentError.message }, 500);
  }
  if (!parent) {
    return jsonResponse({ error: "No family found for this account" }, 404);
  }

  const pinHash = await hashPin(pin);
  const { error: updateError } = await adminClient
    .from("families")
    .update({ pin_hash: pinHash })
    .eq("id", parent.family_id);
  if (updateError) {
    return jsonResponse({ error: updateError.message }, 500);
  }

  return jsonResponse({ ok: true });
});
