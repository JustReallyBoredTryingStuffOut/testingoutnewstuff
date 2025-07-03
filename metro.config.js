const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for import.meta
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper module resolution
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config; 