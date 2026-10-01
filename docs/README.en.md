# 🇬🇧 BP Diary — English documentation

[← Home](../README.md) · [Русский](README.ru.md) · [O‘zbekcha](README.uz-Latn.md)

## About

**BP Diary V18 / 5.8.0** is an Android application for blood-pressure journaling, repeated readings, trend review, reminders, backups and doctor-ready reporting.

The application is local-first: diary records and profile data stay on the device unless the user explicitly exports or shares them.

## Main features

### 🩺 Measurements

- up to 3 repeated readings in one session;
- SYS / DIA / pulse entry;
- support for left and right arm readings;
- validation of new and edited values before persistence;
- clearly invalid input is blocked;
- a separate warning flow remains for extreme but accepted values;
- existing historical records are not rewritten by the newer entry validation.

### 📊 Archive and analytics

- session archive;
- fast search;
- period filters;
- date sorting;
- edit and delete flows;
- charts and summary metrics;
- light and dark themes.

### ⏰ Reminders

You can configure:

- up to 3 measurement times per day;
- 1 / 2 / 3 alerts;
- repeat intervals of 5 / 10 / 15 / 30 minutes;
- 3 Android system sound choices;
- optional vibration;
- a test-sound action;
- **Done**;
- **Remind later**.

The schedule is restored after device reboot and after time or timezone changes.

### 📄 Doctor report

The mobile report uses **A4 landscape**, matching the desktop-style layout.

It supports:

- period selection;
- preview;
- summary metrics;
- profile and context;
- the full measurement table;
- Print;
- Save PDF;
- Share PDF.

The mobile export layer does not change the medical/core calculations used by the report.

### 🔐 Privacy

V18 includes:

- system Android App Lock;
- biometric/device credential authentication;
- automatic re-lock after 10 seconds in background;
- immediate re-authentication after physical screen lock;
- Screen Privacy through Android `FLAG_SECURE`;
- hidden Recent Apps content while privacy protection is enabled.

### 💾 Backups

Two backup modes are available.

**Plain Full Backup**
- JSON;
- intended for compatibility and ordinary export.

**Protected Full Backup**
- the password is not stored by BP Diary;
- PBKDF2-SHA-256;
- 310,000 iterations;
- random 16-byte salt;
- AES-GCM-256;
- random 12-byte IV;
- wrong password or modified ciphertext is rejected before current application data are changed.

If the protected-backup password is lost, BP Diary cannot recover it.

## 🌐 Languages

The application UI supports:

- Russian;
- English;
- Uzbek — Latin script.

Language can be changed from the application interface and Settings.

## 📦 Installation

Official stable release:

**V18 / 5.8.0**

[Open the official GitHub Release](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.0)

File:

```text
BP-Diary-5.8-V18.apk
```

SHA-256:

```text
802b608d2828c4513be644cdbb4287bf922dadec4fe3a6469378ee5c50c3d15c
```

Verification on Linux/macOS:

```bash
sha256sum BP-Diary-5.8-V18.apk
```

V18 preserves the package ID but uses a new private signer. To migrate from V17: create and verify a Full Backup, uninstall V17, install V18 and restore your data. Existing new-signer V18 installations can update in place.

Create a Full Backup before uninstalling or moving to another device.

## 🧱 Repository architecture

Key files:

```text
source/index.html
assets/mobile-modern.js
assets/mobile-modern.css
scripts/prepare-web.mjs
scripts/patch-android.mjs
scripts/regression.mjs
tests/ui-v18.spec.mjs
version.json
release-request.json
```

Responsibilities:

- `source/index.html` — primary application and core;
- `assets/mobile-modern.*` — mobile UI/UX;
- `scripts/prepare-web.mjs` — offline web bundle preparation;
- `scripts/patch-android.mjs` — Android-native bridge;
- `scripts/regression.mjs` — static regression;
- `tests/ui-v18.spec.mjs` — Playwright UI regression.

See [ARCHITECTURE.md](../ARCHITECTURE.md).

## 🛠️ Local build

Requirements:

- Node.js 22;
- Java 21;
- Android SDK;
- npm.

Basic flow:

```bash
npm ci
npm run prepare:web
npm run qa
npx cap add android
node scripts/patch-android.mjs
npm run cap:sync
```

Generated `www/`, `android/` and `node_modules/` directories are not primary source and are not tracked in Git.

## ✅ QA and protected main

The `main` branch is protected by a repository ruleset.

Before a commit can enter `main`, both required checks must pass:

- `build-apk`;
- `mobile-ui`.

Both checks run through GitHub Actions on working branches so the exact commit can be tested before integration into `main`.

Release publication is additionally guarded by `release-request.json`. The normal state is:

```json
{
  "publish": false
}
```

Publication is opened only by a separate intentional release commit.

## 🔒 Security

Diary data are not sent to GitHub during normal application use.

The update checker performs a network request only after an explicit user action and targets the official GitHub Releases API for this repository.

See [SECURITY.md](../SECURITY.md).

## ⚕️ Medical scope

BP Diary helps users keep records and prepare information for discussion with a healthcare professional.

The application:

- does not diagnose conditions;
- does not prescribe treatment;
- does not replace a clinician;
- should not be the sole basis for decisions in an emergency.

## 📜 License

Copyright © 2026 **Tokhirjon Yuldoshev**.

This project is licensed under the **Apache License 2.0**.

See [LICENSE](../LICENSE).

## 🤝 Contributing

Branch workflow, required checks and Pull Request expectations are described in [CONTRIBUTING.md](../CONTRIBUTING.md).

---

[← Back to home](../README.md)
