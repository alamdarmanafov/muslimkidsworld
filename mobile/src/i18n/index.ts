import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import az from "./locales/az.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import tr from "./locales/tr.json";

export const supportedLanguages = ["en", "az", "tr", "ru"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  en: "English",
  az: "Azərbaycanca",
  tr: "Türkçe",
  ru: "Русский",
};

const LANGUAGE_STORAGE_KEY = "mkw.language";

function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  return !!value && (supportedLanguages as readonly string[]).includes(value);
}

function detectDeviceLanguage(): SupportedLanguage {
  const deviceLanguageCode = Localization.getLocales()[0]?.languageCode ?? undefined;
  return isSupportedLanguage(deviceLanguageCode) ? deviceLanguageCode : "en";
}

let initialized = false;

/**
 * Initializes i18next once, using a previously saved language choice if
 * there is one (see setLanguage below), otherwise the device's own
 * language when it's one we support, otherwise English. Safe to call
 * more than once — later calls are a no-op.
 */
export async function initI18n(): Promise<void> {
  if (initialized) return;
  initialized = true;

  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  const language = isSupportedLanguage(savedLanguage ?? undefined)
    ? (savedLanguage as SupportedLanguage)
    : detectDeviceLanguage();

  await i18next.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      az: { translation: az },
      tr: { translation: tr },
      ru: { translation: ru },
    },
    lng: language,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

/** Switches the app's language and remembers the choice for next launch. */
export async function setLanguage(language: SupportedLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18next.changeLanguage(language);
}

export default i18next;
