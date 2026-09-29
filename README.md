# BP Diary Android

Android app packaging for **BP Diary / Дневник артериального давления 5.5** using Capacitor 8.

## Current release: V15 finalization

V15 completes the staged V11 → V12 → V13 roadmap while preserving the validated medical/core logic.

### Mobile experience

- premium mobile UI with light/dark themes and RU/EN;
- touch-first navigation: **Замер / Аналитика / Архив**;
- corrected Cardio-profile spacing and Personal range & goals framing;
- Reminder button in the top app bar;
- unified Archive action buttons, with destructive Delete all kept red;
- first-run onboarding and full About screen.

### Archive

- modern reading cards;
- fast text search across rendered readings;
- quick periods: **All / 7 / 30 / 90 days**;
- newest/oldest sorting;
- edit/delete actions with confirmation and safety backup behavior.

### Reports and export

- doctor report preview;
- periods: **7 / 14 / 30 days / all data / custom range**;
- **Print / Save PDF / Share** actions;
- offline PDF generation libraries packaged with the app.

### Data protection

- up to five automatic local restore points;
- manual Full Backup JSON export/restore remains available;
- automatic safety copies are made before selected destructive/restore operations.

### Accessibility

- enlarged touch targets;
- visible keyboard focus;
- screen/region and dialog semantics;
- accessible labels for navigation, archive search, record actions and form controls;
- reduced-motion and increased-contrast support.

## App identity

- App name: `BP Diary`
- Android application ID: `com.tokhirjonyuldoshev.bpdiary`
- Mobile subtitle: `Дневник артериального давления`

## Build and QA

The normal GitHub Actions workflow builds both debug and release variants and verifies that both APKs use the same stable update signer.

V15 also includes:

- `npm run qa:v15` static regression smoke checks;
- `QA_V15.md` final device regression matrix;
- `CHANGELOG.md` release history.

The final direct-distribution GitHub Release is built as a **release APK** and published with a SHA-256 checksum.

## Signing note

The V15 direct-distribution APK is signed with the same stable update key used by the recent V8–V14 test builds, so it can be installed over the current app without uninstalling.

That stable direct-distribution key is **not a Play Store production signing key**. A future Google Play publication should use a dedicated private release key / Play App Signing and preferably an AAB.

## Data note

Diary data are stored inside the Android app/WebView data area. Automatic backups also live inside the app sandbox. Uninstalling the application removes that local app data, so create a **Full Backup** before uninstalling, changing devices or moving to a different signing lineage.

## Release safety

Before declaring the release fully device-verified, complete the checklist in `QA_V15.md`, especially:

1. install V15 over V14;
2. verify existing readings and settings;
3. test Archive search/filter/sort;
4. test Save/Share PDF;
5. test manual and automatic backup/restore;
6. test Android Back, Voice/TTS, RU/EN and light/dark;
7. check larger system text and TalkBack labels.
