import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Icon } from "../../src/components/icons";
import { fetchQuietHours, setQuietHours, type QuietHours } from "../../src/lib/notificationSettings";
import { toast } from "../../src/lib/toast";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

const PRESETS: { start: number; end: number }[] = [
  { start: 21, end: 8 },
  { start: 22, end: 7 },
  { start: 23, end: 6 },
];

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}

export default function NotificationQuietHours() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [start, setStart] = useState("22");
  const [end, setEnd] = useState("7");

  useEffect(() => {
    fetchQuietHours().then((hours) => {
      if (hours) {
        setEnabled(true);
        setStart(String(hours.start));
        setEnd(String(hours.end));
      }
      setLoading(false);
    });
  }, []);

  const startHour = parseInt(start, 10);
  const endHour = parseInt(end, 10);
  const validHours =
    Number.isInteger(startHour) && startHour >= 0 && startHour <= 23 &&
    Number.isInteger(endHour) && endHour >= 0 && endHour <= 23 &&
    startHour !== endHour;
  const canSave = saving === false && (!enabled || validHours);

  const handleSave = async () => {
    setSaving(true);
    const hours: QuietHours = enabled ? { start: startHour, end: endHour } : null;
    const ok = await setQuietHours(hours);
    setSaving(false);
    if (!ok) {
      toast.error(t("quietHours.saveFailed"));
      return;
    }
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.loadingScreen]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
      </Pressable>

      <Icon name="moon" size={32} color={colors.primary} style={{ marginBottom: spacing.sm }} />
      <Text style={styles.title}>{t("quietHours.title")}</Text>
      <Text style={styles.subtitle}>{t("quietHours.subtitle")}</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{t("quietHours.enable")}</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>

      {enabled ? (
        <>
          <Text style={styles.sectionLabel}>{t("quietHours.presets")}</Text>
          <View style={styles.presetsRow}>
            {PRESETS.map((p) => {
              const selected = startHour === p.start && endHour === p.end;
              return (
                <Pressable
                  key={`${p.start}-${p.end}`}
                  style={[styles.presetChip, selected && styles.presetChipSelected]}
                  onPress={() => {
                    setStart(String(p.start));
                    setEnd(String(p.end));
                  }}
                >
                  <Text style={[styles.presetText, selected && styles.presetTextSelected]}>
                    {formatHour(p.start)}–{formatHour(p.end)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>{t("quietHours.custom")}</Text>
          <View style={styles.customRow}>
            <View style={styles.customField}>
              <Text style={styles.customFieldLabel}>{t("quietHours.from")}</Text>
              <TextInput
                value={start}
                onChangeText={setStart}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.customInput}
              />
            </View>
            <Text style={styles.customDash}>—</Text>
            <View style={styles.customField}>
              <Text style={styles.customFieldLabel}>{t("quietHours.to")}</Text>
              <TextInput
                value={end}
                onChangeText={setEnd}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.customInput}
              />
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.footer}>
        <Button label={t("common.save")} disabled={!canSave} onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  loadingScreen: { alignItems: "center", justifyContent: "center" },
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow,
  },
  toggleLabel: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  sectionLabel: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.inkMuted, marginBottom: spacing.sm },
  presetsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  presetChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  presetChipSelected: { backgroundColor: colors.night, borderColor: colors.night },
  presetText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink },
  presetTextSelected: { color: colors.onNight },
  customRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  customField: { flex: 1 },
  customFieldLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted, marginBottom: spacing.xs },
  customInput: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.ink,
    textAlign: "center",
  },
  customDash: { fontFamily: fonts.heading, fontSize: 18, color: colors.inkMuted, paddingBottom: spacing.md },
  footer: { marginTop: "auto", paddingBottom: spacing.md },
});
