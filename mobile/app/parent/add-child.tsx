import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { addChild } from "../../src/lib/children";
import { toast } from "../../src/lib/toast";
import { colors, radii, spacing } from "../../src/theme/theme";

// A mix of people and kid-friendly animal avatars — not just the
// original 4 — since a child who doesn't see themself in "boy/girl/
// child/baby" should still have a fun option to pick.
const avatarOptions = ["👦", "👧", "🧒", "👶", "🧑", "👱", "🦸", "🦸‍♀️", "🐱", "🐶", "🦁", "🦊"];

export default function AddChild() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = name.trim().length > 0 && age.trim().length > 0;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const parsedAge = Number(age);
    const result = await addChild(
      name.trim(),
      Number.isFinite(parsedAge) && parsedAge > 0 ? parsedAge : null,
      avatar,
    );
    setLoading(false);
    if ("error" in result) {
      const message = `${t("addChild.somethingWrong")} (${result.error})`;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(t("addChild.added", { name: name.trim() }));
    router.replace("/parent/family-code");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.flex}>
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
          </Card>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.footer}>
            <Button
              label={loading ? t("addChild.creating") : t("addChild.generateCode")}
              disabled={!canGenerate || loading}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  flex: { flex: 1 },
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
  avatarRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
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
  errorText: {
    fontSize: 13,
    color: colors.pink,
    textAlign: "center",
    marginTop: spacing.md,
  },
  footer: { marginTop: "auto", paddingBottom: spacing.md },
});
