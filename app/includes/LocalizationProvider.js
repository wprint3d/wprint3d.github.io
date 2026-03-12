import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCalendars, useLocales } from "expo-localization";
import { createContext, useContext, useEffect, useState } from "react";

import {
  AUTO_LANGUAGE,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_OPTIONS,
  getEffectiveLanguageFromLocaleTags,
  getLanguageOption,
  getStoredLanguageSelectionValue,
  translations,
} from "../../config/localization";

const LocalizationContext = createContext({
  effectiveLanguage: DEFAULT_LANGUAGE,
  selectedLanguage: AUTO_LANGUAGE,
  setSelectedLanguage: async () => {},
  strings: translations.en,
});

export const LocalizationProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState(AUTO_LANGUAGE);
  const locales = useLocales();
  const calendars = useCalendars();
  const deviceLanguageTags = locales?.map((locale) => locale?.languageTag).filter(Boolean) || [DEFAULT_LANGUAGE];
  const timeZone = calendars?.[0]?.timeZone || null;
  const resolvedLocaleTag = (
    typeof globalThis.Intl !== "undefined"
      ? globalThis.Intl.DateTimeFormat().resolvedOptions().locale || null
      : null
  );
  const effectiveLanguage = getEffectiveLanguageFromLocaleTags(
    selectedLanguage,
    deviceLanguageTags,
    timeZone,
    resolvedLocaleTag
  );
  const strings = translations[effectiveLanguage] || translations.en;

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        const persistedLanguage = getStoredLanguageSelectionValue(storedValue);

        if (isMounted && persistedLanguage) {
          setSelectedLanguageState(persistedLanguage);
        }
      } catch {}
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof globalThis.document === "undefined") {
      return;
    }

    const normalizedLanguage = effectiveLanguage.replace("_", "-");
    globalThis.document.documentElement.lang = normalizedLanguage;

    const metaLanguage = globalThis.document.querySelector('meta[name="language"]');
    if (metaLanguage) {
      metaLanguage.setAttribute("content", normalizedLanguage);
    }
  }, [effectiveLanguage]);

  const setSelectedLanguage = async (value) => {
    const persistedLanguage = getStoredLanguageSelectionValue(value);
    const nextSelection = persistedLanguage || AUTO_LANGUAGE;

    setSelectedLanguageState(nextSelection);

    try {
      if (persistedLanguage) {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, persistedLanguage);
        return;
      }

      await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
    } catch {}
  };

  return (
    <LocalizationContext.Provider
      value={{
        effectiveLanguage,
        getLanguageOption,
        languageOptions: LANGUAGE_OPTIONS,
        selectedLanguage,
        setSelectedLanguage,
        strings,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
