import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, type IconName } from "../../src/components/icons";
import { foreignLanguageAvailability, type ForeignTargetLang, type QuizCategory } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

const categoryTiles: { category: QuizCategory; icon: IconName; bg: string }[] = [
  { category: "din", icon: "mosque", bg: colors.successDark },
  { category: "riyaziyyat", icon: "star", bg: colors.primary },
  { category: "yaxsiEmeller", icon: "heart", bg: colors.pink },
  { category: "elm", icon: "globe", bg: colors.teal },
];

const targetLangLabels: Record<ForeignTargetLang, string> = {
  en: "English",
  ru: "Русский",
};

export default function QuizCategories() {
  const { t, i18n } = useTranslation();
  const availableForeignLangs = foreignLanguageAvailability[i18n.language] ?? [];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("quizCategories.title")}</Text>
        <Icon name="star" size={20} color={colors.gold} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {categoryTiles.map((tile) => (
          <Pressable
            key={tile.category}
            style={styles.row}
            onPress={() => router.push(`/child/quiz?category=${tile.category}`)}
          >
            <View style={[styles.iconWrap, { backgroundColor: tile.bg }]}>
              <Icon name={tile.icon} size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.rowTitle}>{t(`quizCategories.${tile.category}`)}</Text>
            <Icon name="arrowRight" size={18} color={colors.inkMuted} />
          </Pressable>
        ))}

        {availableForeignLangs.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{t("quizCategories.xariciDil")}</Text>
            {availableForeignLangs.map((lang) => (
              <Pressable
                key={lang}
                style={styles.row}
                onPress={() => router.push(`/child/quiz?category=xariciDil&targetLang=${lang}`)}
              >
                <View style={[styles.iconWrap, { backgroundColor: colors.purple }]}>
                  <Icon name="quiz" size={26} color="#FFFFFF" />
                </View>
                <Text style={styles.rowTitle}>{targetLangLabels[lang]}</Text>
                <Icon name="arrowRight" size={18} color={colors.inkMuted} />
              </Pressable>
            ))}
          </>
        ) : null}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
});
