import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../theme/theme";
import { IconBadge, IconBadgeTone } from "./IconBadge";

export function StatPill({
  emoji,
  tone,
  label,
  value,
}: {
  emoji: string;
  tone: IconBadgeTone;
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.pill}>
      <IconBadge emoji={emoji} tone={tone} size={36} shape="circle" />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: colors.inkMuted,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
});
