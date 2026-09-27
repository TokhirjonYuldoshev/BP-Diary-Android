# BP Diary Android

Android packaging of **Дневник артериального давления 5.5** using Capacitor 8.

## App

- App name: `Дневник давления`
- Android application ID: `com.tokhirjonyuldoshev.bpdiary`
- Web app source is reconstructed into `www/index.html` by the build preparation script.
- The original medical/calculation logic is preserved.
- Chart.js, Font Awesome and SheetJS are packaged into the APK during CI so the installed app does not depend on those CDNs at runtime.

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

Output:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Data

The app currently stores diary data in the WebView's local storage, matching the web version. Use the app's **Full backup** function regularly. Uninstalling the Android app clears its local app storage unless restored from a backup.

## Distribution

The CI artifact is a debug APK intended for sideload/testing. A Play Store release should use a private signing key and generate a signed release AAB/APK.
