# V16 Candidate Regression QA

Status: **PASSED / ACCEPTED FOR RELEASE**

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
- [x] Android debug + release build is green on `main` (Run #115).
- [x] Both APK variants verify against the stable update signer.

## Device acceptance matrix

### Upgrade and data
- [x] Install V16 directly over V15 without uninstalling.
- [x] Existing measurements remain present.
- [x] Patient/settings data remain present.
- [x] Existing V15 auto-backups remain available.
- [x] Manual Full Backup from V15 can still be restored.

### Native Android reminder
- [x] Open the bell or Settings → Reminder.
- [x] Android notification permission can be granted.
- [x] Set a reminder a few minutes in the future.
- [x] Notification appears after BP Diary is closed.
- [x] Tapping notification opens BP Diary.
- [x] Reminder remains configured after reopening the app.
- [x] Reminder is restored after device reboot.
- [x] Reminder is restored after installing a newer APK over the app.
- [x] Device time/timezone change reschedules the reminder.
- [x] Turning reminder off cancels future notifications.
- [x] A legacy V15 JavaScript reminder is migrated once without duplicate reminders.

### Settings
- [x] Settings opens from the top bar.
- [x] Language switch works and Settings reopens in the selected language.
- [x] Light/dark switch works.
- [x] Reminder settings work.
- [x] Auto-backups open.
- [x] Full Backup opens.
- [x] About opens.
- [x] Android Back closes Settings/sheets before leaving the app.

### Update checker
- [x] Settings → Check for updates works with internet access.
- [x] With V15 currently latest on GitHub, V16 candidate does not incorrectly claim V15 is newer.
- [x] When a truly newer release exists, the screen shows its version.
- [x] Open official release opens the GitHub Release in the browser.
- [x] No APK is silently installed.

### V15 regression
- [x] Cardio-profile spacing remains correct.
- [x] SCORE2 remains aligned.
- [x] Personal range outer frame remains correct.
- [x] Save/edit/delete measurement works.
- [x] Archive search/filter/sort works.
- [x] Doctor report 7/14/30/all/custom works.
- [x] Save PDF works.
- [x] Share PDF works.
- [x] Manual and automatic backup/restore work.
- [x] Voice input and TTS work.
- [x] RU/EN work.
- [x] Light/dark work.
- [x] Larger text remains usable.
- [x] TalkBack labels remain meaningful.

## Release acceptance

V16 was approved for promotion after the candidate/device acceptance step and final `main` CI/UI regression passed.

Publication remains mechanically gated until `release-request.json` is intentionally switched from:

```json
{"publish": false}
```

The final release commit sets `publish` to `true`. The generic release workflow then performs a fresh signed release build, signer verification, checksum generation and GitHub Release publication from `version.json`.
