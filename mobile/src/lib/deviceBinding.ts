import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "mkw.deviceId";
const BOUND_CODE_KEY = "mkw.boundFamilyCode";

function generateDeviceId() {
  return `dev_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateDeviceId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// This only remembers the binding locally, on this device — it is not
// itself the enforcement. The real "one device per code" check happens
// server-side in supabase/functions/redeem-family-code, which must be
// called (and must succeed) before this is called; see app/child-code.tsx.
export async function bindDeviceToFamilyCode(code: string): Promise<void> {
  await getDeviceId();
  await AsyncStorage.setItem(BOUND_CODE_KEY, code);
}

export async function getBoundFamilyCode(): Promise<string | null> {
  return AsyncStorage.getItem(BOUND_CODE_KEY);
}

export async function isDeviceBound(): Promise<boolean> {
  const code = await getBoundFamilyCode();
  return code !== null;
}

export async function clearDeviceBinding(): Promise<void> {
  await AsyncStorage.multiRemove([BOUND_CODE_KEY]);
}
