import { PlaceholderScreen } from "../../../src/components/PlaceholderScreen";
import { tones } from "../../../src/components/IconBadge";

export default function ParentProfile() {
  return (
    <PlaceholderScreen
      icon="smile"
      tone={tones.purple}
      title="Account"
      subtitle="Devices, notifications, and the Parent Gate live here."
    />
  );
}
