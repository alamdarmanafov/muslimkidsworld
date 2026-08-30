export const ADMIN_CREDENTIALS = {
  email: "admin@muslimkidsworld.com",
  password: "admin123",
};

const STORAGE_KEY = "mkw_admin_session";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function setAdminAuthed(value: boolean) {
  if (value) {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
