// mobile/src/lib/bugReportUI.ts
//
// Imperative trigger for the "report a problem" modal, mirroring
// toast.ts's pub/sub — shakeDetector.ts and the manual "Problem
// bildir" button in Profile both call triggerBugReport(), and
// <BugReportHost> (mounted once in app/_layout.tsx) is the sole
// subscriber that renders the modal.

import { captureBugScreenshot, type CapturedScreenshot } from "./bugReport";

type Listener = (screenshot: CapturedScreenshot | null) => void;

let listener: Listener | null = null;
let inFlight = false;

/** Called once by BugReportHost on mount/unmount — not for screens to use. */
export function registerBugReportListener(fn: Listener | null) {
  listener = fn;
}

/**
 * Captures the current screen *before* any report UI appears, then
 * opens the report modal with it. A no-op while a capture is already
 * in flight, so a rapid double-shake doesn't stack two modals.
 */
export async function triggerBugReport(): Promise<void> {
  if (inFlight) return;
  inFlight = true;
  try {
    const screenshot = await captureBugScreenshot();
    listener?.(screenshot);
  } finally {
    inFlight = false;
  }
}
