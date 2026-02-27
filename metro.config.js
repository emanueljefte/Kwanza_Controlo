const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const { StrictMode } = require("react");
 
const config = getDefaultConfig(__dirname)
config.resolver.assetExts.push("cjs")
config.resolver.sourceExts.push('sql')
module.exports = withNativeWind(config, { input: './global.css' , dev: {StrictMode: false}})