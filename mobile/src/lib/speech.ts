// mobile/src/lib/speech.ts
//
// Thin wrapper around expo-speech (on-device text-to-speech, no
// account or API key) so a pre-reader can hear quiz questions read
// aloud (the quiz screen's speaker icon was already in the UI before
// this — see app/child/quiz.tsx — just never wired to anything).

import * as Speech from "expo-speech";

// BCP-47 codes for expo-speech's `language` option. Azerbaijani TTS
// voices are missing on a lot of devices — when that happens the OS
// falls back to whatever default voice it has rather than erroring,
// so this still degrades gracefully instead of staying silent.
const SPEECH_LOCALE: Record<string, string> = {
  az: "az-AZ",
  en: "en-US",
  ru: "ru-RU",
  tr: "tr-TR",
};

/** Reads `text` aloud in the given app language, replacing any speech already in progress. */
export async function speakText(text: string, lang: string): Promise<void> {
  if (!text.trim()) return;
  await Speech.stop();
  Speech.speak(text, { language: SPEECH_LOCALE[lang] ?? SPEECH_LOCALE.en });
}

export async function stopSpeaking(): Promise<void> {
  await Speech.stop();
}
