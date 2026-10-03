# V18 — Secure Signing & Supply-Chain QA

Status: **FINAL / STABLE / RELEASED**

## Version

- Release: `V18`
- Version: `5.8.1`
- versionCode: `182`
- Official tag: `v5.8.1`
- Branch: `main`
- Publication gate: `publish=false`

## Device retest marker

- Current stable maintenance release uses `versionCode 182`; the original V18 / 5.8.0 release used `versionCode 181`.

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


## V18 maintenance candidate 5.8.1 / versionCode 182 — 2026-10-02

This candidate exists to version the already reviewed post-release dependency and supply-chain maintenance separately from the immutable official V18 / 5.8.0 release.

Accepted maintenance changes:

- [x] Chart.js 4.5.1 automated CI: PASSED
- [x] Chart.js 4.5.1 owner real-device analytics / rotation / RU-EN-UZ check: PASSED
- [x] Font Awesome Free 7.3.1 automated CI: PASSED
- [x] Font Awesome Free 7.3.1 owner real-device icon / light-dark / RU-EN-UZ check: PASSED
- [x] GitHub Actions upgraded and pinned to immutable full commit SHAs
- [x] `THIRD_PARTY_NOTICES.md` added and aligned with direct dependency versions
- [x] Medical/core source remains unchanged from the accepted V18 release target
- [x] Package ID remains `com.tokhirjonyuldoshev.bpdiary`
- [x] Publication gate remains `false`

Candidate metadata:

- Release line: `V18`
- Version name: `5.8.1`
- Version code: `182`
- Proposed tag: `v5.8.1`
- Proposed artifact: `BP-Diary-5.8.1-V18.apk`

Still required before publication:

- [x] Final candidate CI on exact candidate SHA `132783b16cc0e323a806225709673ecb3bdb576d`: Build #304, UI Regression #197 (20/20), Dependency Security Audit #104, CodeQL #71 — SUCCESS
- [x] Owner verified V18 / 5.8.1 / versionCode 182 and reported the candidate working on 2026-10-02
- [x] Owner explicitly authorized publication of 5.8.1 on 2026-10-02
- [x] Signed release created from protected `main` by Publish Android Release #11 (`36994705331`)
- [x] Official APK hash and production signer verified
- [x] Owner attempted official 5.8.1 post-release update on 2026-10-02
- [x] In-place install over the existing device installation FAILED; Issue #18 opened
- [ ] Exact installed APK signer/version state on the affected device is identified
- [ ] Official 5.8.1 post-release install path is resolved and re-verified


## Official V18 5.8.1 release verification — 2026-10-02

- [x] Owner explicitly authorized publication on 2026-10-02
- [x] Publish Android Release #11 (`36994705331`): SUCCESS
- [x] Official tag: `v5.8.1`
- [x] Release target: `44b0b80447a3e2a58c01b3199469416be65967e4`
- [x] Official APK: `BP-Diary-5.8.1-V18.apk`
- [x] Official APK size: `4,818,035` bytes
- [x] Official APK SHA-256: `38b1e92307df61915ff85edc8e447688f4f36010ec39c6e01178a9f5796b1301`
- [x] Production signer SHA-256: `a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`
- [x] Release workflow artifact ID: `11221212265`
- [x] Release asset ID: `605346382`
- [x] Publication gate set back to `false` in the post-release commit
- [x] Owner attempted official 5.8.1 install/update sanity; in-place update failed on the affected device
- [ ] Root cause from installed package/signing state is confirmed
- [ ] Resolved install/update path is re-tested on the device

The original `v5.8.0` release remains preserved as immutable release history.


### 5.8.1 post-release install failure evidence

- Issue: [#18 — Investigate failed in-place update from official V18 5.8.0 to 5.8.1](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues/18)
- Official 5.8.0 package ID: `com.tokhirjonyuldoshev.bpdiary`
- Official 5.8.1 package ID: `com.tokhirjonyuldoshev.bpdiary`
- Official 5.8.0 versionCode: `181`
- Official 5.8.1 versionCode: `182`
- Both official APKs independently verified with APK Signature Scheme v2 signer SHA-256:
  `a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`
- Therefore the release APK pair does not currently show a package/signing mismatch; the exact installed package on the affected device must be captured before assigning root cause.
- Until Issue #18 is resolved, documentation does not guarantee in-place update for every existing V18 installation.


## V18 bugfix candidate 5.8.2 / versionCode 183

Purpose: fix reminder/sheet stability bugs reported from real-device screenshots without changing medical/core calculations, SCORE2, report formulas, data schema, or package ID.

Candidate fixes:

- [x] Repeated identical in-app toast feedback is deduplicated instead of stacking indefinitely
- [x] Toast host is capped so rapid repeated actions cannot cover the whole sheet
- [x] Reminder “Test sound” action is single-flight while the native call is pending
- [x] Native reminder sound test cancels the previous test notification before publishing the next one
- [x] Native sound test does not broadcast a notification when Android notification permission is denied
- [x] Auto-backup sheet has an explicit visible close button
- [x] Automated UI tests added for repeated reminder-test taps and auto-backup close behavior
- [x] Static regression invariants added for the new behavior

Still required:

- [x] Exact-head candidate CI on `4b6836e54e51d66e8fdf001ad2a7a3f613b65a92`: Build #387, UI Regression #280 (22/22), Dependency Security Audit #187, CodeQL #90 — SUCCESS
- [x] Owner tested reminder sound repeatedly on a real Android device on 2026-10-03 — PASSED
- [x] Owner verified repeated taps no longer stack many toasts or dismiss the page unexpectedly — PASSED
- [x] Owner verified the Auto-backup sheet closes from the × button — PASSED
- [x] Owner authorized merging the accepted 5.8.2 bugfix candidate into `main`
- [x] Owner explicitly authorized publication of V18 / 5.8.2 on 2026-10-03
