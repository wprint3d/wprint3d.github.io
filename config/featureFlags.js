const envFlag = (key, fallback = false) => {
  const value = process.env[key];

  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if ([ "1", "true", "yes", "on" ].includes(normalized)) {
    return true;
  }

  if ([ "0", "false", "no", "off" ].includes(normalized)) {
    return false;
  }

  return fallback;
};

export const featureFlags = Object.freeze({
  pluginSystem: envFlag("EXPO_PUBLIC_PLUGIN_SYSTEM_ENABLED", false),
});

export function isPluginSystemEnabled() {
  return featureFlags.pluginSystem;
}
