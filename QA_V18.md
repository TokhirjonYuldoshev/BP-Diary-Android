# V18 — Secure Signing & Supply-Chain QA

Status: **FINAL / STABLE / RELEASED**

## Version

- Release: `V18`
- Version: `5.8.0`
- versionCode: `181`
- Official tag: `v5.8.0`
- Branch: `v18-secure-signing-migration`
- Publication gate: `publish=false`

## Device retest marker

- Candidate after protected-backup lifecycle fixes uses `versionCode 181` so Android must install the new APK over the earlier V18 candidate.

## Scope

V18 starts with security and release-engineering hardening. Medical/core calculations, SCORE2, report formulas, existing data schema, package ID and user data compatibility are intentionally out of scope unless separately reviewed.

## Completed foundation

- [x] V18 metadata initialized
- [x] Release publication gate closed
- [x] Legacy tracked signing material removed from V18 tree
- [x] Ordinary branch CI separated from production signing
- [x] Production signing isolated to protected release workflow
- [x] Existing tag/release overwrite blocked
- [x] Private-key file patterns blocked by `.gitignore`
- [x] Tracked private-key/PEM guard added
- [x] Separate V18 Playwright suite added
- [x] In-app About shows Apache License 2.0
- [x] V18 onboarding version/security text updated
- [x] Dependabot configuration added
- [x] Dependency vulnerability workflow added
- [x] CodeQL workflow added
- [x] SheetJS CDN SHA-256 pinned and enforced
- [x] jsPDF upgraded from 2.5.1 to 4.2.1
- [x] jsPDF 4.2.1 real-device PDF Save / Print / Share regression completed
- [ ] Build-tooling vulnerabilities from @capacitor/assets reviewed/replaced when an upstream-safe path is available
- [x] New private V18 production signing key created outside Git
- [x] GitHub `production-signing` environment configured
- [x] Production signing secrets configured
- [x] New certificate SHA-256 recorded: `a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`
- [x] V17 backup → clean V18 install → restore migration tested
- [x] Full real-device acceptance completed

## Production signing verification

- [x] Production signing smoke test passed
- [x] Signed V18 candidate certificate matched pinned SHA-256
- [x] Signed candidate artifact created: `BP-Diary-5.8-V18-Signed-Candidate`
- [x] Signing smoke artifact SHA-256: `070f5e5e2c0d35db34406a21d2658624a0bd09808e044202357542f1d26aa839`
- [x] No GitHub Release was published during smoke testing

## Automated checks

Required on the exact V18 candidate commit:

- `build-apk`
- `mobile-ui`

Additional V18 security checks:

- `dependency-audit`
- `codeql-javascript`

## Release rule

V18 must not be published until:

1. production signer is private and verified;
2. dependency/supply-chain findings are resolved or explicitly documented;
3. automated checks pass;
4. real-device migration and functional acceptance pass;
5. the owner explicitly approves publication.

## Signing boundary

The V17 direct-distribution signer was exposed in public project history and is treated as compromised. It must not be reused as the V18 trusted production signing identity.

The V18 production keystore must never be committed to Git or sent through public project files.

## Owner acceptance — 2026-10-01

The owner confirmed all real-device checks passed on signed V18 / 5.8.0 / versionCode 181 and explicitly authorized integration into main and publication.

- Signing Smoke #4: run `36847051484`, artifact `11154510310`.
- Tested APK SHA-256: `d009ceb6fd9a39e6b74eb47a1d09a06faae8a687623377a258203cded54ed0f1`.
- [x] In-place update over the existing new-signer V18 and version marker verified
- [x] Protected backup saves; password dialog remains open
- [x] Protected restore succeeds
- [x] Wrong password rejected without modifying current data
- [x] PDF Save / Print / Share
- [x] App Lock, screen-off and background re-lock; screen privacy
- [x] Reminders and restoration after reboot/time/timezone changes
- [x] Plain backup/restore, Analytics, Archive, RU / EN / UZ
- [x] Input validation, restart and data preservation

Build-time findings through @capacitor/assets remain documented and visible in the non-blocking full audit. Runtime high/critical findings remain blocking.

## Official release verification

- Official tag: `v5.8.0`, target `521f613d72401912f26b96843197f0327d26a6a2`.
- Publish workflow `36855648198`: SUCCESS.
- APK: `BP-Diary-5.8-V18.apk`.
- Official APK SHA-256: `802b608d2828c4513be644cdbb4287bf922dadec4fe3a6469378ee5c50c3d15c`.
- Production signer verified by release workflow: `a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`.
- production-signing restricted to main, verified from owner screenshot on 2026-10-01.
- Publication gate returned to false.

## Official APK post-release device sanity — 2026-10-02

The owner installed the official GitHub Release APK in place over the accepted V18 installation and confirmed the final post-release sanity checks passed.

- [x] Official `BP-Diary-5.8-V18.apk` installs/updates successfully without uninstalling the app
- [x] Application starts normally after the in-place update
- [x] Existing user data remains intact
- [x] About/version marker confirmed as V18 / 5.8.0 / versionCode 181
- [x] Official release APK post-release device sanity: PASSED
