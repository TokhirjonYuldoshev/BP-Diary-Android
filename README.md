# BP Diary Android

Android app packaging for **Дневник артериального давления 5.5** using Capacitor 8.

## Modern mobile UI

The Android build keeps the validated diary logic and adds a dedicated mobile application layer:

- fixed app bar with quick language/theme controls;
- premium mobile hero for the current reading;
- bottom navigation: **Замер / Аналитика / Архив**;
- only one main screen is shown at a time;
- Cardio profile, SCORE2 and personal targets are compact expandable panels;
- measurement cards and controls are optimized for touch;
- analytics charts collapse into compact no-data states when there are no records;
- the archive is rendered as modern measurement cards instead of a 1000px-wide table;
- archive export/backup actions are available through a bottom action sheet;
- light/dark themes and RU/EN remain supported;
- Chart.js, Font Awesome and SheetJS are packaged locally for offline runtime use.

The mobile shell is injected **outside the diary's validated inline JavaScript**. CI checks the generated HTML positions and JavaScript syntax before Android compilation, preventing the prior failure where template source appeared as visible text.

## App identity

- App name: `Дневник давления`
- Android application ID: `com.tokhirjonyuldoshev.bpdiary`

## Build

GitHub Actions builds `BP-Diary-5.5-WOW.apk` on every push to `main`.

The test APK uses a repository-stored debug-only signing key so subsequent test builds can update one another. A Play Store release must use a separate private release key and signed AAB.

## Data

Diary data are stored in the Android WebView local storage, matching the web version. Use **Полный бэкап** regularly. Before uninstalling an older build signed with a different key, export a Full Backup and restore it after installation.
