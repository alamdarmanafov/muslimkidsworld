import { PlaceholderScreen } from "../../../src/components/PlaceholderScreen";
import { tones } from "../../../src/components/IconBadge";

export default function ChildProfile() {
  return (
    <PlaceholderScreen
      icon="smile"
      tone={tones.yellow}
      title="My Profile"
      subtitle="Avatar, level, and settings your parent has approved for you."
    />
  );
}
