module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       ['@babel/plugin-transform-class-properties', { loose: true }],
//       ['@babel/plugin-transform-private-methods', { loose: true }],
//       // "react-native-worklets-core/plugin",
//       'react-native-reanimated/plugin'
//     ],
//   };
// };