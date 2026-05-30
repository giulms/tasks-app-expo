const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// zustand/middleware ESM build uses import.meta which Metro cannot handle.
// Force CJS by removing the 'import' condition so Metro picks *.js instead of esm/*.mjs.
config.resolver.unstable_conditionNames = [
    'require',
    'default',
    'react-native',
    'browser',
];

module.exports = config;
