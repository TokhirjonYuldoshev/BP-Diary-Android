# V15 Final Regression QA

Status: **PASSED / FINAL-STABLE**

The staged V11 → V12 → V13/V14 → V15 plan is closed. Automated CI gates passed and the final device regression was confirmed on Android after installing V15 over V14.

## Automated CI gates

- [x] Offline web assets prepare successfully.
- [x] Mobile JavaScript passes `node --check`.
- [x] Final regression smoke passes.
- [x] No runtime Chart.js / SheetJS CDN dependency remains.
- [x] Archive search is present.
- [x] Accessibility markers and semantic labels are present.
- [x] Cardio-profile spacing fix is preserved.
- [x] Personal-range outer frame fix is preserved.
- [x] Android native Back hook is present.
- [x] Native PDF share bridge is present.
- [x] Automatic backup native methods are present.
- [x] Debug APK builds successfully.
- [x] Release APK builds successfully.
- [x] Stable signing certificate matches the final APK.
- [x] GitHub Release workflow completes successfully.

## Device regression matrix

### Upgrade / data

- [x] V15 installs over V14 without uninstalling.
- [x] Existing readings remain present.
- [x] Existing patient/settings data remain present.
- [x] Existing automatic backups remain available.

### Measure

- [x] Cardio-profile spacing is correct.
- [x] SCORE2 card is aligned.
- [x] Personal range & goals has the expected outer frame.
- [x] Save, edit and delete a reading work.
- [x] Voice input works.
- [x] TTS works.

### Archive

- [x] Search finds matching readings.
- [x] Clearing search restores matching period results.
- [x] 7 / 30 / 90 / All filters work.
- [x] Newest/oldest sort works.
- [x] Edit opens the reading in Measure.
- [x] Delete requires confirmation.
- [x] Data & actions buttons share one blue style except Delete all.

### Reports / export

- [x] Doctor report opens.
- [x] 7 / 14 / 30 / All / custom period works.
- [x] Print opens Android print UI.
- [x] Save PDF produces a non-empty PDF.
- [x] Share produces a non-empty PDF and opens Android Share UI.

### Backup / restore

- [x] Manual Full Backup saves JSON.
- [x] Manual restore requires confirmation and restores data.
- [x] Automatic backup can be created and restored.
- [x] Delete all creates a safety backup before confirmation.

### Navigation / accessibility

- [x] Android Back closes open sheets/report before leaving the app.
- [x] Double Back at root exits.
- [x] Reminder button in the top bar works.
- [x] RU and EN work.
- [x] Light and dark themes work.
- [x] Larger system text remains usable.
- [x] TalkBack labels are meaningful for the tested top controls, bottom navigation, dialogs, archive search and record actions.
- [x] Reduced-motion behavior does not rely on animations.

## Release acceptance

**Accepted.**

- Stable release: `v5.5.150`
- App version: `5.5.150`
- Version code: `150`
- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Release APK SHA-256: `2dc658f51214718706963ed71186a31fd883d8ea1fa4ce5841d55e0f3f598082`

Repository-finalization work after the app release only restructures source visibility/documentation/build reproducibility and does not intentionally change the validated medical/core behavior.
