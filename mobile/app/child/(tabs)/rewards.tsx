import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import { achievements, childStats } from "../../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const stats = [
  { label: "Badges", value: childStats.badges },
  { label: "Stars", value: childStats.stars },
  { label: "Days", value: childStats.days },
];

export default function Achievements() {
  const earned = achievements.filter((a) => a.earned);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Achievements</Text>

        <View style={styles.trophyCard}>
          <View style={styles.trophyIconWrap}>
            <Icon name="trophy" size={30} color={colors.goldDark} />
          </View>
          <Text style={styles.trophyTitle}>You're Amazing!</Text>
          <Text style={styles.trophySubtitle}>Keep learning and earn more rewards.</Text>

          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Badges</Text>
        <View style={styles.badgeGrid}>
          {earned.map((a) => (
            <View key={a.id} style={styles.badge}>
              <View style={[styles.badgeIconWrap, { backgroundColor: a.tone[0] }]}>
                <Icon name={a.icon} size={26} color={a.tone[1]} />
              </View>
              <Text style={styles.badgeLabel}>{a.label}</Text>
            </View>
          ))}
        </View>
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
