import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import { Icon } from "../../src/components/icons";
import { fetchConnectedDevices, revokeDevice, type ConnectedDevice } from "../../src/lib/devices";
import { toast } from "../../src/lib/toast";
import { colors, spacing } from "../../src/theme/theme";

export default function Devices() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);

  const load = useCallback(async () => {
    const result = await fetchConnectedDevices();
    setDevices(result);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleRevoke = (device: ConnectedDevice) => {
    Alert.alert(
      t("devices.revokeConfirmTitle"),
      t("devices.revokeConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("devices.revoke"),
          style: "destructive",
          onPress: async () => {
            const ok = await revokeDevice(device.familyCodeId);
            if (!ok) {
              toast.error(t("devices.revokeFailed"));
              return;
            }
            toast.success(t("devices.revoked"));
            setDevices((prev) => prev.filter((d) => d.familyCodeId !== device.familyCodeId));
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("devices.title")}</Text>
        <View style={{ width: 34 }} />
      </View>
      <Text style={styles.subtitle}>{t("devices.subtitle")}</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : devices.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="shield" size={32} color={colors.locked} />
          <Text style={styles.emptyTitle}>{t("devices.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("devices.emptySubtitle")}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {devices.map((device) => (
            <Card key={device.familyCodeId} style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon name="shield" size={20} color={colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>
                  {t("devices.deviceLabel", { id: device.deviceId.slice(-6).toUpperCase() })}
                </Text>
                <Text style={styles.rowMeta}>
                  {t("devices.connectedOn", { date: new Date(device.boundAt).toLocaleDateString() })}
                </Text>
              </View>
              <Pressable
                style={styles.revokeBtn}
                hitSlop={8}
                onPress={() => handleRevoke(device)}
              >
                <Text style={styles.revokeBtnText}>{t("devices.revoke")}</Text>
              </Pressable>
            </Card>
          ))}
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
  subtitle: {
    fontSize: 13,
    color: colors.inkMuted,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  list: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "700", color: colors.ink },
  rowMeta: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },
  revokeBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  revokeBtnText: { fontSize: 12, fontWeight: "700", color: "#DC2626" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: colors.ink, textAlign: "center" },
  emptySubtitle: { fontSize: 13, color: colors.inkMuted, textAlign: "center" },
});
