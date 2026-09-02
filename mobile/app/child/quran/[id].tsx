import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import { quranSurahs } from "../../../src/data/mock";
import { getArabicVerses, getSurahVerses } from "../../../src/data/quran";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function SurahDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const surah = quranSurahs.find((s) => s.id === id) ?? quranSurahs[0];

  const arabicVerses = getArabicVerses(surah.chapter);
  const translatedVerses = getSurahVerses(surah.chapter, i18n.language);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t(`content.quran.${surah.id}`)}</Text>
        <Text style={styles.arabicTitle}>{surah.arabicName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {arabicVerses.map((arabic, i) => (
          <View key={i} style={styles.verseCard}>
            <View style={styles.verseBadge}>
              <Text style={styles.verseBadgeText}>{i + 1}</Text>
            </View>
            <Text style={styles.arabicText}>{arabic}</Text>
            <Text style={styles.translationText}>{translatedVerses[i]}</Text>
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
  title: { fontFamily: fonts.heading, fontSize: 16, color: colors.ink },
  arabicTitle: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  verseCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow,
  },
  verseBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.successDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  verseBadgeText: { color: "#FFFFFF", fontFamily: fonts.bodyBold, fontSize: 12 },
  arabicText: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    color: colors.ink,
    textAlign: "right",
    lineHeight: 38,
  },
  translationText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
