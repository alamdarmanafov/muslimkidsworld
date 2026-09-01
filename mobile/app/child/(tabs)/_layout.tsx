import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Icon, type IconName } from "../../../src/components/icons";
import { colors, radii, shadow, spacing } from "../../../src/theme/theme";

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return <Icon name={name} size={22} color={focused ? colors.primary : colors.inkMuted} />;
}

export default function ChildTabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarItemStyle: { paddingVertical: spacing.xs },
        tabBarStyle: {
          height: 66,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          borderTopWidth: 0,
          borderTopLeftRadius: radii.lg,
          borderTopRightRadius: radii.lg,
          backgroundColor: colors.card,
          ...shadow,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t("tabs.progress"),
          tabBarIcon: ({ focused }) => <TabIcon name="chartBar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: t("tabs.rewards"),
          tabBarIcon: ({ focused }) => <TabIcon name="trophy" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ focused }) => <TabIcon name="smile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
