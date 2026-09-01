import { useCallback, useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { getSupabaseClient } from "../../src/lib/supabase";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

const ROTATE_SECONDS = 30;

type GenerateResponse = { code: string; familyCodeId: string; expiresAt: string };

export default function FamilyCode() {
  const [code, setCode] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROTATE_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const fetchCode = useCallback(async () => {
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error: fnError } = await supabase.functions.invoke<GenerateResponse>(
        "generate-family-code",
      );
      if (fnError) throw fnError;
      if (!data) throw new Error("No code returned");
      if (!mounted.current) return;
      setCode(data.code);
      setSecondsLeft(ROTATE_SECONDS);
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e.message : "Could not get a code. Check your connection.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchCode();
    return () => {
      mounted.current = false;
    };
  }, [fetchCode]);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          fetchCode();
          return ROTATE_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [fetchCode]);

  const digits = code ? code.split("") : ["-", "-", "-", "-", "-", "-"];

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Icon name="arrowRight" size={18} color={colors.onNight} style={styles.backIcon} />
      </Pressable>

      <View style={styles.body}>
        <Icon name="users" size={30} color={colors.gold} />
        <Text style={styles.title}>Connect a Child</Text>
        <Text style={styles.subtitle}>
          Open Muslim Kids World on your child's device, choose "I'm a Child", and enter this
          code.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: spacing.xl }} />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={fetchCode}>
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.codeRow}>
              {digits.map((d, i) => (
                <View key={i} style={styles.digitBox}>
                  <Text style={styles.digitText}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={styles.countdownTrack}>
              <View
                style={[
                  styles.countdownFill,
                  { width: `${(secondsLeft / ROTATE_SECONDS) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.countdownText}>New code in {secondsLeft}s</Text>
          </>
        )}
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
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xs },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.onNight, marginTop: spacing.sm },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onNightMuted,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  codeRow: { flexDirection: "row", gap: spacing.xs },
  digitBox: {
    width: 40,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  digitText: { fontFamily: fonts.heading, fontSize: 26, color: colors.gold },
  countdownTrack: {
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    marginTop: spacing.lg,
  },
  countdownFill: { height: "100%", borderRadius: 3, backgroundColor: colors.gold },
  countdownText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onNightMuted,
    marginTop: spacing.sm,
  },
  errorBox: { alignItems: "center", gap: spacing.md, marginTop: spacing.lg },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.pink,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
  retryBtn: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    ...shadow,
  },
  retryText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.night },
});
