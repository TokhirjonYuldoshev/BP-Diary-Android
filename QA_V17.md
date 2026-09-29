# V17 Privacy & Resilience — Candidate QA

Status: **CANDIDATE — automated acceptance in progress, real-device privacy tests required**

- Release: `V17`
- Version: `5.7.0`
- versionCode: `170`
- Package ID: `com.tokhirjonyuldoshev.bpdiary`

## Scope

V17 intentionally does **not** change blood-pressure calculations, SCORE2 logic, patient data schema or report formulas.

It adds:

- optional biometric app lock;
- optional Android `FLAG_SECURE` privacy shield for screenshots and Recent Apps previews;
- password-protected Full Backup using PBKDF2-SHA-256 + AES-GCM-256;
- protected-backup restore;
- regression coverage for the new privacy layer.

## Automated gates

- [x] Single-source version metadata resolves to V17 / 5.7.0 / 170.
- [x] Protected backup implementation uses AES-GCM-256.
- [x] Password-derived key uses PBKDF2-SHA-256.
- [x] Password is not persisted by BP Diary.
- [x] Protected backup envelope contains ciphertext instead of plain backup payload.
- [x] Native biometric bridge exists.
- [x] Native screenshot/Recent Apps privacy shield exists.
- [x] Pre-paint biometric lock guard exists.
- [ ] Final Android debug + release build succeeds on the candidate SHA.
- [ ] Debug and release APK signer matches the stable update signer.
- [ ] V17 Playwright UI regression succeeds.

## Device acceptance

### Upgrade
- [ ] Install V17 over official V16 without uninstalling.
- [ ] Existing measurements, patients, settings and auto-backups remain.
- [ ] V16 reminder remains configured.

### Biometric lock
- [ ] Settings → Privacy → Biometric lock detects enrolled biometrics.
- [ ] Enabling requires successful biometric authentication.
- [ ] Cold launch asks for biometric authentication before diary content is usable.
- [ ] Cancelling authentication keeps the privacy lock screen visible.
- [ ] Unlock button allows another attempt.
- [ ] After 15+ seconds in background, returning to BP Diary requires authentication.
- [ ] Disabling biometric lock requires successful authentication.
- [ ] If biometrics are unavailable, the app does not permanently lock the user out.

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
- [ ] Wrong password is rejected without modifying current data.
- [ ] Restore still creates a safety auto-backup before replacing data.
- [ ] Forgotten password cannot be bypassed by the app.

### V16 regression
- [ ] Native reminder works after app close/reboot.
- [ ] Update checker works.
- [ ] Archive search/filter/sort works.
- [ ] Doctor report and PDF Save/Share work.
- [ ] Manual plain JSON backup/restore still works.
- [ ] Voice/TTS work.
- [ ] Android Back works.
- [ ] RU/EN and light/dark work.
- [ ] Accessibility remains usable.

## Release gate

Keep `release-request.json` at `publish=false` until all blocking device checks above pass.
