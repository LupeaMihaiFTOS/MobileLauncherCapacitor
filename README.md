# FintechOS Native Launcher starter project
Created with Capacitor Create. Dependent on capacitor
### To clone the project
```
git clone --recursive https://github.com/LupeaMihaiFTOS/MobileLauncherCapacitor.git
```

### To start using the Capacitor CLI inside the project
```
cd capacitor
npm install
npm run build
cd ../
npm install
```


#### Custom changes on the fork of capacitor
- The capacitor runtime is injected where a script tag with src of "ftos-native.js" is requested. It is safe for other runtimes already injected.
```
<script type="text/javascript" src="ftos-native.js"></script>
```
- Main page redirects (page.html with status code 302) now reflects the new URL in the WebView

### Running this example
1. Sync the native projects with the capacitor files
```
npx cap sync
```
2. Open native project (folder Android or folder iOS) and use the native toolkit to run the app.

