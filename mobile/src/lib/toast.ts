// mobile/src/lib/toast.ts
//
// A tiny imperative pub/sub so any screen or lib function — component
// or not — can pop a success/error banner without threading a prop or
// context down to it. ToastHost (src/components/ToastHost.tsx),
// mounted once in app/_layout.tsx, is the sole subscriber and does the
// actual rendering; this file only holds the call/notify wiring.

export type ToastType = "success" | "error";
export type ToastMessage = { id: number; type: ToastType; message: string };

type Listener = (toast: ToastMessage) => void;

let idCounter = 0;
let listener: Listener | null = null;

/** Called once by ToastHost on mount/unmount — not for screens to use. */
export function registerToastListener(fn: Listener | null) {
  listener = fn;
}

function show(type: ToastType, message: string) {
  idCounter += 1;
  listener?.({ id: idCounter, type, message });
}

export const toast = {
  success: (message: string) => show("success", message),
  error: (message: string) => show("error", message),
};
