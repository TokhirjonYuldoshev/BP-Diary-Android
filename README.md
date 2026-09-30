<div align="center">
  <img src="assets/logo.svg" alt="BP Diary logo" width="104">
  <h1>BP Diary — Дневник артериального давления</h1>
  <p><strong>Android-приложение для ведения дневника давления, анализа измерений, резервного копирования и подготовки PDF-отчётов.</strong></p>
  <p><strong>Android app for blood-pressure journaling, trend review, backups and doctor-ready PDF reports.</strong></p>
  <p>
    <a href="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml"><img src="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml/badge.svg?branch=main" alt="Android build"></a>
    <a href="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/ui-regression.yml"><img src="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/ui-regression.yml/badge.svg?branch=main" alt="UI regression"></a>
  </p>
  <p>
    <a href="#-русский">Русский</a> ·
    <a href="#-english">English</a> ·
    <a href="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0">V16 Release</a>
  </p>
</div>

---

# 🇷🇺 Русский

## Статус проекта

**Текущий стабильный релиз: V16 / 5.6.0 — Reliability & Android Integration.**

Готовый к релизному пайплайну кандидат: **V17 / 5.7.0 — Reminders, Reports, Privacy & Localization**. Real-device acceptance пройден; публикация остаётся закрыта через `publish=false` до финального переноса в `main`.

- Release tag: `v5.6.0`
- versionCode: `160`
- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Android shell: Capacitor 8
- Основной исходник: `source/index.html`
- Мобильный UI/UX: `assets/mobile-modern.js` + `assets/mobile-modern.css`
- Native Android bridge: `scripts/patch-android.mjs`
- Официальный APK: [BP Diary 5.6.0 V16](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0)

Финальный APK:

```text
BP-Diary-5.6-V16.apk
SHA-256: 74cd50bf017c6d02936adc6da947eadb7908e99931559e7b527755df1ad7c6dc
```

## Что умеет BP Diary

### Замеры и профиль

- ввод артериального давления и пульса;
- несколько замеров и поддержка обеих рук;
- Кардио-профиль и параметры SCORE2;
- персональный диапазон и цели;
- голосовой ввод;
- TTS-озвучивание;
- русский, английский и узбекский (Latin) языки;
- светлая и тёмная темы.

### Архив и аналитика

- современные карточки измерений;
- быстрый поиск;
- фильтры **Все / 7 / 30 / 90 дней**;
- сортировка новые/старые;
- редактирование и удаление;
- графики и сводная аналитика;
- подтверждение опасных действий.

### Отчёт врачу

- периоды **7 / 14 / 30 дней / все данные / свой диапазон**;
- предварительный просмотр;
- **Печать**;
- **Сохранить PDF**;
- **Поделиться PDF** через системное меню Android.

### Резервное копирование

- до **5 автоматических локальных копий**;
- ручной Full Backup в JSON;
- восстановление из Full Backup;
- safety-backup перед отдельными опасными операциями.

### V17: кандидат, прошедший device acceptance

- до **3 времён напоминаний в день**, 1–3 сигнала, интервалы 5/10/15/30 минут, 3 системных звука и вибрация;
- действия уведомлений **«Измерено»** и **«Напомнить позже»**;
- проверка новых/редактируемых замеров до сохранения;
- полноценное руководство **RU / EN / UZ**;
- мобильный отчёт врача **A4 landscape**, как ПК-версия;
- App Lock через системную Android-аутентификацию, Screen privacy и защищённый AES-GCM backup;
- medical/core расчёты, SCORE2, формулы отчёта, Package ID и signing lineage не изменены.

### V16: Android-интеграция

- **нативные ежедневные Android-напоминания**;
- уведомления работают после закрытия BP Diary;
- восстановление расписания после перезагрузки телефона;
- пересчёт расписания после изменения времени или часового пояса;
- Android 13+ notification permission;
- миграция старого V15 JavaScript-напоминания без создания дублей;
- отдельный экран **Настройки**;
- ручная **Проверка обновлений** только через официальный GitHub Release;
- никаких скрытых загрузок или автоустановки APK.

