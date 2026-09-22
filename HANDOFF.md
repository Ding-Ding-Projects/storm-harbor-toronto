# Handoff

The core map and signal source is in progress. The source uses ECCC GeoMet WMS for visualization and WCS GeoTIFF for numeric proximity analysis, plus Open-Meteo for forecast thunderstorm codes. The app defaults to Toronto and lets users move the map pin, enter coordinates, or request device location. The deployed website is https://storm-harbor-toronto.deennosheung.chatgpt.site.

The source build and 14 focused tests pass. The public deployment succeeded and the anonymous HTML serves the expected bundle. A live ECCC WCS request returned a georeferenced TIFF for Toronto. The signed Android release APK and unsigned Windows Squirrel setup have been built and inspected for expected packages. The required isolated UI tool route is unavailable, and no Android device or emulator is present, so visual, installed, and interaction verification remain unproven. Do not represent those layers as passed. Keep the roadmap checkboxes aligned with that evidence.
