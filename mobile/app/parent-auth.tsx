import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../src/components/icons";
import { signInWithApple } from "../src/lib/appleAuth";
import { isGoogleSignInConfigured, signInWithGoogle } from "../src/lib/googleAuth";
import { getSupabaseClient } from "../src/lib/supabase";
import { toast } from "../src/lib/toast";
import { colors, fonts, radii, spacing } from "../src/theme/theme";

type Mode = "signIn" | "signUp";

export default function ParentAuth() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const googleAvailable = Platform.OS === "ios" && isGoogleSignInConfigured();

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  const isSignUp = mode === "signUp";
  const canSubmit =
    email.trim().length > 3 &&
    password.length >= 6 &&
    (!isSignUp || (fullName.trim().length > 0 && password === confirmPassword));

  const handleAppleSignIn = async () => {
    setError(null);
    setLoading(true);
    const result = await signInWithApple();
    setLoading(false);
    if (!result.ok) {
      if (result.cancelled) return;
      const message = result.error ?? t("parentAuth.somethingWrong");
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(t("parentAuth.signedIn"));
    router.replace("/parent");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (!result.ok) {
      if (result.cancelled) return;
      const message = result.error ?? t("parentAuth.somethingWrong");
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(t("parentAuth.signedIn"));
    router.replace("/parent");
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseClient();

      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase
            .from("parents")
            .update({ full_name: fullName.trim() })
            .eq("id", data.user.id);
        }

        if (!data.session) {
          toast.success(t("parentAuth.checkEmail"));
          setError(t("parentAuth.checkEmail"));
          setMode("signIn");
          setLoading(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }

      toast.success(isSignUp ? t("parentAuth.accountCreated") : t("parentAuth.signedIn"));
      router.replace("/parent");
    } catch (e) {
      const message = e instanceof Error ? e.message : t("parentAuth.somethingWrong");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
          </Pressable>

          <Icon name="users" size={30} color={colors.primary} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.title}>
            {isSignUp ? t("parentAuth.signUpTitle") : t("parentAuth.signInTitle")}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp ? t("parentAuth.signUpSubtitle") : t("parentAuth.signInSubtitle")}
          </Text>

          <View style={styles.form}>
            {isSignUp ? (
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder={t("parentAuth.fullName")}
                placeholderTextColor={colors.locked}
                autoCapitalize="words"
              />
            ) : null}
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t("parentAuth.email")}
              placeholderTextColor={colors.locked}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={t("parentAuth.password")}
              placeholderTextColor={colors.locked}
              secureTextEntry
            />
            {isSignUp ? (
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("parentAuth.confirmPassword")}
                placeholderTextColor={colors.locked}
                secureTextEntry
              />
            ) : null}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.submitBtn, (!canSubmit || loading) && styles.submitBtnDisabled]}
            disabled={!canSubmit || loading}
            onPress={handleSubmit}
          >
            <Text style={styles.submitBtnText}>
              {loading
                ? t("parentAuth.pleaseWait")
                : isSignUp
                  ? t("parentAuth.createAccount")
                  : t("parentAuth.signIn")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setError(null);
              setMode(isSignUp ? "signIn" : "signUp");
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp ? t("parentAuth.alreadyHaveAccount") : t("parentAuth.newHere")}
              <Text style={styles.switchTextBold}>
                {isSignUp ? t("parentAuth.signIn") : t("parentAuth.createAccount")}
              </Text>
            </Text>
          </Pressable>

          {appleAvailable || googleAvailable ? (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t("parentAuth.or")}</Text>
                <View style={styles.dividerLine} />
              </View>

              {appleAvailable ? (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    isSignUp
                      ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
                      : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={radii.md}
                  style={styles.appleBtn}
                  onPress={handleAppleSignIn}
                />
              ) : null}

              {googleAvailable ? (
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  style={styles.googleBtn}
                  onPress={handleGoogleSignIn}
                />
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  form: { gap: spacing.sm },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.pink,
    marginTop: spacing.sm,
  },
  submitBtn: {
    backgroundColor: colors.night,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontFamily: fonts.bodyBold, fontSize: 15, color: "#FFFFFF" },
  switchText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.md,
  },
  switchTextBold: { fontFamily: fonts.bodyBold, color: colors.primary },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontFamily: fonts.body, fontSize: 11, color: colors.inkMuted },
  appleBtn: { width: "100%", height: 48 },
  googleBtn: { width: "100%", height: 48, marginTop: spacing.sm },
});
