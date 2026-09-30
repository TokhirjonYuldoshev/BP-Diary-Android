# V17 — Final Release QA

Status: **FINAL / STABLE / RELEASED — AUTOMATED QA PASSED / REAL-DEVICE ACCEPTANCE PASSED**

- Release: `V17`
- Version: `5.7.0`
- versionCode: `170`
- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Release gate: `publish=false` (closed after successful publication)

## Scope and non-regression boundary

V17 intentionally does **not** change blood-pressure calculations, session-average formulas, SCORE2 logic, report formulas, patient data schema, package ID or the permanent direct-distribution signing lineage.

V17 adds or hardens:

- system Android authentication for App Lock (biometric and/or device credential/PIN);
- optional Android `FLAG_SECURE` screen privacy;
- password-protected Full Backup using PBKDF2-SHA-256 + AES-GCM-256;
- protected-backup restore;
- RU / EN / UZ mobile localization;
- input guardrails for newly entered/edited measurements without rewriting old stored data;
- configurable native Android measurement reminders;
- an in-app RU / EN / UZ user guide;
- desktop-style A4 landscape doctor-report export on mobile.

## Automated gates

- [x] Single-source version metadata resolves to V17 / 5.7.0 / 170.
- [x] `release-request.json` remains `publish=false`.
- [x] Protected backup implementation uses AES-GCM-256.
- [x] Password-derived key uses PBKDF2-SHA-256.
- [x] Password is not persisted by BP Diary.
- [x] Protected backup envelope contains ciphertext instead of plain backup payload.
- [x] Native Android authentication bridge exists.
- [x] Native screenshot/Recent Apps privacy shield exists.
- [x] Pre-paint App Lock privacy guard exists.
- [x] App Lock implementation uses a 10-second background threshold and system authentication; the removed custom lock overlay is not expected.
- [x] Measurement-entry guardrails have static/UI regression coverage.
- [x] Uzbek Archive periods are covered as `7 kun / 30 kun / 90 kun`.
- [x] Full RU / EN / UZ guide has regression coverage.
- [x] Mobile doctor report export is forced to A4 landscape to match the desktop report layout.
- [x] Advanced reminder UI has regression coverage.
- [x] Native reminder engine supports up to three daily times, 1–3 total alerts, configurable interval, three system sounds, optional vibration, Done and Remind later actions.
- [x] Reminder schedule restoration after reboot/time/timezone/app update remains wired.
- [x] Candidate Android Build #142 (`36683215509`) succeeded from `d2027b044755503a4a257e9985887684073e3b26`.
- [x] Build #142 verified debug and release APK signer SHA-256 `63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102`.
- [x] V17 UI Regression #37 (`36683034605`) passed on the same app/native behavior; later commits are regression/docs-only.
- [x] Build #142 artifact ID `11083090588`; candidate APK SHA-256 `0c1b90083461b5adcb917e3a83ca62039b767e25c9ed75f164044afe23a3b18b`.

## Device acceptance

Real-device acceptance was explicitly confirmed by the user on **2026-09-30** with **“всё работает”** after testing the current V17 candidate.


### Upgrade
- [x] Install V17 over official V16 without uninstalling.
- [x] Existing measurements, patients, settings and auto-backups remain.
- [x] Existing V16 reminder migrates/continues without duplicate notifications.

### Measurement input guardrails
- [x] New/edit measurement: clearly invalid input is blocked before persistence.
- [x] SYS entry range is enforced as 60–260 mmHg.
- [x] DIA entry range is enforced as 40–160 mmHg.
- [x] Pulse entry range is enforced as 30–220 bpm when pulse is entered.
- [x] SYS must be greater than DIA.
- [x] Exact invalid field is highlighted and receives focus.
- [x] Existing historical records are not deleted or rewritten by the new entry guardrails.
- [x] A very high but accepted reading still follows the existing pre-save safety-warning flow.

### Uzbek localization
- [x] Archive shows `Barchasi / 7 kun / 30 kun / 90 kun`.
- [x] Measure screen has no unintended RU/EN leftovers.
- [x] Analytics Overview/Charts has no unintended RU/EN leftovers.
- [x] Archive/cards/actions have no unintended RU/EN leftovers.
- [x] Settings/About/Guide have no unintended RU/EN leftovers.
- [x] Doctor report and Protected Backup flows have no unintended RU/EN leftovers.

