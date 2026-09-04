import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../src/components/icons";
import { fetchPrayerCityId, setPrayerCityId } from "../../src/lib/familyLocation";
import { getPrayerCities } from "../../src/lib/prayerTimes";
import { toast } from "../../src/lib/toast";
import { colors, fonts, radii, shadow, spacing } from "../../src/theme/theme";

const cities = getPrayerCities();

export default function PrayerCity() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrayerCityId().then((id) => {
      setSelectedId(id ?? null);
      setLoading(false);
    });
  }, []);

  const handleSelect = async (cityId: string) => {
    setSaving(true);
    const ok = await setPrayerCityId(cityId);
    setSaving(false);
    if (!ok) {
      toast.error(t("prayerCity.saveFailed"));
      return;
    }
    setSelectedId(cityId);
    toast.success(t("prayerCity.saved"));
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("prayerCity.title")}</Text>
        <View style={styles.backBtn} />
      </View>
      <Text style={styles.subtitle}>{t("prayerCity.subtitle")}</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {cities.map((city) => {
            const selected = selectedId === city.id;
            return (
              <Pressable
                key={city.id}
                style={[styles.row, selected && styles.rowSelected]}
                disabled={saving}
                onPress={() => handleSelect(city.id)}
              >
                <Text style={[styles.rowText, selected && styles.rowTextSelected]}>
                  {t(`content.prayerCities.${city.id}`)}
                </Text>
                {selected ? <Icon name="check" size={18} color={colors.primary} /> : null}
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
    padding: spacing.lg,
    paddingBottom: spacing.md,
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
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    paddingHorizontal: spacing.lg,
    lineHeight: 19,
  },
  list: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow,
  },
  rowSelected: { borderColor: colors.primary, backgroundColor: "#EFF6FF" },
  rowText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  rowTextSelected: { color: colors.primary },
});
