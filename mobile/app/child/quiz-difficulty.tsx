import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import type { ForeignTargetLang, QuizCategory, QuizDifficulty } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

const levels: { difficulty: QuizDifficulty; emoji: string; bg: string }[] = [
  { difficulty: "easy", emoji: "🟢", bg: colors.success },
  { difficulty: "medium", emoji: "🔵", bg: colors.primary },
  { difficulty: "hard", emoji: "🟣", bg: colors.purple },
];

export default function QuizDifficulty() {
  const { t } = useTranslation();
  const { category, targetLang } = useLocalSearchParams<{
    category: QuizCategory;
    targetLang?: ForeignTargetLang;
  }>();

  function choose(difficulty: QuizDifficulty) {
    const params = new URLSearchParams({ category, difficulty });
    if (targetLang) params.set("targetLang", targetLang);
    router.push(`/child/quiz?${params.toString()}`);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("quizDifficulty.title")}</Text>
        <Icon name="star" size={20} color={colors.gold} />
      </View>

      <View style={styles.content}>
        {levels.map((level) => (
          <Pressable
            key={level.difficulty}
            style={[styles.card, { borderColor: level.bg }]}
            onPress={() => choose(level.difficulty)}
          >
            <Text style={styles.emoji}>{level.emoji}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{t(`quizDifficulty.${level.difficulty}`)}</Text>
              <Text style={styles.cardAge}>{t(`quizDifficulty.${level.difficulty}Age`)}</Text>
            </View>
          </Pressable>
        ))}
      </View>
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
  content: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing.lg,
    ...shadow,
  },
  emoji: { fontSize: 36 },
  cardText: { flex: 1 },
  cardTitle: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink },
  cardAge: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, marginTop: 2 },
});
