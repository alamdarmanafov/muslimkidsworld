import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Icon } from "../../../src/components/icons";
import { activeChild } from "../../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function ChildProfile() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <Avatar emoji={activeChild.emoji} color={activeChild.color} size={88} />
        <Text style={styles.name}>{activeChild.name}</Text>
        <Text style={styles.subtitle}>Level {activeChild.level} · {activeChild.age} years old</Text>
      </View>

      <Pressable style={styles.parentLink} onPress={() => router.push("/parent-pin")}>
        <Icon name="lock" size={16} color={colors.inkMuted} />
        <Text style={styles.parentLinkText}>Parent Mode</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm },
  name: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink, marginTop: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted },
  parentLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow,
  },
  parentLinkText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.inkMuted },
});
