import { useEffect } from "react";
import { Stack } from "expo-router";
import { registerForPushNotifications } from "../../src/lib/pushNotifications";

export default function ParentLayout() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-child" options={{ presentation: "modal" }} />
      <Stack.Screen name="daily-limit" options={{ presentation: "modal" }} />
      <Stack.Screen name="family-code" options={{ presentation: "modal" }} />
      <Stack.Screen name="privacy" options={{ presentation: "modal" }} />
      <Stack.Screen name="parent-pin-setup" options={{ presentation: "modal" }} />
      <Stack.Screen name="devices" options={{ presentation: "modal" }} />
    </Stack>
  );
}
