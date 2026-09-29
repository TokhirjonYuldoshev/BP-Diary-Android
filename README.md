<div align="center">
  <img src="assets/logo.svg" alt="BP Diary logo" width="104">
  <h1>BP Diary — Дневник артериального давления</h1>
  <p><strong>Android-приложение для ведения дневника давления, анализа измерений, резервного копирования и подготовки PDF-отчётов.</strong></p>
  <p><strong>Android app for blood-pressure journaling, trend review, backups and doctor-ready PDF reports.</strong></p>
  <p>
    <a href="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml"><img src="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml/badge.svg?branch=main" alt="Build Android APK"></a>
  </p>
  <p>
    <a href="#-русский">Русский</a> ·
    <a href="#-english">English</a> ·
    <a href="https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0">Latest Release</a>
  </p>
</div>

---

# 🇷🇺 Русский

## О проекте

**BP Diary 5.5** — Android-версия дневника артериального давления с мобильным интерфейсом, локальным хранением данных, аналитикой, резервными копиями и отчётами для врача.

Текущий стабильный релиз: **V16 / 5.6.0 — Reliability & Android Integration**.

- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Android shell: Capacitor 8
- Основной исходник приложения: `source/index.html`
- Мобильный UI/UX слой: `assets/mobile-modern.js` + `assets/mobile-modern.css`
- Android/native bridge: `scripts/patch-android.mjs`
- Стабильный APK: [GitHub Release v5.5.150](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0)

> Основной исходный код теперь хранится в обычном читаемом `source/index.html`. Старые Base64-части удалены.


### V16 candidate

V16 переносит критичные Android-функции из WebView в нативный слой:

- ежедневные системные напоминания, работающие после закрытия приложения;
- восстановление напоминания после перезагрузки и изменения времени/часового пояса;
- отдельный экран **Настройки**;
- ручная проверка обновлений только через официальный GitHub Release;
- единый `version.json` для версии APK, имени артефакта и release tag;
- автоматизированные UI/screenshot regression-тесты.

V16 принят как **stable release** после полного CI/UI regression и device-acceptance шага. См. [QA_V16.md](QA_V16.md).

## Возможности

### Замеры и профиль

- ввод измерений артериального давления и пульса;
- поддержка нескольких замеров и обеих рук;
- Кардио-профиль и параметры SCORE2;
- персональный диапазон и цели;
- голосовой ввод;
- TTS-озвучивание;
- RU / EN;
- светлая и тёмная темы.

### Архив и аналитика

- карточки сохранённых измерений;
- быстрый поиск по Архиву;
- фильтры **Все / 7 / 30 / 90 дней**;
- сортировка **сначала новые / сначала старые**;
- редактирование и удаление записей;
- графики и сводная аналитика;
- подтверждение опасных действий.

### Отчёт для врача

- периоды **7 / 14 / 30 дней / все данные / свой диапазон**;
- предварительный просмотр;
- **Печать**;
- **Сохранить PDF**;
- **Поделиться PDF** через системное меню Android.

### Защита данных

- до **5 автоматических локальных резервных копий**;
- ручной полный JSON backup/restore;
- safety-backup перед частью опасных операций;
- данные дневника и автоматические копии хранятся внутри локальной области приложения.

> Перед удалением приложения или переносом на другое устройство рекомендуется создать **Полный бэкап**. Удаление Android-приложения удаляет его локальные данные.

## Установка

1. Откройте [релиз BP Diary 5.5 V15](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0).
2. Скачайте `BP-Diary-5.6-V16.apk`.
3. Установите APK на Android.
4. V15 подписан тем же стабильным update-ключом, что и последние тестовые V8–V14, поэтому его можно устанавливать **поверх V14 без удаления приложения**.

SHA-256 финального V15 APK:

```text
2dc658f51214718706963ed71186a31fd883d8ea1fa4ce5841d55e0f3f598082
```

## Структура репозитория

```text
BP-Diary-Android/
├── source/
│   └── index.html              # основной читаемый код BP Diary
├── assets/
│   ├── mobile-modern.js        # Android/mobile UX слой
│   ├── mobile-modern.css       # мобильные стили
│   └── logo.svg
├── scripts/
│   ├── prepare-web.mjs         # подготовка offline web bundle
│   ├── patch-android.mjs       # native Android bridge + signing config
│   └── regression-v15.mjs      # автоматический regression smoke
├── .github/workflows/
│   ├── build-android.yml       # CI debug + release verification
│   └── release-v15.yml         # финальный V15 GitHub Release
├── CHANGELOG.md
├── QA_V15.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── SECURITY.md
└── package.json
```

