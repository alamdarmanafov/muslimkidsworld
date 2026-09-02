import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { colors, radii, spacing } from "../../src/theme/theme";

const avatarOptions = ["👦", "👧", "🧒", "👶"];
const genderOptions = ["Boy", "Girl"] as const;
const genderLabelKeys: Record<(typeof genderOptions)[number], string> = {
  Boy: "addChild.boy",
  Girl: "addChild.girl",
};

function generateChildCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function AddChild() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<(typeof genderOptions)[number]>("Boy");
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [code, setCode] = useState<string | null>(null);

  const canGenerate = name.trim().length > 0 && age.trim().length > 0;

  if (code) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.codeBody}>
          <Text style={styles.codeLabel}>{t("addChild.childCode")}</Text>
          <Text style={styles.code}>{code}</Text>
          <Text style={styles.expiry}>{t("addChild.expiresIn10")}</Text>
          <Text style={styles.hint}>
            {t("addChild.hint", { name: name || t("addChild.yourChild") })}
          </Text>
        </View>
        <View style={styles.footer}>
          <Button label={t("addChild.done")} onPress={() => router.replace("/parent/children")} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{t("addChild.title")}</Text>

      <Card style={styles.form}>
        <Text style={styles.label}>{t("addChild.avatar")}</Text>
        <View style={styles.avatarRow}>
          {avatarOptions.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => setAvatar(emoji)}
              style={[
                styles.avatarOption,
                avatar === emoji && styles.avatarOptionSelected,
              ]}
            >
              <Text style={styles.avatarEmoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>{t("addChild.name")}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t("addChild.namePlaceholder")}
          placeholderTextColor={colors.inkMuted}
        />

        <Text style={styles.label}>{t("addChild.age")}</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder={t("addChild.agePlaceholder")}
          keyboardType="number-pad"
          placeholderTextColor={colors.inkMuted}
        />

        <Text style={styles.label}>{t("addChild.gender")}</Text>
        <View style={styles.genderRow}>
          {genderOptions.map((g) => (
            <Pressable
              key={g}
              onPress={() => setGender(g)}
              style={[styles.genderOption, gender === g && styles.genderOptionSelected]}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === g && styles.genderTextSelected,
                ]}
              >
                {t(genderLabelKeys[g])}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <View style={styles.footer}>
        <Button
          label={t("addChild.generateCode")}
          disabled={!canGenerate}
          onPress={() => setCode(generateChildCode())}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginBottom: spacing.md },
  form: { gap: spacing.xs },
  label: { fontSize: 13, fontWeight: "600", color: colors.inkMuted, marginTop: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    fontSize: 15,
    color: colors.ink,
  },
  avatarRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  avatarOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarOptionSelected: { borderColor: colors.primary },
  avatarEmoji: { fontSize: 24 },
  genderRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  genderOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  genderOptionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { fontWeight: "600", color: colors.ink },
  genderTextSelected: { color: "#fff" },
  footer: { marginTop: "auto", paddingBottom: spacing.md },
  codeBody: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm },
  codeLabel: { fontSize: 14, color: colors.inkMuted },
  code: { fontSize: 48, fontWeight: "800", color: colors.ink, letterSpacing: 6 },
  expiry: { fontSize: 13, color: colors.fire, fontWeight: "600" },
  hint: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
});