## Установка и обновление

1. Откройте [официальный V16 Release](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0).
2. Скачайте `BP-Diary-5.6-V16.apk`.
3. Установите APK на Android.
4. V16 использует ту же signing lineage, что и V8–V15 direct-distribution builds, поэтому его можно устанавливать **поверх V15 без удаления приложения**.

Перед удалением приложения или переносом на другое устройство рекомендуется создать **Полный бэкап**. Android удаляет локальные app/WebView-данные при uninstall.

## Проверка SHA-256

Ожидаемый SHA-256:

```text
74cd50bf017c6d02936adc6da947eadb7908e99931559e7b527755df1ad7c6dc
```

Пример проверки:

```bash
sha256sum BP-Diary-5.6-V16.apk
```

## Структура репозитория

```text
BP-Diary-Android/
├── source/
│   └── index.html               # основной читаемый код BP Diary
├── assets/
│   ├── mobile-modern.js         # mobile UX и Android UI integration
│   ├── mobile-modern.css        # mobile visual system
│   └── logo.svg
├── scripts/
│   ├── prepare-web.mjs          # сборка offline web bundle
│   ├── patch-android.mjs        # native Android bridge
│   └── regression.mjs           # regression smoke
├── tests/
│   ├── ui-v16.spec.mjs          # V16 Playwright regression
│   └── ui-v17.spec.mjs          # V17 Playwright regression
├── .github/workflows/
│   ├── build-android.yml        # debug + release CI
│   ├── ui-regression.yml        # visual/mobile regression
│   └── release.yml              # generic signed release workflow
├── version.json                 # единый источник версии
├── release-request.json         # publication gate
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── QA_V15.md
├── QA_V16.md
└── package.json
```

Сгенерированные `www/`, `android/` и `node_modules/` не хранятся в Git.

## Сборка локально

Требования:

- Node.js 22;
- Java 21;
- Android SDK;
- npm.

```bash
npm ci
npm run prepare:web
npm run qa
npx cap add android
node scripts/patch-android.mjs
npm run cap:sync
```

Android-проект после этого находится в `android/`.

## Версионирование и Release

BP Diary использует один источник истины:

```text
version.json
```

Он задаёт:

- release label;
- versionName;
- versionCode;
- Git tag;
- имя APK/artifact.

Публикация дополнительно защищена `release-request.json`. Release workflow выполняет свежую release-сборку, проверяет signer, считает SHA-256 и только затем публикует GitHub Release.

## QA

V16 прошёл:

- final regression smoke;
- JavaScript syntax validation;
- Android debug build;
- Android release build;
- signer verification;
- Playwright mobile UI regression;
- light/dark screenshots;
- проверку ключевой геометрии мобильных карточек;
- device-acceptance этап перед публикацией.

Основные финальные прогоны:

- Android Build **#115 — SUCCESS**;
- UI Regression **#13 — SUCCESS**;
- final release build **SUCCESS**;
- GitHub Release publish **SUCCESS**.

Полная матрица: [QA_V16.md](QA_V16.md).

История: [CHANGELOG.md](CHANGELOG.md).

## Архитектура

Основная логика, мобильный слой и native Android integration разделены:

- `source/index.html` — базовое приложение;
- `assets/mobile-modern.*` — mobile UX;
- `scripts/prepare-web.mjs` — offline runtime bundle;
- `scripts/patch-android.mjs` — Android-native функции.

Подробнее: [ARCHITECTURE.md](ARCHITECTURE.md).

## Приватность и безопасность

Измерения, профиль и локальные backups не отправляются в GitHub при проверке обновлений.

V16 обращается к GitHub Releases API **только после явного нажатия пользователем «Проверить обновления»**.

Нативные напоминания хранят только настройки расписания/уведомления (времена, повторы, интервал, звук, вибрация и подписи действий); данные измерений в reminder preferences не записываются.

Подробнее: [SECURITY.md](SECURITY.md).

### Signing

