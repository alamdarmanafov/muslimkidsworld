import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../src/components/icons";
import { parentPin } from "../src/data/mock";
import { colors, fonts, radii, spacing } from "../src/theme/theme";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export default function ParentPin() {
  const { t } = useTranslation();
  const [digits, setDigits] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (digits.length < PIN_LENGTH) return;
    if (digits === parentPin) {
      router.replace("/parent");
    } else {
      setError(true);
      const timeout = setTimeout(() => {
        setDigits("");
        setError(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [digits]);

  const press = (key: string) => {
    if (key === "" || error) return;
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

        <View style={styles.dots}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < digits.length && styles.dotFilled,
                error && styles.dotError,
              ]}
            />
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{t("parentPin.wrongPin")}</Text> : null}
      </View>

      <View style={styles.keypad}>
        {KEYS.map((key, i) => (
          <Pressable
            key={i}
            style={[styles.key, key === "" && styles.keyHidden]}
            disabled={key === ""}
            onPress={() => press(key)}
          >
            {key === "back" ? (
              <Icon name="arrowRight" size={20} color={colors.onNight} style={styles.backIcon} />
            ) : (
              <Text style={styles.keyText}>{key}</Text>
            )}
          </Pressable>
        ))}
      </View>
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
  dots: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  dotFilled: { backgroundColor: colors.gold, borderColor: colors.gold },
  dotError: { backgroundColor: colors.pink, borderColor: colors.pink },
  errorText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.pink, marginTop: spacing.sm },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "auto",
    marginBottom: spacing.lg,
  },
  key: {
    width: "33.33%",
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  keyHidden: { opacity: 0 },
  keyText: { fontFamily: fonts.heading, fontSize: 26, color: colors.onNight },
});
