// supabase/functions/_shared/notifyParents.ts
//
// Push-notifies every parent in a family — the "look up their
// push_tokens rows and send" half that record-quiz-result's
// achievement notification, record-screen-time's daily-limit
// notification, and mark-story-read/mark-world-visit's achievement
// path all need identically. Never throws: a push failure must not
// fail the request that triggered it, only be logged.

// deno-lint-ignore no-explicit-any
type AdminClient = any;

import { sendExpoPush } from "./push.ts";

export async function notifyFamilyParents(
  adminClient: AdminClient,
  familyId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  try {
    const { data: parentRows } = await adminClient
      .from("parents")
      .select("id")
      .eq("family_id", familyId);
    const parentIds = (parentRows ?? []).map((p: { id: string }) => p.id);
    if (parentIds.length === 0) return;

    const { data: tokenRows } = await adminClient
      .from("push_tokens")
      .select("expo_push_token")
      .eq("owner_type", "parent")
      .in("owner_id", parentIds);
    const tokens = (tokenRows ?? []).map((r: { expo_push_token: string }) => r.expo_push_token);
    if (tokens.length === 0) return;

    await sendExpoPush(tokens, title, body, data);
  } catch (err) {
    console.error("notifyFamilyParents failed", err instanceof Error ? err.message : String(err));
  }
}
