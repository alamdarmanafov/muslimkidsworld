// supabase/functions/_shared/resolveChild.ts
//
// Resolves a child device id to the family it's bound to and which
// child is "active" on it — the one piece of logic get-child-progress,
// record-quiz-result, mark-journey-item, and register-push-token all
// duplicated before multi-child support existed. Now: honors
// family_codes.active_child_id when a parent has set one (via
// set-active-child, gated by the Parent Gate PIN — see that
// function's header comment), otherwise falls back to the family's
// oldest (first-created) child, which was every one of those
// functions' entire behavior before this file existed. A single
// bound device only ever has one row matching
// eq(bound_device_id).is(revoked_at, null) at a time (revoke-device
// only ever revokes, generate-family-code never touches a bound row —
// see those functions' header comments), so this never has to choose
// between multiple candidates.

// deno-lint-ignore no-explicit-any
type AdminClient = any;

export type ResolvedDeviceChild = { familyId: string; childId: string };
export type ResolveChildError = { error: string; status: number };

export async function resolveDeviceChild(
  adminClient: AdminClient,
  deviceId: string,
): Promise<ResolvedDeviceChild | ResolveChildError> {
  const { data: boundCode, error: codeError } = await adminClient
    .from("family_codes")
    .select("family_id, active_child_id")
    .eq("bound_device_id", deviceId)
    .is("revoked_at", null)
    .order("bound_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (codeError) return { error: codeError.message, status: 500 };
  if (!boundCode) return { error: "Device is not bound to a family", status: 404 };

  if (boundCode.active_child_id) {
    const { data: activeChild, error: activeChildError } = await adminClient
      .from("children")
      .select("id")
      .eq("id", boundCode.active_child_id)
      .eq("family_id", boundCode.family_id)
      .maybeSingle();
    if (activeChildError) return { error: activeChildError.message, status: 500 };
    if (activeChild) return { familyId: boundCode.family_id, childId: activeChild.id };
    // active_child_id pointed at a child that's gone (deleted after
    // being selected) — fall through to the oldest-child default
    // below rather than erroring the request.
  }

  const { data: child, error: childError } = await adminClient
    .from("children")
    .select("id")
    .eq("family_id", boundCode.family_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (childError) return { error: childError.message, status: 500 };
  if (!child) return { error: "No child found for this family", status: 404 };

  return { familyId: boundCode.family_id, childId: child.id };
}

export function isResolveError(
  result: ResolvedDeviceChild | ResolveChildError,
): result is ResolveChildError {
  return "error" in result;
}
