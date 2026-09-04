// mobile/src/lib/certificate.ts
//
// Generates a printable/shareable PDF certificate for one earned
// achievement (app/child/(tabs)/rewards.tsx's "Sertifikat" button) —
// a parent can save or print it, something a badge shown only inside
// the app never offered. Entirely on-device via expo-print (renders
// HTML to a PDF) + expo-sharing (the OS share sheet); no server round
// trip, no third-party design tool.

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export type CertificateStrings = {
  kicker: string;
  appName: string;
  footer: string;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtml(childName: string, achievementLabel: string, dateStr: string, strings: CertificateStrings) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { margin: 0; }
  body { margin: 0; font-family: -apple-system, Helvetica, Arial, sans-serif; background: #F5F8FC; }
  .cert {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding: 56px 48px;
    border: 10px solid #FFD54F;
    outline: 2px solid #0D1B4C;
    outline-offset: -22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .badge { font-size: 84px; margin-bottom: 8px; }
  .kicker { letter-spacing: 4px; color: #D97706; font-weight: 700; font-size: 14px; text-transform: uppercase; }
  h1 { font-size: 36px; color: #0D1B4C; margin: 10px 0 24px; }
  .name { font-size: 32px; color: #2563EB; font-weight: 800; margin: 8px 0; }
  .achievement { font-size: 22px; color: #1F2937; margin: 8px 0 28px; }
  .date { font-size: 13px; color: #6B7280; }
  .footer { font-size: 12px; color: #9CA3AF; margin-top: 36px; }
</style>
</head>
<body>
  <div class="cert">
    <div class="badge">🏆</div>
    <div class="kicker">${escapeHtml(strings.kicker)}</div>
    <h1>${escapeHtml(strings.appName)}</h1>
    <div class="name">${escapeHtml(childName)}</div>
    <div class="achievement">${escapeHtml(achievementLabel)}</div>
    <div class="date">${escapeHtml(dateStr)}</div>
    <div class="footer">${escapeHtml(strings.footer)}</div>
  </div>
</body>
</html>`;
}

/**
 * Renders and shares a certificate PDF. Returns false if generation
 * or sharing failed, or if this device has no share target at all
 * (e.g. certain simulators) — the caller should treat that as
 * "couldn't share", not necessarily a bug worth surfacing loudly.
 */
export async function shareCertificate(
  childName: string,
  achievementLabel: string,
  strings: CertificateStrings,
): Promise<boolean> {
  try {
    const dateStr = new Date().toLocaleDateString();
    const html = buildHtml(childName, achievementLabel, dateStr, strings);
    const { uri } = await Print.printToFileAsync({ html });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return false;

    await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: achievementLabel });
    return true;
  } catch {
    return false;
  }
}
