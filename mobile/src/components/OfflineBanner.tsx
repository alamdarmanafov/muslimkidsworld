// mobile/src/components/OfflineBanner.tsx
//
// A persistent "you're offline" bar pinned above everything else,
// mounted once in app/_layout.tsx so it works from any screen (parent
// or child). Nothing in this app currently tells a parent or child
// why a quiz result or a Weekly Report failed to load when the device
// has no connection — every screen just shows its own generic
// "something went wrong" text, which reads as a bug rather than what
// it actually is.

import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import { Icon } from "./icons";
import { colors, fonts, spacing } from "../theme/theme";

export function OfflineBanner() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();

  // isInternetReachable starts null until the first real check
  // resolves — treat that as "assume online" rather than flash the
  // banner on every cold start. isConnected === false (no radio link
  // at all) is reported immediately and reliably, so that alone is
  // enough to show it.
  const isOffline = netInfo.isConnected === false || netInfo.isInternetReachable === false;
  if (!isOffline) return null;

  return (
    <View pointerEvents="none" style={[styles.wrap, { paddingTop: insets.top + spacing.xs }]}>
      <Icon name="globe" size={14} color="#FFFFFF" />
      <Text style={styles.text}>{t("common.offline")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    backgroundColor: colors.ink,
    zIndex: 999,
  },
  text: { fontFamily: fonts.bodyBold, fontSize: 12, color: "#FFFFFF" },
});
