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

  it("describes the container-based install flow as Podman in every supported language", () => {
    expect(translations.en.main.tabs.docker).toBe("Podman (Docker-like)");
    expect(translations.es.main.tabs.docker).toContain("Podman");
    expect(translations.fr.main.tabs.docker).toContain("Podman");
    expect(translations.pt.main.tabs.docker).toContain("Podman");
    expect(translations.it.main.tabs.docker).toContain("Podman");
    expect(translations.de.main.tabs.docker).toContain("Podman");
    expect(translations.es_AR.main.tabs.docker).toContain("Podman");

    expect(translations.en.docker.installEngineTitle).toContain("Podman");
    expect(translations.es.docker.installEngineTitle).toContain("Podman");
    expect(translations.fr.docker.installEngineTitle).toContain("Podman");
    expect(translations.pt.docker.installEngineTitle).toContain("Podman");
    expect(translations.it.docker.installEngineTitle).toContain("Podman");
    expect(translations.de.docker.installEngineTitle).toContain("Podman");
    expect(translations.es_AR.docker.installEngineTitle).toContain("Podman");

    expect(translations.en.docker.postInstallTitle).toBeUndefined();
    expect(translations.es.docker.postInstallTitle).toBeUndefined();
    expect(translations.fr.docker.postInstallTitle).toBeUndefined();
    expect(translations.pt.docker.postInstallTitle).toBeUndefined();
    expect(translations.it.docker.postInstallTitle).toBeUndefined();
    expect(translations.de.docker.postInstallTitle).toBeUndefined();
    expect(translations.es_AR.docker.postInstallTitle).toBeUndefined();

    expect(translations.en.docker.recommendedBody).toContain("Podman");
    expect(translations.es.docker.recommendedBody).toContain("Podman");
    expect(translations.fr.docker.recommendedBody).toContain("Podman");
    expect(translations.pt.docker.recommendedBody).toContain("Podman");
    expect(translations.it.docker.recommendedBody).toContain("Podman");
    expect(translations.de.docker.recommendedBody).toContain("Podman");
    expect(translations.es_AR.docker.recommendedBody).toContain("Podman");
  });

  it("provides a translated Raspberry Pi device label in every supported language", () => {
    expect(translations.en.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (or newer)");
    expect(translations.es.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (o más reciente)");
    expect(translations.fr.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (ou plus récent)");
    expect(translations.pt.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (ou mais recente)");
    expect(translations.it.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (o successivo)");
    expect(translations.de.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (oder neuer)");
    expect(translations.es_AR.raspberryPi.deviceLabel).toBe("Raspberry Pi 3 (o más reciente)");
  });
});
