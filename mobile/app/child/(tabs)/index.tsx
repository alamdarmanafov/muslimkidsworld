import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, type IconName } from "../../../src/components/icons";
import {
  activeChild,
  dailyJourney,
  dailyMinutesDone,
  getDailyLimitMinutes,
} from "../../../src/data/mock";
import { fetchChildProgress } from "../../../src/lib/childProgress";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const exploreTiles: { labelKey: string; icon: IconName; bg: string; href: string }[] = [
  { labelKey: "childHome.quran", icon: "book", bg: colors.successDark, href: "/child/quran" },
  { labelKey: "childHome.dua", icon: "heart", bg: colors.purple, href: "/child/dua" },
  { labelKey: "childHome.stories", icon: "star", bg: colors.fire, href: "/child/stories" },
  { labelKey: "childHome.games", icon: "controller", bg: colors.primary, href: "/child/games" },
  { labelKey: "childHome.quiz", icon: "quiz", bg: colors.pink, href: "/child/quiz-categories" },
  { labelKey: "childHome.salah", icon: "mosque", bg: colors.teal, href: "/child/salah" },
  { labelKey: "childHome.alphabet", icon: "globe", bg: colors.goldDark, href: "/child/alphabet" },
  { labelKey: "childHome.divineNames", icon: "star", bg: colors.purple, href: "/child/divine-names" },
];

const journeyLabelKeys: Record<string, string> = {
  quran: "childHome.quran",
  dua: "childHome.dua",
  story: "childHome.story",
  quiz: "childHome.quiz",
  game: "childHome.game",
};

function gardenStageKey(percent: number) {
  if (percent >= 100) return { key: "childHome.gardenFullBloom", tone: colors.successDark };
  if (percent >= 60) return { key: "childHome.gardenBlooming", tone: colors.success };
  if (percent >= 25) return { key: "childHome.gardenGrowing", tone: "#8FD19E" };
  return { key: "childHome.gardenSprouted", tone: "#B7E4C7" };
}

export default function ChildHome() {
  const { t } = useTranslation();
  const [name, setName] = useState(activeChild.name);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchChildProgress().then((result) => {
      if (cancelled || !result) return;
      setName(result.child.name);
      setXp(result.progress.xp);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dailyGoalMinutes = getDailyLimitMinutes();
  const remaining = Math.max(dailyGoalMinutes - dailyMinutesDone, 0);
  const progress = Math.round((dailyMinutesDone / dailyGoalMinutes) * 100);
  const complete = dailyMinutesDone >= dailyGoalMinutes;
  const almostThere = !complete && remaining <= 5;
  const garden = gardenStageKey(progress);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t("childHome.greeting")}</Text>
            <Text style={styles.name}>{name}! 👋</Text>
          </View>
          <View style={styles.starPill}>
            <Icon name="star" size={14} color={colors.goldDark} />
            <Text style={styles.starPillText}>{xp}</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Icon name="moon" size={22} color={colors.gold} style={styles.heroMoon} />
          {complete ? (
            <>
              <Text style={styles.heroTitle}>{t("childHome.journeyComplete")}</Text>
              <Text style={styles.heroSubtitle}>{t("childHome.journeyCompleteBody")}</Text>
            </>
          ) : almostThere ? (
            <>
              <Text style={styles.heroTitle}>{t("childHome.almostThere")}</Text>
              <Text style={styles.heroSubtitle}>
                {t("childHome.minutesLeft", { count: remaining })}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroTitle}>{t("childHome.todaysJourney")}</Text>
              <Text style={styles.heroSubtitle}>
                {t("childHome.progressStatus", { done: dailyMinutesDone, goal: dailyGoalMinutes })}
              </Text>
            </>
          )}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>

          <View style={styles.journeyList}>
            {dailyJourney.map((item) => (
              <Pressable
                key={item.id}
                style={styles.journeyRow}
                onPress={() => router.push(item.href as never)}
              >
                <View style={[styles.journeyIconWrap, item.done && styles.journeyIconWrapDone]}>
                  <Icon
                    name={item.done ? "check" : item.icon}
                    size={15}
                    color={item.done ? colors.night : colors.onNight}
                  />
                </View>
                <Text style={[styles.journeyLabel, item.done && styles.journeyLabelDone]}>
                  {t(journeyLabelKeys[item.id] ?? item.label)}
                </Text>
                <Text style={styles.journeyMinutes}>{item.minutes} min</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.gardenCard, { borderColor: garden.tone }]}>
          <Icon name="tree" size={30} color={garden.tone} />
          <View style={{ flex: 1 }}>
            <Text style={styles.gardenTitle}>{t("childHome.gardenTitle")}</Text>
            <Text style={styles.gardenSubtitle}>{t(garden.key)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t("childHome.explore")}</Text>
        <View style={styles.grid}>
          {exploreTiles.map((tile) => (
            <Pressable
              key={tile.labelKey}
              style={[styles.tile, { backgroundColor: tile.bg }]}
              onPress={() => router.push(tile.href as never)}
            >
              <Icon name={tile.icon} size={34} color="#FFFFFF" />
              <Text style={styles.tileLabel}>{t(tile.labelKey)}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  greeting: { fontFamily: fonts.body, fontSize: 14, color: colors.inkMuted },
  name: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink },
  starPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3D6",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  starPillText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.goldDark },
  heroCard: {
    backgroundColor: colors.night,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadow,
  },
  heroMoon: { position: "absolute", top: spacing.md, right: spacing.md },
  heroTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.onNight },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onNightMuted,
    marginTop: 2,
    marginBottom: spacing.md,
    paddingRight: 30,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.success },
  journeyList: { marginTop: spacing.md, gap: spacing.xs },
  journeyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  journeyIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyIconWrapDone: { backgroundColor: colors.success },
  journeyLabel: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 13, color: colors.onNight },
  journeyLabelDone: { color: colors.onNightMuted, textDecorationLine: "line-through" },
  journeyMinutes: { fontFamily: fonts.body, fontSize: 12, color: colors.onNightMuted },
  gardenCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow,
  },
  gardenTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  gardenSubtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted, marginTop: 2 },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    ...shadow,
  },
  tileLabel: { fontFamily: fonts.bodyBold, fontSize: 12, color: "#FFFFFF", textAlign: "center" },
});
