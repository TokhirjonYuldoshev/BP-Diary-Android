# Architecture / Архитектура

## Русский

### Цель архитектуры

BP Diary Android разделяет исходное приложение, мобильный UX-слой, Android-native функции и сборочную инфраструктуру. Это сделано намеренно: мобильные изменения не должны без необходимости затрагивать медицинскую/core-логику дневника.

### Слои

#### 1. `source/index.html`

Основной читаемый исходник приложения BP Diary.

Здесь находится базовый интерфейс и основная логика дневника. Ранее этот файл хранился в четырёх gzip+Base64 частях. После финальной нормализации репозитория он хранится непосредственно как HTML, чтобы код был доступен для просмотра, аудита и сопровождения.

#### 2. `assets/mobile-modern.js`

Мобильный presentation/UX слой.

Отвечает, в частности, за:

- мобильную навигацию;
- экран Архива;
- поиск, фильтры и сортировку;
- экран «О продукте»;
- onboarding;
- report viewer;
- PDF Share flow;
- toast/confirm UI;
- Android Back coordination;
- accessibility semantics;
- mobile-only адаптацию интерфейса.

#### 3. `assets/mobile-modern.css`

Мобильная визуальная система:

- light/dark;
- карточки;
- bottom navigation;
- sheets/dialogs;
- report viewer;
- Archive;
- accessibility focus;
- reduced motion;
- increased contrast;
- responsive layout.

#### 4. `scripts/prepare-web.mjs`

Собирает runtime web bundle в `www/`:

1. читает `source/index.html`;
2. копирует mobile assets;
3. локально подключает Chart.js, Font Awesome, SheetJS, html2canvas и jsPDF;
4. заменяет runtime CDN references локальными путями;
5. инжектирует mobile CSS/JS;
6. валидирует результат.

`www/` — build output и не хранится в Git.

#### 5. `scripts/patch-android.mjs`

Создаёт Android-specific слой после `npx cap add android`.

Содержит:

- `MainActivity` с Android Back;
- Capacitor plugin `NativeBridge`;
- speech recognition;
- TTS;
- PDF share;
- Android print;
- backup/restore file operations;
- local automatic backups;
- external URL opening;
- signing configuration.

`android/` — generated build tree и не хранится в Git.

### V16 Android integration

V16 adds a native reliability layer without moving diary/medical calculations out of the existing application core.

- `ReminderScheduler.java` — stores the daily reminder configuration and schedules the next Android alarm.
- `ReminderReceiver.java` — receives the alarm, creates the system notification and schedules the following day.
- `BOOT_COMPLETED`, device-time and timezone broadcasts restore/reschedule the reminder after system changes.
- Android 13+ notification permission is requested only when the user chooses to enable notifications.
- `NativeBridge.checkForUpdate` performs an explicit user-requested HTTPS request to the official GitHub Releases API; there is no background update polling.
- `version.json` is the single source for release label, semantic version, Android versionCode, release tag and artifact basename.
- `release-request.json` is a publication safety gate. A candidate cannot publish while `publish=false`.
- `tests/ui-v16.spec.mjs` validates key mobile layouts and produces light/dark screenshots in CI.

### Data flow

```text
source/index.html
        │
        ├── assets/mobile-modern.css
        ├── assets/mobile-modern.js
        └── packaged offline libraries
                │
                ▼
             www/
                │
                ▼
         Capacitor Android
                │
                ├── WebView
                └── NativeBridge
                        │
                        ├── Share / Print
                        ├── Voice / TTS
                        ├── Backup / Restore
                        └── Android Back
```

### Хранение данных

Основные данные дневника сохраняются в локальной области Android WebView/приложения. Автоматические резервные копии находятся в app-internal storage.

Удаление приложения удаляет эту локальную область, поэтому перед uninstall/device migration необходимо использовать Full Backup.

### Signing

Текущий direct-distribution APK использует стабильный update signer, совместимый с V8–V15.

Этот ключ существовал в истории публичного репозитория и поэтому не должен использоваться как безопасный production key для Google Play.

### Правило изменений

Изменения мобильного UX должны по возможности оставаться в `assets/mobile-modern.*` и `scripts/patch-android.mjs`.

Core/medical logic в `source/index.html` изменяется только когда это действительно необходимо и после отдельной проверки.

---

## English

### Architecture goal

BP Diary Android separates the primary application source, mobile UX layer, Android-native capabilities and build infrastructure. This is intentional: mobile presentation work should not unnecessarily modify the diary's medical/core logic.

### Layers

#### 1. `source/index.html`

The human-readable primary BP Diary source.

This contains the base application UI and core diary logic. It used to be stored as four gzip+Base64 chunks; the repository-finalization pass restored it as normal HTML for review, audit and maintenance.

#### 2. `assets/mobile-modern.js`

Mobile presentation/UX layer, including:

- mobile navigation;
- Archive UI;
- search, filters and sorting;
- About screen;
- onboarding;
- report viewer;
- PDF Share flow;
- toast/confirm UI;
- Android Back coordination;
- accessibility semantics;
- mobile-specific adaptations.

#### 3. `assets/mobile-modern.css`

Mobile visual system: light/dark themes, cards, navigation, sheets, report viewer, Archive, focus visibility, reduced motion, increased contrast and responsive layout.

#### 4. `scripts/prepare-web.mjs`

Builds the runtime web bundle into `www/` by reading `source/index.html`, copying mobile assets and offline libraries, replacing runtime CDN references, injecting the mobile layer and validating the result.

`www/` is generated and intentionally untracked.

#### 5. `scripts/patch-android.mjs`

Creates the Android-specific layer after `npx cap add android`, including MainActivity Back handling, the NativeBridge Capacitor plugin, speech recognition, TTS, PDF share/print, backup/restore, local auto-backups, external URL handling and signing configuration.

`android/` is generated and intentionally untracked.

### Data flow

```text
source/index.html
        │
        ├── assets/mobile-modern.css
        ├── assets/mobile-modern.js
        └── packaged offline libraries
                │
                ▼
             www/
                │
                ▼
         Capacitor Android
                │
                ├── WebView
                └── NativeBridge
                        │
                        ├── Share / Print
                        ├── Voice / TTS
                        ├── Backup / Restore
                        └── Android Back
```

### Change rule

Prefer mobile UX changes in `assets/mobile-modern.*` and `scripts/patch-android.mjs`.

Only modify core/medical logic in `source/index.html` when necessary and with dedicated validation.
