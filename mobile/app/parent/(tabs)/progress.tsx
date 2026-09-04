import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { Icon } from "../../../src/components/icons";
import { toast } from "../../../src/lib/toast";
import { fetchWeeklyReport, type ChildWeeklyReport } from "../../../src/lib/weeklyReport";
import { shareWeeklyReport } from "../../../src/lib/weeklyReportExport";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const DAY_KEYS = ["days.sun", "days.mon", "days.tue", "days.wed", "days.thu", "days.fri", "days.sat"];

function buildWeekDisplay(week: ChildWeeklyReport["week"]) {
  const byDate = new Map(week.map((d) => [d.activityDate, d.minutesSpent]));
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

// Only surfaces a strongest/weakest subject once there's enough of a
// sample to mean anything — a single lucky (or unlucky) quiz
// shouldn't label a child's whole subject.
const MIN_QUESTIONS_FOR_SIGNAL = 5;

function pickStrongestAndWeakest(stats: ChildWeeklyReport["categoryStats"]) {
  const eligible = stats.filter((s) => s.questionsAnswered >= MIN_QUESTIONS_FOR_SIGNAL);
  if (eligible.length === 0) return null;
  const sorted = [...eligible].sort((a, b) => b.accuracy - a.accuracy);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  if (strongest.category === weakest.category) return { strongest, weakest: null };
  return { strongest, weakest };
}

export default function Progress() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ChildWeeklyReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchWeeklyReport().then((result) => {
        setReports(result);
        setSelectedId((prev) => prev ?? result[0]?.id ?? null);
        setLoading(false);
      });
    }, []),
  );

  const selected = reports.find((r) => r.id === selectedId) ?? reports[0];

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  if (!selected) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{t("parentProgressPlaceholder.title")}</Text>
          <Text style={styles.emptySubtitle}>{t("parentProgressPlaceholder.subtitle")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const week = buildWeekDisplay(selected.week);
  const totalMinutes = selected.week.reduce((sum, d) => sum + d.minutesSpent, 0);
  const signal = pickStrongestAndWeakest(selected.categoryStats);

  const handleExport = async () => {
    setExporting(true);
    const ok = await shareWeeklyReport(
      selected.name,
      { accuracy: selected.accuracy, streak: selected.streak, badges: selected.badgesEarnedThisWeek },
      week.map((d) => ({ label: t(d.dayKey), minutes: d.value })),
      selected.categoryStats.map((c) => ({
        label: t(`quizCategories.${c.category}`),
        questionsAnswered: c.questionsAnswered,
        accuracy: c.accuracy,
      })),
      {
        title: t("parentProgress.exportTitle"),
        accuracy: t("childProgress.accuracy"),
        streak: t("parentProgress.streak"),
        badges: t("parentProgress.newBadges"),
        day: t("parentProgress.exportDay"),
        minutes: t("parentProgress.exportMinutes"),
        subject: t("parentProgress.subjects"),
        questions: t("parentProgress.exportQuestions"),
        accuracyCol: t("childProgress.accuracy"),
        footer: t("parentProgress.exportFooter"),
      },
    );
    setExporting(false);
    if (!ok) toast.error(t("parentProgress.exportFailed"));
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("parentProgressPlaceholder.title")}</Text>
        <Text style={styles.subtitle}>{t("parentProgressPlaceholder.subtitle")}</Text>

        {reports.length > 1 ? (
          <View style={styles.childRow}>
            {reports.map((child) => (
              <Pressable
                key={child.id}
                style={[styles.childChip, child.id === selected.id && styles.childChipSelected]}
                onPress={() => setSelectedId(child.id)}
              >
                <Avatar emoji={child.emoji} color={child.color} size={28} />
                <Text
                  style={[styles.childChipText, child.id === selected.id && styles.childChipTextSelected]}
                >
                  {child.name}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>{t("parentProgress.thisWeek")}</Text>
        <Card style={styles.chartCard}>
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
          <Text style={styles.chartCaption}>
            {t("parentProgress.minutesThisWeek", { count: totalMinutes })}
          </Text>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{selected.accuracy}%</Text>
            <Text style={styles.statLabel}>{t("childProgress.accuracy")}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="flame" size={16} color={colors.fire} />
            <Text style={styles.statValue}>{selected.streak}</Text>
            <Text style={styles.statLabel}>{t("parentProgress.streak")}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="trophy" size={16} color={colors.goldDark} />
            <Text style={styles.statValue}>{selected.badgesEarnedThisWeek}</Text>
            <Text style={styles.statLabel}>{t("parentProgress.newBadges")}</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>{t("parentProgress.subjects")}</Text>
        {signal ? (
          <Card style={styles.subjectsCard}>
            <View style={styles.subjectRow}>
              <Icon name="star" size={18} color={colors.success} />
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectLabel}>{t("parentProgress.strongest")}</Text>
                <Text style={styles.subjectName}>
                  {t(`quizCategories.${signal.strongest.category}`)}
                </Text>
              </View>
              <Text style={styles.subjectAccuracy}>{signal.strongest.accuracy}%</Text>
            </View>
            {signal.weakest ? (
              <View style={[styles.subjectRow, styles.subjectRowBorder]}>
                <Icon name="tree" size={18} color={colors.goldDark} />
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectLabel}>{t("parentProgress.needsPractice")}</Text>
                  <Text style={styles.subjectName}>
                    {t(`quizCategories.${signal.weakest.category}`)}
                  </Text>
                </View>
                <Text style={styles.subjectAccuracy}>{signal.weakest.accuracy}%</Text>
              </View>
            ) : null}
          </Card>
        ) : (
          <Card style={styles.subjectsCard}>
            <Text style={styles.emptySubjects}>{t("parentProgress.notEnoughData")}</Text>
          </Card>
        )}

        <Button
          label={exporting ? t("parentProgress.exporting") : t("parentProgress.exportButton")}
          variant="outline"
          disabled={exporting}
          onPress={handleExport}
          style={styles.exportBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, marginTop: 2 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink, textAlign: "center" },
  emptySubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, textAlign: "center" },
  childRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  childChipSelected: { borderColor: colors.primary, backgroundColor: "#EFF6FF" },
  childChipText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.inkMuted },
  childChipTextSelected: { color: colors.primary },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  chartCard: { gap: spacing.sm },
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
  chartCaption: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted, textAlign: "center" },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statCard: { flex: 1, alignItems: "center", paddingVertical: spacing.md, gap: 4 },
  statValue: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted, textAlign: "center" },
  subjectsCard: { gap: spacing.sm },
  subjectRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs },
  subjectRowBorder: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  subjectInfo: { flex: 1 },
  subjectLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted },
  subjectName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  subjectAccuracy: { fontFamily: fonts.heading, fontSize: 16, color: colors.ink },
  emptySubjects: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, textAlign: "center" },
  exportBtn: { marginTop: spacing.lg },
});
