import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, type IconName } from "../../../src/components/icons";
import { activeChild } from "../../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const learnTiles: { label: string; icon: IconName; bg: string; href: string }[] = [
  { label: "Quran", icon: "book", bg: colors.successDark, href: "/child/quran" },
  { label: "Dua", icon: "heart", bg: colors.purple, href: "/child/dua" },
  { label: "Stories", icon: "star", bg: colors.fire, href: "/child/stories" },
  { label: "Games", icon: "controller", bg: colors.primary, href: "/child/games" },
  { label: "Quiz", icon: "quiz", bg: colors.pink, href: "/child/quiz" },
];

const weeklyProgress = 72;

export default function ChildHome() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Assalamu Alaikum,</Text>
            <Text style={styles.name}>{activeChild.name}! 👋</Text>
          </View>
          <View style={styles.starPill}>
            <Icon name="star" size={14} color={colors.goldDark} />
            <Text style={styles.starPillText}>{activeChild.xp}</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Icon name="moon" size={22} color={colors.gold} style={styles.heroMoon} />
          <Text style={styles.heroTitle}>Keep going!</Text>
          <Text style={styles.heroSubtitle}>You're doing great, {activeChild.name}!</Text>
          <View style={styles.heroProgressRow}>
            <Text style={styles.heroProgressLabel}>Your Progress</Text>
            <Text style={styles.heroProgressValue}>{weeklyProgress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${weeklyProgress}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Let's continue learning</Text>
        <View style={styles.grid}>
          {learnTiles.map((t) => (
            <Pressable
              key={t.label}
              style={[styles.tile, { backgroundColor: t.bg }]}
              onPress={() => router.push(t.href as never)}
            >
              <Icon name={t.icon} size={34} color="#FFFFFF" />
              <Text style={styles.tileLabel}>{t.label}</Text>
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
    marginBottom: spacing.lg,
    overflow: "hidden",
    ...shadow,
  },
  heroMoon: { position: "absolute", top: spacing.md, right: spacing.md },
  heroTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.onNight },
  heroSubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.onNightMuted, marginTop: 2 },
  heroProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  heroProgressLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.onNightMuted },
  heroProgressValue: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.gold },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.success },
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
