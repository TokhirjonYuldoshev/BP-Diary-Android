# BP Diary Android

Android app packaging for **Дневник артериального давления 5.5** using Capacitor 8.

## Mobile app

The Android build now uses a dedicated modern mobile shell while preserving the validated diary calculations:

- bottom navigation: **Замер / Аналитика / Архив**;
- one main section at a time instead of one very long desktop page;
- compact mobile header;
- mobile archive rendered as touch-friendly measurement cards;
- archive actions placed behind a compact **Действия** menu;
- empty charts collapse to a compact no-data state;
- larger touch targets and mobile-friendly form layout;
- light/dark themes remain supported;
- desktop HTML layout and medical calculation functions remain unchanged.

## App identity

- App name: `Дневник давления`
- Android application ID: `com.tokhirjonyuldoshev.bpdiary`

## Offline assets

Chart.js, Font Awesome and SheetJS are copied into the APK during CI and the HTML runtime URLs are rewritten to local files. The installed app therefore does not require those CDNs to display charts/icons or export Excel files.

## Build APK

GitHub Actions automatically builds a debug APK on every push to `main`.

Manual local build requires Node.js 22+, Java 21 and Android SDK:

```bash
npm install
npm run prepare:web
npx cap add android
npx cap sync android
npx capacitor-assets generate --android
cd android
./gradlew assembleDebug
```

## Test-build signing

CI uses a repository-stored **debug-only** keystore so subsequent test APKs have a stable signature and can update one another.

This key is **not** intended for a Play Store release. A production release must use a separate private release keystore stored in GitHub Secrets.

## Data

Diary data currently live in the Android WebView local storage, matching the web version. Use **Полный бэкап** regularly.

If Android requires uninstalling an older APK because it was signed with a different debug key, export a Full Backup **before uninstalling**, then install the new APK and restore that backup.

## Distribution

CI produces a debug APK for sideload/testing. A Play Store build should use a signed release AAB/APK and a private release key.
