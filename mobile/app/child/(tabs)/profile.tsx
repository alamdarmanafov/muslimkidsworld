import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Icon } from "../../../src/components/icons";
import { LanguageSwitcher } from "../../../src/components/LanguageSwitcher";
import { activeChild } from "../../../src/data/mock";
import { fetchChildProgress } from "../../../src/lib/childProgress";
import { clearDeviceBinding } from "../../../src/lib/deviceBinding";
import { toast } from "../../../src/lib/toast";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function ChildProfile() {
  const { t } = useTranslation();
  const [child, setChild] = useState({
    name: activeChild.name,
    age: activeChild.age as number | null,
    level: activeChild.level,
    emoji: activeChild.emoji,
    color: activeChild.color,
  });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      fetchChildProgress().then((result) => {
        if (cancelled || !result) return;
        setChild({
          name: result.child.name,
          age: result.child.age,
          level: result.progress.level,
          emoji: result.child.emoji,
          color: result.child.color,
        });
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleSignOut = () => {
    Alert.alert(t("childProfile.signOutConfirmTitle"), t("childProfile.signOutConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.signOut"),
        style: "destructive",
        onPress: async () => {
          await clearDeviceBinding();
          toast.success(t("childProfile.signedOut"));
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.body}>
        <Avatar emoji={child.emoji} color={child.color} size={88} />
        <Text style={styles.name}>{child.name}</Text>
        <Text style={styles.subtitle}>
          {t("childProfile.levelAge", { level: child.level, age: child.age })}
        </Text>

        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>{t("childProfile.language")}</Text>
          <LanguageSwitcher />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.parentLink} onPress={() => router.push("/child-select")}>
          <Icon name="users" size={16} color={colors.inkMuted} />
          <Text style={styles.parentLinkText}>{t("childProfile.switchChild")}</Text>
        </Pressable>
        <Pressable style={styles.parentLink} onPress={() => router.push("/parent-pin")}>
          <Icon name="lock" size={16} color={colors.inkMuted} />
          <Text style={styles.parentLinkText}>{t("childProfile.parentMode")}</Text>
        </Pressable>
        <Pressable onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t("common.signOut")}</Text>
        </Pressable>
      </View>
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
  footer: {
    gap: spacing.md,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  parentLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    ...shadow,
  },
  parentLinkText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.inkMuted },
  signOutText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
    textDecorationLine: "underline",
  },
});
