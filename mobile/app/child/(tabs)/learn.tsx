import { PlaceholderScreen } from "../../../src/components/PlaceholderScreen";
import { tones } from "../../../src/components/IconBadge";

export default function Learn() {
  return (
    <PlaceholderScreen
      icon="book"
      tone={tones.teal}
      title="Lessons"
      subtitle="Islam Basics, Quran, Prophets, Salah, and more — coming soon."
    />
  );
}