Сгенерированные каталоги `www/`, `android/` и `node_modules/` не хранятся в Git: они создаются во время сборки.

## Сборка локально

Требования:

- Node.js 22;
- Java 21;
- Android SDK;
- npm.

Подготовка web-части:

```bash
npm install
npm run prepare:web
npm run qa
```

Создание Android-проекта:

```bash
npx cap add android
node scripts/patch-android.mjs
npm run cap:sync
```

После этого Android-проект находится в `android/`.

## Архитектура и принцип изменений

Мобильный Android-слой намеренно отделён от основной логики дневника:

- `source/index.html` — исходное приложение;
- `assets/mobile-modern.*` — mobile presentation/UX;
- `scripts/patch-android.mjs` — Android-native функции;
- `scripts/prepare-web.mjs` — композиция runtime bundle.

Это позволяет улучшать Android UX без ненужного вмешательства в медицинскую/core-логику. Подробнее: [ARCHITECTURE.md](ARCHITECTURE.md).

## QA и стабильность

Финальный V15 прошёл:

- GitHub Actions build;
- JavaScript syntax check;
- automated regression smoke;
- debug + release APK build;
- проверку одинаковой подписи;
- ручную проверку на Android-устройстве: upgrade поверх V14, сохранение данных, Archive search/filter/sort, PDF Save/Share, backups, Android Back, Voice/TTS, RU/EN, light/dark и accessibility.

Полная матрица: [QA_V15.md](QA_V15.md).

История изменений: [CHANGELOG.md](CHANGELOG.md).

## Подпись APK

Текущий direct-distribution APK использует стабильный update-ключ проекта, чтобы сохранялась совместимость обновлений V8–V15.

**Важно:** этот ключ присутствовал в истории публичного репозитория и **не должен считаться безопасным production-ключом для Google Play**. Для будущей публикации в Google Play нужен отдельный приватный signing key / Play App Signing и предпочтительно AAB.

## Медицинское назначение

BP Diary помогает вести записи и готовить данные для обсуждения с врачом. Приложение не заменяет медицинскую диагностику, лечение или профессиональную консультацию.

## Лицензия

В репозитории **не опубликован отдельный LICENSE-файл**. Публичная доступность исходного кода сама по себе не означает автоматического разрешения на копирование, изменение или распространение. Перед переиспользованием кода необходимо получить соответствующее разрешение правообладателя или руководствоваться применимым законодательством.

## Автор и обратная связь

Разработчик: **Tokhirjon Yuldoshev**

