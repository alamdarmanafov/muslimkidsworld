import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import { fetchChildProgress, type DailyActivity } from "../../../src/lib/childProgress";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const DAY_KEYS = ["days.sun", "days.mon", "days.tue", "days.wed", "days.thu", "days.fri", "days.sat"];

function buildWeekDisplay(week: DailyActivity[]) {
  const byDate = new Map(week.map((d) => [d.activity_date, d.questions_answered]));
  const days: { dayKey: string; value: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({ dayKey: DAY_KEYS[d.getUTCDay()], value: byDate.get(dateStr) ?? 0 });
  }
  const max = Math.max(...days.map((d) => d.value), 1);
  return days.map((d) => ({ ...d, percent: Math.round((d.value / max) * 100) }));
}

export default function ChildProgress() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [level, setLevel] = useState(1);
  const [week, setWeek] = useState<{ dayKey: string; value: number; percent: number }[]>(
    buildWeekDisplay([]),
  );

  useEffect(() => {
    let cancelled = false;
    fetchChildProgress().then((result) => {
      if (cancelled) return;
      if (result) {
        setStreak(result.progress.streak);
        setAccuracy(result.progress.accuracy);
        setLevel(result.progress.level);
        setWeek(buildWeekDisplay(result.week));
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("childProgress.title")}</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            <View style={styles.streakCard}>
              <Icon name="flame" size={26} color="#FFFFFF" />
              <View>
                <Text style={styles.streakValue}>
                  {t("childProgress.dayStreak", { count: streak })}
                </Text>
                <Text style={styles.streakSubtitle}>{t("childProgress.keepGoingChain")}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t("childProgress.thisWeek")}</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartRow}>
                {week.map((d, i) => (
                  <View key={`${d.dayKey}-${i}`} style={styles.barWrap}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${d.percent}%` }]} />
                    </View>
                    <Text style={styles.barLabel}>{t(d.dayKey)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{accuracy}%</Text>
                <Text style={styles.statLabel}>{t("childProgress.accuracy")}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>Lvl {level}</Text>
                <Text style={styles.statLabel}>{t("parentHome.level")}</Text>
              </View>
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
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.fire,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow,
  },
  streakValue: { fontFamily: fonts.heading, fontSize: 16, color: "#FFFFFF" },
  streakSubtitle: { fontFamily: fonts.body, fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink, marginBottom: spacing.sm },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow,
  },
  chartRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 100 },
  barWrap: { alignItems: "center", gap: spacing.xs, flex: 1 },
  barTrack: {
    width: 10,
    height: 80,
    borderRadius: 5,
    backgroundColor: colors.background,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: "100%", borderRadius: 5, backgroundColor: colors.primary },
  barLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.inkMuted },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    ...shadow,
  },
  statValue: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted, marginTop: 2 },
});
