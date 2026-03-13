const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const useLatestCallbackShim = path.resolve(__dirname, "shims/useLatestCallback.js");

  const { transformer, resolver } = config;
  const defaultResolveRequest = resolver.resolveRequest;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
  };

  config.transformer.minifierPath   = 'metro-minify-terser';
  config.transformer.minifierConfig = {
    compress: { drop_console: ['debug'] }
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === "use-latest-callback") {
        return {
          filePath: useLatestCallbackShim,
          type: "sourceFile"
        };
      }

      if (defaultResolveRequest) {
        return defaultResolveRequest(context, moduleName, platform);
      }

      return context.resolveRequest(context, moduleName, platform);
    }
  };

  config.transformer.getTransformOptions = async () => ({
    transform: {
      inlineRequires: true,
      experimentalImportSupport: true,
    },
  });

  return config;
})();
