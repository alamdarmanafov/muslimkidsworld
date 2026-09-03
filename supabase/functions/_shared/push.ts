// supabase/functions/_shared/push.ts
//
// Sends push notifications through Expo's push service given a list
// of Expo push tokens (from public.push_tokens, saved by
// register-push-token). Used by record-quiz-result (achievement
// earned) and send-daily-reminders. Never throws — a notification
// failure should never break the request that triggered it; errors
// are only logged.

type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound: "default";
};

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
const BATCH_SIZE = 100;

export async function sendExpoPush(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  const validTokens = [...new Set(tokens)].filter((t) => t.startsWith("ExponentPushToken["));
  if (validTokens.length === 0) return;

  for (let i = 0; i < validTokens.length; i += BATCH_SIZE) {
    const batch = validTokens.slice(i, i + BATCH_SIZE);
    const messages: PushMessage[] = batch.map((to) => ({ to, title, body, data, sound: "default" }));
    try {
      const res = await fetch(EXPO_PUSH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(messages),
      });
      if (!res.ok) {
        console.error("Expo push request failed", res.status, await res.text());
      }
    } catch (err) {
      console.error("Expo push request threw", err instanceof Error ? err.message : String(err));
    }
  }
}
