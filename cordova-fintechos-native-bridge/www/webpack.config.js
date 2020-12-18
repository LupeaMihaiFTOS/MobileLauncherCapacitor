const path = require('path');

module.exports = {
  entry: {
    main: "./dist/index.js",
  },
  output: {
    path: __dirname,
    filename: 'FintechosNativeBridge.js',
  },
  externals: {
    "jquery": "jQuery",
    "@capacitor/core": "Capacitor",
    "capacitor-plugin-fintechos-core": "Capacitor.Plugins",
    "FingerprintAIO": "Fingerprint"
  }
};