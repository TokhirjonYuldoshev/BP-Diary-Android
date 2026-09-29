# BP Diary Android

Android app packaging for **BP Diary / Дневник артериального давления 5.5** using Capacitor 8.

## Current mobile release track

V14 keeps the validated diary/core logic, preserves the V12/V13 feature set, and includes the corrected mobile profile-card layout:

- premium mobile UI with light/dark themes and RU/EN;
- touch-first navigation: **Замер / Аналитика / Архив**;
- doctor report preview with **Печать / Сохранить PDF / Поделиться**;
- report periods: **7 / 14 / 30 days / all data / custom range**;
- internal automatic backups: up to **5 local restore points**;
- manual full JSON backup/restore remains available;
- archive quick periods and newest/oldest sorting;
- first-run onboarding that can be reopened from **О продукте**;
- in-app toast notifications and confirmation dialogs;
- Android Back handling for screens, sheets and onboarding;
- accessibility polish: minimum touch targets, focus states, reduced-motion and increased-contrast support;
- Voice/TTS and native Android share/print integrations.

The mobile shell is injected **outside the diary's validated inline JavaScript**. Medical/core calculations are intentionally kept separate from mobile presentation changes.

## App identity

- App name: `BP Diary`
- Android application ID: `com.tokhirjonyuldoshev.bpdiary`
- Mobile subtitle: `Дневник артериального давления`

## Build

GitHub Actions builds the Android APK on pushes to the active release branch and to `main`.

For V14 the artifact is named:

`BP-Diary-5.5-V14-Android-APK`

The build verifies the permanent test signer before publishing the artifact so test releases can be installed over the previous version without removing user data.

## Data and backups

Diary data remain stored in the Android WebView local storage, matching the existing app architecture.

V14 preserves the app-internal automatic restore points introduced in V12 while preserving the existing **Полный бэкап** JSON export. Automatic copies survive normal app updates, but uninstalling the application removes app-internal data, so a manual Full Backup is still recommended before uninstalling or moving to another device.

## Release safety

Before treating a build as stable, verify on a real Android device:

1. install over the previous version without uninstalling;
2. open and edit an archived reading;
3. test Android Back from each screen and sheet;
4. save and share a doctor PDF;
5. create and restore both manual and automatic backups;
6. test RU/EN and light/dark themes;
7. test Voice/TTS.
