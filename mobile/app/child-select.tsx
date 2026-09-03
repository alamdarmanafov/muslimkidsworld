import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../src/components/Avatar";
import { Icon } from "../src/components/icons";
import { PinDots, PinKeypad } from "../src/components/PinKeypad";
import { fetchFamilyChildren, setActiveChild, type FamilyChild } from "../src/lib/childSelect";
import { toast } from "../src/lib/toast";
import { colors, fonts, radii, spacing } from "../src/theme/theme";

const PIN_LENGTH = 4;

export default function ChildSelect() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<FamilyChild[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [switching, setSwitching] = useState<FamilyChild | null>(null);
  const [digits, setDigits] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchFamilyChildren().then((result) => {
      setLoading(false);
      if (!result) return;
      setChildren(result.children);
      setActiveChildId(result.activeChildId);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!switching || digits.length < PIN_LENGTH) return;
    let cancelled = false;
    setChecking(true);
    setActiveChild(switching.id, digits).then((result) => {
      if (cancelled) return;
      setChecking(false);
      if (result.ok) {
        setActiveChildId(switching.id);
        toast.success(t("childSelect.switched", { name: switching.name }));
        setSwitching(null);
        setDigits("");
        return;
      }
      setError(true);
      resetTimeout.current = setTimeout(() => {
        setDigits("");
        setError(false);
      }, 900);
    });
    return () => {
      cancelled = true;
    };
  }, [digits, switching, t]);

  const press = (key: string) => {
    if (key === "" || error || checking) return;
    if (key === "back") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length < PIN_LENGTH) setDigits((d) => d + key);
  };

  if (switching) {
    return (
      <SafeAreaView style={styles.pinScreen}>
        <Pressable
          onPress={() => {
            setSwitching(null);
            setDigits("");
            setError(false);
          }}
          style={styles.backBtnNight}
        >
          <Icon name="arrowRight" size={18} color={colors.onNight} style={styles.backIcon} />
        </Pressable>

        <View style={styles.pinBody}>
          <Avatar emoji={switching.emoji} color={switching.color} size={64} />
          <Text style={styles.pinTitle}>{t("childSelect.confirmPinTitle", { name: switching.name })}</Text>
          <Text style={styles.pinSubtitle}>{t("childSelect.confirmPinSubtitle")}</Text>

          <PinDots length={PIN_LENGTH} filled={digits.length} error={error} />
          {checking ? <ActivityIndicator color={colors.gold} style={{ marginTop: spacing.sm }} /> : null}
          {error ? <Text style={styles.pinError}>{t("parentPin.wrongPin")}</Text> : null}
        </View>

        <PinKeypad onPress={press} disabled={error || checking} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("childSelect.title")}</Text>
        <View style={{ width: 34 }} />
      </View>
      <Text style={styles.subtitle}>{t("childSelect.subtitle")}</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {children.map((child) => {
            const isActive = child.id === activeChildId;
            return (
              <Pressable
                key={child.id}
                style={[styles.row, isActive && styles.rowActive]}
                onPress={() => !isActive && setSwitching(child)}
              >
                <Avatar emoji={child.emoji} color={child.color} size={48} />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{child.name}</Text>
                  {child.age != null ? (
                    <Text style={styles.rowMeta}>{t("parentChildren.yearsOld", { age: child.age })}</Text>
                  ) : null}
                </View>
                {isActive ? (
                  <View style={styles.activeBadge}>
                    <Icon name="check" size={14} color="#FFFFFF" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { fontSize: 18, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 13, color: colors.inkMuted, paddingHorizontal: spacing.lg, marginTop: spacing.xs },
  list: { padding: spacing.lg, gap: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  rowActive: { borderColor: colors.primary },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: "700", color: colors.ink },
  rowMeta: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },
  activeBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pinScreen: { flex: 1, backgroundColor: colors.night, padding: spacing.lg },
  backBtnNight: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  pinBody: { alignItems: "center", marginTop: spacing.xl, gap: spacing.xs },
  pinTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.onNight,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  pinSubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.onNightMuted, textAlign: "center" },
  pinError: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.pink, marginTop: spacing.sm },
});
