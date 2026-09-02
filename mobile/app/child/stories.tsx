import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { stories } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function Stories() {
  const { t } = useTranslation();
  const [featured, ...rest] = stories;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("stories.title")}</Text>
        <Icon name="star" size={20} color={colors.gold} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={[styles.featuredCard, { backgroundColor: colors.fire }]}>
          <Icon name={featured.icon} size={40} color="#FFFFFF" />
          <Text style={styles.featuredTitle}>{t(`content.stories.${featured.id}.title`)}</Text>
          <Text style={styles.featuredSubtitle}>{t(`content.stories.${featured.id}.subtitle`)}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>{t("stories.moreStories")}</Text>
        <View style={styles.grid}>
          {rest.map((s) => (
            <Pressable key={s.id} style={[styles.tile, s.locked && styles.tileLocked]}>
              <View style={[styles.tileIconWrap, { backgroundColor: s.tone[0] }]}>
                <Icon name={s.icon} size={26} color={s.tone[1]} />
              </View>
              <Text style={styles.tileTitle}>{t(`content.stories.${s.id}.title`)}</Text>
              {s.locked ? <Icon name="lock" size={14} color={colors.locked} /> : null}
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
  featuredCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  featuredTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: spacing.sm,
  },
  featuredSubtitle: { fontFamily: fonts.body, fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink, marginBottom: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  tileLocked: { opacity: 0.6 },
  tileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.ink },
});
