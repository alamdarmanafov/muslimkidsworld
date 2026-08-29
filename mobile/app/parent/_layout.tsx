import { Stack } from "expo-router";

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-child" options={{ presentation: "modal" }} />
    </Stack>
  );
}
