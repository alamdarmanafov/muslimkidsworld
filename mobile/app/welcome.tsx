import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../src/components/icons";
import { colors, fonts, radii, spacing } from "../src/theme/theme";

const stars = [
  { top: 24, left: 40, size: 5 },
  { top: 52, left: 110, size: 4 },
  { top: 18, left: 200, size: 6 },
  { top: 70, left: 260, size: 4 },
  { top: 40, left: 320, size: 5 },
  { top: 96, left: 60, size: 4 },
  { top: 100, left: 300, size: 5 },
];

const trustItems = [
  { icon: "shield" as const, label: "Safe Content", color: colors.primary },
  { icon: "lock" as const, label: "Parent Control", color: colors.successDark },
  { icon: "heart" as const, label: "Trusted by Parents", color: colors.pink },
];

export default function Welcome() {
  return (
    <LinearGradient
      colors={[colors.night, colors.night, colors.background]}
      locations={[0, 0.4, 0.56]}
      style={styles.flex}
    >
      <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.sky}>
            {stars.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  { top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: s.size },
                ]}
              />
            ))}
            <Icon name="moon" size={40} color={colors.gold} style={styles.bigMoon} />

            <View style={styles.archFrame}>
              <View style={styles.archInner}>
                <Icon name="moon" size={22} color={colors.gold} />
                <Icon name="book" size={16} color={colors.onNight} style={{ marginTop: 6 }} />
              </View>
            </View>

            <Text style={styles.title}>
              Muslim{"\n"}
              <Text style={{ color: colors.primaryLight }}>Kids</Text>
              <Text style={{ color: colors.gold }}> World</Text>
            </Text>
            <View style={styles.taglineRow}>
              <Text style={styles.taglineDot}>★</Text>
              <Text style={styles.tagline}>Learn · Play · Grow</Text>
              <Text style={styles.taglineDot}>★</Text>
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.question}>Who are you?</Text>

            <View style={styles.cardsRow}>
              <Pressable
                style={[styles.card, { backgroundColor: "#E4F1FF" }]}
                onPress={() => router.push("/parent")}
              >
                <View style={[styles.cardBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="users" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.cardEyebrow}>I'm a</Text>
                <Text style={[styles.cardTitle, { color: colors.primaryDark }]}>Parent</Text>
                <Text style={styles.cardSubtitle}>Manage your child's learning journey</Text>
                <View style={[styles.cardArrow, { backgroundColor: colors.primary }]}>
                  <Icon name="arrowRight" size={18} color="#FFFFFF" />
                </View>
              </Pressable>

              <Pressable
                style={[styles.card, { backgroundColor: "#FFF3D6" }]}
                onPress={() => router.push("/child")}
              >
                <View style={[styles.cardBadge, { backgroundColor: colors.gold }]}>
                  <Icon name="smile" size={20} color={colors.night} />
                </View>
                <Text style={styles.cardEyebrow}>I'm a</Text>
                <Text style={[styles.cardTitle, { color: colors.goldDark }]}>Child</Text>
                <Text style={styles.cardSubtitle}>Learn, play & discover amazing things</Text>
                <View style={[styles.cardArrow, { backgroundColor: colors.gold }]}>
                  <Icon name="arrowRight" size={18} color={colors.night} />
                </View>
              </Pressable>
            </View>

            <View style={styles.trustHeader}>
              <Icon name="shield" size={18} color={colors.successDark} />
              <Text style={styles.trustHeaderText}>A safe space for little Muslims</Text>
            </View>

            <View style={styles.trustRow}>
              {trustItems.map((t) => (
                <View key={t.label} style={styles.trustItem}>
                  <Icon name={t.icon} size={15} color={t.color} />
                  <Text style={styles.trustLabel}>{t.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.skyline}>
              <Icon name="mosque" size={26} color={colors.primaryLight} style={{ opacity: 0.5 }} />
              <Icon name="mosque" size={38} color={colors.primaryLight} style={{ opacity: 0.7 }} />
              <Icon name="mosque" size={26} color={colors.primaryLight} style={{ opacity: 0.5 }} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  sky: {
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  star: { position: "absolute", backgroundColor: colors.onNight, opacity: 0.8 },
  bigMoon: { position: "absolute", top: 4, left: spacing.lg },
  archFrame: {
    width: 92,
    height: 108,
    backgroundColor: colors.onNight,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  archInner: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.night,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 34,
    textAlign: "center",
    color: colors.onNight,
    lineHeight: 38,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  taglineDot: { color: colors.gold, fontSize: 11 },
  tagline: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.onNightMuted,
    letterSpacing: 0.3,
  },
  body: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  question: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  cardsRow: { flexDirection: "row", gap: spacing.md },
  card: {
    flex: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  cardBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  cardEyebrow: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted },
  cardTitle: { fontFamily: fonts.heading, fontSize: 20, marginTop: 2 },
  cardSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
  cardArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: spacing.md,
  },
  trustHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  trustHeaderText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  trustLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted },
  skyline: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
