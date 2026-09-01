import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../../src/components/Card";
import { IconBadge } from "../../../src/components/IconBadge";
import { activeChild, worldLocations } from "../../../src/data/mock";
import { colors, radii, spacing } from "../../../src/theme/theme";

export default function World() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My World</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>⭐ {activeChild.xp}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {worldLocations.map((loc) => {
          const locked = activeChild.level < loc.unlockLevel;
          return (
            <Card key={loc.id} style={styles.locationCard}>
              <View style={locked && styles.dim}>
                <IconBadge icon={loc.icon} tone={loc.tone} size={64} />
              </View>
              <Text style={[styles.name, locked && styles.dim]}>{loc.name}</Text>
              {locked ? (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockText}>🔒 Lvl {loc.unlockLevel}</Text>
                </View>
              ) : null}
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.skyBottom },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  xpBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  xpText: { fontWeight: "700", color: colors.ink },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    padding: spacing.lg,
  },
  locationCard: {
    width: "45%",
    alignItems: "center",
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  name: { fontSize: 13, fontWeight: "700", color: colors.ink, textAlign: "center" },
  dim: { opacity: 0.4 },
  lockBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  lockText: { fontSize: 11, color: colors.inkMuted, fontWeight: "600" },
});
