import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import { achievements } from "../../../src/data/mock";
import { fetchChildProgress } from "../../../src/lib/childProgress";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function Achievements() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState(0);
  const [stars, setStars] = useState(0);
  const [days, setDays] = useState(0);
  const [earnedSlugs, setEarnedSlugs] = useState<string[]>([]);

  // The badge catalog (icon/tone) still comes from mock.ts, but which
  // ones actually show as earned now comes from record-quiz-result's
  // criteria evaluation (see supabase/migrations/0008_achievement_criteria.sql) —
  // only badges backed by data this backend tracks (quiz results,
  // streak) can ever appear here; book-lover/storyteller/mosque-visitor
  // stay unearned until Stories/the world map get their own tracking.
  const earned = achievements.filter((a) => earnedSlugs.includes(a.id));

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      fetchChildProgress().then((result) => {
        if (cancelled) return;
        if (result) {
          setBadges(result.progress.badges_count);
          setStars(result.progress.stars_count);
          setDays(result.progress.active_days_count);
          setEarnedSlugs(result.achievements);
        }
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const stats = [
    { labelKey: "achievements.badges", value: badges },
    { labelKey: "achievements.stars", value: stars },
    { labelKey: "achievements.days", value: days },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("achievements.title")}</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            <View style={styles.trophyCard}>
              <View style={styles.trophyIconWrap}>
                <Icon name="trophy" size={30} color={colors.goldDark} />
              </View>
              <Text style={styles.trophyTitle}>{t("achievements.youreAmazing")}</Text>
              <Text style={styles.trophySubtitle}>{t("achievements.keepLearning")}</Text>

              <View style={styles.statsRow}>
                {stats.map((s) => (
                  <View key={s.labelKey} style={styles.statItem}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{t(s.labelKey)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t("achievements.recentBadges")}</Text>
            <View style={styles.badgeGrid}>
              {earned.map((a) => (
                <View key={a.id} style={styles.badge}>
                  <View style={[styles.badgeIconWrap, { backgroundColor: a.tone[0] }]}>
                    <Icon name={a.icon} size={26} color={a.tone[1]} />
                  </View>
                  <Text style={styles.badgeLabel}>{t(`content.achievements.${a.id}`)}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink, marginBottom: spacing.lg },
  trophyCard: {
    backgroundColor: "#FFF3D6",
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  trophyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  trophyTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.goldDark },
  trophySubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statValue: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink, marginBottom: spacing.sm },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  badge: {
    width: "30%",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
    ...shadow,
  },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLabel: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.ink, textAlign: "center" },
});
