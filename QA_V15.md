# V15 Final Regression QA

This checklist closes the V11 → V12 → V13 finalization plan while preserving the validated medical/core logic.

## Automated CI gates

The V15 workflow must pass all of the following before an APK is accepted:

- Offline web assets are prepared successfully.
- Mobile JavaScript passes `node --check`.
- V15 regression smoke passes.
- No runtime Chart.js / SheetJS CDN dependencies remain.
- Archive search markers are present.
- Accessibility markers are present.
- V14 Cardio-profile and Personal-range fixes are still present.
- Android native Back hook is present.
- Native PDF share bridge is present.
- Automatic backup native methods are present.
- Stable signing certificate is verified against the final APK.
- Android Gradle build completes successfully.

## Device regression matrix

### Upgrade/data
- [ ] Install V15 over V14 without uninstalling.
- [ ] Existing readings remain present.
- [ ] Existing patient/settings data remain present.
- [ ] Existing automatic backups remain available.

### Measure
- [ ] Cardio-profile has correct spacing.
- [ ] SCORE2 card is aligned.
- [ ] Personal range & goals has the expected outer frame.
- [ ] Save, edit and delete a reading.
- [ ] Voice input works.
- [ ] TTS works.

### Archive
- [ ] Search finds matching readings.
- [ ] Clearing search restores all matching period results.
- [ ] 7 / 30 / 90 / All filters work.
- [ ] Newest/oldest sort works.
- [ ] Edit opens the reading in Measure.
- [ ] Delete requires confirmation.
- [ ] Data & actions buttons share one blue style except Delete all.

### Reports/export
- [ ] Doctor report opens.
- [ ] 7 / 14 / 30 / All / custom period works.
- [ ] Print opens Android print UI.
- [ ] Save PDF produces a non-empty PDF.
- [ ] Share produces a non-empty PDF and opens Android Share UI.

### Backup/restore
- [ ] Manual Full Backup saves JSON.
- [ ] Manual restore requires confirmation and restores data.
- [ ] Automatic backup can be created and restored.
- [ ] Delete all creates a safety backup before confirmation.

### Navigation/accessibility
- [ ] Android Back closes open sheets/report before leaving the app.
- [ ] Double Back at root exits.
- [ ] Reminder button in the top bar works.
- [ ] RU and EN work.
- [ ] Light and dark themes work.
- [ ] System larger text remains usable.
- [ ] TalkBack announces top controls, bottom navigation, dialogs, archive search and record actions meaningfully.
- [ ] Reduced-motion setting does not rely on animations.

## Release acceptance

A V15 direct-distribution release is accepted when CI is green, signature verification passes, the APK installs over V14, and the device checks above show no blocker.
