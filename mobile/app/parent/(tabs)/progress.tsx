import { PlaceholderScreen } from "../../../src/components/PlaceholderScreen";
import { tones } from "../../../src/components/IconBadge";

export default function Progress() {
  return (
    <PlaceholderScreen
      icon="chartBar"
      tone={tones.blue}
      title="Weekly Report"
      subtitle="Accuracy, learning time, strong areas, and streaks per child."
    />
  );
}
