/* eslint-env jest */

import {
  AUTO_LANGUAGE,
  LANGUAGE_OPTIONS,
  getEffectiveLanguage,
  getEffectiveLanguageFromLocaleTags,
  getStoredLanguageSelectionValue,
  resolveSupportedLanguage,
  translations,
} from "../config/localization";

describe("localization", () => {
  it("exposes the requested language options including autodetection", () => {
    expect(LANGUAGE_OPTIONS.map((option) => option.value)).toEqual([
      AUTO_LANGUAGE,
      "en",
      "es",
      "fr",
      "pt",
      "it",
      "de",
      "es_AR",
    ]);
  });

  it("maps detected locales to the supported language set", () => {
    expect(resolveSupportedLanguage("es-AR")).toBe("es_AR");
    expect(resolveSupportedLanguage("es_MX")).toBe("es");
    expect(resolveSupportedLanguage("pt-BR")).toBe("pt");
    expect(resolveSupportedLanguage("de-DE")).toBe("de");
    expect(resolveSupportedLanguage("ja-JP")).toBe("en");
    expect(resolveSupportedLanguage(undefined)).toBe("en");
  });

  it("prefers a manually selected language over autodetection", () => {
    expect(getEffectiveLanguage("fr", "es-AR")).toBe("fr");
    expect(getEffectiveLanguage(AUTO_LANGUAGE, "es-AR")).toBe("es_AR");
  });

  it("prefers an exact supported locale from the browser preference chain", () => {
    expect(getEffectiveLanguageFromLocaleTags(AUTO_LANGUAGE, ["es-419", "es-AR", "en-US"])).toBe("es_AR");
    expect(getEffectiveLanguageFromLocaleTags(AUTO_LANGUAGE, ["pt-BR", "es-AR"])).toBe("es_AR");
    expect(getEffectiveLanguageFromLocaleTags(AUTO_LANGUAGE, ["es-419", "es-MX"])).toBe("es");
  });

  it("maps Latin American Spanish to es_AR when the device timezone confirms Argentina", () => {
    expect(
      getEffectiveLanguageFromLocaleTags(
        AUTO_LANGUAGE,
        ["es-419", "en-US"],
        "America/Argentina/Buenos_Aires"
      )
    ).toBe("es_AR");

    expect(
      getEffectiveLanguageFromLocaleTags(
        AUTO_LANGUAGE,
        ["es-419", "en-US"],
        "America/Santiago"
      )
    ).toBe("es");
  });

  it("maps Chrome for Android Spanish formatting plus Argentina timezone to es_AR", () => {
    expect(
      getEffectiveLanguageFromLocaleTags(
        AUTO_LANGUAGE,
        ["en-US", "es-US", "es", "en"],
        "America/Buenos_Aires",
        "es-MX"
      )
    ).toBe("es_AR");

    expect(
      getEffectiveLanguageFromLocaleTags(
        AUTO_LANGUAGE,
        ["en-US", "es-US", "es", "en"],
        "America/Buenos_Aires",
        "en-US"
      )
    ).toBe("es");
  });

  it("only persists explicit non-auto selections", () => {
    expect(getStoredLanguageSelectionValue("de")).toBe("de");
    expect(getStoredLanguageSelectionValue(AUTO_LANGUAGE)).toBeNull();
    expect(getStoredLanguageSelectionValue("unknown")).toBeNull();
  });

  it("keeps accented characters and the Spanish ñ in translations", () => {
    expect(translations.es.main.heroDescription).toContain("experiencia");
    expect(translations.es.main.heroDescription).toContain("rápido");
    expect(translations.es.main.heroDescription).toContain("fiable");
    expect(translations.es.main.getStarted).toBe("Primeros pasos");
    expect(translations.es.main.cards[1].title).toContain("tus");
    expect(translations.es_AR.main.browsePlugins).toContain("Explorá");
    expect(translations.es_AR.main.getStarted).toBe("Primeros pasos");
  });
});
