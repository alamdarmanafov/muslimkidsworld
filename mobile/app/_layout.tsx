import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { OfflineBanner } from "../src/components/OfflineBanner";
import { ToastHost } from "../src/components/ToastHost";
import { initI18n } from "../src/i18n";
import { installGlobalErrorHandler } from "../src/lib/errorReporting";
import { colors } from "../src/theme/theme";

installGlobalErrorHandler();

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}

function AppShell() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  if (!fontsLoaded || !i18nReady) {
    return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="child-code" />
        <Stack.Screen name="child" />
        <Stack.Screen name="parent-pin" options={{ presentation: "modal" }} />
        <Stack.Screen name="child-select" options={{ presentation: "modal" }} />
        <Stack.Screen name="parent-auth" />
        <Stack.Screen name="parent" />
      </Stack>
      <ToastHost />
      <OfflineBanner />
    </SafeAreaProvider>
  );
}
