import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, radii } from "../theme/theme";

type Variant = "primary" | "success" | "outline";

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const background =
    variant === "success"
      ? colors.success
      : variant === "outline"
        ? "transparent"
        : colors.primary;
  const textColor = variant === "outline" ? colors.primary : "#FFFFFF";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: background,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          borderWidth: variant === "outline" ? 2 : 0,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
});