Direct-distribution APK V8–V17 сохраняет существующий update signer:

```text
SHA-256 certificate:
63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102
```

Этот ключ присутствовал в истории публичного репозитория и **не является безопасным production signing key для Google Play**. Для будущей публикации в Google Play нужен отдельный приватный ключ / Play App Signing и предпочтительно AAB.

## Медицинское назначение

BP Diary предназначен для ведения записей и подготовки данных для обсуждения со специалистом. Приложение не заменяет диагностику, лечение или профессиональную медицинскую консультацию.

## Лицензия

В репозитории пока нет отдельного `LICENSE`-файла. Публичная доступность исходного кода сама по себе не предоставляет автоматического разрешения на копирование, изменение или распространение.

## Автор и обратная связь

Разработчик: **Tokhirjon Yuldoshev**

- [Repository](https://github.com/TokhirjonYuldoshev/BP-Diary-Android)
- [Issues](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues)
- [Releases](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases)

---

# 🇬🇧 English

## Project status

**Current stable release: V16 / 5.6.0 — Reliability & Android Integration.**

Release-ready candidate: **V17 / 5.7.0 — Reminders, Reports, Privacy & Localization**. Real-device acceptance has passed; publication remains gated by `publish=false` until final integration into `main`.

- Release tag: `v5.6.0`
- versionCode: `160`
- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Android shell: Capacitor 8
- Primary source: `source/index.html`
- Mobile UI/UX: `assets/mobile-modern.js` + `assets/mobile-modern.css`
- Native Android bridge: `scripts/patch-android.mjs`
- Official APK: [BP Diary 5.6.0 V16](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0)

Final APK:

```text
BP-Diary-5.6-V16.apk
SHA-256: 74cd50bf017c6d02936adc6da947eadb7908e99931559e7b527755df1ad7c6dc
```

## Features

### Measurements and profile

- blood-pressure and pulse entry;
- multiple readings and both arms;
- cardiovascular profile and SCORE2 parameters;
- personal target range;
- voice input;
- TTS;
- Russian, English and Uzbek (Latin);
- light and dark themes.

### Archive and analytics

- modern reading cards;
- fast Archive search;
- **All / 7 / 30 / 90 days** filters;
- newest/oldest sorting;
- edit and delete flows;
- charts and summary analytics;
- destructive-action confirmations.

### Doctor report

- **7 / 14 / 30 days / all data / custom range**;
- preview;
- **Print**;
- **Save PDF**;
- **Share PDF** through Android's system share sheet.

### Backup and restore

- up to **5 automatic local restore points**;
- manual Full Backup JSON export;
- restore from Full Backup;
- safety backups before selected destructive operations.

### V17 accepted release candidate

- up to **3 reminder times per day**, 1–3 alerts, 5/10/15/30-minute intervals, 3 Android system sounds and optional vibration;
- notification actions for **Done** and **Remind later**;
- input guardrails for new/edited measurements before persistence;
- full in-app **RU / EN / UZ** user guide;
- mobile doctor report in **A4 landscape**, matching the desktop-style report;
- system Android App Lock, Screen privacy and password-protected AES-GCM backup;
- medical/core calculations, SCORE2, report formulas, Package ID and signing lineage remain unchanged.

### V16 Android integration

- **native daily Android reminders**;
- notifications work after BP Diary is closed;
- reminder restoration after device reboot;
- rescheduling after time/timezone changes;
- Android 13+ notification permission;
- one-time migration from the legacy V15 JavaScript reminder;
- dedicated **Settings** screen;
- user-initiated **Check for updates** against the official GitHub Release;
- no silent APK download or installation.

## Installation and upgrade

1. Open the [official V16 Release](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0).
2. Download `BP-Diary-5.6-V16.apk`.
3. Install it on Android.
4. V16 uses the same direct-distribution signing lineage as V8–V15, so it can be installed **over V15 without uninstalling**.

Create a **Full Backup** before uninstalling or moving devices. Android removes the application's local app/WebView data on uninstall.

## SHA-256 verification

Expected SHA-256:

```text
74cd50bf017c6d02936adc6da947eadb7908e99931559e7b527755df1ad7c6dc
```

Example:

```bash
sha256sum BP-Diary-5.6-V16.apk
```

## Repository layout

```text
BP-Diary-Android/
├── source/
│   └── index.html               # readable primary BP Diary source
├── assets/
│   ├── mobile-modern.js         # mobile UX and Android UI integration
│   ├── mobile-modern.css        # mobile visual system
│   └── logo.svg
├── scripts/
│   ├── prepare-web.mjs          # offline web bundle
│   ├── patch-android.mjs        # native Android bridge
│   └── regression.mjs           # regression smoke
├── tests/
│   └── ui-v16.spec.mjs          # Playwright mobile UI regression
├── .github/workflows/
│   ├── build-android.yml        # debug + release CI
│   ├── ui-regression.yml        # visual/mobile regression
│   └── release.yml              # generic signed release workflow
├── version.json                 # single source of version truth
├── release-request.json         # publication gate
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── QA_V15.md
├── QA_V16.md
└── package.json
```

Generated `www/`, `android/` and `node_modules/` directories are not tracked.

## Local build

Requirements:

- Node.js 22;
- Java 21;
- Android SDK;
- npm.

```bash
npm ci
npm run prepare:web
npm run qa
npx cap add android
node scripts/patch-android.mjs
npm run cap:sync
```

The generated Android project is written to `android/`.

## Versioning and release

BP Diary uses a single source of truth:

```text
version.json
```

It defines the release label, versionName, versionCode, Git tag and artifact basename.

Publication is additionally gated by `release-request.json`. The release workflow performs a fresh signed release build, verifies the signer, computes SHA-256 and only then publishes the GitHub Release.

## QA

V16 passed:

- final regression smoke;
- JavaScript syntax validation;
- Android debug build;
- Android release build;
- signer verification;
- Playwright mobile UI regression;
- light/dark screenshots;
- key mobile-layout geometry checks;
- the device-acceptance stage before publication.

Key final runs:

- Android Build **#115 — SUCCESS**;
- UI Regression **#13 — SUCCESS**;
- final signed release build **SUCCESS**;
- GitHub Release publication **SUCCESS**.

Full matrix: [QA_V16.md](QA_V16.md).

History: [CHANGELOG.md](CHANGELOG.md).

## Architecture

The application core, mobile presentation layer and native Android integration are intentionally separated:

- `source/index.html` — base application;
- `assets/mobile-modern.*` — mobile UX;
- `scripts/prepare-web.mjs` — offline runtime bundle;
- `scripts/patch-android.mjs` — Android-native capabilities.

See [ARCHITECTURE.md](ARCHITECTURE.md).

## Privacy and security

Measurements, profile data and local backups are not sent to GitHub when checking for updates.

V16 contacts the GitHub Releases API **only after the user explicitly taps “Check for updates.”**

Native reminders store only schedule/notification configuration (times, repeats, interval, sound, vibration and action labels); measurement data are not stored in reminder preferences.

See [SECURITY.md](SECURITY.md).

### APK signing

Direct-distribution builds V8–V17 retain the existing update signer:

```text
SHA-256 certificate:
63e7e2c0739cc1e6640ac53c39b7908d70b92606df0a3cbd973a516bf9e3c102
```

Because this key has existed in public repository history, it **must not be treated as a secure Google Play production key**. A future Play release should use a separate private key / Play App Signing and preferably an AAB.

## Medical scope

BP Diary is a record-keeping and reporting tool intended to help organize information for discussion with a healthcare professional. It does not replace diagnosis, treatment or professional medical advice.

## License

The repository currently has no separate `LICENSE` file. Public source visibility does not by itself grant permission to copy, modify or redistribute the code.

## Author and feedback

Developer: **Tokhirjon Yuldoshev**

- [Repository](https://github.com/TokhirjonYuldoshev/BP-Diary-Android)
- [Issues](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues)
- [Releases](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases)
