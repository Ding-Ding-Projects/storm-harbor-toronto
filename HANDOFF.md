# Handoff

The core map and signal source is in progress. The source uses ECCC GeoMet WMS for visualization and WCS GeoTIFF for numeric proximity analysis, plus Open-Meteo for forecast thunderstorm codes. The app defaults to Toronto and lets users move the map pin, enter coordinates, or request device location. The deployed website is https://storm-harbor-toronto.deennosheung.chatgpt.site.

The source build and 14 focused tests pass. The public deployment succeeded and the anonymous HTML serves the expected bundle. A live ECCC WCS request returned a georeferenced TIFF for Toronto. The signed Android release APK and unsigned Windows Squirrel setup have been built and inspected for expected packages. Public release `v0.1.0` targets `9e7e87f3a93d172586b0670060e930b6c1baf7da`, is non-draft, and contains four assets. Both user-facing downloads were fetched again and matched their published SHA-256 values. The required isolated UI tool route is unavailable, and no Android device or emulator is present, so visual, installed, and interaction verification remain unproven. Do not represent those layers as passed. Keep the roadmap checkboxes aligned with that evidence.

## Next checks

1. On a host with the isolated UI tool route, drive the public website at desktop and 320 px widths, verify the signal states and source errors, and retain genuine captures with source and build hashes.
2. In a disposable Windows installation boundary, install the Squirrel setup, launch the packaged app, and verify its window and weather controls.
3. On an Android device or usable emulator, install the published APK and test startup, optional location permission, map refresh, and thunder control.
4. Revisit the provider request strategy if usage grows. The current clients use normal per-device cache behavior, not a shared weather proxy.
