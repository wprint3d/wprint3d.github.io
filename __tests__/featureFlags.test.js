/* eslint-env jest */

import { featureFlags, isPluginSystemEnabled } from "../config/featureFlags";

describe("featureFlags", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it("disables the plugin system by default", () => {
    expect(featureFlags.pluginSystem).toBe(false);
    expect(isPluginSystemEnabled()).toBe(false);
  });

  it("allows the plugin system to be enabled through an Expo public env var", () => {
    process.env = {
      ...originalEnv,
      EXPO_PUBLIC_PLUGIN_SYSTEM_ENABLED: "true",
    };

    jest.resetModules();

    const { featureFlags: envFlags, isPluginSystemEnabled: envEnabled } = require("../config/featureFlags");

    expect(envFlags.pluginSystem).toBe(true);
    expect(envEnabled()).toBe(true);
  });
});
