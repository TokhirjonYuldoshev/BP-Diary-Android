<div align="center">

<img src="assets/logo.svg" alt="BP Diary logo" width="112">

# BP Diary

**Local-first Android blood-pressure diary with reminders, analytics, protected backups and doctor-ready PDF reports.**

**Локальный Android-дневник давления с напоминаниями, аналитикой, защищёнными бэкапами и PDF-отчётами для врача.**

**Qon bosimini qayd etish, eslatmalar, tahlil, himoyalangan zaxira va shifokor uchun PDF hisobotli Android ilova.**

[![Android Build](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml/badge.svg?branch=main)](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml)
[![UI Regression](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/ui-regression.yml/badge.svg?branch=main)](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/ui-regression.yml)
[![Release](https://img.shields.io/badge/release-v5.7.0-1f8f5f)](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.7.0)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

### 🌐 Documentation

[🇷🇺 Русский](docs/README.ru.md) ·
[🇬🇧 English](docs/README.en.md) ·
[🇺🇿 O‘zbekcha (Lotin)](docs/README.uz-Latn.md)

### 📦 Stable release

[**Download BP Diary V17 / 5.7.0**](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.7.0)

`BP-Diary-5.7-V17.apk`

`SHA-256: 5c328d79badfcb84f3160089aaa2dc7d2dd48f3a5aa2d91e5bdd0cec7d3c31f9`

</div>

---

## ✨ What BP Diary does

| | Capability | Highlights |
|---|---|---|
| 🩺 | **Measurements** | Up to 3 repeated readings, both arms, pulse, validation before save |
| 📊 | **Analytics** | Archive, search, quick periods, charts and summary metrics |
| ⏰ | **Reminders** | Up to 3 times/day, 1–3 alerts, intervals, 3 sounds, vibration |
| 📄 | **Doctor report** | Preview, A4 landscape PDF, Print, Save and Share |
| 🔐 | **Privacy** | App Lock, Screen Privacy and protected AES-GCM backup |
| 💾 | **Backups** | Plain JSON backup + encrypted password-protected backup |
| 🌐 | **Languages** | Russian, English and Uzbek (Latin) |
| 🌗 | **UI** | Light/dark themes, Android-native flows and accessibility |

## 🧭 Project status

| Item | Current state |
|---|---|
| Stable version | **V17 / 5.7.0** |
| versionCode | **170** |
| Package ID | `com.tokhirjonyuldoshev.bpdiary` |
| Android shell | Capacitor 8 |
| Release gate | `publish=false` |
| Protected branch | `main` |
| Required checks | `build-apk`, `mobile-ui` |
| License | **Apache-2.0** |

BP Diary keeps the medical/core calculation layer separate from the mobile presentation and Android-native integration layers.

## 📚 Documentation

- [Русская документация](docs/README.ru.md)
- [English documentation](docs/README.en.md)
- [O‘zbekcha hujjatlar — Lotin](docs/README.uz-Latn.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Architecture](ARCHITECTURE.md)
- [Changelog](CHANGELOG.md)
- [Release notes](RELEASE_NOTES.md)
- [V17 QA matrix](QA_V17.md)
- [Apache License 2.0](LICENSE)

## 🛠️ Development

Primary project files:

```text
source/index.html            application/core source
assets/mobile-modern.js      mobile UX layer
assets/mobile-modern.css     mobile visual system
scripts/prepare-web.mjs      offline web bundle
scripts/patch-android.mjs    Android native bridge
scripts/regression.mjs       static regression
tests/ui-v17.spec.mjs        Playwright mobile regression
version.json                 version source of truth
release-request.json         release publication gate
```

Generated `www/`, `android/` and `node_modules/` directories are not committed.

The protected `main` branch requires both GitHub Actions checks to pass:

- `build-apk`
- `mobile-ui`

Contributions should be developed and tested on a separate branch before integration.

## 🔒 Privacy and integrity

BP Diary stores diary data locally unless the user explicitly exports or shares it. Protected backups use password-based key derivation and authenticated encryption. The update checker contacts the official GitHub Releases API only after the user explicitly requests an update check.

For security details and APK-signing notes, see [SECURITY.md](SECURITY.md).

## ⚕️ Medical scope

BP Diary is a record-keeping and reporting tool. It does **not** diagnose conditions, prescribe treatment, or replace professional medical advice.

## 📜 License

Copyright © 2026 **Tokhirjon Yuldoshev**.

Licensed under the **Apache License 2.0**. See [LICENSE](LICENSE).

---

<div align="center">

**BP Diary V17 / 5.7.0**

[Releases](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases) ·
[Issues](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues) ·
[Contributing](CONTRIBUTING.md) ·
[Security](SECURITY.md)

</div>
