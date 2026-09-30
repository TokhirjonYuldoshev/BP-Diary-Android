# V17 Privacy & Resilience — Candidate QA

Status: **CANDIDATE — AUTOMATED QA PASSED / REAL-DEVICE ACCEPTANCE PENDING**

- Release: `V17`
- Version: `5.7.0`
- versionCode: `170`
- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Release gate: `publish=false`

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

### Upgrade
- [ ] Install V17 over official V16 without uninstalling.
- [ ] Existing measurements, patients, settings and auto-backups remain.
- [ ] Existing V16 reminder migrates/continues without duplicate notifications.

### Measurement input guardrails
- [ ] New/edit measurement: clearly invalid input is blocked before persistence.
- [ ] SYS entry range is enforced as 60–260 mmHg.
- [ ] DIA entry range is enforced as 40–160 mmHg.
- [ ] Pulse entry range is enforced as 30–220 bpm when pulse is entered.
- [ ] SYS must be greater than DIA.
- [ ] Exact invalid field is highlighted and receives focus.
- [ ] Existing historical records are not deleted or rewritten by the new entry guardrails.
- [ ] A very high but accepted reading still follows the existing pre-save safety-warning flow.

### Uzbek localization
- [ ] Archive shows `Barchasi / 7 kun / 30 kun / 90 kun`.
- [ ] Measure screen has no unintended RU/EN leftovers.
- [ ] Analytics Overview/Charts has no unintended RU/EN leftovers.
- [ ] Archive/cards/actions have no unintended RU/EN leftovers.
- [ ] Settings/About/Guide have no unintended RU/EN leftovers.
- [ ] Doctor report and Protected Backup flows have no unintended RU/EN leftovers.

### Measurement reminders
- [ ] Settings exposes Reminders prominently above advanced privacy controls.
- [ ] One, two and three daily times can be saved.
- [ ] One alert means one signal total.
- [ ] Two alerts means initial signal + one repeat.
- [ ] Three alerts means initial signal + two repeats.
- [ ] Repeat interval 5 / 10 / 15 / 30 minutes works.
- [ ] Sound 1 / 2 / 3 can be selected and distinguished on the device.
- [ ] Test sound button produces a notification sound when Android permission/channel settings allow it.
- [ ] Vibration on/off behaves as selected.
- [ ] Notification action “Done / Измерено / O‘lchandi” cancels pending repeats for that reminder.
- [ ] “Remind later / Напомнить позже / Keyinroq eslatish” schedules the next signal after the configured interval.
- [ ] Schedule continues after app close.
- [ ] Schedule is restored after reboot and time/timezone change.
- [ ] Android notification settings can still override channel sound/vibration; the UI does not claim otherwise.

### User guide
- [ ] Settings → Guide opens the full RU / EN / UZ guide.
- [ ] Guide explains SYS/SAD, DIA/DAD and pulse.
- [ ] Guide explains readings 1–3, Archive/Analytics, doctor report, reminders and backups.
- [ ] Guide contains a clear non-diagnostic disclaimer.
- [ ] About → Guide opens the same full guide.
- [ ] “Show introduction tour” still opens onboarding.

### App Lock
- [ ] Enabling App Lock requires successful system authentication.
- [ ] Cold launch protects diary content before it becomes usable.
- [ ] Android biometric or device credential/PIN can unlock when supported by the device.
- [ ] Cancelling authentication does not expose diary content.
- [ ] After 10+ seconds in background, returning to BP Diary requires authentication.
- [ ] Locking the physical screen requires authentication immediately after return.
- [ ] Time spent inside the Android authentication prompt does not incorrectly count as background timeout.
- [ ] Disabling App Lock requires successful authentication.
- [ ] If authentication is unavailable, the app does not permanently lock the user out.

### Screen privacy
- [ ] Enabling Screen privacy prevents normal screenshots.
- [ ] Recent Apps preview does not expose diary content.
- [ ] Disabling Screen privacy restores normal screenshots.
- [ ] Setting persists across restart.

### Protected backup
- [ ] Protected backup requires a password of at least 8 characters.
- [ ] Password confirmation must match.
- [ ] Saved file uses `.bpbackup.json`.
- [ ] Opening the file as text does not expose patient/readings JSON.
- [ ] Correct password restores the backup.
- [ ] Wrong password/corruption is rejected before current data changes.
- [ ] Restore creates a safety auto-backup before replacing data.
- [ ] Forgotten password cannot be bypassed by the app.
- [ ] Protected Backup modal closes correctly with ×, Cancel and Android Back.

### Doctor report / PDF
- [ ] Mobile report preview shows the same information blocks as the desktop report.
- [ ] Save PDF uses A4 landscape.
- [ ] Print uses A4 landscape.
- [ ] Share generates an A4 landscape PDF.
- [ ] Summary cards, patient/context block and measurement table fit/read correctly.
- [ ] Long reports repeat the table header and paginate without clipping rows.
- [ ] RU / EN / UZ report labels are correct.
- [ ] Report calculations and source data remain unchanged.

### V16 regression
- [ ] Update checker works.
- [ ] Archive search/filter/sort works.
- [ ] Manual plain JSON backup/restore still works.
- [ ] Auto-backups still work.
- [ ] Voice/TTS work.
- [ ] Android Back works.
- [ ] RU/EN and light/dark work.
- [ ] Accessibility remains usable.

## Release gate

Keep `release-request.json` at `publish=false`.

Do **not** merge V17 into `main`, do **not** create GitHub Release `v5.7.0`, and do **not** mark V17 stable until all blocking real-device checks pass and the user explicitly confirms: **“всё работает”**.
