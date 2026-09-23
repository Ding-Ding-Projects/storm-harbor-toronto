# Roadmap

## Core experience

- [x] Create a Toronto-default interactive lightning map. The live `0.1.0` interface was captured at desktop and mobile sizes.
- [x] Add red, yellow, green, and unavailable signals with a thunder report control. The live interface showed the green observation state and red basement state.
- [x] Check the signal against live and synthetic data, including stale and malformed source responses. Fourteen focused data and signal tests passed.
- [ ] Show the running version and build timestamp on the initial screen, then capture the clean `0.1.1` bundles.
- [ ] Integrate the four review fixes in provenance lookup, Windows staging, dark-theme contrast, and marker semantics; verify the built interface. The review branch passed four focused regressions and a local build; captures and integration remain pending.
- [ ] Complete the universal accessibility, localization, settings, and per-surface user-interface contract. A hand-written inventory and the remaining work still need to be recorded.
- [ ] Complete the checked-in design-reference parity inventory and viewport, language, theme, and scale matrix.

## Distribution

- [x] Publish the public website and confirm anonymous HTTP delivery. The current live version is `0.1.0`.
- [ ] Publish the `0.1.1` bundle to the configured Sites project. The current Sites account returns `NOT_FOUND` for the project, and its owner and editable lists are empty.
- [x] Build and inspect the signed Android APK and unsigned Windows Squirrel package for `0.1.0`; verify the published download hashes.
- [ ] Build, capture, and publish release `0.1.1` from a clean, pushed source revision.
- [ ] Install and verify the Windows Squirrel package in a disposable installation boundary.
- [ ] Install and verify the Android APK on a device or usable emulator.
- [x] Capture and review the live desktop and mobile interface, plus the directly launched Windows package, for the `0.1.0` baseline.
- [ ] Capture the `0.1.1` web, desktop, and Android builds with provenance-bound receipts.
