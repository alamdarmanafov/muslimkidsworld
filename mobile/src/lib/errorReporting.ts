// mobile/src/lib/errorReporting.ts
//
// Sends crashes/errors to our own error_reports table (see
// supabase/functions/report-error and 0021_error_reports.sql) instead
// of a third-party crash SDK — reused infrastructure, no new vendor
// account needed. Wired up in two places: a global JS error handler
// (below) and <ErrorBoundary> (../components/ErrorBoundary.tsx) for
// render errors specifically.
//
// This must never itself throw or block the UI — it's called from
// error-handling paths, so a failure here (network down, Supabase
// misconfigured) has to fail silently rather than compound the
// original crash.

import Constants from "expo-constants";
import { Platform } from "react-native";
import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

/**
 * "parent" vs "child" isn't known to the caller (the error handlers
 * below are mounted once, at the app root, above both trees) — a
 * signed-in Supabase session only ever exists on the parent side
 * (child devices are session-less, see deviceBinding.ts), so it's a
 * reliable proxy for which UI was on screen when the error fired.
 */
async function detectSource(): Promise<"parent" | "child"> {
  try {
    const { data } = await getSupabaseClient().auth.getSession();
    return data.session ? "parent" : "child";
  } catch {
    return "child";
  }
}

export async function reportError(
  error: unknown,
  extra?: { componentStack?: string },
): Promise<void> {
  try {
    const message = error instanceof Error ? error.message : String(error);
    const stack =
      (error instanceof Error ? error.stack : undefined) ??
      extra?.componentStack ??
      undefined;
    const [source, deviceId] = await Promise.all([
      detectSource(),
      getDeviceId().catch(() => undefined),
    ]);

    await getSupabaseClient().functions.invoke("report-error", {
      body: {
        source,
        message,
        stack,
        deviceId,
        appVersion: Constants.expoConfig?.version,
        platform: Platform.OS,
      },
    });
  } catch {
    // Reporting must never throw — see header comment.
  }
}

/**
 * Installs a handler for JS errors that escape React entirely (they
 * don't trigger an ErrorBoundary — e.g. an error thrown from an event
 * handler or a timer). Call once, as early as possible, from
 * app/_layout.tsx.
 */
export function installGlobalErrorHandler(): void {
  const g = globalThis as unknown as {
    ErrorUtils?: {
      getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
      setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
    };
  };
  if (!g.ErrorUtils) return;

  const previousHandler = g.ErrorUtils.getGlobalHandler();
  g.ErrorUtils.setGlobalHandler((error, isFatal) => {
    reportError(error);
    previousHandler?.(error, isFatal);
  });
}
