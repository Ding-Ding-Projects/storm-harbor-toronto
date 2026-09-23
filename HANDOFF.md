# Handoff

## Published baseline

The public repository is `Ding-Ding-Projects/storm-harbor-toronto`; its default branch is `main`. The current public release is `v0.1.0`, targeting `9e7e87f3a93d172586b0670060e930b6c1baf7da`. It includes a signed Android APK and an unsigned Squirrel Windows setup. Both downloads were fetched from the release and matched their recorded SHA-256 hashes. The public website is `https://storm-harbor-toronto.deennosheung.chatgpt.site` and its last verified deployment is version `0.1.0` from source `7beb8787f800ca85bbe5775728d9528ce846289d`.

## Current candidate

The `0.1.1` candidate changes the source version, localizes the thunder countdown unit, gives the map marker a localized accessible description, and adds a version and build timestamp to the front screen. `dist/build-info.json` records the package version, build time, timezone, source revision, and source-only clean state. Documentation now describes that record.

`npm test` passed 18 cases: 14 existing data and signal cases plus four build-timestamp formatting cases. `npm run build` completed after the latest source change. Its current provenance reports a dirty source tree because the candidate source and documentation have not yet been committed. This output is for local verification only. Rebuild from the pushed source before packaging.

The Windows packaging script now reads the root package name and version and writes output under `release/windows/v<version>/`; this change has not yet been exercised by a package build. The linked `feat/android-version-sync` branch now derives Android `versionName` and `versionCode` from the root package version. For `0.1.1`, the expected values are `0.1.1` and `1001`. That branch has not yet been built or integrated.

Independent correctness, security, and accessibility reviews, followed by separate votes, confirmed four fixes required before a new package build: bind build-provenance Git commands to the configuration directory, stage only the declared Electron runtime file, raise the dark-theme build-label contrast, and make the location marker explicitly decorative instead of relying on unsupported `alt` behavior. Focused regression coverage and built-surface verification are still pending. Reviewers found no current packaged log or leaked local data.

## User-interface evidence

Earlier manual notes record the `0.1.0` public website at desktop, 390 px, and 320 px widths. The green observation state and a red state after a thunder report were observed; the red state showed the 30-minute shelter timer. English and Cantonese output were observed. A directly launched `0.1.0` Windows package also showed both states. Six PNG files remain only in the local `evidence/` folder without validated provenance receipts, so they are excluded from the public repository and are not counted as release evidence. These observations do not prove accessibility, Windows installation, Android installation, or operation of the new `0.1.1` metadata.

The hand-written inventory in `docs/ui/completeness.md` records 46 rows and the remaining gaps in the shared interface contract. The full settings and feature inventory, focused negative regressions, checked-in design-reference parity matrix, and additional provenance-bound built-surface captures remain incomplete.

## External verification blockers

- The Sites connector returns `NOT_FOUND` for the configured project ID `appgprj_6ab2df96a280819190f9f66f447e3eda`; owner and editable Site lists are empty in the current account. The `0.1.0` site was previously verified, but current retrieval attempts ended at a TLS handshake failure, so present availability is unverified. A `0.1.1` publication cannot be saved or deployed until the configured project is accessible.
- No disposable Windows user or virtual machine is available for Squirrel installation verification.
- No Android device or usable emulator is available for installation verification.
- The GitHub wiki is enabled but not initialized. `git ls-remote` could not access a wiki repository, so no wiki article has been created.
- The repository has no GitHub Actions workflow. It also has no existing indexable dim-sum photo catalog required by the release process; no substitute image has been generated or downloaded.

Issue #1 tracks the remaining visual and installation checks. The next safe work is to finish the four confirmed source fixes and their regressions, integrate and push the verified candidate to `main`, rebuild from that source revision, package both platforms, and capture the new interfaces. Then retry the Sites workflow when the configured project is visible, and complete installation checks on disposable Windows and Android environments.
