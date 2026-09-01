import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { StatPill } from "../../../src/components/StatPill";
import { activeChild, dailyTen } from "../../../src/data/mock";
import { colors, spacing } from "../../../src/theme/theme";

const grid = [
  { label: "Learn", icon: "book" as const, tone: tones.teal, href: "/child/learn" as const },
  { label: "World", icon: "globe" as const, tone: tones.blue, href: "/child/world" as const },
  { label: "Good Deeds", icon: "heart" as const, tone: tones.pink, href: "/child/rewards" as const },
  { label: "Rewards", icon: "gift" as const, tone: tones.gold, href: "/child/rewards" as const },
  { label: "Events", icon: "calendar" as const, tone: tones.orange, href: "/child/world" as const },
  { label: "Profile", icon: "smile" as const, tone: tones.yellow, href: "/child/profile" as const },
];

export default function ChildHome() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Assalamu Alaikum,</Text>
            <Text style={styles.name}>{activeChild.name}! 👋</Text>
          </View>
          <Text style={styles.bell}>🔔</Text>
        </View>

        <Card style={styles.statsRow}>
          <StatPill icon="star" tone={tones.gold} label="Level" value={activeChild.level} />
          <StatPill icon="crown" tone={tones.orange} label="XP" value={activeChild.xp} />
          <StatPill icon="flame" tone={tones.red} label="Streak" value={activeChild.streak} />
        </Card>

        <Card style={styles.missionCard}>
          <Text style={styles.missionLabel}>Today's Mission</Text>
          <View style={styles.missionRow}>
            <IconBadge icon="quiz" tone={tones.purple} size={56} shape="square" />
            <View style={{ flex: 1 }}>
              <Text style={styles.missionTitle}>Daily 10</Text>
              <Text style={styles.missionSubtitle}>
                {dailyTen.length * 3} Questions
              </Text>
              <Text style={styles.missionXp}>
                +{dailyTen.reduce((sum, q) => sum + q.xp, 0)} XP 🪙
              </Text>
            </View>
          </View>
          <Button
            label="Start"
            variant="success"
            onPress={() => router.push("/child/quiz")}
          />
        </Card>

        <View style={styles.grid}>
          {grid.map((item) => (
            <Pressable
              key={item.label}
              style={styles.gridItem}
              onPress={() => router.push(item.href)}
            >
              <Card style={styles.gridCard}>
                <IconBadge icon={item.icon} tone={item.tone} size={44} shape="square" />
                <Text style={styles.gridLabel}>{item.label}</Text>
              </Card>
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
  headerText: {},
  greeting: { fontSize: 14, color: colors.inkMuted },
  name: { fontSize: 24, fontWeight: "800", color: colors.ink },
  bell: { fontSize: 22 },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  missionCard: { marginBottom: spacing.lg },
  missionLabel: { fontSize: 13, color: colors.inkMuted, marginBottom: spacing.sm },
  missionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  missionTitle: { fontSize: 18, fontWeight: "800", color: colors.ink },
  missionSubtitle: { fontSize: 13, color: colors.inkMuted },
  missionXp: { fontSize: 13, color: colors.successDark, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  gridItem: { width: "31%" },
  gridCard: { alignItems: "center", paddingVertical: spacing.md, gap: spacing.xs },
  gridLabel: { fontSize: 12, fontWeight: "600", color: colors.ink, textAlign: "center" },
});
