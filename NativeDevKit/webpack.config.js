const path = require('path');
var glob = require("glob");

module.exports = {
  // mode: "production",
  entry: () => {
      return glob.sync('./build/*.js').reduce((pre, cur) => {
          pre[cur.replace(/^.*[\\\/]/, '').split('.')[0]] = cur;
          return pre;
      }, {});
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static-ftos-native.[name]_1.0.0.lib.js',
  },
  externals: {
    "jquery": "jQuery",
    "@capacitor/core": "Capacitor",
    "capacitor-plugin-fintechos-core": "Capacitor.Plugins.FintechosCore",
    "capacitor-secure-storage-plugin": "Capacitor.Plugins.SecureStoragePlugin",
    "FingerprintAIO": "Fingerprint"
  }
};