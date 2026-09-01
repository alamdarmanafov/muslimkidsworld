import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { quranSurahs } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function Quran() {
  const [featured, ...rest] = quranSurahs;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Quran</Text>
        <Icon name="star" size={20} color={colors.gold} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.featuredCard}>
          <View style={styles.featuredTop}>
            <Text style={styles.featuredLabel}>Surah {featured.name}</Text>
            <Pressable style={styles.playBtn}>
              <Icon name="play" size={18} color={colors.successDark} />
            </Pressable>
          </View>
          <Text style={styles.featuredJuz}>{featured.juz}</Text>
        </View>

        {rest.map((s) => (
          <View key={s.id} style={[styles.row, s.locked && styles.rowLocked]}>
            <View>
              <Text style={styles.rowName}>Surah {s.name}</Text>
              <Text style={styles.rowJuz}>{s.juz}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowArabic}>{s.arabicName}</Text>
              {s.locked ? (
                <Icon name="lock" size={16} color={colors.locked} />
              ) : (
                <Icon name="play" size={16} color={colors.successDark} />
              )}
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
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.sm },
  featuredCard: {
    backgroundColor: colors.successDark,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadow,
  },
  featuredTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredLabel: { fontFamily: fonts.heading, fontSize: 18, color: "#FFFFFF" },
  featuredJuz: { fontFamily: fonts.body, fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowLocked: { opacity: 0.6 },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  rowJuz: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted, marginTop: 2 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rowArabic: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
});
