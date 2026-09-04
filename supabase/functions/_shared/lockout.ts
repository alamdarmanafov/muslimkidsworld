// supabase/functions/_shared/lockout.ts
//
// 3-strikes brute-force protection, shared by verify-parent-pin /
// set-active-child (a 4-digit PIN — 10,000 possibilities, both
// checked under the "pin" action so guessing through one endpoint
// can't buy fresh attempts on the other) and redeem-family-code (a
// 6-digit code, "code" action). Keyed by (device_id, action) in
// device_lockouts (0020_attempt_lockouts.sql).
//
// `deviceId` alone is NOT enough to key this on: it's a value the
// calling device makes up and sends in the request body
// (mobile/src/lib/deviceBinding.ts's generateDeviceId(), persisted in
// AsyncStorage — nothing server-side ever issues or checks it), so a
// caller hitting these functions directly (not through the app) can
// defeat the whole 3-strikes limit just by sending a fresh random
// deviceId on every guess. Every caller here also passes the
// request's client IP (best-effort, from the edge platform's
// forwarded-for header) as a second, caller-supplied-but-much-harder-
// to-rotate key — a lockout applies if *either* key has struck out,
// and a failed attempt counts against both. IP spoofing/rotation
// (VPNs, botnets) is a materially higher bar than "send a different
// string", which is the actual gap this closes; it isn't a claim that
// IP-based limiting is unbeatable by a determined, resourced attacker.
//
// When the platform doesn't hand us a client IP at all (getClientIp
// returns null — shouldn't happen on Supabase's own edge network, but
// cheap to guard), callers fall back to device-only keying, i.e.
// exactly today's behavior, rather than colliding every such request
// into one shared "unknown IP" bucket and locking out unrelated users.

// deno-lint-ignore no-explicit-any
type AdminClient = any;

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 5;

export type LockoutStatus = { locked: true; retryAfterSeconds: number } | { locked: false };

/** Best-effort client IP from standard reverse-proxy headers; null if none are present. */
export function getClientIp(req: Request): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return null;
}

/** The set of device_lockouts keys a given (deviceId, req) pair should be checked/recorded against. */
export function lockoutKeys(deviceId: string, req: Request): string[] {
  const ip = getClientIp(req);
  return ip ? [deviceId, `ip:${ip}`] : [deviceId];
}

/** Call before checking the PIN/code — returns locked:true if any of these keys should be refused outright. */
export async function checkLockout(
  adminClient: AdminClient,
  keys: string[],
  action: string,
): Promise<LockoutStatus> {
  const { data } = await adminClient
    .from("device_lockouts")
    .select("locked_until")
    .in("device_id", keys)
    .eq("action", action);

  let maxRemainingMs = 0;
  for (const row of data ?? []) {
    if (!row.locked_until) continue;
    const remainingMs = new Date(row.locked_until).getTime() - Date.now();
    if (remainingMs > maxRemainingMs) maxRemainingMs = remainingMs;
  }
  if (maxRemainingMs > 0) {
    return { locked: true, retryAfterSeconds: Math.ceil(maxRemainingMs / 1000) };
  }
  return { locked: false };
}

/**
 * Call after a wrong PIN/code — records the failure against every key
 * (device and, when available, IP) independently, so either one
 * hitting MAX_ATTEMPTS locks the pair out for LOCKOUT_MINUTES.
 */
export async function recordFailedAttempt(
  adminClient: AdminClient,
  keys: string[],
  action: string,
): Promise<void> {
  const { data: existingRows } = await adminClient
    .from("device_lockouts")
    .select("device_id, failed_attempts")
    .in("device_id", keys)
    .eq("action", action);
  const existingByKey = new Map((existingRows ?? []).map((r: { device_id: string; failed_attempts: number }) => [r.device_id, r.failed_attempts]));

  const now = new Date().toISOString();
  const rows = keys.map((key) => {
    const newCount = (existingByKey.get(key) ?? 0) + 1;
    const hitLimit = newCount >= MAX_ATTEMPTS;
    return {
      device_id: key,
      action,
      failed_attempts: hitLimit ? 0 : newCount,
      locked_until: hitLimit ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString() : null,
      updated_at: now,
    };
  });

  await adminClient.from("device_lockouts").upsert(rows, { onConflict: "device_id,action" });
}

/** Call after a correct PIN/code — clears any accumulated failures for every key. */
export async function clearLockout(adminClient: AdminClient, keys: string[], action: string): Promise<void> {
  await adminClient.from("device_lockouts").delete().in("device_id", keys).eq("action", action);
}
