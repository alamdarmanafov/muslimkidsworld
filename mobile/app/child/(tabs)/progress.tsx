import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import { activeChild } from "../../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const week = [
  { day: "Mon", value: 60 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 55 },
];

export default function ChildProgress() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Progress</Text>

        <View style={styles.streakCard}>
          <Icon name="flame" size={26} color="#FFFFFF" />
          <View>
            <Text style={styles.streakValue}>{activeChild.streak} day streak</Text>
            <Text style={styles.streakSubtitle}>Keep it going, don't break the chain!</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartRow}>
            {week.map((d) => (
              <View key={d.day} style={styles.barWrap}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${d.value}%` }]} />
                </View>
                <Text style={styles.barLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeChild.accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Lvl {activeChild.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
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
