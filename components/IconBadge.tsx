import { Icon, type IconName } from "./icons";

const toneStyles = {
  purple: { bg: "bg-violet-100", fg: "text-violet-600", border: "border-violet-200" },
  teal: { bg: "bg-teal-100", fg: "text-teal-600", border: "border-teal-200" },
  blue: { bg: "bg-blue-100", fg: "text-blue-600", border: "border-blue-200" },
  pink: { bg: "bg-pink-100", fg: "text-pink-600", border: "border-pink-200" },
  gold: { bg: "bg-amber-100", fg: "text-amber-600", border: "border-amber-200" },
  orange: { bg: "bg-orange-100", fg: "text-orange-600", border: "border-orange-200" },
  green: { bg: "bg-green-100", fg: "text-green-600", border: "border-green-200" },
} as const;

export type IconTone = keyof typeof toneStyles;

export function IconBadge({
  icon,
  tone,
  size = 48,
}: {
  icon: IconName;
  tone: IconTone;
  size?: number;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center border ${toneStyles[tone].bg} ${toneStyles[tone].fg} ${toneStyles[tone].border}`}
      style={{ width: size, height: size, borderRadius: size * 0.32 }}
    >
      <Icon name={icon} style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
}
