// supabase/functions/_shared/pinHash.ts
//
// Parent Gate PIN hashing, shared by set-parent-pin (writes it),
// verify-parent-pin and set-active-child (both check it). Salted
// SHA-256: a bare SHA-256(pin) is fine against the online brute-force
// attempts the lockout in _shared/lockout.ts throttles, but a leaked
// `families` table would let one precomputed 10,000-entry table (all
// of SHA-256("0000") through SHA-256("9999"), built once) instantly
// crack every family's PIN in every installation, since they'd all be
// hashed identically. A random per-family salt means that
// precomputation has to be redone per family instead of once ever —
// see 0032_pin_salt.sql.

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** A fresh random salt for a newly-set/changed PIN. */
export function generatePinSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Salt is null only for a PIN set before 0032_pin_salt.sql — see this file's header comment. */
export async function hashPin(pin: string, salt: string | null): Promise<string> {
  return sha256Hex((salt ?? "") + pin);
}
