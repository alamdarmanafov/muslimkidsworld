// mobile/src/components/PinKeypad.tsx
//
// The dot-progress + numeric keypad shared by app/parent-pin.tsx
// (child device enters the family's real PIN) and
// app/parent/parent-pin-setup.tsx (parent sets/changes it) — same
// look, different logic around it.

import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "./icons";
import { colors, fonts, spacing } from "../theme/theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function PinDots({
  length,
  filled,
  error,
}: {
  length: number;
  filled: number;
  error?: boolean;
}) {
  return (
    <View style={styles.dots}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.dot, i < filled && styles.dotFilled, error && styles.dotError]} />
      ))}
    </View>
  );
}

export function PinKeypad({
  onPress,
  disabled,
}: {
  onPress: (key: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.keypad}>
      {KEYS.map((key, i) => (
        <Pressable
          key={i}
          style={[styles.key, key === "" && styles.keyHidden]}
          disabled={key === "" || disabled}
          onPress={() => onPress(key)}
        >
          {key === "back" ? (
            <Icon name="arrowRight" size={20} color={colors.onNight} style={styles.backIcon} />
          ) : (
            <Text style={styles.keyText}>{key}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  backIcon: { transform: [{ scaleX: -1 }] },
  dots: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  dotFilled: { backgroundColor: colors.gold, borderColor: colors.gold },
  dotError: { backgroundColor: colors.pink, borderColor: colors.pink },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "auto",
    marginBottom: spacing.lg,
  },
  key: {
    width: "33.33%",
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  keyHidden: { opacity: 0 },
  keyText: { fontFamily: fonts.heading, fontSize: 26, color: colors.onNight },
});
