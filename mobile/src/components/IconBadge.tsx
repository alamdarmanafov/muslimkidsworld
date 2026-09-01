import { View } from "react-native";
import { Icon, type IconName } from "./icons";

export type IconBadgeTone = readonly [string, string];

export const tones = {
  purple: ["#EDE9FE", "#7C3AED"],
  teal: ["#CCFBF1", "#0D9488"],
  blue: ["#DBEAFE", "#2563EB"],
  pink: ["#FCE7F3", "#DB2777"],
  gold: ["#FEF3C7", "#D97706"],
  orange: ["#FFEDD5", "#EA580C"],
  yellow: ["#FEF9C3", "#CA8A04"],
  green: ["#DCFCE7", "#16A34A"],
  brown: ["#F5E4D3", "#92400E"],
  indigo: ["#E0E7FF", "#4338CA"],
  red: ["#FEE2E2", "#DC2626"],
} as const satisfies Record<string, IconBadgeTone>;

export function IconBadge({
  icon,
  tone,
  size = 44,
}: {
  icon: IconName;
  tone: IconBadgeTone;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: tone[0],
        borderWidth: 1.5,
        borderColor: `${tone[1]}40`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={size * 0.5} color={tone[1]} />
    </View>
  );
}
