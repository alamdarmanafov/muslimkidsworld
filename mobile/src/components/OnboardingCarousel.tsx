// mobile/src/components/OnboardingCarousel.tsx
//
// Shared chrome for the parent and child first-run walkthroughs
// (app/parent/onboarding.tsx, app/child/onboarding.tsx) — just the
// step dots, Back/Next/Skip buttons, and the finish callback; each
// screen supplies its own steps and calls this the same way.

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, type IconName } from "./icons";
import { colors, fonts, radii, spacing } from "../theme/theme";

export type OnboardingStep = {
  icon: IconName;
  iconBg: string;
  title: string;
  body: string;
};

export function OnboardingCarousel({
  steps,
  onFinish,
}: {
  steps: OnboardingStep[];
  onFinish: () => void;
}) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <View style={styles.container}>
      <Pressable style={styles.skip} onPress={onFinish} hitSlop={8}>
        <Text style={styles.skipText}>{t("onboarding.skip")}</Text>
      </Pressable>

      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: step.iconBg }]}>
          <Icon name={step.icon} size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.body}</Text>
      </View>

      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        {index > 0 ? (
          <Pressable style={styles.backBtn} onPress={() => setIndex((i) => i - 1)}>
            <Text style={styles.backText}>{t("onboarding.back")}</Text>
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Pressable
          style={styles.nextBtn}
          onPress={() => (isLast ? onFinish() : setIndex((i) => i + 1))}
        >
          <Text style={styles.nextText}>{isLast ? t("onboarding.getStarted") : t("onboarding.next")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: "space-between" },
  skip: { alignSelf: "flex-end" },
  skipText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.inkMuted },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink, textAlign: "center" },
  text: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: spacing.md,
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: spacing.xs, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.sm, minWidth: 60 },
  backText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.inkMuted },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  nextText: { fontFamily: fonts.bodyBold, fontSize: 15, color: "#FFFFFF" },
});
