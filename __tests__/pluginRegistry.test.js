/* eslint-env jest */

describe("plugin registry config", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it("normalizes versioned registry entries into marketplace cards", () => {
    jest.resetModules();
    const {
      normalizeRegistryPayload,
    } = require("../config/pluginRegistry");

    const normalized = normalizeRegistryPayload({
      plugins: [
        {
          id: "octoprint.navbartemp-port",
          name: "OctoPrint NavbarTemp Port",
          description: "Ported plugin",
          categories: ["octoprint", "navbar"],
          versions: [
            {
              version: "0.1.0",
              packageUrl: "https://example.com/0.1.0.w3dp",
              documentationUrl: "https://example.com/docs",
              releasedAt: "2026-03-15",
            },
            {
              version: "0.2.0",
              packageUrl: "https://example.com/0.2.0.w3dp",
              documentationUrl: "https://example.com/docs-v2",
              releasedAt: "2026-03-16",
            },
          ],
        },
      ],
    });

    expect(normalized).toHaveLength(1);
    expect(normalized[0]).toMatchObject({
      id: "octoprint.navbartemp-port",
      latestVersion: "0.2.0",
      version: "0.2.0",
      packageUrl: "https://example.com/0.2.0.w3dp",
      documentationUrl: "https://example.com/docs-v2",
      releasedAt: "2026-03-16",
    });
  });

  it("reads the registry URLs from expo public env vars when provided", () => {
    process.env = {
      ...originalEnv,
      EXPO_PUBLIC_PLUGIN_REGISTRY_INDEX_URL: "https://plugins.example.com/index.json",
      EXPO_PUBLIC_PLUGIN_REGISTRY_REPOSITORY_URL: "https://github.com/example/plugin-registry",
      EXPO_PUBLIC_PLUGIN_EXAMPLES_URL: "https://github.com/example/plugins",
    };

    jest.resetModules();
    const { pluginRegistryConfig } = require("../config/pluginRegistry");

    expect(pluginRegistryConfig).toMatchObject({
      indexUrl: "https://plugins.example.com/index.json",
      repositoryUrl: "https://github.com/example/plugin-registry",
      examplesUrl: "https://github.com/example/plugins",
    });
  });
});
