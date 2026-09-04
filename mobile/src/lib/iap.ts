// mobile/src/lib/iap.ts
//
// Client side of the iOS in-app purchase flow — app/parent/(tabs)/premium.tsx
// does the actual purchasing (via expo-iap's useIAP hook, which needs to
// live in a component), this file only holds the plain data fetches
// around it: which App Store product id maps to which plan, the
// family's current subscription state, and asking our own backend to
// verify a completed purchase with Apple (see
// supabase/functions/verify-apple-purchase).

import { getSupabaseClient } from "./supabase";

export type PlanProduct = { slug: string; appleProductId: string };

/**
 * The signed-in parent's own user id, or null if there's no session.
 * app/parent/(tabs)/premium.tsx passes this as requestPurchase's
 * appAccountToken so Apple signs it into the transaction — see
 * verify-apple-purchase's header comment for why that's what actually
 * ties a purchase to *this* account, not just to a real transaction.
 */
export async function getCurrentParentId(): Promise<string | null> {
  const {
    data: { user },
  } = await getSupabaseClient().auth.getUser();
  return user?.id ?? null;
}

/**
 * The App Store product id for every active plan that has one
 * configured. Public-read (subscription_plans has no RLS restriction
 * on select), so this works before the parent is signed in too.
 */
export async function fetchPlanProducts(): Promise<PlanProduct[]> {
  try {
    const { data, error } = await getSupabaseClient()
      .from("subscription_plans")
      .select("slug, apple_product_id")
      .eq("is_active", true)
      .not("apple_product_id", "is", null);
    if (error || !data) return [];
    return data
      .filter((row): row is { slug: string; apple_product_id: string } =>
        Boolean(row.apple_product_id),
      )
      .map((row) => ({ slug: row.slug, appleProductId: row.apple_product_id }));
  } catch {
    return [];
  }
}

export type FamilySubscription = {
  status: "trial" | "active" | "cancelled" | "expired";
  planSlug: string | null;
  currentPeriodEnd: string | null;
};

/** The signed-in parent's family's current subscription row, or null if none/unauthenticated. */
export async function fetchFamilySubscription(): Promise<FamilySubscription | null> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("subscriptions")
      .select("status, plan_id, current_period_end")
      .maybeSingle();
    if (error || !data) return null;

    let planSlug: string | null = null;
    const { data: plan } = await client
      .from("subscription_plans")
      .select("slug")
      .eq("id", data.plan_id)
      .maybeSingle();
    if (plan) planSlug = plan.slug;

    return {
      status: data.status,
      planSlug,
      currentPeriodEnd: data.current_period_end,
    };
  } catch {
    return null;
  }
}

export type VerifyPurchaseResult =
  | { ok: true; status: string; planSlug: string }
  | { ok: false; error: string };

/**
 * Asks our backend to confirm a just-completed (or restored) App
 * Store transaction with Apple directly, rather than trusting the
 * on-device purchase object alone — see the edge function's own
 * comment for why. Updates the family's subscriptions row on success.
 */
export async function verifyApplePurchase(transactionId: string): Promise<VerifyPurchaseResult> {
  try {
    const { data, error } = await getSupabaseClient().functions.invoke<{
      ok: true;
      status: string;
      planSlug: string;
    }>("verify-apple-purchase", { body: { transactionId } });
    if (error || !data) {
      const context = (error as { context?: Response } | null)?.context;
      if (context && typeof context.json === "function") {
        try {
          const body = await context.json();
          if (typeof body?.error === "string") return { ok: false, error: body.error };
        } catch {
          // fall through
        }
      }
      return { ok: false, error: error?.message ?? "verify-apple-purchase failed" };
    }
    return { ok: true, status: data.status, planSlug: data.planSlug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
