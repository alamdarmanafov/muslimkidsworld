import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme/theme";
import { IconBadge, IconBadgeTone } from "./IconBadge";
import type { IconName } from "./icons";

export function PlaceholderScreen({
  icon,
  tone,
  title,
  subtitle,
}: {
  icon: IconName;
  tone: IconBadgeTone;
  title: string;
  subtitle: string;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <IconBadge icon={icon} tone={tone} size={72} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink, marginTop: spacing.sm },
  subtitle: { fontSize: 14, color: colors.inkMuted, textAlign: "center" },
});
