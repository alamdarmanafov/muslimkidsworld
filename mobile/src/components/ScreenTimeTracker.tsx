// mobile/src/components/ScreenTimeTracker.tsx
//
// Mounted once in app/child/_layout.tsx so it runs for the whole
// child app regardless of which screen is open. Counts real
// foreground seconds (via AppState, pausing whenever the app isn't
// "active" — backgrounded, locked, a system dialog) and flushes one
// minute at a time to record-screen-time. Renders nothing; this is
// pure side effect, same shape as the push-registration effect
// already in that layout file.
//
// A tick lost to the app being killed mid-minute is fine to lose —
// this only needs to be roughly accurate for a parent-facing "about
// how long today" number and the daily-limit notification, not exact
// to the second.

import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { recordScreenTime } from "../lib/screenTime";

const TICK_MS = 60_000;

export function ScreenTimeTracker() {
  const activeRef = useRef(AppState.currentState === "active");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      activeRef.current = state === "active";
    });

    const interval = setInterval(() => {
      if (activeRef.current) {
        recordScreenTime(1);
      }
    }, TICK_MS);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return null;
}
