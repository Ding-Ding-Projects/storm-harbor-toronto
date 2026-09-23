# Build provenance

Every production build writes `dist/build-info.json` from the package version, the build process time, the build host's timezone, the current source revision, and the source checkout's clean state. The cleanliness field excludes the generated `dist/` output itself and includes every other tracked or untracked path. Vite embeds the same values in the user interface and in Android and desktop bundles that package `dist/`.

The front screen shows the package version and build timestamp with seconds. It formats the timestamp in the build timezone and names the IANA timezone. If the timestamp or timezone is missing or invalid, the interface reports that the build time is unavailable instead of using the launch clock.

The desktop staging package uses the root package name and version instead of a second hard-coded version. The Android Gradle change currently on `feat/android-version-sync` is intended to read the same version for `versionName` and map the three numeric components into fixed-width numeric slots for `versionCode`. That mapping preserves version ordering for the supported component range and fails on malformed or out-of-range values. For package version `0.1.1`, the expected Android metadata is `versionName=0.1.1` and `versionCode=1001`; inspect the built APK after that change is integrated to verify both values.

The build record is generated from the actual package and source-control state. A release candidate must be built from a clean, pushed source revision, and its provenance record must identify that revision and report a clean source tree. A local build made while source or documentation files are changed is useful for development, but is not release evidence.

## Verification

`npm run build` type-checks the application and writes the static bundle plus `dist/build-info.json`. Compare the JSON version with `package.json`, validate the timestamp and IANA timezone, and confirm the recorded source revision is the intended release target. Run `npm test` for the lightning signal and weather-data cases. Inspect the version and timestamp from the real packaged interface before publishing a release.
