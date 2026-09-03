import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Icon } from "../../../src/components/icons";
import { LanguageSwitcher } from "../../../src/components/LanguageSwitcher";
import { activeChild } from "../../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function ChildProfile() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <Avatar emoji={activeChild.emoji} color={activeChild.color} size={88} />
        <Text style={styles.name}>{activeChild.name}</Text>
        <Text style={styles.subtitle}>
          {t("childProfile.levelAge", { level: activeChild.level, age: activeChild.age })}
        </Text>

        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>{t("childProfile.language")}</Text>
          <LanguageSwitcher />
        </View>
      </View>

      <Pressable style={styles.parentLink} onPress={() => router.push("/parent-pin")}>
        <Icon name="lock" size={16} color={colors.inkMuted} />
        <Text style={styles.parentLinkText}>{t("childProfile.parentMode")}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm },
  name: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink, marginTop: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    ...shadow,
  },
  languageLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink },
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
