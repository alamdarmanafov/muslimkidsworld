import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { plans } from "../../../src/data/mock";
import { colors, radii, spacing } from "../../../src/theme/theme";

export default function Premium() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(
    plans.find((p) => p.bestValue)?.id ?? plans[0].id,
  );
  const plan = plans.find((p) => p.id === selectedPlan)!;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <IconBadge icon="crown" tone={tones.gold} size={72} />
        <Text style={styles.title}>{t("parentPremium.title")}</Text>
        <Text style={styles.subtitle}>{t("parentPremium.subtitle")}</Text>

        <View style={styles.plansRow}>
          {plans.map((p) => {
            const selected = p.id === selectedPlan;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPlan(p.id)}
                style={[styles.planCard, selected && styles.planCardSelected]}
              >
                {p.bestValue ? (
                  <Text style={styles.bestValue}>{t("parentPremium.bestValue")}</Text>
                ) : null}
                <Text style={styles.planName}>{p.name}</Text>
                <Text style={styles.planPrice}>
                  {p.price}
                  <Text style={styles.planPeriod}> {p.period}</Text>
                </Text>
                <Text style={styles.planLimit}>{p.childLimit}</Text>
                <View
                  style={[styles.radio, selected && styles.radioSelected]}
                >
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Card style={styles.featuresCard}>
          {plan.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.check}>✅</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={t("parentPremium.continue")} variant="success" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.ink, marginTop: spacing.sm },
  subtitle: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  plansRow: { flexDirection: "row", gap: spacing.md, width: "100%" },
  planCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  planCardSelected: { borderColor: colors.success, backgroundColor: "#F0FDF4" },
  bestValue: {
    position: "absolute",
    top: -10,
    right: spacing.sm,
    backgroundColor: colors.success,
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  planName: { fontSize: 13, fontWeight: "700", color: colors.ink },
  planPrice: { fontSize: 20, fontWeight: "800", color: colors.ink, marginTop: spacing.xs },
  planPeriod: { fontSize: 12, color: colors.inkMuted, fontWeight: "400" },
  planLimit: { fontSize: 12, color: colors.inkMuted, marginTop: spacing.xs },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: colors.success },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  featuresCard: { width: "100%", marginTop: spacing.lg, gap: spacing.sm },
  featureRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  check: { fontSize: 14 },
  featureText: { fontSize: 14, color: colors.ink },
  footer: { padding: spacing.lg },
});
