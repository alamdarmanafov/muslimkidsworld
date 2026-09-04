import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { fetchChildProgress } from "../../src/lib/childProgress";
import { fetchStories } from "../../src/lib/stories";
import type { Story } from "../../src/lib/stories";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

type StoryListItem = Omit<Story, "paragraphs">;

export default function Stories() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<StoryListItem[]>([]);
  const [childLevel, setChildLevel] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchStories(i18n.language), fetchChildProgress()]).then(([list, progress]) => {
      if (cancelled) return;
      setStories(list ?? []);
      if (progress) setChildLevel(progress.progress.level);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  const [featured, ...rest] = stories;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("stories.title")}</Text>
        <View style={styles.starWrap}>
          <Icon name="star" size={20} color={colors.gold} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : !featured ? (
        <Text style={styles.emptyText}>{t("stories.unavailable")}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable
            style={[styles.featuredCard, { backgroundColor: colors.fire }]}
            onPress={() => router.push(`/child/stories/${featured.id}`)}
          >
            <Icon name={featured.icon} size={40} color="#FFFFFF" />
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredSubtitle}>{featured.subtitle}</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>{t("stories.moreStories")}</Text>
          <View style={styles.grid}>
            {rest.map((s) => {
              const locked = childLevel < s.unlockLevel;
              return (
                <Pressable
                  key={s.id}
                  style={[styles.tile, locked && styles.tileLocked]}
                  disabled={locked}
                  onPress={() => router.push(`/child/stories/${s.id}`)}
                >
                  <View style={[styles.tileIconWrap, { backgroundColor: s.tone[0] }]}>
                    <Icon name={s.icon} size={26} color={s.tone[1]} />
                  </View>
                  <Text style={styles.tileTitle}>{s.title}</Text>
                  {locked ? <Icon name="lock" size={14} color={colors.locked} /> : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
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
  title: { flex: 1, textAlign: "center", fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  starWrap: { width: 34, alignItems: "center" },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
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
