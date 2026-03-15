/* eslint-env jest */

import fs from "node:fs";
import path from "node:path";

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

  it("references the Expo public plugin flag directly so the web bundle can inline it", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "config", "featureFlags.js"),
      "utf8"
    );

    expect(source).toContain("process.env.EXPO_PUBLIC_PLUGIN_SYSTEM_ENABLED");
    expect(source).not.toContain("process.env[key]");
  });
});
