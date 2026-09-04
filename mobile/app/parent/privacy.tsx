import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { colors, fonts, spacing } from "../../src/theme/theme";

// Not localized on purpose: this is a legal document, and an
// inaccurate machine translation of one is worse than none — every
// other screen in the app is translated, this one stays in English
// until a real translation is reviewed by someone who can vouch for
// it being legally accurate, not just linguistically close.
const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: "What we collect",
    body:
      "From a parent: the email address and password used to sign in. " +
      "From a child profile a parent creates: a name, an age, and an " +
      "emoji avatar — no photo, exact birthdate, or contact details. " +
      "While a child plays: which quizzes they finish, how many " +
      "answers were correct, and daily activity counts, used only to " +
      "show progress and streaks back to the parent.",
  },
  {
    heading: "What we don't collect",
    body:
      "No advertising or analytics trackers, no location data, no " +
      "contacts, no device identifiers beyond a random id used solely " +
      "to link a child's device to their family's account, and no data " +
      "sold or shared with third parties for marketing.",
  },
  {
    heading: "Where it's stored",
    body:
      "In a Supabase-hosted database, protected by row-level security " +
      "so a family can only ever read or change its own data — not " +
      "another family's.",
  },
  {
    heading: "Children's privacy",
    body:
      "A child never creates their own account, enters their own " +
      "email, or signs in directly — a parent creates the child's " +
      "profile and shares a rotating 6-digit code to connect the " +
      "child's device. Only a parent can view, edit, or delete a " +
      "child's information.",
  },
  {
    heading: "Deleting your data",
    body:
      "Deleting your account from Profile removes your sign-in " +
      "permanently. If you're the only parent on the account, every " +
      "child profile, their progress, and your family's data are " +
      "deleted with it — this cannot be undone.",
  },
  {
    heading: "Contact",
    body: "Questions about this policy — or anything else — can be sent from Profile → Contact us.",
  },
];

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("parentProfile.privacyPolicy")}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {SECTIONS.map((s) => (
          <View key={s.heading} style={styles.section}>
            <Text style={styles.heading}>{s.heading}</Text>
            <Text style={styles.paragraph}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  body: { padding: spacing.lg, paddingTop: 0, gap: spacing.lg, paddingBottom: spacing.xl },
  section: { gap: spacing.xs },
  heading: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink },
  paragraph: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, lineHeight: 20 },
});
