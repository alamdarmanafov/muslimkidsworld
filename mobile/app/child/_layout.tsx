import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { ScreenTimeTracker } from "../../src/components/ScreenTimeTracker";
import { getDeviceId } from "../../src/lib/deviceBinding";
import { hasSeenChildOnboarding } from "../../src/lib/onboarding";
import { registerForPushNotifications } from "../../src/lib/pushNotifications";

export default function ChildLayout() {
  useEffect(() => {
    getDeviceId().then(registerForPushNotifications);
    hasSeenChildOnboarding().then((seen) => {
      if (!seen) router.push("/child/onboarding");
    });
  }, []);

  return (
    <>
      <ScreenTimeTracker />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quiz" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="onboarding" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
