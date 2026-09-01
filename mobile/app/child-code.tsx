import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../src/components/icons";
import { bindDeviceToFamilyCode, getDeviceId } from "../src/lib/deviceBinding";
import { getSupabaseClient } from "../src/lib/supabase";
import { colors, fonts, radii, spacing } from "../src/theme/theme";

async function readFunctionErrorMessage(error: unknown): Promise<string> {
  const context = (error as { context?: Response } | null)?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (typeof body?.error === "string") return body.error;
    } catch {
      // fall through to generic message below
    }
  }
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}

export default function ChildCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      const { error: fnError } = await getSupabaseClient().functions.invoke(
        "redeem-family-code",
        { body: { code, deviceId } },
      );
      if (fnError) {
        setError(await readFunctionErrorMessage(fnError));
        return;
      }
      await bindDeviceToFamilyCode(code);
      router.replace("/child");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.moonWrap}>
        <Icon name="moon" size={48} color={colors.gold} />
      </View>
      <Text style={styles.title}>Hi, little explorer! 🌟</Text>
      <Text style={styles.subtitle}>Ask your parent for your 6-digit Family Code.</Text>

      <TextInput
        value={code}
        onChangeText={(v) => {
          setCode(v.replace(/[^0-9]/g, ""));
          setError(null);
        }}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="000000"
        placeholderTextColor={colors.locked}
        style={[styles.input, error && styles.inputError]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        style={[styles.button, (code.length < 6 || loading) && styles.buttonDisabled]}
        disabled={code.length < 6 || loading}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>{loading ? "Checking…" : "Continue →"}</Text>
      </Pressable>

      <Text style={styles.note}>
        Your child experience never shows subscription or payment information.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.skyBottom,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  moonWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.night,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.ink, textAlign: "center" },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  input: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    fontFamily: fonts.heading,
    fontSize: 28,
    textAlign: "center",
    letterSpacing: 10,
    color: colors.ink,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  inputError: { borderColor: colors.pink },
  errorText: { fontFamily: fonts.body, fontSize: 12, color: colors.pink, marginTop: spacing.sm },
  button: {
    width: "100%",
    backgroundColor: colors.night,
    padding: spacing.lg,
    borderRadius: radii.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { fontFamily: fonts.bodyBold, fontSize: 16, color: "#FFFFFF" },
  note: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.lg,
    lineHeight: 18,
  },
});
