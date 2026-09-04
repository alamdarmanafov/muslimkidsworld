import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { hasSeenParentOnboarding } from "../../src/lib/onboarding";
import { registerForPushNotifications } from "../../src/lib/pushNotifications";

export default function ParentLayout() {
  useEffect(() => {
    registerForPushNotifications();
    hasSeenParentOnboarding().then((seen) => {
      if (!seen) router.push("/parent/onboarding");
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-child" options={{ presentation: "modal" }} />
      <Stack.Screen name="daily-limit" options={{ presentation: "modal" }} />
      <Stack.Screen name="family-code" options={{ presentation: "modal" }} />
      <Stack.Screen name="privacy" options={{ presentation: "modal" }} />
      <Stack.Screen name="contact" options={{ presentation: "modal" }} />
      <Stack.Screen name="notification-quiet-hours" options={{ presentation: "modal" }} />
      <Stack.Screen name="prayer-city" options={{ presentation: "modal" }} />
      <Stack.Screen name="parent-pin-setup" options={{ presentation: "modal" }} />
      <Stack.Screen name="devices" options={{ presentation: "modal" }} />
      <Stack.Screen name="onboarding" options={{ presentation: "modal" }} />
    </Stack>
  );
}
