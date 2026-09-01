import { PlaceholderScreen } from "../../../src/components/PlaceholderScreen";
import { tones } from "../../../src/components/IconBadge";

export default function Rewards() {
  return (
    <PlaceholderScreen
      icon="gift"
      tone={tones.gold}
      title="Rewards"
      subtitle="Avatars, clothes, and world items you've unlocked with XP."
    />
  );
}
