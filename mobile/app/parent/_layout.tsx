import { Stack } from "expo-router";

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-child" options={{ presentation: "modal" }} />
      <Stack.Screen name="daily-limit" options={{ presentation: "modal" }} />
      <Stack.Screen name="family-code" options={{ presentation: "modal" }} />
    </Stack>
  );
}
