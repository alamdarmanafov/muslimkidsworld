import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, type IconName } from "../../../src/components/icons";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { LanguageSwitcher } from "../../../src/components/LanguageSwitcher";
import { deleteAccount } from "../../../src/lib/children";
import { getSupabaseClient } from "../../../src/lib/supabase";
import { toast } from "../../../src/lib/toast";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function ParentProfile() {
  const { t } = useTranslation();

  const menuItems: { icon: IconName; label: string; onPress: () => void }[] = [
    { icon: "users", label: t("parentHome.manageChildren"), onPress: () => router.push("/parent/children") },
    { icon: "chartBar", label: t("tabs.progress"), onPress: () => router.push("/parent/progress") },
    { icon: "clock", label: t("parentHome.dailyLimit"), onPress: () => router.push("/parent/daily-limit") },
    { icon: "lock", label: t("parentProfile.parentPin"), onPress: () => router.push("/parent/parent-pin-setup") },
    { icon: "shield", label: t("devices.title"), onPress: () => router.push("/parent/devices") },
    { icon: "crown", label: t("tabs.premium"), onPress: () => router.push("/parent/premium") },
    { icon: "shield", label: t("parentProfile.privacyPolicy"), onPress: () => router.push("/parent/privacy") },
    { icon: "speaker", label: t("contact.menuLabel"), onPress: () => router.push("/parent/contact") },
  ];

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
          toast.success(t("parentProfile.signedOut"));
          router.replace("/welcome");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t("parentProfile.deleteAccountConfirmTitle"),
      t("parentProfile.deleteAccountConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            const ok = await deleteAccount();
            if (!ok) {
              toast.error(t("parentProfile.deleteAccountFailed"));
              return;
            }
            try {
              await getSupabaseClient().auth.signOut();
            } catch {
              // ignore — the account is already gone server-side
            }
            toast.success(t("parentProfile.deleteAccountSucceeded"));
            router.replace("/welcome");
          },
        },
      ],
    );
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

        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={[styles.menuRow, i > 0 && styles.menuRowBorder]}
            >
              <Icon name={item.icon} size={18} color={colors.ink} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="arrowRight" size={14} color={colors.inkMuted} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t("common.signOut")}</Text>
        </Pressable>
        <Pressable onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountText}>{t("parentProfile.deleteAccount")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  body: { flex: 1, alignItems: "center", padding: spacing.xl, gap: spacing.sm },
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
  menuCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    marginTop: spacing.lg,
    ...shadow,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  menuLabel: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  footer: { alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  signOutBtn: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    ...shadow,
  },
  signOutText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.pink },
  deleteAccountText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
    textDecorationLine: "underline",
  },
});
