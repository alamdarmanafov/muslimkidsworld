import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { duas, type DuaCategory } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

const categories: DuaCategory[] = ["Morning", "Evening", "Sleep", "Eat"];
const categoryLabelKeys: Record<DuaCategory, string> = {
  Morning: "dua.categoryMorning",
  Evening: "dua.categoryEvening",
  Sleep: "dua.categorySleep",
  Eat: "dua.categoryEat",
};

export default function Dua() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<DuaCategory>("Morning");
  const active = duas.find((d) => d.category === category) ?? duas[0];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("dua.title")}</Text>
        <Icon name="star" size={20} color={colors.gold} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{active.title}</Text>
          <Text style={styles.arabic}>{active.arabic}</Text>
          <Text style={styles.transliteration}>{active.transliteration}</Text>

          <View style={styles.controls}>
            <Pressable style={styles.smallBtn}>
              <Icon name="skipBack" size={16} color={colors.purple} />
            </Pressable>
            <Pressable style={styles.playBtn}>
              <Icon name="play" size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.smallBtn}>
              <Icon name="skipForward" size={16} color={colors.purple} />
            </Pressable>
          </View>
        </View>

        <View style={styles.categoryRow}>
          {categories.map((c) => (
            <Pressable
              key={c}
              style={[styles.categoryChip, c === category && styles.categoryChipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.categoryText, c === category && styles.categoryTextActive]}>
                {t(categoryLabelKeys[c])}
              </Text>
            </Pressable>
          ))}
        </View>
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
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  content: { padding: spacing.lg, paddingTop: 0 },
  card: {
    backgroundColor: "#EDE6FB",
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  cardTitle: { fontFamily: fonts.heading, fontSize: 16, color: colors.purple, marginBottom: spacing.md },
  arabic: { fontFamily: fonts.bodyBold, fontSize: 22, color: colors.ink, textAlign: "center", lineHeight: 34 },
  transliteration: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    fontStyle: "italic",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  smallBtn: { padding: spacing.xs },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  categoryChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  categoryChipActive: { backgroundColor: colors.purple },
  categoryText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.inkMuted },
  categoryTextActive: { color: "#FFFFFF" },
});
