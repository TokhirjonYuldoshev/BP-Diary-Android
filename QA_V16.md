# V16 Candidate Regression QA

Status: **CANDIDATE — CI + UI automation required, device acceptance pending**

Version: `5.6.0`  
Version code: `160`  
Release label: `V16`  
Package ID: `com.tokhirjonyuldoshev.bpdiary`

## Automated acceptance gates

- [x] Single-source release metadata from `version.json`.
- [x] Readable `source/index.html` pipeline.
- [x] Regression smoke includes V16 settings/reminder/update integration.
- [x] Playwright mobile UI regression workflow exists.
- [x] Light-theme profile-card geometry checks.
- [x] Archive search/sort presence checks.
- [x] Settings screen snapshot.
- [x] Dark-theme snapshot.
- [x] Existing V15 PDF/backup/accessibility/Android Back checks remain.
- [ ] Android debug + release build is green for the final candidate SHA.
- [ ] Both APK variants verify against the stable update signer.

## Device acceptance matrix

### Upgrade and data
- [ ] Install V16 directly over V15 without uninstalling.
- [ ] Existing measurements remain present.
- [ ] Patient/settings data remain present.
- [ ] Existing V15 auto-backups remain available.
- [ ] Manual Full Backup from V15 can still be restored.

### Native Android reminder
- [ ] Open the bell or Settings → Reminder.
- [ ] Android notification permission can be granted.
- [ ] Set a reminder a few minutes in the future.
- [ ] Notification appears after BP Diary is closed.
- [ ] Tapping notification opens BP Diary.
- [ ] Reminder remains configured after reopening the app.
- [ ] Reminder is restored after device reboot.
- [ ] Reminder is restored after installing a newer APK over the app.
- [ ] Device time/timezone change reschedules the reminder.
- [ ] Turning reminder off cancels future notifications.
- [ ] A legacy V15 JavaScript reminder is migrated once without duplicate reminders.

### Settings
- [ ] Settings opens from the top bar.
- [ ] Language switch works and Settings reopens in the selected language.
- [ ] Light/dark switch works.
- [ ] Reminder settings work.
- [ ] Auto-backups open.
- [ ] Full Backup opens.
- [ ] About opens.
- [ ] Android Back closes Settings/sheets before leaving the app.

### Update checker
- [ ] Settings → Check for updates works with internet access.
- [ ] With V15 currently latest on GitHub, V16 candidate does not incorrectly claim V15 is newer.
- [ ] When a truly newer release exists, the screen shows its version.
- [ ] Open official release opens the GitHub Release in the browser.
- [ ] No APK is silently installed.

### V15 regression
- [ ] Cardio-profile spacing remains correct.
- [ ] SCORE2 remains aligned.
- [ ] Personal range outer frame remains correct.
- [ ] Save/edit/delete measurement works.
- [ ] Archive search/filter/sort works.
- [ ] Doctor report 7/14/30/all/custom works.
- [ ] Save PDF works.
- [ ] Share PDF works.
- [ ] Manual and automatic backup/restore work.
- [ ] Voice input and TTS work.
- [ ] RU/EN work.
- [ ] Light/dark work.
- [ ] Larger text remains usable.
- [ ] TalkBack labels remain meaningful.

## Release gate

Do **not** publish V16 while `release-request.json` has:

```json
{"publish": false}
```

After the final candidate passes device regression, set `publish` to `true` in a dedicated release commit on `main`. The generic release workflow then builds, verifies and publishes the signed release APK using `version.json`.
