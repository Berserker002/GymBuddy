const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prefer the React Native export condition so Metro avoids ESM builds that rely on `import.meta`.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'development', 'default'];

module.exports = config;
