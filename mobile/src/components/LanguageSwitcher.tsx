import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setLanguage, supportedLanguages, type SupportedLanguage } from "../i18n";
import { colors, fonts, radii, spacing } from "../theme/theme";

const codeLabels: Record<SupportedLanguage, string> = {
  en: "EN",
  az: "AZ",
  tr: "TR",
  ru: "RU",
};

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  return (
    <View style={styles.row}>
      {supportedLanguages.map((lang) => {
        const active = lang === current;
        return (
          <Pressable
            key={lang}
            style={[
              styles.chip,
              dark && styles.chipDark,
              active && (dark ? styles.chipActiveDark : styles.chipActive),
            ]}
            onPress={() => setLanguage(lang)}
          >
            <Text
              style={[
                styles.chipText,
                dark && styles.chipTextDark,
                active && (dark ? styles.chipTextActiveDark : styles.chipTextActive),
              ]}
            >
              {codeLabels[lang]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  chipDark: { backgroundColor: "rgba(255,255,255,0.12)" },
  chipActive: { backgroundColor: colors.night },
  chipActiveDark: { backgroundColor: colors.gold },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.inkMuted },
  chipTextDark: { color: colors.onNightMuted },
  chipTextActive: { color: "#FFFFFF" },
  chipTextActiveDark: { color: colors.night },
});
