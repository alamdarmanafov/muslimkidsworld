import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../src/components/icons";
import { PinDots, PinKeypad } from "../src/components/PinKeypad";
import { verifyParentPin } from "../src/lib/parentPin";
import { colors, fonts, spacing } from "../src/theme/theme";

const PIN_LENGTH = 4;

export default function ParentPin() {
  const { t } = useTranslation();
  const [digits, setDigits] = useState("");
  const [error, setError] = useState(false);
  const [noPinSet, setNoPinSet] = useState(false);
  const [checking, setChecking] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (digits.length < PIN_LENGTH) return;
    let cancelled = false;
    setChecking(true);
    verifyParentPin(digits).then(({ valid, pinSet }) => {
      if (cancelled) return;
      setChecking(false);
      if (valid) {
        router.replace("/parent");
        return;
      }
      setError(true);
      setNoPinSet(!pinSet);
      resetTimeout.current = setTimeout(() => {
        setDigits("");
        setError(false);
      }, 900);
    });
    return () => {
      cancelled = true;
    };
  }, [digits]);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, []);

  const press = (key: string) => {
    if (key === "" || error || checking) return;
    if (key === "back") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length < PIN_LENGTH) setDigits((d) => d + key);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Icon name="arrowRight" size={18} color={colors.onNight} style={styles.backIcon} />
      </Pressable>

      <View style={styles.body}>
        <Icon name="lock" size={30} color={colors.gold} />
        <Text style={styles.title}>{t("parentPin.title")}</Text>
        <Text style={styles.subtitle}>{t("parentPin.subtitle")}</Text>

        <PinDots length={PIN_LENGTH} filled={digits.length} error={error} />
        {checking ? <ActivityIndicator color={colors.gold} style={{ marginTop: spacing.sm }} /> : null}
        {error ? (
          <Text style={styles.errorText}>
            {noPinSet ? t("parentPin.noPinSet") : t("parentPin.wrongPin")}
          </Text>
        ) : null}
      </View>

      <PinKeypad onPress={press} disabled={error || checking} />
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
