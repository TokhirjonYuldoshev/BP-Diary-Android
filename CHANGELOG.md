# Changelog

## V18 — Maintenance Release — 5.8.1

- Publication authorized by the owner on 2026-10-02 after successful candidate acceptance.
- Version metadata prepared as V18 / 5.8.1 / versionCode 182 / tag `v5.8.1`.
- Chart.js updated to 4.5.1 after automated CI and owner real-device chart regression.
- Font Awesome Free updated to 7.3.1 after automated CI and owner real-device visual regression.
- GitHub Actions upgraded and pinned to immutable full commit SHAs.
- Added `THIRD_PARTY_NOTICES.md`.
- Runtime high/critical dependency audit remains clean; known `@capacitor/assets 3.0.5` build-time findings remain documented.
- Medical/core logic, SCORE2, report formulas, data schema, native implementation and package ID remain unchanged from the accepted V18 code.
- Publication gate was opened only for the authorized release transaction and is closed again after verification.
- Official stable release `v5.8.1` published by Publish Android Release #11 (`36994705331`).
- Release target: `44b0b80447a3e2a58c01b3199469416be65967e4`.
- Official APK: `BP-Diary-5.8.1-V18.apk` — 4,818,035 bytes.
- Official APK SHA-256: `38b1e92307df61915ff85edc8e447688f4f36010ec39c6e01178a9f5796b1301`.
- Production signer SHA-256: `a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`.
- Release workflow artifact ID: `11221212265`.
- Post-release install note: the owner reported that the official 5.8.1 APK was rejected when installed over the existing app on one real device; Issue #18 tracks diagnosis. Official 5.8.0 and 5.8.1 APKs have the same package ID and production certificate, so the affected installed package state still needs verification.
- Until Issue #18 is resolved, in-place update is not documented as guaranteed; Full Backup must be created and verified before any uninstall/reinstall path.

## V18 — Secure Signing & Supply Chain — 5.8.0

- New private RSA-4096 production signer replaces the exposed legacy signing identity.
- Production signing isolated in GitHub Environment; ordinary CI uses debug signing and compiles unsigned release APKs.
- Pinned certificate verification, immutable release checks and tracked-private-key guards.
- Dependency audit, CodeQL, Dependabot and SheetJS SHA-256 verification.
- jsPDF upgraded to 4.2.1.
- Protected backup/restore password modal isolated from WebView history and tab refresh.
- VersionCode 181 signed candidate accepted on a real Android device; owner authorized publication on 2026-10-01.
- V17 migration requires backup, uninstall, new-signer V18 installation and restore; existing new-signer V18 can update in place.
- Medical/core logic, report formulas, data schema and package ID preserved.
- Upstream @capacitor/assets build-toolchain findings remain documented; runtime high/critical audit remains blocking.
- Official stable release `v5.8.0` published by successful workflow `36855648198`.
- Official APK SHA-256: `802b608d2828c4513be644cdbb4287bf922dadec4fe3a6469378ee5c50c3d15c`.
- production-signing restricted to main; publication gate returned to false.

## V17 — Reminders, Reports, Privacy & Localization — 5.7.0

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

### Release verification
- Android Build #142: **SUCCESS**.
- UI Regression #37: **SUCCESS**.
- Candidate APK SHA-256: `0c1b90083461b5adcb917e3a83ca62039b767e25c9ed75f164044afe23a3b18b`.
- Signing certificate SHA-256: `63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102`.
- Real-device acceptance: **PASSED — “всё работает” confirmed on 2026-09-30**.
- Main Android Build #144: **SUCCESS**.
- Main UI Regression #39: **SUCCESS**.
- Publish Android Release workflow #5 (`36689632656`): **SUCCESS**.
- Official GitHub Release: `v5.7.0` — **FINAL / STABLE / RELEASED**.
- Official APK: `BP-Diary-5.7-V17.apk`.
- Official APK SHA-256: `5c328d79badfcb84f3160089aaa2dc7d2dd48f3a5aa2d91e5bdd0cec7d3c31f9`.
- Release workflow artifact ID: `11085710121`.
- Publication gate reset to `publish=false` immediately after release verification.
- Post-release Android Build #146 (`36689981393`): **SUCCESS** on gate-close commit `f6d640cafa860615bc02cc07ca15e7dae9bb71e3`.
- Build #146 signer verification: `63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102`.

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
