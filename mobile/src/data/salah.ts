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
