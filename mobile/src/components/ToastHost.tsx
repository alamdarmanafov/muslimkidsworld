// mobile/src/components/ToastHost.tsx
//
// Renders whatever src/lib/toast.ts's `toast.success()` / `toast.error()`
// last fired, as a banner pinned to the top of the screen above
// everything else. Mounted once in app/_layout.tsx so it works the
// same from any screen, parent or child side, without each screen
// managing its own success/error UI.

import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "./icons";
import { colors, fonts, radii, shadow, spacing } from "../theme/theme";
import { registerToastListener, type ToastMessage } from "../lib/toast";

const VISIBLE_MS = 2600;

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState<ToastMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    registerToastListener((toastMessage) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setCurrent(toastMessage);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
          setCurrent(null);
        });
      }, VISIBLE_MS);
    });
    return () => {
      registerToastListener(null);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [opacity]);

  if (!current) return null;

  const isError = current.type === "error";

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { top: insets.top + spacing.sm, opacity },
        isError ? styles.error : styles.success,
      ]}
    >
      <Icon name={isError ? "lock" : "check"} size={16} color="#FFFFFF" />
      <Text style={styles.text} numberOfLines={2}>
        {current.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    zIndex: 1000,
    ...shadow,
  },
  success: { backgroundColor: colors.successDark },
  error: { backgroundColor: colors.pink },
  text: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 13, color: "#FFFFFF" },
});
