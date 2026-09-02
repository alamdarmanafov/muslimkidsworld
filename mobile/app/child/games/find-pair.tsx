import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../src/components/Button";
import { Icon } from "../../../src/components/icons";
import { islamicSymbols } from "../../../src/data/gamesData";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FindPairGame() {
  const { t } = useTranslation();
  const [emojiOrder, setEmojiOrder] = useState(() => shuffle(islamicSymbols));
  const [nameOrder, setNameOrder] = useState(() => shuffle(islamicSymbols));
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ emoji: string; name: string } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const won = matched.length === islamicSymbols.length;

  function restart() {
    setEmojiOrder(shuffle(islamicSymbols));
    setNameOrder(shuffle(islamicSymbols));
    setSelected(null);
    setWrongPair(null);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  }

  function pressEmoji(id: string) {
    if (busy || matched.includes(id)) return;
    setSelected(id);
  }

  function pressName(id: string) {
    if (busy || matched.includes(id) || !selected) return;
    setMoves((m) => m + 1);
    if (selected === id) {
      setMatched((prev) => [...prev, id]);
      setSelected(null);
    } else {
      setBusy(true);
      setWrongPair({ emoji: selected, name: id });
      setTimeout(() => {
        setWrongPair(null);
        setSelected(null);
        setBusy(false);
      }, 600);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("content.games.find-pair.title")}</Text>
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
          <View style={styles.columns}>
            <View style={styles.column}>
              {emojiOrder.map((s) => {
                const isMatched = matched.includes(s.id);
                const isSelected = selected === s.id;
                const isWrong = wrongPair?.emoji === s.id;
                return (
                  <Pressable
                    key={s.id}
                    style={[
                      styles.emojiCard,
                      isSelected && styles.cardSelected,
                      isMatched && styles.cardMatched,
                      isWrong && styles.cardWrong,
                    ]}
                    onPress={() => pressEmoji(s.id)}
                    disabled={isMatched}
                  >
                    <Text style={styles.emoji}>{s.emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.column}>
              {nameOrder.map((s) => {
                const isMatched = matched.includes(s.id);
                const isWrong = wrongPair?.name === s.id;
                return (
                  <Pressable
                    key={s.id}
                    style={[styles.nameCard, isMatched && styles.cardMatched, isWrong && styles.cardWrong]}
                    onPress={() => pressName(s.id)}
                    disabled={isMatched}
                  >
                    <Text style={styles.nameText}>{t(`content.islamicSymbols.${s.id}`)}</Text>
                  </Pressable>
                );
              })}
            </View>
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
    paddingTop: spacing.xl * 1.5,
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
  columns: { flexDirection: "row", gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  emojiCard: {
    height: 64,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    ...shadow,
  },
  nameCard: {
    height: 64,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadow,
  },
  emoji: { fontSize: 30 },
  nameText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink, textAlign: "center" },
  cardSelected: { borderColor: colors.primary },
  cardMatched: { backgroundColor: "#DCFCE7", borderColor: colors.success },
  cardWrong: { borderColor: colors.fire },
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
