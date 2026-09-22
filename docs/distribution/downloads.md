# Builds and downloads

The public website is built from `dist/` and deployed through Sites. The Windows download is an unsigned Squirrel.Windows installer built from a staged runtime-only package, with the React bundle inside `app.asar`. The Android download is a Capacitor APK signed with a stable project-owned key held outside the repository. The source repository contains neither signing secrets nor an Android keystore.

Build the website with `npm run build`, the Windows installer with `npm run desktop:package`, and the signed Android APK with `npm run android:apk` after configuring a local JDK 21, Android SDK, and protected signing properties as described in `android/README.md`. The root `build.bat` and `build-installer.bat` provide Windows entry points.

The website needs network access for live weather and map tiles. The installed apps use the same sources. If the network is unavailable, the signal must show unavailable rather than green. The Windows setup is unsigned, so the operating system may show an unknown-publisher warning. The Android key proves continuity between releases but does not establish store approval or public trust.

Package structure, hashes, and signature status are checked before release. Installation, launch, and real interface captures are separate verification steps and are not inferred from successful packaging.
