# Changelog

## V17 — Reminders, Reports, Privacy & Localization — 5.7.0 release candidate

### Added and improved
- System Android App Lock using biometric authentication and/or device credential/PIN.
- Automatic App Lock after **10 seconds** in the background and immediate re-authentication after physical screen lock.
- Optional Android `FLAG_SECURE` screen privacy for screenshots and Recent Apps previews.
- Password-protected Full Backup using PBKDF2-SHA-256 (310,000 iterations) and AES-GCM-256.
- Protected-backup restore with wrong-password/corruption rejection before application data are modified.
- Pre-paint privacy guard so protected diary content is hidden before system authentication completes.
- **Uzbek (Latin) UI localization** alongside Russian and English, including Archive period labels such as `7 kun / 30 kun / 90 kun`.
- Input guardrails for newly entered/edited measurements: SYS 60–260 mmHg, DIA 40–160 mmHg, optional pulse 30–220 bpm, and SYS > DIA.
- Existing historical records are not rewritten by the new entry guardrails.
- Configurable native measurement reminders with up to **three daily times**.
- Reminder repeat count **1–3**, repeat interval **5 / 10 / 15 / 30 minutes**, three Android system sound choices and optional vibration.
- Reminder notification actions for **Done / Измерено / O‘lchandi** and **Remind later / Напомнить позже / Keyinroq eslatish**.
- Reminder test-sound control and restoration after reboot, time/timezone changes and application updates.
- Full in-app **RU / EN / UZ user guide** explaining readings, SYS/DIA/pulse, Archive/Analytics, reports, reminders and backups.
- Mobile doctor report export aligned with the desktop report: **A4 landscape** for Save PDF, Print and Share.
- Pre-save safety warning remains in place for accepted extreme readings.
- Expanded static and Playwright regression coverage for V17.

### Preserved
- Blood-pressure calculations, session-average formulas, SCORE2 logic, target-range calculations, report formulas and existing patient/data schema remain unchanged.
- Plain JSON Full Backup and automatic local backups remain available.
- Update checker, Archive, Voice/TTS, Android Back, light/dark and existing V16 flows remain available.
- Package ID remains `com.tokhirjonyuldoshev.bpdiary`.
- Direct-distribution signing lineage is unchanged.

### Candidate verification
- Android Build #142: **SUCCESS**.
- UI Regression #37: **SUCCESS**.
- Candidate APK SHA-256: `0c1b90083461b5adcb917e3a83ca62039b767e25c9ed75f164044afe23a3b18b`.
- Signing certificate SHA-256: `63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102`.
- Real-device acceptance: **PASSED — “всё работает” confirmed on 2026-09-30**.
- Publication gate remains `publish=false` until final integration into `main`.

### Security note
BP Diary does not store the protected-backup password. Losing the password means the encrypted file cannot be recovered by the application.

## V16 — Reliability & Android Integration — 5.6.0

### Added
- Native Android daily reminders using AlarmManager and system notifications.
- Reminder restoration after reboot, device-time changes and timezone changes.
- Android 13+ notification permission flow and notification settings access.
- One-time migration path from the legacy JavaScript reminder.
- Dedicated mobile Settings screen.
- Manual update checker against the official GitHub Releases API.
- Single-source release metadata in `version.json`.
- Generic release workflow gated by `release-request.json`.
- Playwright mobile UI regression with light/dark screenshots.
- V16-specific static regression coverage.

### Preserved
- V15 archive search/filter/sort.
- Doctor PDF preview/save/print/share.
- Manual and automatic backup/restore.
- Android Back integration.
- Voice/TTS.
- RU/EN and light/dark themes.
- Cardio-profile/SCORE2/Personal-range layout fixes.
- Package ID and existing data/signing lineage.

### Release status
**FINAL / STABLE / RELEASED**

- GitHub Release: `v5.6.0`
- Release APK: `BP-Diary-5.6-V16.apk`
- APK SHA-256: `74cd50bf017c6d02936adc6da947eadb7908e99931559e7b527755df1ad7c6dc`
- Signing certificate SHA-256: `63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102`
- Android Build #115: **SUCCESS**
- UI Regression #13: **SUCCESS**
- Release workflow #2: **SUCCESS**
- Publication gate reset to `publish=false` after release.


All notable Android wrapper and repository changes are tracked here. Medical/core calculations are intentionally kept outside mobile presentation and repository-maintenance changes.

## Repository finalization — post V15

- Restored the primary application source as human-readable `source/index.html`.
- Removed legacy gzip+Base64 source chunks after byte-exact reconstruction and build verification.
- Updated the web build pipeline to read `source/index.html` directly.
- Added deterministic npm lockfile generation for reproducible dependency installation.
- Added `npm run qa` as the canonical regression command.
- Rebuilt README in Russian and English.
- Added architecture, contribution and security documentation.
- Marked the complete V15 Android device regression matrix as passed.
- Preserved V15 application behavior, package ID, data format and signing lineage.

All notable Android wrapper changes are tracked here. Medical/core calculations are intentionally kept outside these mobile UI/release changes.

## V15 — Finalization

### Added
- Fast Archive search across rendered reading cards.
- Search state persistence across refreshes.
- Expanded accessibility semantics for screens, dialogs, form controls, archive records, charts and report viewer.
- Stronger visible keyboard/focus indicators.
- Static V15 regression smoke suite in `scripts/regression-v15.mjs`.
- Signed Android release build path for direct-distribution APKs.
- Final QA checklist and release documentation.

### Preserved
- V14 Cardio-profile spacing and Personal-range outer frame fixes.
- V13 unified Archive action colors, header Reminder button and repaired Share flow.
- V12 automatic backups, report periods, Archive quick filters/sort and onboarding.
- V11 premium mobile redesign, About screen, report viewer, toasts and destructive confirmations.
- Android Back behavior, Voice/TTS, manual backup/restore, PDF Save/Print/Share, RU/EN and light/dark themes.

### Release safety
- Package ID remains `com.tokhirjonyuldoshev.bpdiary`.
- The stable update signer is unchanged, so V15 can be installed over the current V14 test build without uninstalling.
- The direct-distribution release APK uses the same stable update key as prior test builds. It is not a Play Store production key.

## V14
- Corrected the real outer DOM wrappers for Cardio-profile spacing and Personal-range framing.

## V13
- Unified Archive action button colors except destructive Delete all.
- Moved Reminder to the top application bar.
- Hardened doctor-report Share flow.

## V12
- Added up to five automatic local backups.
- Added 7/14/30/all/custom doctor-report periods.
- Added Archive quick periods and newest/oldest sorting.
- Added first-run onboarding and accessibility foundations.

## V11
- Introduced the premium mobile UI, About screen, redesigned Archive/report viewer, toast notifications and destructive-action confirmations.
