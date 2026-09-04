import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../src/components/icons";
import { markJourneyItem, markStoryRead } from "../../../src/lib/childProgress";
import { fetchStoryDetail, type Story } from "../../../src/lib/stories";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function StoryDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStoryDetail(id, i18n.language).then((detail) => {
      if (cancelled) return;
      setStory(detail);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, i18n.language]);

  useEffect(() => {
    if (!story) return;
    markJourneyItem("story");
    markStoryRead(story.id);
  }, [story]);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {story?.title ?? ""}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : !story ? (
        <Text style={styles.emptyText}>{t("stories.unavailable")}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.banner, { backgroundColor: story.tone[0] }]}>
            <Icon name={story.icon} size={36} color={story.tone[1]} />
            <Text style={[styles.bannerSubtitle, { color: story.tone[1] }]}>{story.subtitle}</Text>
          </View>

          {story.paragraphs.map((p, i) => (
            <View key={i} style={styles.paragraphCard}>
              <Text style={styles.paragraphText}>{p}</Text>
            </View>
          ))}
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
  title: { flex: 1, textAlign: "center", fontFamily: fonts.heading, fontSize: 16, color: colors.ink },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  content: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  banner: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  bannerSubtitle: { fontFamily: fonts.bodyBold, fontSize: 13 },
  paragraphCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow,
  },
  paragraphText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 24,
  },
});
