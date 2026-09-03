import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingCarousel, type OnboardingStep } from "../../src/components/OnboardingCarousel";
import { markChildOnboardingSeen } from "../../src/lib/onboarding";
import { colors } from "../../src/theme/theme";

export default function ChildOnboarding() {
  const { t } = useTranslation();

  const steps: OnboardingStep[] = [
    {
      icon: "moon",
      iconBg: colors.night,
      title: t("childOnboarding.step1Title"),
      body: t("childOnboarding.step1Body"),
    },
    {
      icon: "star",
      iconBg: colors.purple,
      title: t("childOnboarding.step2Title"),
      body: t("childOnboarding.step2Body"),
    },
    {
      icon: "tree",
      iconBg: colors.successDark,
      title: t("childOnboarding.step3Title"),
      body: t("childOnboarding.step3Body"),
    },
  ];

  const finish = async () => {
    await markChildOnboardingSeen();
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <OnboardingCarousel steps={steps} onFinish={finish} />
    </SafeAreaView>
  );
}
