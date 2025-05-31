module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      // Required for react-native-reanimated
      "react-native-reanimated/plugin",
      // NativeWind
      "nativewind/babel",
    ],
  };
}; 