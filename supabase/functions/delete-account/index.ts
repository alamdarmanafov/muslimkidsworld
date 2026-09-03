// supabase/functions/delete-account/index.ts
//
// Lets a signed-in parent permanently delete their own account
// (mobile/app/parent/(tabs)/profile.tsx "Delete account"). Two things
// have to happen that no client-side RLS grant allows:
//   1. Removing the auth.users row itself — only the service role can
//      do this (supabase-js has no client-side "delete my own user").
//   2. Deciding whether to also delete the family (and everything
//      that cascades from it: children, child_progress,
//      child_daily_activity, child_achievements, family_codes,
//      subscriptions — every one of those FKs is `on delete cascade`
//      to families, see 0001_core_schema.sql). A family can have more
//      than one parent (0004_rls_policies.sql's "co-parents" policy),
//      so deleting one parent must NOT take the whole family down
//      with them unless they were the last parent in it.
//
// Request (caller must be signed in — Authorization bearer token):
//   POST /functions/v1/delete-account
//   (no body required)
//
// Response:
//   200 { deletedFamily: boolean }   — deletedFamily is true only if
//                                      this was the family's last parent
//   401 { error: "..." }             — caller is not authenticated
//   500 { error: "..." }

import { createClient } from "npm:@supabase/supabase-js@2.112.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

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

  // Delete the auth user first — cascades (parents.id references
  // auth.users on delete cascade) to remove just this parent's own
  // `parents` row, leaving any co-parents and the family untouched.
  const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id);
  if (deleteUserError) {
    return jsonResponse({ error: deleteUserError.message }, 500);
  }

  if (!parent) {
    // No parents row (shouldn't normally happen) — nothing left to clean up.
    return jsonResponse({ deletedFamily: false });
  }

  const { count: remainingParents, error: countError } = await adminClient
    .from("parents")
    .select("id", { count: "exact", head: true })
    .eq("family_id", parent.family_id);

  if (countError) {
    return jsonResponse({ error: countError.message }, 500);
  }

  if ((remainingParents ?? 0) === 0) {
    // Last parent in this family — remove the family too, cascading to
    // children, child_progress, child_daily_activity,
    // child_achievements, family_codes, and subscriptions.
    const { error: deleteFamilyError } = await adminClient
      .from("families")
      .delete()
      .eq("id", parent.family_id);
    if (deleteFamilyError) {
      return jsonResponse({ error: deleteFamilyError.message }, 500);
    }
    return jsonResponse({ deletedFamily: true });
  }

  return jsonResponse({ deletedFamily: false });
});
