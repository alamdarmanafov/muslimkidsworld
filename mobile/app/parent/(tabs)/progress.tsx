import { useTranslation } from "react-i18next";
import { PlaceholderScreen } from "../../../src/components/PlaceholderScreen";
import { tones } from "../../../src/components/IconBadge";

export default function Progress() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      icon="chartBar"
      tone={tones.blue}
      title={t("parentProgressPlaceholder.title")}
      subtitle={t("parentProgressPlaceholder.subtitle")}
    />
  );
}
