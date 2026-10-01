# Storm Harbor Toronto

A calm, interactive lightning map for Toronto and surrounding areas, with a clear shelter signal. The map uses observed lightning density from Environment and Climate Change Canada, a short thunderstorm forecast from Open-Meteo, and OpenStreetMap tiles.

**Public website:** https://storm-harbor-toronto.deennosheung.chatgpt.site

**Downloads:** https://github.com/Ding-Ding-Projects/storm-harbor-toronto/releases/tag/v0.1.0

## What the signal means

| Signal | Condition | Guidance |
| --- | --- | --- |
| Red | Lightning observed within 30 km in the recent three 10-minute frames, or the user reports hearing thunder | Head to a safe, accessible basement if available; otherwise stay in a fully enclosed building. |
| Yellow | Lightning observed 30–60 km away, or thunderstorms forecast in the next three hours | Prepare to move indoors and keep watching conditions. |
| Green | No lightning observed within 60 km in valid recent frames and no thunderstorm forecast in the next three hours | No nearby lightning observed. This is not a safety guarantee. |
| Grey | Recent observation or forecast data is unavailable or invalid | Check official weather updates and listen for thunder. |

The lightning source publishes aggregated density cells of approximately 2.5 km, every 10 minutes. These are not exact strike locations. The three recent frames cover 30 minutes ending at the latest published time, which may lag the current time. When thunder is heard, go indoors immediately and remain indoors for at least 30 minutes after the last thunder. A basement may be more comfortable but is not required for lightning protection. Avoid a basement affected by flooding.

## Run and build

`build.bat` prepares dependencies and builds the web interface. On a prepared machine, use `npm ci`, `npm run assets`, and `npm run dev`. Use `npm run build` for the static site, `build-installer.bat` for the unsigned Windows Squirrel installer, and `npm run android:apk` for a signed Android release APK. The Windows installer is written to `release/windows/v<package-version>/`, and its staged Electron metadata uses the root `package.json` version. Android release APKs require a project-owned signing key stored outside the repository. `npm run android:apk:debug` makes a temporary debug package.

The web version uses no account and requests device location only after the user selects that control. Language preference and the last user-reported thunder time stay in browser storage. Weather requests go directly to the source providers. The app does not store location history. If the source or network is unavailable, the signal must show unavailable rather than green.

## Sources and terms

- [ECCC lightning density data and license](https://eccc-msc.github.io/open-data/msc-data/lightning/readme_lightning_en/)
- [ECCC lightning safety](https://www.canada.ca/en/environment-climate-change/services/lightning/safety/preparedness-fact-sheet.html)
- [Open-Meteo forecast API](https://open-meteo.com/en/docs), with attribution under CC BY 4.0
- [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) and [tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

This is an independent project. It is not an official warning service or an endorsement by the Government of Canada.

## Current verification

Release `v0.1.0` remains the latest public release. It includes a signed Android APK and an unsigned Squirrel Windows package. Both downloads were fetched from the release and matched their recorded SHA-256 hashes. The public website is live on the Sites host.

The current `0.1.1` source candidate adds a localized countdown label, visible build version and timestamp metadata, and package-version wiring for the Windows installer. The selected-location pin is decorative; the coordinates and weather details are available in text beside the map. The review-fix branch binds build-provenance Git commands to the project directory, stages only the declared Electron runtime file, improves dark-theme build-label contrast, and hides the noninteractive pin from assistive technology. Four focused regressions passed along with eighteen earlier tests, and `npm run build` completed in that branch. Its local build had uncommitted source and is not release evidence. The branch still needs integration, clean-source packaging, and built-interface verification. Android package-version wiring is ready on `feat/android-version-sync` and is not yet integrated into `main`; fresh package builds and metadata inspection remain pending.

Six `0.1.0` interface captures remain in a local `evidence/` folder without validated provenance receipts. They are not included in the public repository or counted as release evidence. Earlier manual observations describe the map and green and red shelter states, but the updated `0.1.1` bundles have not yet been captured, and Windows and Android installation checks remain open.

The current Sites account cannot resolve the configured project ID: `get_site` returns `NOT_FOUND`, and its owner and editable Site lists are empty. The `0.1.0` website was previously verified, but current retrieval attempts ended at a TLS handshake failure, so present availability is unverified. Publishing the `0.1.1` bundle is blocked until the configured project is accessible again. GitHub issue #1 tracks the remaining visual and installation checks.
