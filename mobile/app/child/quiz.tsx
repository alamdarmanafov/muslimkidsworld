import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { IconBadge } from "../../src/components/IconBadge";
import {
  getQuizQuestions,
  latestReward,
  type ForeignTargetLang,
  type QuizCategory,
  type QuizDifficulty,
} from "../../src/data/mock";
import { colors, radii, spacing } from "../../src/theme/theme";

type Phase = "question" | "feedback" | "reward";

const optionColors = ["#FBBF24", "#22C55E", "#8B5CF6", "#3B82F6"];

function resolveOptionText(option: { textKey?: string; text?: string; emoji: string }, t: (key: string) => string) {
  if (option.textKey) return t(option.textKey);
  return option.text ?? option.emoji;
}

export default function Quiz() {
  const { t, i18n } = useTranslation();
  const { category, targetLang, difficulty } = useLocalSearchParams<{
    category: QuizCategory;
    targetLang?: ForeignTargetLang;
    difficulty?: QuizDifficulty;
  }>();
  const questions = getQuizQuestions(category ?? "din", targetLang, difficulty, i18n.language);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [earnedXp, setEarnedXp] = useState(0);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function selectOption(optionId: string) {
    setSelectedId(optionId);
    if (optionId === question.correctOptionId) {
      setEarnedXp(question.xp);
    } else {
      setEarnedXp(0);
    }
    setPhase("feedback");
  }

  function next() {
    if (isLast) {
      setPhase("reward");
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setPhase("question");
  }

  if (phase === "reward") {
    return (
      <SafeAreaView style={styles.rewardScreen}>
        <Pressable style={styles.closeBtn} onPress={() => router.replace("/child")}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.rewardBody}>
          <Text style={styles.rewardTitle}>{t("quiz.newRewardUnlocked")}</Text>
          <View style={styles.rewardImageWrap}>
            <IconBadge
              icon={latestReward.icon}
              tone={latestReward.tone}
              size={112}
            />
          </View>
          <Text style={styles.rewardName}>{t(`content.rewards.${latestReward.id}`)}</Text>
          <Text style={styles.rewardLevel}>
            {t("quiz.levelReward", { level: latestReward.unlockLevel })}
          </Text>
        </View>
        <View style={styles.footer}>
          <Button label={t("quiz.awesome")} onPress={() => router.replace("/child")} />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === "feedback") {
    const correct = selectedId === question.correctOptionId;
    const correctOption = question.options.find((o) => o.id === question.correctOptionId);
    const explanation = question.explanationKey ? t(question.explanationKey) : null;
    return (
      <SafeAreaView style={styles.feedbackScreen}>
        <View style={styles.feedbackBody}>
          <View
            style={[
              styles.resultCircle,
              { backgroundColor: correct ? colors.success : colors.gold },
            ]}
          >
            <Text style={styles.resultIcon}>{correct ? "✓" : "💡"}</Text>
          </View>
          <Text style={styles.feedbackTitle}>
            {correct ? t("quiz.greatJob") : t("quiz.notQuite")}
          </Text>
          <Text style={styles.feedbackSubtitle}>
            {correct ? t("quiz.answeredCorrectly") : t("quiz.tryNextOne")}
          </Text>
          {!correct && correctOption ? (
            <Text style={styles.correctAnswer}>
              {t("quiz.correctAnswerWas", { answer: resolveOptionText(correctOption, t) })}
            </Text>
          ) : null}
          {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
          {correct ? <Text style={styles.xpEarned}>⭐ +{earnedXp} XP</Text> : null}
        </View>
        <View style={styles.footer}>
          <Button
            label={isLast ? t("quiz.seeReward") : t("quiz.nextQuestion")}
            variant="success"
            onPress={next}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/child")}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.progressLabel}>
          {t("quiz.questionOf", { current: index + 1, total: questions.length })}
        </Text>
        <Text style={styles.speaker}>🔊</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((index + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.questionBlock}>
        <Text style={styles.prompt}>
          {question.promptText ??
            t(question.promptKey ?? `content.quiz.${question.id}`, question.promptParams)}
        </Text>

        <View style={styles.optionsGrid}>
          {question.options.map((option, i) => (
            <Pressable
              key={option.id}
              style={styles.optionCard}
              onPress={() => selectOption(option.id)}
            >
              <View style={[styles.optionBadge, { backgroundColor: optionColors[i] }]}>
                <Text style={styles.optionBadgeText}>{option.label}</Text>
              </View>
              <Text style={option.textKey || option.text ? styles.optionText : styles.optionEmoji}>
                {resolveOptionText(option, t)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.card, padding: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  closeText: { fontSize: 20, color: colors.inkMuted },
  progressLabel: { fontSize: 13, fontWeight: "700", color: colors.ink },
  speaker: { fontSize: 18 },
  progressTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  progressFill: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
  },
  questionBlock: {
    marginTop: spacing.xl,
  },
  prompt: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  optionCard: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
  },
  optionBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  optionEmoji: { fontSize: 44 },
  optionText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
    paddingHorizontal: spacing.sm,
  },

  feedbackScreen: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  feedbackBody: { flex: 1, alignItems: "center", justifyContent: "center" },
  resultCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  resultIcon: { fontSize: 44, color: "#fff", fontWeight: "800" },
  feedbackTitle: { fontSize: 26, fontWeight: "800", color: colors.ink },
  feedbackSubtitle: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.xs },
  correctAnswer: {
    marginTop: spacing.md,
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
  },
  explanation: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
  },
  xpEarned: {
    marginTop: spacing.lg,
    fontSize: 18,
    fontWeight: "800",
    color: colors.gold,
  },

  rewardScreen: { flex: 1, backgroundColor: "#FDF3D8", padding: spacing.lg },
  closeBtn: { alignSelf: "flex-end" },
  rewardBody: { flex: 1, alignItems: "center", justifyContent: "center" },
  rewardTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  rewardImageWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  rewardName: { fontSize: 20, fontWeight: "800", color: colors.ink },
  rewardLevel: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.xs },
  footer: { paddingBottom: spacing.md },
});
