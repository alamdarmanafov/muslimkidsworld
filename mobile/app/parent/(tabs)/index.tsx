import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Card } from "../../../src/components/Card";
import { Icon, type IconName } from "../../../src/components/icons";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { children, familyCode } from "../../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const weekStats = [
  { icon: "book" as const, tone: tones.blue, label: "Lessons", value: 4 },
  { icon: "quiz" as const, tone: tones.pink, label: "Questions", value: 70 },
  { icon: "clock" as const, tone: tones.teal, label: "Time", value: "42 min" },
  { icon: "gift" as const, tone: tones.gold, label: "Rewards", value: 3 },
];

const parentTools: { icon: IconName; label: string; href: string }[] = [
  { icon: "chartBar", label: "Learning progress", href: "/parent/progress" },
  { icon: "users", label: "Manage children", href: "/parent/children" },
  { icon: "clock", label: "Daily Limit", href: "/parent/daily-limit" },
  { icon: "lock", label: "Parent PIN & safety", href: "/parent/profile" },
  { icon: "smile", label: "Settings", href: "/parent/profile" },
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

        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>YOUR FAMILY CODE</Text>
          <Text style={styles.code}>{familyCode}</Text>
          <Text style={styles.codeHint}>Share this code with your child</Text>
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

        <Pressable style={styles.premiumButton} onPress={() => router.push("/parent/premium")}>
          <Icon name="crown" size={18} color={colors.night} />
          <Text style={styles.premiumButtonText}>Manage Premium Family</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Parent tools</Text>
        <View style={styles.toolsList}>
          {parentTools.map((t) => (
            <Pressable
              key={t.label}
              style={styles.toolRow}
              onPress={() => router.push(t.href as never)}
            >
              <Icon name={t.icon} size={18} color={colors.ink} />
              <Text style={styles.toolLabel}>{t.label}</Text>
              <Icon name="arrowRight" size={16} color={colors.inkMuted} />
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
  bell: { fontSize: 22 },
  codeBox: {
    backgroundColor: colors.night,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  codeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.onNightMuted,
  },
  code: {
    fontFamily: fonts.heading,
    fontSize: 32,
    letterSpacing: 6,
    color: colors.gold,
    marginVertical: spacing.xs,
  },
  codeHint: { fontFamily: fonts.body, fontSize: 12, color: colors.onNightMuted },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  link: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.primary },
  childrenRow: { flexDirection: "row", gap: spacing.md },
  childCard: { flex: 1, alignItems: "center", paddingVertical: spacing.md, gap: 4 },
  childName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  childMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  statCard: { width: "47%", alignItems: "center", paddingVertical: spacing.md, gap: 4 },
  statValue: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  statLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.gold,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  premiumButtonText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.night },
  toolsList: { gap: spacing.sm },
  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadow,
  },
  toolLabel: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
});
