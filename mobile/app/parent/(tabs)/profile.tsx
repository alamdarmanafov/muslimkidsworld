import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconBadge, tones } from "../../../src/components/IconBadge";
import { getSupabaseClient } from "../../../src/lib/supabase";
import { colors, fonts, radii, shadow, spacing } from "../../../src/theme/theme";

export default function ParentProfile() {
  const handleSignOut = () => {
    Alert.alert("Sign out?", "You'll need to sign in again to manage your family.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await getSupabaseClient().auth.signOut();
          } catch {
            // ignore — env not configured or already signed out
          }
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.body}>
        <IconBadge icon="smile" tone={tones.purple} size={72} />
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Devices, notifications, and the Parent Gate live here.</Text>
      </View>

      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.xl },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.ink, marginTop: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, textAlign: "center" },
  signOutBtn: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow,
  },
  signOutText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.pink },
});