- [GitHub repository](https://github.com/TokhirjonYuldoshev/BP-Diary-Android)
- [Issues / ошибки и предложения](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues)
- [Releases](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases)

---

# 🇬🇧 English

## About

**BP Diary 5.5** is an Android blood-pressure diary with a mobile-first interface, local data storage, analytics, backup/restore and doctor-ready reports.

Current stable release: **V16 / 5.6.0 — Reliability & Android Integration**.

- Package ID: `com.tokhirjonyuldoshev.bpdiary`
- Android shell: Capacitor 8
- Main application source: `source/index.html`
- Mobile UI/UX layer: `assets/mobile-modern.js` + `assets/mobile-modern.css`
- Android/native bridge: `scripts/patch-android.mjs`
- Stable APK: [GitHub Release v5.5.150](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0)

> The main application source is now stored as a normal, human-readable `source/index.html`. The legacy Base64 source chunks have been removed.


### V16 candidate

V16 moves critical Android behavior out of the WebView and into the native layer:

- persistent daily system reminders that work after the app is closed;
- reminder restoration after reboot and time/timezone changes;
- dedicated **Settings** screen;
- manual update checks against the official GitHub Release only;
- single-source `version.json` for APK version, artifact name and release tag;
- automated UI/screenshot regression tests.

V16 is accepted as the **stable release** after final CI/UI regression and the device-acceptance step. See [QA_V16.md](QA_V16.md).

## Features

### Measurements and profile

- blood-pressure and pulse entry;
- multiple readings and both arms;
- cardiovascular profile and SCORE2 parameters;
- personal target range;
- voice input;
- TTS read-out;
- RU / EN;
- light and dark themes.

### Archive and analytics

- modern reading cards;
- fast Archive search;
- **All / 7 / 30 / 90 days** filters;
- newest/oldest sorting;
- edit and delete flows;
- charts and summary analytics;
- confirmations for destructive actions.

### Doctor report

- **7 / 14 / 30 days / all data / custom range**;
- report preview;
- **Print**;
- **Save PDF**;
- **Share PDF** through Android's system share sheet.

### Data protection

- up to **5 automatic local restore points**;
- manual full JSON backup/restore;
- safety backup before selected destructive operations;
- diary data and automatic backups remain inside the app's local storage area.

> Create a **Full Backup** before uninstalling the app or moving to another device. Android removes the app's local data when the app is uninstalled.

## Installation

1. Open [BP Diary 5.5 V15 release](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.6.0).
2. Download `BP-Diary-5.6-V16.apk`.
3. Install the APK on Android.
4. V15 uses the same stable update signer as the recent V8–V14 test builds, so it can be installed **over V14 without uninstalling**.

Final V15 APK SHA-256:

```text
2dc658f51214718706963ed71186a31fd883d8ea1fa4ce5841d55e0f3f598082
```

## Repository layout

```text
BP-Diary-Android/
├── source/
│   └── index.html              # readable BP Diary application source
├── assets/
│   ├── mobile-modern.js        # Android/mobile UX layer
│   ├── mobile-modern.css       # mobile styling
│   └── logo.svg
├── scripts/
│   ├── prepare-web.mjs         # prepares the offline web bundle
│   ├── patch-android.mjs       # native Android bridge + signing config
│   └── regression-v15.mjs      # automated regression smoke
├── .github/workflows/
│   ├── build-android.yml       # CI debug + release verification
│   └── release-v15.yml         # final V15 GitHub Release
├── CHANGELOG.md
├── QA_V15.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── SECURITY.md
└── package.json
```

Generated `www/`, `android/` and `node_modules/` directories are intentionally not tracked.

## Local build

Requirements:

- Node.js 22;
- Java 21;
- Android SDK;
- npm.

Prepare and validate the web layer:

```bash
npm install
npm run prepare:web
npm run qa
```

Create the Android project:

```bash
npx cap add android
node scripts/patch-android.mjs
npm run cap:sync
```

The generated Android project will be available in `android/`.

## Architecture

The Android mobile layer is intentionally separated from the diary's primary application logic:

- `source/index.html` — application source;
- `assets/mobile-modern.*` — mobile presentation and UX;
- `scripts/patch-android.mjs` — native Android capabilities;
- `scripts/prepare-web.mjs` — runtime bundle composition.

This keeps mobile UX work isolated from unnecessary changes to medical/core logic. See [ARCHITECTURE.md](ARCHITECTURE.md).

## QA and release quality

V15 has passed:

- GitHub Actions build;
- JavaScript syntax validation;
- automated regression smoke;
- debug + release APK builds;
- signer verification;
- manual Android-device regression covering upgrade over V14, preserved data, Archive search/filter/sort, PDF Save/Share, backups, Android Back, Voice/TTS, RU/EN, light/dark and accessibility.

Full matrix: [QA_V15.md](QA_V15.md).

Change history: [CHANGELOG.md](CHANGELOG.md).

## APK signing

The current direct-distribution APK uses the project's stable update key to preserve the V8–V15 update path.

**Important:** this key has existed in the history of the public repository and must **not** be treated as a secure Google Play production key. A future Google Play release should use a separate private signing key / Play App Signing and preferably an AAB.

## Medical scope

BP Diary is a record-keeping and reporting tool intended to help users organize information for discussion with healthcare professionals. It does not replace medical diagnosis, treatment or professional medical advice.

## License

This repository currently has **no separate LICENSE file**. Public source visibility does not by itself grant permission to copy, modify or redistribute the code. Obtain appropriate permission from the rights holder or follow applicable law before reusing the code.

## Author and feedback

Developer: **Tokhirjon Yuldoshev**

- [GitHub repository](https://github.com/TokhirjonYuldoshev/BP-Diary-Android)
- [Issues / bug reports and suggestions](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues)
- [Releases](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases)
