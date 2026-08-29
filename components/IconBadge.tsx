const toneStyles = {
  purple: { gradient: "from-violet-300 to-violet-600", base: "bg-violet-800" },
  teal: { gradient: "from-teal-300 to-teal-600", base: "bg-teal-800" },
  blue: { gradient: "from-blue-300 to-blue-600", base: "bg-blue-800" },
  pink: { gradient: "from-pink-300 to-pink-600", base: "bg-pink-800" },
  gold: { gradient: "from-amber-300 to-amber-600", base: "bg-amber-800" },
  orange: { gradient: "from-orange-300 to-orange-600", base: "bg-orange-800" },
  green: { gradient: "from-green-300 to-green-600", base: "bg-green-800" },
} as const;

export type IconTone = keyof typeof toneStyles;

export function IconBadge({
  emoji,
  tone,
  size = 48,
  shape = "square",
}: {
  emoji: string;
  tone: IconTone;
  size?: number;
  shape?: "square" | "circle";
}) {
  const depth = Math.round(size * 0.16);
  const rounded = shape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="relative" style={{ width: size, height: size + depth }}>
      <div
        className={`absolute ${rounded} ${toneStyles[tone].base}`}
        style={{ width: size, height: size, top: depth }}
      />
      <div
        className={`absolute flex items-center justify-center overflow-hidden bg-gradient-to-br shadow-lg ${rounded} ${toneStyles[tone].gradient}`}
        style={{ width: size, height: size, top: 0 }}
      >
        <div
          className="absolute rounded-full bg-white/30"
          style={{ width: size * 0.9, height: size * 0.5, top: size * 0.05 }}
        />
        <span style={{ fontSize: size * 0.5 }}>{emoji}</span>
      </div>
    </div>
  );
}
