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

// NOTE: this only remembers the binding locally, on this device. Without a
// backend there is no way to know whether the same Family Code has already
// been bound to a *different* device — that check has to happen server-side
// once Family Codes are issued and tracked centrally.
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
