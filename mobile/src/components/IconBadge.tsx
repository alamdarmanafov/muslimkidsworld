import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type IconBadgeTone = readonly [string, string];

export const tones = {
  purple: ["#C4B5FD", "#7C3AED"],
  teal: ["#5EEAD4", "#0D9488"],
  blue: ["#93C5FD", "#2563EB"],
  pink: ["#FBCFE8", "#DB2777"],
  gold: ["#FDE68A", "#D97706"],
  orange: ["#FDBA74", "#EA580C"],
  yellow: ["#FEF08A", "#CA8A04"],
  green: ["#86EFAC", "#16A34A"],
  brown: ["#F3D9B1", "#B45309"],
  indigo: ["#A5B4FC", "#4338CA"],
  red: ["#FCA5A5", "#DC2626"],
} as const satisfies Record<string, IconBadgeTone>;

function darken(hex: string, amount: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((num >> 16) & 255) * (1 - amount));
  const g = Math.round(((num >> 8) & 255) * (1 - amount));
  const b = Math.round((num & 255) * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function IconBadge({
  emoji,
  tone,
  size = 44,
  shape = "square",
}: {
  emoji: string;
  tone: IconBadgeTone;
  size?: number;
  shape?: "square" | "circle";
}) {
  const radius = shape === "circle" ? size / 2 : size * 0.32;
  const depth = Math.round(size * 0.16);
  const baseColor = darken(tone[1], 0.35);

  return (
    <View style={{ width: size, height: size + depth }}>
      <View
        style={{
          position: "absolute",
          top: depth,
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: baseColor,
        }}
      />
      <View
        style={[
          styles.shadowWrap,
          {
            position: "absolute",
            top: 0,
            width: size,
            height: size,
            borderRadius: radius,
            shadowColor: tone[1],
          },
        ]}
      >
        <LinearGradient
          colors={tone}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.gradient, { width: size, height: size, borderRadius: radius }]}
        >
          <View
            pointerEvents="none"
            style={[
              styles.gloss,
              {
                width: size * 0.9,
                height: size * 0.55,
                borderRadius: size * 0.45,
                top: size * 0.06,
              },
            ]}
          />
          <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gloss: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
});