### Measurement reminders
- [x] Settings exposes Reminders prominently above advanced privacy controls.
- [x] One, two and three daily times can be saved.
- [x] One alert means one signal total.
- [x] Two alerts means initial signal + one repeat.
- [x] Three alerts means initial signal + two repeats.
- [x] Repeat interval 5 / 10 / 15 / 30 minutes works.
- [x] Sound 1 / 2 / 3 can be selected and distinguished on the device.
- [x] Test sound button produces a notification sound when Android permission/channel settings allow it.
- [x] Vibration on/off behaves as selected.
- [x] Notification action “Done / Измерено / O‘lchandi” cancels pending repeats for that reminder.
- [x] “Remind later / Напомнить позже / Keyinroq eslatish” schedules the next signal after the configured interval.
- [x] Schedule continues after app close.
- [x] Schedule is restored after reboot and time/timezone change.
- [x] Android notification settings can still override channel sound/vibration; the UI does not claim otherwise.

### User guide
- [x] Settings → Guide opens the full RU / EN / UZ guide.
- [x] Guide explains SYS/SAD, DIA/DAD and pulse.
- [x] Guide explains readings 1–3, Archive/Analytics, doctor report, reminders and backups.
- [x] Guide contains a clear non-diagnostic disclaimer.
- [x] About → Guide opens the same full guide.
- [x] “Show introduction tour” still opens onboarding.

### App Lock
- [x] Enabling App Lock requires successful system authentication.
- [x] Cold launch protects diary content before it becomes usable.
- [x] Android biometric or device credential/PIN can unlock when supported by the device.
- [x] Cancelling authentication does not expose diary content.
- [x] After 10+ seconds in background, returning to BP Diary requires authentication.
- [x] Locking the physical screen requires authentication immediately after return.
- [x] Time spent inside the Android authentication prompt does not incorrectly count as background timeout.
- [x] Disabling App Lock requires successful authentication.
- [x] If authentication is unavailable, the app does not permanently lock the user out.

### Screen privacy
- [x] Enabling Screen privacy prevents normal screenshots.
- [x] Recent Apps preview does not expose diary content.
- [x] Disabling Screen privacy restores normal screenshots.
- [x] Setting persists across restart.

### Protected backup
- [x] Protected backup requires a password of at least 8 characters.
- [x] Password confirmation must match.
- [x] Saved file uses `.bpbackup.json`.
- [x] Opening the file as text does not expose patient/readings JSON.
- [x] Correct password restores the backup.
- [x] Wrong password/corruption is rejected before current data changes.
- [x] Restore creates a safety auto-backup before replacing data.
- [x] Forgotten password cannot be bypassed by the app.
- [x] Protected Backup modal closes correctly with ×, Cancel and Android Back.

### Doctor report / PDF
- [x] Mobile report preview shows the same information blocks as the desktop report.
- [x] Save PDF uses A4 landscape.
- [x] Print uses A4 landscape.
- [x] Share generates an A4 landscape PDF.
- [x] Summary cards, patient/context block and measurement table fit/read correctly.
- [x] Long reports repeat the table header and paginate without clipping rows.
- [x] RU / EN / UZ report labels are correct.
- [x] Report calculations and source data remain unchanged.

### V16 regression
- [x] Update checker works.
- [x] Archive search/filter/sort works.
- [x] Manual plain JSON backup/restore still works.
- [x] Auto-backups still work.
- [x] Voice/TTS work.
- [x] Android Back works.
- [x] RU/EN and light/dark work.
- [x] Accessibility remains usable.

## Release result

- [x] V17 was integrated into `main` by fast-forward with `publish=false`.
- [x] Main Android Build #144 passed.
- [x] Main UI Regression #39 passed.
- [x] Release gate was intentionally opened in commit `f90498a14a8febac5705543556418a36c83acd69`.
- [x] Publish Android Release workflow #5 (`36689632656`) completed successfully.
- [x] Official GitHub Release: `v5.7.0` — non-draft, non-prerelease.
- [x] Official APK: `BP-Diary-5.7-V17.apk`.
- [x] Official APK SHA-256: `5c328d79badfcb84f3160089aaa2dc7d2dd48f3a5aa2d91e5bdd0cec7d3c31f9`.
- [x] Release signer SHA-256: `63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102`.
- [x] Release workflow artifact ID: `11085710121`.
- [x] Publication gate was closed back to `publish=false` immediately after release verification.
