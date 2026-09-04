// mobile/src/lib/weeklyReportExport.ts
//
// Renders a child's Weekly Report (app/parent/(tabs)/progress.tsx) to
// a PDF and opens the native share sheet — same on-device
// expo-print + expo-sharing pattern as certificate.ts, so a parent
// can save or send the report instead of it only ever living inside
// the app.

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export type WeeklyReportDayRow = { label: string; minutes: number };
export type WeeklyReportCategoryRow = { label: string; questionsAnswered: number; accuracy: number };

export type WeeklyReportStrings = {
  title: string;
  accuracy: string;
  streak: string;
  badges: string;
  day: string;
  minutes: string;
  subject: string;
  questions: string;
  accuracyCol: string;
  footer: string;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtml(
  childName: string,
  dateRangeStr: string,
  stats: { accuracy: number; streak: number; badges: number },
  days: WeeklyReportDayRow[],
  categories: WeeklyReportCategoryRow[],
  strings: WeeklyReportStrings,
) {
  const maxMinutes = Math.max(...days.map((d) => d.minutes), 1);
  const dayRows = days
    .map(
      (d) => `<tr>
        <td>${escapeHtml(d.label)}</td>
        <td style="width:60%"><div class="bar-wrap"><div class="bar-fill" style="width:${Math.round((d.minutes / maxMinutes) * 100)}%"></div></div></td>
        <td style="text-align:right">${d.minutes}</td>
      </tr>`,
    )
    .join("");
  const categoryRows = categories
    .map(
      (c) => `<tr>
        <td>${escapeHtml(c.label)}</td>
        <td style="text-align:right">${c.questionsAnswered}</td>
        <td style="text-align:right">${c.accuracy}%</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #1F2937; background: #fff; }
  h1 { color: #0D1B4C; font-size: 24px; margin: 0 0 4px; }
  .subtitle { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
  .stats { display: flex; gap: 16px; margin-bottom: 28px; }
  .stat { flex: 1; background: #F5F8FC; border-radius: 12px; padding: 16px; text-align: center; }
  .stat .value { font-size: 20px; font-weight: 800; color: #0D1B4C; }
  .stat .label { font-size: 11px; color: #6B7280; margin-top: 4px; }
  h2 { font-size: 14px; color: #0D1B4C; margin: 24px 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
  th { color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  .bar-wrap { background: #E5E7EB; border-radius: 4px; height: 8px; width: 100%; }
  .bar-fill { background: #2563EB; border-radius: 4px; height: 8px; }
  .footer { font-size: 11px; color: #9CA3AF; margin-top: 32px; text-align: center; }
</style>
</head>
<body>
  <h1>${escapeHtml(strings.title)}</h1>
  <div class="subtitle">${escapeHtml(childName)} — ${escapeHtml(dateRangeStr)}</div>

  <div class="stats">
    <div class="stat"><div class="value">${stats.accuracy}%</div><div class="label">${escapeHtml(strings.accuracy)}</div></div>
    <div class="stat"><div class="value">${stats.streak}</div><div class="label">${escapeHtml(strings.streak)}</div></div>
    <div class="stat"><div class="value">${stats.badges}</div><div class="label">${escapeHtml(strings.badges)}</div></div>
  </div>

  <h2>${escapeHtml(strings.day)} / ${escapeHtml(strings.minutes)}</h2>
  <table>
    <thead><tr><th>${escapeHtml(strings.day)}</th><th></th><th style="text-align:right">${escapeHtml(strings.minutes)}</th></tr></thead>
    <tbody>${dayRows}</tbody>
  </table>

  <h2>${escapeHtml(strings.subject)}</h2>
  <table>
    <thead><tr><th>${escapeHtml(strings.subject)}</th><th style="text-align:right">${escapeHtml(strings.questions)}</th><th style="text-align:right">${escapeHtml(strings.accuracyCol)}</th></tr></thead>
    <tbody>${categoryRows}</tbody>
  </table>

  <div class="footer">${escapeHtml(strings.footer)}</div>
</body>
</html>`;
}

/** Renders and shares a Weekly Report PDF. Returns false on any failure or if sharing isn't available. */
export async function shareWeeklyReport(
  childName: string,
  stats: { accuracy: number; streak: number; badges: number },
  days: WeeklyReportDayRow[],
  categories: WeeklyReportCategoryRow[],
  strings: WeeklyReportStrings,
): Promise<boolean> {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 6);
    const dateRangeStr = `${weekAgo.toLocaleDateString()} – ${today.toLocaleDateString()}`;

    const html = buildHtml(childName, dateRangeStr, stats, days, categories, strings);
    const { uri } = await Print.printToFileAsync({ html });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return false;

    await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: strings.title });
    return true;
  } catch {
    return false;
  }
}
