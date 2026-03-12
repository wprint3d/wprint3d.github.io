export const featureFlags = Object.freeze({
  pluginSystem: false,
});

export function isPluginSystemEnabled() {
  return featureFlags.pluginSystem;
}
