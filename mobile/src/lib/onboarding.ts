// mobile/src/lib/onboarding.ts
//
// Tiny "have they seen the first-run walkthrough" flags, one per
// audience (parent, child) since they're shown on different
// screens/devices entirely. Local-only (AsyncStorage, same storage
// deviceBinding.ts already uses for the device id) — this is a UI
// nicety, not something that needs to sync across devices or survive
// a reinstall.

import AsyncStorage from "@react-native-async-storage/async-storage";

const PARENT_KEY = "onboarding_seen_parent";
const CHILD_KEY = "onboarding_seen_child";

export async function hasSeenParentOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(PARENT_KEY)) === "true";
}

export async function markParentOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(PARENT_KEY, "true");
}

export async function hasSeenChildOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(CHILD_KEY)) === "true";
}

export async function markChildOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(CHILD_KEY, "true");
}
