# Android package

The Android app wraps the same local Vite bundle used by the website. Its application ID is `ca.stormharbor.toronto`, and it starts at Toronto. The app needs network access for map tiles and weather data. Location access is optional and requested only when the user selects device location.

## Build

Install Node.js, JDK 21, and the Android SDK with API 35, Android SDK Build Tools, and Platform Tools. Set `JAVA_HOME` and `ANDROID_HOME` to those installations. Run `npm ci` and then `npm run android:apk` from the repository root. The command builds the website, syncs Capacitor, generates Android launcher icons from `design/storm-harbor.svg`, and assembles a signed release APK at `android/app/build/outputs/apk/release/app-release.apk`.

Release signing reads `%LOCALAPPDATA%/StormHarborToronto/android-signing.properties`. The file must remain outside this repository and contain `storeFile`, `storePassword`, `keyAlias`, and `keyPassword` properties pointing to a project-owned PKCS#12 keystore. Keep the same keystore for future releases so Android can install updates over earlier versions. The build stops if release signing is missing. Never check in the keystore or signing properties.

For a temporary local debug build, run `npm run android:apk:debug`. This produces `android/app/build/outputs/apk/debug/app-debug.apk` with Android's debug signing identity. It is not the release download.

## Verify

Use `apksigner verify --verbose --print-certs` from the installed Android SDK Build Tools to check the release signature. Use `aapt dump badging` to inspect the package name, version, launcher icon, and SDK range. Install with `adb install -r android/app/build/outputs/apk/release/app-release.apk` on a connected device or emulator, then open Storm Harbor Toronto and test the map, optional location prompt, and shelter signal. The APK needs a data connection for live observations.
