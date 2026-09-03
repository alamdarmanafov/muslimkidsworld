import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { PinDots, PinKeypad } from "../../src/components/PinKeypad";
import { setParentPin } from "../../src/lib/parentPin";
import { toast } from "../../src/lib/toast";
import { colors, fonts, spacing } from "../../src/theme/theme";

const PIN_LENGTH = 4;

export default function ParentPinSetup() {
  const { t } = useTranslation();
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [digits, setDigits] = useState("");
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const isConfirming = firstPin !== null;

  const press = async (key: string) => {
    if (key === "" || error || saving) return;
    if (key === "back") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length >= PIN_LENGTH) return;
    const next = digits + key;
    setDigits(next);
    if (next.length < PIN_LENGTH) return;

    if (!isConfirming) {
      setTimeout(() => {
        setFirstPin(next);
        setDigits("");
      }, 150);
      return;
    }

    if (next !== firstPin) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setFirstPin(null);
        setDigits("");
      }, 900);
      return;
    }

    setSaving(true);
    const ok = await setParentPin(next);
    setSaving(false);
    if (!ok) {
      toast.error(t("parentPinSetup.saveFailed"));
      setFirstPin(null);
      setDigits("");
      return;
    }
    toast.success(t("parentPinSetup.saved"));
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Icon name="arrowRight" size={18} color={colors.onNight} style={styles.backIcon} />
      </Pressable>

      <View style={styles.body}>
        <Icon name="lock" size={30} color={colors.gold} />
        <Text style={styles.title}>
          {isConfirming ? t("parentPinSetup.confirmTitle") : t("parentPinSetup.title")}
        </Text>
        <Text style={styles.subtitle}>{t("parentPinSetup.subtitle")}</Text>

        <PinDots length={PIN_LENGTH} filled={digits.length} error={error} />
        {saving ? <ActivityIndicator color={colors.gold} style={{ marginTop: spacing.sm }} /> : null}
        {error ? <Text style={styles.errorText}>{t("parentPinSetup.mismatch")}</Text> : null}
      </View>

      <PinKeypad onPress={press} disabled={error || saving} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night, padding: spacing.lg },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  body: { alignItems: "center", marginTop: spacing.xl, gap: spacing.xs },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.onNight, marginTop: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.onNightMuted, textAlign: "center" },
  errorText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.pink, marginTop: spacing.sm },
});
