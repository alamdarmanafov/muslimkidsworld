import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { colors, spacing } from "../src/theme/theme";

export default function Welcome() {
  return (
    <LinearGradient
      colors={[colors.skyTop, colors.skyBottom, colors.ground]}
      locations={[0, 0.55, 1]}
      style={styles.flex}
    >
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.title}>
            Muslim{"\n"}
            <Text style={{ color: colors.success }}>Kids</Text>
            {"\n"}World
          </Text>
          <Text style={styles.tagline}>Learn • Play • Grow</Text>
          <Text style={styles.mosque}>🕌</Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="I'm a Parent"
            variant="primary"
            onPress={() => router.push("/parent")}
          />
          <Button
            label="I'm a Child"
            variant="outline"
            style={{ marginTop: spacing.md, backgroundColor: colors.card }}
            onPress={() => router.push("/child")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: { fontSize: 24, marginBottom: spacing.sm },
  title: {
    fontSize: 44,
    fontWeight: "800",
    textAlign: "center",
    color: colors.primaryDark,
    lineHeight: 48,
  },
  tagline: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
  },
  mosque: {
    fontSize: 90,
    marginTop: spacing.xl,
  },
  actions: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
