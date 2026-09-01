import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Icon } from "../../src/components/icons";
import { dailyLimitOptions, getDailyLimitMinutes, setDailyLimitMinutes } from "../../src/data/mock";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

export default function DailyLimit() {
  const current = getDailyLimitMinutes();
  const isPreset = (dailyLimitOptions as readonly number[]).includes(current);
  const [selected, setSelected] = useState<number | "custom">(isPreset ? current : "custom");
  const [customValue, setCustomValue] = useState(isPreset ? "" : String(current));

  const finalMinutes = selected === "custom" ? parseInt(customValue, 10) || 0 : selected;
  const canSave = finalMinutes > 0;

  const handleSave = () => {
    setDailyLimitMinutes(finalMinutes);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
      </Pressable>

      <Icon name="clock" size={32} color={colors.primary} style={{ marginBottom: spacing.sm }} />
      <Text style={styles.title}>Daily Learning Limit</Text>
      <Text style={styles.subtitle}>
        Once your child reaches this many minutes, today's journey is marked complete and the
        app won't push more content.
      </Text>

      <View style={styles.optionsGrid}>
        {dailyLimitOptions.map((m) => (
          <Pressable
            key={m}
            style={[styles.option, selected === m && styles.optionSelected]}
            onPress={() => setSelected(m)}
          >
            <Text style={[styles.optionText, selected === m && styles.optionTextSelected]}>
              {m} min
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.option, selected === "custom" && styles.optionSelected]}
          onPress={() => setSelected("custom")}
        >
          <Text style={[styles.optionText, selected === "custom" && styles.optionTextSelected]}>
            Custom
          </Text>
        </Pressable>
      </View>

      {selected === "custom" ? (
        <TextInput
          value={customValue}
          onChangeText={setCustomValue}
          keyboardType="number-pad"
          placeholder="e.g. 40"
          placeholderTextColor={colors.locked}
          style={styles.customInput}
        />
      ) : null}

      <View style={styles.footer}>
        <Button label="Save" disabled={!canSave} onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.sm,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  option: {
    width: "31%",
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  optionSelected: { backgroundColor: colors.night, borderColor: colors.night },
  optionText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  optionTextSelected: { color: colors.onNight },
  customInput: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.ink,
  },
  footer: { marginTop: "auto", paddingBottom: spacing.md },
});
