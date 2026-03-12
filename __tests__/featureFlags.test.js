/* eslint-env jest */

import { featureFlags, isPluginSystemEnabled } from "../config/featureFlags";

describe("featureFlags", () => {
  it("disables the plugin system by default", () => {
    expect(featureFlags.pluginSystem).toBe(false);
    expect(isPluginSystemEnabled()).toBe(false);
  });
});
