# Desktop runtime staging

`scripts/package-desktop.mjs` copies the built `dist/` bundle, `electron/main.cjs`, and `assets/storm-harbor.ico` into a temporary package directory. It then writes a minimal package manifest with the version from the root `package.json`. Other files under `electron/` do not enter the Windows package.

`tests/desktop-stage.test.mjs` places a benign ignored `electron/private.log` next to the runtime entry point and checks that staging excludes the log while retaining the required bundle, entry point, and icon. This verifies the staging rule; it does not prove that a new installer was built or installed. Inspect the final `app.asar` and install the Squirrel package before release.
