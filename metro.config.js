const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  };

  config.transformer.minifierPath   = 'metro-minify-terser';
  config.transformer.minifierConfig = {
    compress: { drop_console: ['debug'] }
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"]
  };

  config.transformer.getTransformOptions = async () => ({
    transform: {
      inlineRequires: true,
      experimentalImportSupport: true,
    },
  });

  return config;
})();