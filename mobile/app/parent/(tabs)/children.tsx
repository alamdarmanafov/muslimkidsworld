import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { ProgressRing } from "../../../src/components/ProgressRing";
import { children } from "../../../src/data/mock";
import { colors, spacing } from "../../../src/theme/theme";

const MAX_SLOTS = 3;

export default function Children() {
  const { t } = useTranslation();
  const slotsUsed = children.length;
  const slotsFull = slotsUsed >= MAX_SLOTS;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("parentChildren.title")}</Text>
        <Text style={styles.slots}>
          {t("parentChildren.slots", { used: slotsUsed, max: MAX_SLOTS })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {children.map((child) => (
          <Card key={child.id} style={styles.row}>
            <Avatar emoji={child.emoji} color={child.color} size={48} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{child.name}</Text>
              <Text style={styles.rowMeta}>{t("parentChildren.yearsOld", { age: child.age })}</Text>
            </View>
            <ProgressRing percent={child.accuracy} size={48} strokeWidth={4} />
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={slotsFull ? t("parentChildren.noSlotsAvailable") : t("parentChildren.addChild")}
          disabled={slotsFull}
          onPress={() => router.push("/parent/add-child")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: 0,
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  slots: { fontSize: 13, color: colors.inkMuted, fontWeight: "600" },
  list: { padding: spacing.lg, gap: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 16, fontWeight: "700", color: colors.ink },
  rowMeta: { fontSize: 13, color: colors.inkMuted },
  footer: { padding: spacing.lg },
});
