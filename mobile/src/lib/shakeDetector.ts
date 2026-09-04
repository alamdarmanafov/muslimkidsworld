// mobile/src/lib/shakeDetector.ts
//
// Detects a device-shake gesture via the accelerometer, used to
// trigger "report a problem" (see bugReport.ts) without the user
// having to find a menu item first. A manual button in Profile still
// covers anyone whose shake doesn't register, or who'd rather not
// shake their phone.

import { Accelerometer, type AccelerometerMeasurement } from "expo-sensors";

const UPDATE_INTERVAL_MS = 100;
// g-force magnitude jump between two consecutive readings — a phone
// resting or being carried normally stays well under 1, a deliberate
// shake spikes well past it.
const SHAKE_THRESHOLD = 1.8;
// Don't re-trigger while the report flow from the last shake is still open.
const COOLDOWN_MS = 3000;

function magnitude({ x, y, z }: AccelerometerMeasurement): number {
  return Math.sqrt(x * x + y * y + z * z);
}

/** Starts listening for a shake gesture. Call the returned function to stop. */
export function installShakeListener(onShake: () => void): () => void {
  Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
  let lastMagnitude: number | null = null;
  let lastShakeAt = 0;

  const subscription = Accelerometer.addListener((reading) => {
    const current = magnitude(reading);
    if (lastMagnitude !== null && Math.abs(current - lastMagnitude) > SHAKE_THRESHOLD) {
      const now = Date.now();
      if (now - lastShakeAt > COOLDOWN_MS) {
        lastShakeAt = now;
        onShake();
      }
    }
    lastMagnitude = current;
  });

  return () => subscription.remove();
}
