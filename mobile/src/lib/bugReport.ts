// mobile/src/lib/bugReport.ts
//
// "Report a problem" — triggered by shaking the device
// (shakeDetector.ts) or the manual "Problem bildir" button in
// Profile. Captures a screenshot of whatever's on screen, resizes it
// toward a standard 1080px-wide screenshot (most phones are already
// close to a 9:16 ratio, so this lands very close to 1080x1920
// without stretching any device's actual aspect ratio), and submits
// it with the user's typed description to report-error
// (kind: "user_report") — the same table and admin panel tab crash
// reports already use, see 0023_bug_screenshots.sql.

import Constants from "expo-constants";
import { Platform } from "react-native";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { captureScreen } from "react-native-view-shot";
import { getDeviceId } from "./deviceBinding";
import { detectSource } from "./errorReporting";
import { getSupabaseClient } from "./supabase";

const TARGET_WIDTH = 1080;

export type CapturedScreenshot = { uri: string; base64: string };

/**
 * Captures the current screen. Call this *before* showing any report
 * UI (a confirmation modal, a text input) — anything on screen at
 * capture time ends up in the screenshot, including the report UI
 * itself if it's already open.
 */
export async function captureBugScreenshot(): Promise<CapturedScreenshot | null> {
  try {
    const rawUri = await captureScreen({ format: "jpg", quality: 0.9 });
    const rendered = await ImageManipulator.manipulate(rawUri).resize({ width: TARGET_WIDTH }).renderAsync();
    const saved = await rendered.saveAsync({ compress: 0.8, format: SaveFormat.JPEG, base64: true });
    if (!saved.base64) return null;
    return { uri: saved.uri, base64: saved.base64 };
  } catch {
    return null;
  }
}

/** Submits a user-written problem report with its screenshot. Returns false on any failure. */
export async function submitBugReport(
  message: string,
  screenshot: CapturedScreenshot | null,
): Promise<boolean> {
  try {
    const [source, deviceId] = await Promise.all([
      detectSource(),
      getDeviceId().catch(() => undefined),
    ]);

    const { error } = await getSupabaseClient().functions.invoke("report-error", {
      body: {
        source,
        kind: "user_report",
        message: message.trim(),
        screenshotBase64: screenshot?.base64,
        deviceId,
        appVersion: Constants.expoConfig?.version,
        platform: Platform.OS,
      },
    });
    return !error;
  } catch {
    return false;
  }
}
