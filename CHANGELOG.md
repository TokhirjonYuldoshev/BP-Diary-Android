# Changelog

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
Accepted for stable publication after final Android Build #115, UI Regression #13, signer verification and the device-acceptance step.


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
