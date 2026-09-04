import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useIAP } from "expo-iap";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { plans } from "../../../src/data/mock";
import {
  fetchFamilySubscription,
  fetchPlanProducts,
  getCurrentParentId,
  verifyApplePurchase,
  type FamilySubscription,
  type PlanProduct,
} from "../../../src/lib/iap";
import { toast } from "../../../src/lib/toast";
import { colors, radii, spacing } from "../../../src/theme/theme";

export default function Premium() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(
    plans.find((p) => p.bestValue)?.id ?? plans[0].id,
  );
  const plan = plans.find((p) => p.id === selectedPlan)!;

  const [planProducts, setPlanProducts] = useState<PlanProduct[]>([]);
  const [subscription, setSubscription] = useState<FamilySubscription | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const {
    connected,
    subscriptions: storeSubscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    restorePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      if (Platform.OS !== "ios") return;
      const transactionId = (purchase as { transactionId?: string }).transactionId;
      if (!transactionId) {
        setPurchasing(false);
        setRestoring(false);
        return;
      }
      const result = await verifyApplePurchase(transactionId);
      if (result.ok) {
        await finishTransaction({ purchase, isConsumable: false });
        toast.success(t("parentPremium.purchaseSuccess"));
        setSubscription(await fetchFamilySubscription());
      } else {
        toast.error(t("parentPremium.purchaseFailed"));
      }
      setPurchasing(false);
      setRestoring(false);
    },
    onPurchaseError: () => {
      setPurchasing(false);
      setRestoring(false);
      toast.error(t("parentPremium.purchaseFailed"));
    },
  });

  useEffect(() => {
    fetchPlanProducts().then(setPlanProducts);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFamilySubscription().then(setSubscription);
    }, []),
  );

  useEffect(() => {
    if (Platform.OS === "ios" && connected && planProducts.length > 0) {
      fetchProducts({ skus: planProducts.map((p) => p.appleProductId), type: "subs" });
    }
  }, [connected, planProducts, fetchProducts]);

  const onContinue = async () => {
    if (Platform.OS !== "ios") {
      toast.error(t("parentPremium.iosOnly"));
      return;
    }
    const productId = planProducts.find((p) => p.slug === plan.id)?.appleProductId;
    if (!productId) {
      toast.error(t("parentPremium.purchaseFailed"));
      return;
    }
    // appAccountToken ties this transaction to this parent's own
    // account — Apple signs it in, and verify-apple-purchase refuses
    // to accept a transaction whose token doesn't match the caller
    // (otherwise anyone could claim credit for anyone else's real
    // purchase just by knowing its transaction id).
    const parentId = await getCurrentParentId();
    if (!parentId) {
      toast.error(t("parentPremium.purchaseFailed"));
      return;
    }
    setPurchasing(true);
    try {
      await requestPurchase({
        request: { apple: { sku: productId, appAccountToken: parentId } },
        type: "subs",
      });
    } catch {
      setPurchasing(false);
    }
  };

  const onRestore = async () => {
    if (Platform.OS !== "ios") {
      toast.error(t("parentPremium.iosOnly"));
      return;
    }
    setRestoring(true);
    try {
      await restorePurchases();
    } catch {
      setRestoring(false);
    }
  };

  if (subscription?.status === "active") {
    const activePlanLabel = plans.find((p) => p.id === subscription.planSlug)?.id;
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.content}>
          <IconBadge icon="crown" tone={tones.gold} size={72} />
          <Text style={styles.title}>{t("parentPremium.activeTitle")}</Text>
          <Text style={styles.subtitle}>
            {t("parentPremium.activeBody", {
              plan: activePlanLabel ? t(`content.plans.${activePlanLabel}.name`) : "",
            })}
          </Text>
          <Text style={styles.manageNote}>{t("parentPremium.manageNote")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <IconBadge icon="crown" tone={tones.gold} size={72} />
        <Text style={styles.title}>{t("parentPremium.title")}</Text>
        <Text style={styles.subtitle}>{t("parentPremium.subtitle")}</Text>

        <View style={styles.plansRow}>
          {plans.map((p) => {
            const selected = p.id === selectedPlan;
            const storeProduct = storeSubscriptions.find(
              (s) => s.id === planProducts.find((pp) => pp.slug === p.id)?.appleProductId,
            );
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPlan(p.id)}
                style={[styles.planCard, selected && styles.planCardSelected]}
              >
                {p.bestValue ? (
                  <Text style={styles.bestValue}>{t("parentPremium.bestValue")}</Text>
                ) : null}
                <Text style={styles.planName}>{t(`content.plans.${p.id}.name`)}</Text>
                <Text style={styles.planPrice}>
                  {storeProduct?.displayPrice ?? p.price}
                  {storeProduct ? null : <Text style={styles.planPeriod}> {p.period}</Text>}
                </Text>
                <Text style={styles.planLimit}>{t(`content.plans.${p.id}.childLimit`)}</Text>
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
          {(t(`content.plans.${plan.id}.features`, { returnObjects: true }) as string[]).map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.check}>✅</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Card>

        {Platform.OS === "ios" ? (
          <Pressable onPress={onRestore} disabled={restoring} style={styles.restoreButton}>
            {restoring ? (
              <ActivityIndicator size="small" color={colors.inkMuted} />
            ) : (
              <Text style={styles.restoreText}>{t("parentPremium.restore")}</Text>
            )}
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={purchasing ? t("parentPremium.purchasing") : t("parentPremium.continue")}
          variant="success"
          onPress={onContinue}
          disabled={purchasing}
        />
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
  manageNote: {
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.lg,
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
  restoreButton: { marginTop: spacing.lg, padding: spacing.sm },
  restoreText: { fontSize: 13, color: colors.inkMuted, fontWeight: "600", textDecorationLine: "underline" },
  footer: { padding: spacing.lg },
});
