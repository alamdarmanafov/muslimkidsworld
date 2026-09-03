import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { Icon } from "../../../src/components/icons";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { fetchChildren, type ParentChild } from "../../../src/lib/children";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

const weekStats = [
  { icon: "book" as const, tone: tones.blue, labelKey: "parentHome.lessons", value: 4 },
  { icon: "quiz" as const, tone: tones.pink, labelKey: "parentHome.questions", value: 70 },
  { icon: "clock" as const, tone: tones.teal, labelKey: "parentHome.time", value: "42 min" },
  { icon: "gift" as const, tone: tones.gold, labelKey: "parentHome.rewardsLabel", value: 3 },
];

export default function ParentHome() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ParentChild[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchChildren().then((result) => {
        setChildren(result ?? []);
        setLoading(false);
      });
    }, []),
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t("parentHome.goodEvening")}</Text>
          </View>
          <Text style={styles.bell}>🔔</Text>
        </View>

        <Pressable style={styles.codeBox} onPress={() => router.push("/parent/family-code")}>
          <Icon name="users" size={22} color={colors.gold} style={{ marginBottom: spacing.xs }} />
          <Text style={styles.codeLabel}>{t("parentHome.connectChild")}</Text>
          <Text style={styles.codeHint}>{t("parentHome.tapForCode")}</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("parentHome.myChildren")}</Text>
          <Pressable onPress={() => router.push("/parent/children")}>
            <Text style={styles.link}>{t("parentHome.viewAll")}</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : children.length === 0 ? (
          <Button label={t("parentChildren.addChild")} onPress={() => router.push("/parent/add-child")} />
        ) : (
          <View style={styles.childrenRow}>
            {children.slice(0, 2).map((child) => (
              <Card key={child.id} style={styles.childCard}>
                <Avatar emoji={child.emoji} color={child.color} size={44} />
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childMeta}>
                  {t("parentHome.level")} {child.level} · 🔥 {child.streak}
                </Text>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("parentHome.thisWeek")}</Text>
          <Pressable onPress={() => router.push("/parent/progress")}>
            <Text style={styles.link}>{t("parentHome.viewReport")}</Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          {weekStats.map((s) => (
            <Card key={s.labelKey} style={styles.statCard}>
              <IconBadge icon={s.icon} tone={s.tone} size={40} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{t(s.labelKey)}</Text>
            </Card>
          ))}
        </View>

        <Pressable style={styles.premiumButton} onPress={() => router.push("/parent/premium")}>
          <Icon name="crown" size={18} color={colors.night} />
          <Text style={styles.premiumButtonText}>{t("parentHome.managePremium")}</Text>
        </Pressable>
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
  codeHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onNightMuted,
    marginTop: 2,
  },
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
});
