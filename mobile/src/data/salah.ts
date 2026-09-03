import { IconName } from "../components/icons";

export type Prayer = {
  id: string;
  icon: IconName;
  rakats: number;
};

export const prayers: Prayer[] = [
  { id: "fajr", icon: "moon", rakats: 2 },
  { id: "dhuhr", icon: "clock", rakats: 4 },
  { id: "asr", icon: "clock", rakats: 4 },
  { id: "maghrib", icon: "moon", rakats: 3 },
  { id: "isha", icon: "moon", rakats: 4 },
];

export const salahStepIds = ["niyyah", "takbir", "qiyam", "ruku", "sujud", "tashahhud"] as const;

// A simple pictorial cue for each step's posture — there's no photo
// asset pipeline in this app, so an emoji illustration is the
// lightest honest way to show "what this looks like" next to the
// text description in app/child/salah.tsx.
export const salahStepEmoji: Record<(typeof salahStepIds)[number], string> = {
  niyyah: "🤲",
  takbir: "🙌",
  qiyam: "🧍",
  ruku: "🙇",
  sujud: "🛐",
  tashahhud: "🧎",
};
