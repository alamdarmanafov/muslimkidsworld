import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { games } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function Games() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("games.title")}</Text>
        <Icon name="star" size={20} color={colors.gold} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {games.map((g) => (
          <Pressable key={g.id} style={styles.row} onPress={() => router.push(`/child/games/${g.id}`)}>
            <View style={[styles.iconWrap, { backgroundColor: g.tone[0] }]}>
              <Icon name={g.icon} size={28} color={g.tone[1]} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t(`content.games.${g.id}.title`)}</Text>
              <Text style={styles.rowSubtitle}>{t(`content.games.${g.id}.subtitle`)}</Text>
            </View>
            <Icon name="arrowRight" size={18} color={colors.inkMuted} />
          </Pressable>
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
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  content: { flexGrow: 1, padding: spacing.lg, paddingTop: 0, gap: spacing.md, justifyContent: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  rowSubtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted, marginTop: 2 },
});
