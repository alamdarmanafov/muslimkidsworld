export const colors = {
  night: "#0D1B4C",
  nightDeep: "#081233",
  onNight: "#F5F8FC",
  onNightMuted: "#A9B4D6",

  skyTop: "#8ED4F0",
  skyBottom: "#CFEFFB",
  ground: "#4CAF6D",
  groundDark: "#3C9B5C",

  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#7CC6FF",
  success: "#22C55E",
  successDark: "#16A34A",
  gold: "#FFD54F",
  goldDark: "#D97706",
  fire: "#F97316",
  purple: "#8B5CF6",
  pink: "#EC4899",
  teal: "#14B8A6",

  ink: "#1F2937",
  inkMuted: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  background: "#F5F8FC",

  locked: "#9CA3AF",
} as const;

export const fonts = {
  heading: "Nunito_800ExtraBold",
  body: "Nunito_400Regular",
  bodyBold: "Nunito_700Bold",
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const shadow = {
  shadowColor: "#0B1B2B",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
} as const;
