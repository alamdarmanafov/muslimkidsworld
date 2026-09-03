import { useEffect } from "react";
import { Stack } from "expo-router";
import { getDeviceId } from "../../src/lib/deviceBinding";
import { registerForPushNotifications } from "../../src/lib/pushNotifications";

export default function ChildLayout() {
  useEffect(() => {
    getDeviceId().then(registerForPushNotifications);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="quiz" options={{ presentation: "fullScreenModal" }} />
    </Stack>
  );
}
