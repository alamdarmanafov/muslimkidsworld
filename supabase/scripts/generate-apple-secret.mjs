// Generates the "Secret Key" JWT that Supabase's Apple auth provider needs.
//
// Usage:
//   node generate-apple-secret.mjs --team YOUR_TEAM_ID --key YOUR_KEY_ID \
//     --client com.muslimkidsworld.app --p8 /path/to/AuthKey_XXXXXXXXXX.p8
//
// Prints the JWT to stdout. Paste that value into Supabase Dashboard →
// Authentication → Providers → Apple → Secret Key. Valid for 180 days
// (Apple's max is 6 months) — regenerate and re-paste before it expires.

import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1 || !process.argv[i + 1]) {
    throw new Error(`Missing --${name}`);
  }
  return process.argv[i + 1];
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const teamId = arg("team");
const keyId = arg("key");
const clientId = arg("client");
const p8Path = arg("p8");

const privateKey = readFileSync(p8Path, "utf8");

const now = Math.floor(Date.now() / 1000);
const sixMonths = 180 * 24 * 60 * 60;

const header = { alg: "ES256", kid: keyId };
const payload = {
  iss: teamId,
  iat: now,
  exp: now + sixMonths,
  aud: "https://appleid.apple.com",
  sub: clientId,
};

const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

const signer = createSign("SHA256");
signer.update(signingInput);
signer.end();
const derSignature = signer.sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
const signature = base64url(derSignature);

console.log(`${signingInput}.${signature}`);
