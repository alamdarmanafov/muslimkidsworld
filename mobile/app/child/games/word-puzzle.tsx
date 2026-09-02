import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../src/components/Button";
import { Icon } from "../../../src/components/icons";
import { arabicWords, type ArabicWordDef } from "../../../src/data/gamesData";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

type BankTile = { uid: number; letter: string; used: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWord(excludeId?: string): ArabicWordDef {
  const options = arabicWords.filter((w) => w.id !== excludeId);
  return options[Math.floor(Math.random() * options.length)] ?? arabicWords[0];
}

function buildBank(word: ArabicWordDef): BankTile[] {
  let letters = shuffle(word.letters);
  if (letters.join("") === word.letters.join("") && word.letters.length > 1) {
    letters = shuffle(word.letters);
  }
  return letters.map((letter, uid) => ({ uid, letter, used: false }));
}

export default function WordPuzzleGame() {
  const { t } = useTranslation();
  const [word, setWord] = useState<ArabicWordDef>(() => pickWord());
  const [bank, setBank] = useState<BankTile[]>(() => buildBank(word));
  const [answer, setAnswer] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  function nextRound() {
    const w = pickWord(word.id);
    setWord(w);
    setBank(buildBank(w));
    setAnswer([]);
    setSolved(false);
  }

  function clearAttempt() {
    setBank(bank.map((t) => ({ ...t, used: false })));
    setAnswer([]);
  }

  function pressTile(tile: BankTile) {
    if (tile.used || solved) return;
    const expected = word.letters[answer.length];
    if (tile.letter !== expected) return;

    setBank((prev) => prev.map((t) => (t.uid === tile.uid ? { ...t, used: true } : t)));
    const nextAnswer = [...answer, tile.letter];
    setAnswer(nextAnswer);
    if (nextAnswer.length === word.letters.length) {
      setSolved(true);
      setSolvedCount((c) => c + 1);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("content.games.word-puzzle.title")}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.solvedText}>{t("games.wordsSolved", { count: solvedCount })}</Text>

        <View style={styles.answerRow}>
          {word.letters.map((_, i) => (
            <View key={i} style={[styles.answerSlot, answer[i] && styles.answerSlotFilled]}>
              <Text style={styles.answerLetter}>{answer[i] ?? ""}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bankRow}>
          {bank.map((tile) => (
            <Pressable
              key={tile.uid}
              style={[styles.bankTile, tile.used && styles.bankTileUsed]}
              onPress={() => pressTile(tile)}
              disabled={tile.used}
            >
              <Text style={styles.bankLetter}>{tile.letter}</Text>
            </Pressable>
          ))}
        </View>

        {solved ? (
          <View style={styles.winCard}>
            <Icon name="trophy" size={36} color={colors.gold} />
            <Text style={styles.winTitle}>{t(`content.arabicWords.${word.id}`)}</Text>
            <Text style={styles.winSubtitle}>{t("games.wellDone")}</Text>
            <Button label={t("games.nextWord")} onPress={nextRound} style={{ marginTop: spacing.md }} />
          </View>
        ) : (
          <Button
            label={t("games.clearAttempt")}
            variant="outline"
            onPress={clearAttempt}
            style={{ marginTop: spacing.lg }}
          />
        )}
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
  title: { flex: 1, textAlign: "center", fontFamily: fonts.heading, fontSize: 16, color: colors.ink },
  content: { padding: spacing.lg, paddingTop: 0 },
  solvedText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  answerRow: { flexDirection: "row", justifyContent: "center", gap: spacing.sm, marginBottom: spacing.xl },
  answerSlot: {
    width: 44,
    height: 52,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.inkMuted,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  answerSlotFilled: { borderStyle: "solid", borderColor: colors.success, backgroundColor: "#DCFCE7" },
  answerLetter: { fontFamily: fonts.bodyBold, fontSize: 24, color: colors.ink },
  bankRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm },
  bankTile: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  bankTileUsed: { opacity: 0.25 },
  bankLetter: { fontFamily: fonts.bodyBold, fontSize: 24, color: colors.ink },
  winCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginTop: spacing.xl,
    ...shadow,
  },
  winTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.ink, marginTop: spacing.sm },
  winSubtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.inkMuted, marginTop: spacing.xs },
});
