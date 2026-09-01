import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { LanguageSwitcher } from "../../../src/components/LanguageSwitcher";
import { getSupabaseClient } from "../../../src/lib/supabase";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function ParentProfile() {
  const { t } = useTranslation();

  const handleSignOut = () => {
    Alert.alert(t("parentProfile.signOutConfirmTitle"), t("parentProfile.signOutConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.signOut"),
        style: "destructive",
        onPress: async () => {
          try {
            await getSupabaseClient().auth.signOut();
          } catch {
            // ignore — env not configured or already signed out
          }
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <IconBadge icon="smile" tone={tones.purple} size={72} />
        <Text style={styles.title}>{t("parentProfile.account")}</Text>
        <Text style={styles.subtitle}>{t("parentProfile.accountSubtitle")}</Text>

        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>{t("parentProfile.language")}</Text>
          <LanguageSwitcher />
        </View>
      </View>

      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>{t("common.signOut")}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.xl },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.ink, marginTop: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, textAlign: "center" },
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
  signOutBtn: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow,
  },
  signOutText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.pink },
});
