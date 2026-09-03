// mobile/src/components/SalahPosture.tsx
//
// A small line-art illustration of each prayer posture, for
// app/child/salah.tsx's step-by-step guide. Replaces the emoji used
// there before (🤲🙌🧍🙇🛐🧎) — those render inconsistently across
// devices/fonts (the same class of problem fixed elsewhere this
// session), and don't actually show the posture, just gesture at it.
// There's no photo pipeline in this app, so this draws a simple,
// consistent stick-figure in the app's own icon style (single-color
// line art, matching src/components/icons.tsx) rather than promising
// a photo it can't deliver.

import Svg, { Circle, Path } from "react-native-svg";
import { salahStepIds } from "../data/salah";
import { colors } from "../theme/theme";

type SalahStepId = (typeof salahStepIds)[number];

// Every posture shares a 100x100 viewBox and the same head position
// when standing, so the set reads as one consistent figure. Only the
// body path (torso/arms/legs) changes per step.
const BODY_PATHS: Record<SalahStepId, string> = {
  // Hands cupped and raised, palms up — the opening dua.
  niyyah:
    "M50 31 V62 M50 40 L30 30 M30 30 Q26 30 26 26 M50 40 L70 30 M70 30 Q74 30 74 26 M50 62 L38 88 M50 62 L62 88",
  // Standing, both hands raised beside the ears.
  takbir: "M50 31 V62 M50 36 L34 18 M50 36 L66 18 M50 62 L38 88 M50 62 L62 88",
  // Standing, hands folded over the waist.
  qiyam: "M50 31 V58 M50 44 L40 55 L50 58 L60 55 L50 44 M50 58 L38 88 M50 58 L62 88",
  // Bowing forward from the waist, hands resting on the knees.
  ruku:
    "M42 27 L78 45 M52 38 L44 58 M66 44 L60 62 M78 45 L92 40 M44 58 L34 74 M44 58 L54 78 M60 62 L50 78",
  // Prostrate — forehead low, arms forward, low to the ground.
  sujud: "M22 62 L34 46 M28 62 L44 62 M44 62 L58 50 M44 62 L60 68 M58 50 L74 46 M60 68 L78 68",
  // Seated, legs folded, one hand raised with a pointed finger.
  tashahhud:
    "M50 31 V54 M50 40 L36 30 M50 44 L62 34 L62 26 M50 54 L30 66 L30 78 M50 54 L70 66 L70 78 M30 78 L70 78",
};

// Head position moves with the standing/bowing/seated posture so it
// doesn't float disconnected from the body path above.
const HEAD_CENTER: Record<SalahStepId, { cx: number; cy: number }> = {
  niyyah: { cx: 50, cy: 22 },
  takbir: { cx: 50, cy: 22 },
  qiyam: { cx: 50, cy: 22 },
  ruku: { cx: 36, cy: 22 },
  sujud: { cx: 16, cy: 60 },
  tashahhud: { cx: 50, cy: 22 },
};

export function SalahPosture({
  step,
  size = 56,
  color = colors.successDark,
}: {
  step: SalahStepId;
  size?: number;
  color?: string;
}) {
  const head = HEAD_CENTER[step];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle cx={head.cx} cy={head.cy} r={9} fill={color} />
      <Path
        d={BODY_PATHS[step]}
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
