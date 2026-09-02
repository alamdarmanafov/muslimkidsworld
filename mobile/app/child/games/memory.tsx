import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../src/components/Button";
import { Icon } from "../../../src/components/icons";
import { memoryDeck } from "../../../src/data/gamesData";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

type Card = { uid: number; cardId: string; emoji: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const doubled = [...memoryDeck, ...memoryDeck];
  return shuffle(doubled).map((c, uid) => ({ uid, cardId: c.id, emoji: c.emoji }));
}

export default function MemoryGame() {
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const won = matched.length === memoryDeck.length;

  function restart() {
    setCards(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  }

  function pressCard(card: Card) {
    if (busy || flipped.includes(card.uid) || matched.includes(card.cardId)) return;
    if (flipped.length === 2) return;

    const next = [...flipped, card.uid];
    setFlipped(next);

    if (next.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);
      const [a, b] = next;
      const cardA = cards.find((c) => c.uid === a)!;
      const cardB = cards.find((c) => c.uid === b)!;
      if (cardA.cardId === cardB.cardId) {
        setTimeout(() => {
          setMatched((prev) => [...prev, cardA.cardId]);
          setFlipped([]);
          setBusy(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 900);
      }
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("content.games.memory.title")}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.movesText}>{t("games.moves", { count: moves })}</Text>

        {won ? (
          <View style={styles.winCard}>
            <Icon name="trophy" size={40} color={colors.gold} />
            <Text style={styles.winTitle}>{t("games.wellDone")}</Text>
            <Text style={styles.winSubtitle}>{t("games.movesResult", { count: moves })}</Text>
            <Button label={t("games.playAgain")} onPress={restart} style={{ marginTop: spacing.md }} />
          </View>
        ) : (
          <View style={styles.grid}>
            {cards.map((card) => {
              const faceUp = flipped.includes(card.uid) || matched.includes(card.cardId);
              return (
                <Pressable
                  key={card.uid}
                  style={[styles.card, faceUp && styles.cardFaceUp]}
                  onPress={() => pressCard(card)}
                >
                  <Text style={styles.cardEmoji}>{faceUp ? card.emoji : "❓"}</Text>
                </Pressable>
              );
            })}
          </View>
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
  content: { flexGrow: 1, padding: spacing.lg, paddingTop: 0, justifyContent: "center" },
  movesText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
  card: {
    width: "28%",
    aspectRatio: 1,
    backgroundColor: colors.purple,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  cardFaceUp: { backgroundColor: colors.card },
  cardEmoji: { fontSize: 30 },
  winCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: "center",
    ...shadow,
  },
  winTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink, marginTop: spacing.sm },
  winSubtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.inkMuted, marginTop: spacing.xs },
});
