// supabase/functions/_shared/lockout.ts
//
// 3-strikes brute-force protection, shared by verify-parent-pin (a
// 4-digit PIN — 10,000 possibilities) and redeem-family-code (a
// 6-digit code). Keyed by (deviceId, action) in device_lockouts
// (0020_attempt_lockouts.sql) so the two actions never share a
// counter with each other or with a different device's attempts.

// deno-lint-ignore no-explicit-any
type AdminClient = any;

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 5;

export type LockoutStatus = { locked: true; retryAfterSeconds: number } | { locked: false };

/** Call before checking the PIN/code — returns locked:true if this device should be refused outright. */
export async function checkLockout(
  adminClient: AdminClient,
  deviceId: string,
  action: string,
): Promise<LockoutStatus> {
  const { data } = await adminClient
    .from("device_lockouts")
    .select("locked_until")
    .eq("device_id", deviceId)
    .eq("action", action)
    .maybeSingle();

  if (data?.locked_until) {
    const remainingMs = new Date(data.locked_until).getTime() - Date.now();
    if (remainingMs > 0) {
      return { locked: true, retryAfterSeconds: Math.ceil(remainingMs / 1000) };
    }
  }
  return { locked: false };
}

/**
 * Call after a wrong PIN/code. Locks the device out for
 * LOCKOUT_MINUTES once it hits MAX_ATTEMPTS, then resets the counter
 * so the next window starts fresh (the lock itself is what keeps
 * blocking further guesses in the meantime).
 */
export async function recordFailedAttempt(
  adminClient: AdminClient,
  deviceId: string,
  action: string,
): Promise<void> {
  const { data: existing } = await adminClient
    .from("device_lockouts")
    .select("failed_attempts")
    .eq("device_id", deviceId)
    .eq("action", action)
    .maybeSingle();

  const newCount = (existing?.failed_attempts ?? 0) + 1;
  const hitLimit = newCount >= MAX_ATTEMPTS;

  await adminClient.from("device_lockouts").upsert(
    {
      device_id: deviceId,
      action,
      failed_attempts: hitLimit ? 0 : newCount,
      locked_until: hitLimit ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id,action" },
  );
}

/** Call after a correct PIN/code — clears any accumulated failures for this device+action. */
export async function clearLockout(
  adminClient: AdminClient,
  deviceId: string,
  action: string,
): Promise<void> {
  await adminClient.from("device_lockouts").delete().eq("device_id", deviceId).eq("action", action);
}
