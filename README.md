# Storm Harbor Toronto

A calm, interactive lightning map for Toronto and surrounding areas, with a clear shelter signal. The map uses observed lightning density from Environment and Climate Change Canada, a short thunderstorm forecast from Open-Meteo, and OpenStreetMap tiles.

**Public website:** https://storm-harbor-toronto.deennosheung.chatgpt.site

## What the signal means

| Signal | Condition | Guidance |
| --- | --- | --- |
| Red | Lightning observed within 30 km in the recent three 10-minute frames, or the user reports hearing thunder | Head to a safe, accessible basement if available; otherwise stay in a fully enclosed building. |
| Yellow | Lightning observed 30–60 km away, or thunderstorms forecast in the next three hours | Prepare to move indoors and keep watching conditions. |
| Green | No lightning observed within 60 km in valid recent frames and no thunderstorm forecast in the next three hours | No nearby lightning observed. This is not a safety guarantee. |
| Grey | Recent observation or forecast data is unavailable or invalid | Check official weather updates and listen for thunder. |

The lightning source publishes aggregated density cells of approximately 2.5 km, every 10 minutes. These are not exact strike locations. The three recent frames cover 30 minutes ending at the latest published time, which may lag the current time. When thunder is heard, go indoors immediately and remain indoors for at least 30 minutes after the last thunder. A basement may be more comfortable but is not required for lightning protection. Avoid a basement affected by flooding.

## Run and build

`build.bat` prepares dependencies and builds the web interface. On a prepared machine, use `npm ci`, `npm run assets`, and `npm run dev`. Use `npm run build` for the static site, `build-installer.bat` for the unsigned Windows Squirrel installer, and `npm run android:apk` for a signed Android release APK. Android release APKs require a project-owned signing key stored outside the repository. `npm run android:apk:debug` makes a temporary debug package.

The web version uses no account and requests device location only after the user selects that control. Language preference and the last user-reported thunder time stay in browser storage. Weather requests go directly to the source providers. The app does not store location history. If the source or network is unavailable, the signal must show unavailable rather than green.

## Sources and terms

- [ECCC lightning density data and license](https://eccc-msc.github.io/open-data/msc-data/lightning/readme_lightning_en/)
- [ECCC lightning safety](https://www.canada.ca/en/environment-climate-change/services/lightning/safety/preparedness-fact-sheet.html)
- [Open-Meteo forecast API](https://open-meteo.com/en/docs), with attribution under CC BY 4.0
- [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) and [tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

This is an independent project. It is not an official warning service or an endorsement by the Government of Canada.

## Current verification

The web source builds and 14 focused signal tests pass. The public website deployment succeeded and its HTML names the expected bundle. The Android APK builds, has a verified signature, and contains the current bundle. The Windows Squirrel package contains the current bundle and an unsigned setup file. Interactive browser, installed Windows, and installed Android verification remain open because the required isolated UI route and an Android device or emulator were unavailable during this build.
