import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Card } from "../../../src/components/Card";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { children } from "../../../src/data/mock";
import { colors, spacing } from "../../../src/theme/theme";

const weekStats = [
  { icon: "book" as const, tone: tones.blue, label: "Lessons", value: 4 },
  { icon: "quiz" as const, tone: tones.pink, label: "Questions", value: 70 },
  { icon: "clock" as const, tone: tones.teal, label: "Time", value: "42 min" },
  { icon: "gift" as const, tone: tones.gold, label: "Rewards", value: 3 },
];

export default function ParentHome() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening,</Text>
            <Text style={styles.name}>Ahmed 👋</Text>
          </View>
          <Text style={styles.bell}>🔔</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Children</Text>
          <Pressable onPress={() => router.push("/parent/children")}>
            <Text style={styles.link}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.childrenRow}>
          {children.slice(0, 2).map((child) => (
            <Card key={child.id} style={styles.childCard}>
              <Avatar emoji={child.emoji} color={child.color} size={44} />
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childMeta}>
                Level {child.level} · 🔥 {child.streak}
              </Text>
            </Card>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <Pressable onPress={() => router.push("/parent/progress")}>
            <Text style={styles.link}>View Report</Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          {weekStats.map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <IconBadge icon={s.icon} tone={s.tone} size={40} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
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
  greeting: { fontSize: 14, color: colors.inkMuted },
  name: { fontSize: 24, fontWeight: "800", color: colors.ink },
  bell: { fontSize: 22 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
  link: { fontSize: 13, color: colors.primary, fontWeight: "600" },
  childrenRow: { flexDirection: "row", gap: spacing.md },
  childCard: { flex: 1, alignItems: "center", paddingVertical: spacing.md, gap: 4 },
  childName: { fontSize: 14, fontWeight: "700", color: colors.ink },
  childMeta: { fontSize: 12, color: colors.inkMuted },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  statCard: { width: "47%", alignItems: "center", paddingVertical: spacing.md, gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.ink },
  statLabel: { fontSize: 12, color: colors.inkMuted },
});
