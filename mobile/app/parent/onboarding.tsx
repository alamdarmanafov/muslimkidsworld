import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingCarousel, type OnboardingStep } from "../../src/components/OnboardingCarousel";
import { markParentOnboardingSeen } from "../../src/lib/onboarding";
import { colors } from "../../src/theme/theme";

export default function ParentOnboarding() {
  const { t } = useTranslation();

  const steps: OnboardingStep[] = [
    {
      icon: "users",
      iconBg: colors.primary,
      title: t("parentOnboarding.step1Title"),
      body: t("parentOnboarding.step1Body"),
    },
    {
      icon: "lock",
      iconBg: colors.night,
      title: t("parentOnboarding.step2Title"),
      body: t("parentOnboarding.step2Body"),
    },
    {
      icon: "moon",
      iconBg: colors.goldDark,
      title: t("parentOnboarding.step3Title"),
      body: t("parentOnboarding.step3Body"),
    },
  ];

  const finish = async () => {
    await markParentOnboardingSeen();
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <OnboardingCarousel steps={steps} onFinish={finish} />
    </SafeAreaView>
  );
}
