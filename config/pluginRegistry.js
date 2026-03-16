const defaultRegistryConfig = Object.freeze({
  indexUrl: "https://raw.githubusercontent.com/wprint3d/plugin-registry/main/index.json",
  repositoryUrl: "https://github.com/wprint3d/plugin-registry",
  examplesUrl: "https://github.com/wprint3d/wprint3d-core/tree/main/examples/plugins",
});

const readEnv = (key, fallback) => {
  const value = process.env[key];

  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export const pluginRegistryConfig = Object.freeze({
  indexUrl: readEnv("EXPO_PUBLIC_PLUGIN_REGISTRY_INDEX_URL", defaultRegistryConfig.indexUrl),
  repositoryUrl: readEnv("EXPO_PUBLIC_PLUGIN_REGISTRY_REPOSITORY_URL", defaultRegistryConfig.repositoryUrl),
  examplesUrl: readEnv("EXPO_PUBLIC_PLUGIN_EXAMPLES_URL", defaultRegistryConfig.examplesUrl),
});

const toVersionParts = (value) =>
  String(value || "")
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map((part) => Number.parseInt(part, 10));

const compareVersionsDescending = (left, right) => {
  const leftParts = toVersionParts(left?.version ?? left);
  const rightParts = toVersionParts(right?.version ?? right);
  const size = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < size; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart !== rightPart) {
      return rightPart - leftPart;
    }
  }

  return String(right?.version ?? right).localeCompare(String(left?.version ?? left));
};

export const normalizeRegistryPlugin = (plugin) => {
  if (!plugin || typeof plugin !== "object") {
    return null;
  }

  const versions = Array.isArray(plugin.versions)
    ? [ ...plugin.versions ].filter((entry) => entry && typeof entry === "object").sort(compareVersionsDescending)
    : [];
  const latestRelease = versions[0] || null;

  return {
    ...plugin,
    versions,
    latestVersion: plugin.latestVersion || latestRelease?.version || plugin.version || null,
    version: plugin.version || latestRelease?.version || plugin.latestVersion || null,
    packageUrl: plugin.packageUrl || latestRelease?.packageUrl || null,
    documentationUrl: plugin.documentationUrl || latestRelease?.documentationUrl || null,
    homepageUrl: plugin.homepageUrl || latestRelease?.homepageUrl || null,
    releasedAt: plugin.releasedAt || latestRelease?.releasedAt || null,
    publicKeySha256: plugin.publicKeySha256 || latestRelease?.publicKeySha256 || null,
  };
};

export const normalizeRegistryPayload = (payload) => {
  const plugins = Array.isArray(payload?.plugins) ? payload.plugins : payload;

  if (!Array.isArray(plugins)) {
    return [];
  }

  return plugins
    .map(normalizeRegistryPlugin)
    .filter(Boolean);
};
