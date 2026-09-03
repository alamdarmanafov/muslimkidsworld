// mobile/src/lib/pushNotifications.ts
//
// Registers this device's Expo push token with the backend
// (register-push-token edge function) so record-quiz-result
// (achievement earned) and send-daily-reminders can notify it later.
// Called once per app session — for a parent, from app/parent/_layout.tsx
// after they're signed in; for a child device, from app/child/_layout.tsx
// once it's bound to a family. supabase.functions.invoke() attaches the
// current session's access token automatically when signed in, or just
// the anon key otherwise — register-push-token tells the two apart the
// same way set-parent-pin / get-child-progress already do.
//
// iOS only for now (no Android push credentials configured yet — see
// supabase/README.md). Never throws: permission denial, a missing
// EAS project id, or the device being offline should all just mean
// "no token today," not a crash or a toast the user can't act on.

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { getSupabaseClient } from "./supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(deviceId?: string): Promise<void> {
  if (Platform.OS !== "ios") return;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let status = existingStatus;
    if (status !== "granted") {
      const result = await Notifications.requestPermissionsAsync();
      status = result.status;
    }
    if (status !== "granted") return;

    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const token = tokenResponse.data;

    const { error } = await getSupabaseClient().functions.invoke("register-push-token", {
      body: { token, deviceId },
    });
    if (error && __DEV__) {
      console.warn("registerForPushNotifications failed", error.message);
    }
  } catch (err) {
    if (__DEV__) {
      console.warn("registerForPushNotifications failed", err instanceof Error ? err.message : String(err));
    }
  }
}
