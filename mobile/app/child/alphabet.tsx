import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { arabicAlphabet } from "../../src/data/alphabet";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function Alphabet() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("alphabet.title")}</Text>
        <View style={styles.starWrap}>
          <Icon name="star" size={20} color={colors.gold} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {arabicAlphabet.map((l) => (
            <View key={l.id} style={styles.card}>
              <Text style={styles.letter}>{l.letter}</Text>
              <Text style={styles.name}>{t(`content.alphabet.${l.id}`)}</Text>
            </View>
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
  title: { flex: 1, textAlign: "center", fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  starWrap: { width: 34, alignItems: "center" },
  content: { padding: spacing.lg, paddingTop: 0 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    ...shadow,
  },
  letter: { fontFamily: fonts.bodyBold, fontSize: 28, color: colors.goldDark },
  name: { fontFamily: fonts.body, fontSize: 10, color: colors.inkMuted },
});
