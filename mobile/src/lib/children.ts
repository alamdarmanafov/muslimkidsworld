// mobile/src/lib/children.ts
//
// Parent-side CRUD for their own family's children — used by
// app/parent/add-child.tsx (create) and
// app/parent/(tabs)/children.tsx (list + delete). Everything here
// runs under the signed-in parent's own RLS-scoped session (see
// "children" policies in supabase/migrations/0004_rls_policies.sql),
// unlike mobile/src/lib/childProgress.ts which is a child device with
// no session at all and has to go through service-role edge
// functions instead.

import { getSupabaseClient } from "./supabase";

export type ParentChild = {
  id: string;
  name: string;
  age: number | null;
  emoji: string;
  color: string;
  accuracy: number;
  level: number;
  streak: number;
};

/**
 * Fetches every child in the signed-in parent's family, with each
 * child's current accuracy/level/streak from child_progress (zeroed
 * out / level 1 if that child has no progress row yet — shouldn't
 * normally happen, see handle_new_child() in 0001_core_schema.sql,
 * but a child can exist for a moment before it does). Returns null on
 * any failure (no session, network error, backend not configured).
 */
export async function fetchChildren(): Promise<ParentChild[] | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: rows, error } = await supabase
      .from("children")
      .select("id, name, age, emoji, color")
      .order("created_at", { ascending: true });
    if (error || !rows) return null;

    if (rows.length === 0) return [];

    const { data: progressRows } = await supabase
      .from("child_progress")
      .select("child_id, accuracy, level, streak")
      .in(
        "child_id",
        rows.map((r) => r.id),
      );
    const progressByChildId = new Map((progressRows ?? []).map((p) => [p.child_id, p]));

    return rows.map((r) => {
      const progress = progressByChildId.get(r.id);
      return {
        ...r,
        accuracy: progress?.accuracy ?? 0,
        level: progress?.level ?? 1,
        streak: progress?.streak ?? 0,
      };
    });
  } catch {
    return null;
  }
}

/**
 * Creates a new child in the signed-in parent's family. Resolves the
 * family id from the parent's own row (RLS lets a parent SELECT only
 * their own `parents` row — see 0004_rls_policies.sql) since the
 * INSERT policy on `children` requires family_id to match it exactly.
 * Returns the new child's id, or null on any failure.
 */
export async function addChild(
  name: string,
  age: number | null,
  emoji: string,
): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: parent, error: parentError } = await supabase
      .from("parents")
      .select("family_id")
      .eq("id", user.id)
      .maybeSingle();
    if (parentError || !parent) return null;

    const { data: child, error: insertError } = await supabase
      .from("children")
      .insert({ family_id: parent.family_id, name, age, emoji })
      .select("id")
      .single();
    if (insertError || !child) return null;

    return child.id;
  } catch {
    return null;
  }
}

/** Deletes a child (and, via cascade, their progress/achievements). */
export async function deleteChild(childId: string): Promise<boolean> {
  try {
    const { error } = await getSupabaseClient().from("children").delete().eq("id", childId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Permanently deletes the signed-in parent's own account via the
 * delete-account edge function (auth.users can't be deleted from the
 * client — see that function's header comment). Does not sign the
 * client out itself; the caller should do that once this resolves.
 */
export async function deleteAccount(): Promise<boolean> {
  try {
    const { error } = await getSupabaseClient().functions.invoke("delete-account");
    return !error;
  } catch {
    return false;
  }
}
