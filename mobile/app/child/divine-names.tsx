import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { getDivineNames } from "../../src/data/divineNamesLoader";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function DivineNames() {
  const { t, i18n } = useTranslation();
  const names = getDivineNames(i18n.language);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("divineNames.title")}</Text>
        <View style={styles.starWrap}>
          <Icon name="star" size={20} color={colors.gold} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {names.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>{n.number}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.arabic}>{n.arabic}</Text>
              <Text style={styles.name}>{n.name}</Text>
              <Text style={styles.meaning}>{n.meaning}</Text>
            </View>
          </View>
        ))}
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow,
  },
  numberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.goldDark,
    alignItems: "center",
    justifyContent: "center",
  },
  numberBadgeText: { color: "#FFFFFF", fontFamily: fonts.bodyBold, fontSize: 12 },
  cardBody: { flex: 1 },
  arabic: { fontFamily: fonts.bodyBold, fontSize: 20, color: colors.ink, textAlign: "right" },
  name: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.goldDark, marginTop: 2 },
  meaning: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted, marginTop: 2 },
});
