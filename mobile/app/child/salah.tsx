import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { prayers, salahStepIds } from "../../src/data/salah";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function Salah() {
  const { t } = useTranslation();
  const [showSteps, setShowSteps] = useState(false);

  if (showSteps) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => setShowSteps(false)} style={styles.backBtn}>
            <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.title}>{t("salah.howToPray")}</Text>
          <View style={styles.starWrap}>
            <Icon name="star" size={20} color={colors.gold} />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {salahStepIds.map((stepId, i) => (
            <View key={stepId} style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{i + 1}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepName}>{t(`content.salahSteps.${stepId}.name`)}</Text>
                <Text style={styles.stepDesc}>{t(`content.salahSteps.${stepId}.desc`)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("salah.title")}</Text>
        <View style={styles.starWrap}>
          <Icon name="star" size={20} color={colors.gold} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>{t("salah.subtitle")}</Text>

        {prayers.map((p) => (
          <View key={p.id} style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: colors.teal }]}>
              <Icon name={p.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.rowTitle}>{t(`content.prayers.${p.id}`)}</Text>
            <Text style={styles.rowRakats}>{t("salah.rakatsLabel", { count: p.rakats })}</Text>
          </View>
        ))}

        <Pressable style={styles.howToBtn} onPress={() => setShowSteps(true)}>
          <Text style={styles.howToBtnText}>{t("salah.howToPray")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { flex: 1, textAlign: "center", fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  starWrap: { width: 34, alignItems: "center" },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, marginBottom: spacing.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  rowRakats: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted },
  howToBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.successDark,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  howToBtnText: { fontFamily: fonts.bodyBold, fontSize: 15, color: "#FFFFFF" },
  stepCard: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.successDark,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: "#FFFFFF", fontFamily: fonts.bodyBold, fontSize: 13 },
  stepText: { flex: 1 },
  stepName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  stepDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, marginTop: 2, lineHeight: 19 },
});
