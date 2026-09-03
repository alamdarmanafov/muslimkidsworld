import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../src/components/Avatar";
import { Button } from "../../../src/components/Button";
import { Card } from "../../../src/components/Card";
import { Icon } from "../../../src/components/icons";
import { ProgressRing } from "../../../src/components/ProgressRing";
import { deleteChild, fetchChildren, type ParentChild } from "../../../src/lib/children";
import { toast } from "../../../src/lib/toast";
import { colors, spacing } from "../../../src/theme/theme";

const MAX_SLOTS = 3;

export default function Children() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ParentChild[]>([]);

  const load = useCallback(async () => {
    const result = await fetchChildren();
    setChildren(result ?? []);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const slotsUsed = children.length;
  const slotsFull = slotsUsed >= MAX_SLOTS;

  const handleDelete = (child: ParentChild) => {
    Alert.alert(
      t("parentChildren.deleteConfirmTitle"),
      t("parentChildren.deleteConfirmBody", { name: child.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            const ok = await deleteChild(child.id);
            if (!ok) {
              toast.error(t("parentChildren.deleteFailed"));
              return;
            }
            toast.success(t("parentChildren.deleted", { name: child.name }));
            setChildren((prev) => prev.filter((c) => c.id !== child.id));
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("parentChildren.title")}</Text>
        <Text style={styles.slots}>
          {t("parentChildren.slots", { used: slotsUsed, max: MAX_SLOTS })}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : children.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{t("parentChildren.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("parentChildren.emptySubtitle")}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {children.map((child) => (
            <Pressable key={child.id} onPress={() => handleDelete(child)}>
              <Card style={styles.row}>
                <Avatar emoji={child.emoji} color={child.color} size={48} />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{child.name}</Text>
                  {child.age != null ? (
                    <Text style={styles.rowMeta}>
                      {t("parentChildren.yearsOld", { age: child.age })}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  style={styles.syncBtn}
                  hitSlop={8}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push("/parent/family-code");
                  }}
                >
                  <Icon name="sync" size={18} color={colors.primary} />
                </Pressable>
                <ProgressRing percent={Math.round(child.accuracy)} size={48} strokeWidth={4} />
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button
          label={slotsFull ? t("parentChildren.noSlotsAvailable") : t("parentChildren.addChild")}
          disabled={slotsFull}
          onPress={() => router.push("/parent/add-child")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: 0,
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  slots: { fontSize: 13, color: colors.inkMuted, fontWeight: "600" },
  list: { padding: spacing.lg, gap: spacing.md },
  syncBtn: { padding: spacing.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 16, fontWeight: "700", color: colors.ink },
  rowMeta: { fontSize: 13, color: colors.inkMuted },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: colors.ink, textAlign: "center" },
  emptySubtitle: { fontSize: 13, color: colors.inkMuted, textAlign: "center" },
  footer: { padding: spacing.lg },
});
