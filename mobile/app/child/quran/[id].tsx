import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import {
  fetchQuranSurahList,
  fetchSurahDetail,
  type QuranSurahDetail,
  type QuranSurahListItem,
} from "../../../src/lib/quran";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function SurahDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [surah, setSurah] = useState<QuranSurahDetail | null>(null);
  const [nextSurah, setNextSurah] = useState<QuranSurahListItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchSurahDetail(id, i18n.language), fetchQuranSurahList()]).then(
      ([detail, list]) => {
        if (cancelled) return;
        setSurah(detail);
        if (detail && list) {
          const next = list.find((s) => s.chapter === detail.chapter + 1);
          setNextSurah(next ?? null);
        }
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [id, i18n.language]);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{surah?.name ?? ""}</Text>
        <Text style={styles.arabicTitle}>{surah?.arabicName ?? ""}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : !surah ? (
        <Text style={styles.emptyText}>{t("quran.unavailable")}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {surah.verses.map((verse) => (
            <View key={verse.verseNumber} style={styles.verseCard}>
              <View style={styles.verseBadge}>
                <Text style={styles.verseBadgeText}>{verse.verseNumber}</Text>
              </View>
              <Text style={styles.arabicText}>{verse.arabic}</Text>
              <Text style={styles.translationText}>{verse.translation}</Text>
            </View>
          ))}

          {surah.translator ? (
            <Text style={styles.translatorNote}>
              {t("quran.translatedBy", { name: surah.translator })}
            </Text>
          ) : null}

          {nextSurah ? (
            <Pressable
              style={styles.nextBtn}
              onPress={() => router.replace(`/child/quran/${nextSurah.slug}`)}
            >
              <Text style={styles.nextBtnText}>
                {t("quran.nextSurah", { name: nextSurah.name })}
              </Text>
              <Icon name="arrowRight" size={16} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </ScrollView>
      )}
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
    paddingTop: spacing.xl * 1.5,
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
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
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
  translatorNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.successDark,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  nextBtnText: { fontFamily: fonts.bodyBold, fontSize: 15, color: "#FFFFFF" },
});
