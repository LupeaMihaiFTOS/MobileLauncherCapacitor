# FTOS Native Static Libraries

The FTOS Native Static Libraries allow you to develop custom behaviours on the mobile platforms. The static libraries are loaded as the page loads, when the Capacitor runtime is initializated.

## Example lbiraries

This repo currently contains a static library that allows biometric authentication. It alters the login page to hide the credentials area and show a biometric validation dialog in order to authenticate the user.

## Building FTOS Native Static Libraries

Each independent static library is contained in it's own .ts file (eg. FingerprintAuth.ts)

Building the static libraries is done by running `npm run build`. External dependencies are resolved in `webpack.config.js`. As an example you have the externalisation of jquery, capacitor core, and cordova fingerprint plugin already present in the file.

## Deploying static libraries

Each library is built in it's own file in the `dist` folder. The file pattern is `static-ftos-native.<LibName>_<Version>.lib.js`. To enable the static library, it is sufficient to copy the library file in the platform's `NativeLibs/Static` directory.