import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { fetchQuranSurahList, type QuranSurahListItem } from "../../src/lib/quran";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function Quran() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState<QuranSurahListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchQuranSurahList().then((result) => {
      if (cancelled) return;
      setSurahs(result ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...rest] = surahs;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("quran.title")}</Text>
        <View style={styles.starWrap}>
          <Icon name="star" size={20} color={colors.gold} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : !featured ? (
        <Text style={styles.emptyText}>{t("quran.unavailable")}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable
            style={styles.featuredCard}
            onPress={() => router.push(`/child/quran/${featured.slug}`)}
          >
            <View style={styles.featuredTop}>
              <Text style={styles.featuredLabel}>{t("quran.surah", { name: featured.name })}</Text>
              <View style={styles.playBtn}>
                <Icon name="play" size={18} color={colors.successDark} />
              </View>
            </View>
            <Text style={styles.featuredJuz}>{featured.juz}</Text>
          </Pressable>

          {rest.map((s) => (
            <Pressable
              key={s.slug}
              style={styles.row}
              onPress={() => router.push(`/child/quran/${s.slug}`)}
            >
              <View>
                <Text style={styles.rowName}>{t("quran.surah", { name: s.name })}</Text>
                <Text style={styles.rowJuz}>{s.juz}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowArabic}>{s.arabicName}</Text>
                <Icon name="play" size={16} color={colors.successDark} />
              </View>
            </Pressable>
          ))}
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
  title: { flex: 1, textAlign: "center", fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  starWrap: { width: 34, alignItems: "center" },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.sm },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  featuredCard: {
    backgroundColor: colors.successDark,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadow,
  },
  featuredTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredLabel: { fontFamily: fonts.heading, fontSize: 18, color: "#FFFFFF" },
  featuredJuz: { fontFamily: fonts.body, fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  rowJuz: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted, marginTop: 2 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rowArabic: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
});
