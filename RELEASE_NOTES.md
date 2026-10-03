# BP Diary 5.8.2 — V18 Bugfix Release

## Русский

BP Diary 5.8.2 — bugfix-релиз линии V18. Он исправляет стабильность экрана напоминаний и всплывающих окон, не меняя medical/core-логику, SCORE2, формулы отчётов, схему данных или package ID.

### Что исправлено

- Повторные одинаковые toast-сообщения больше не накапливаются бесконечно.
- Одновременный многократный запуск «Проверить звук» заблокирован на время текущего native-вызова.
- Перед новым тестом звука предыдущая тестовая Android-notification отменяется.
- При отсутствии разрешения Android на уведомления тестовая notification не отправляется.
- В окне «Автоматические копии» добавлена явная кнопка закрытия ×.
- Добавлены UI/regression-тесты для повторных нажатий «Проверить звук» и закрытия окна автоматических копий.

### Проверки

- Candidate V18 / 5.8.2 / versionCode 183 принят владельцем на реальном Android-устройстве 2026-10-03.
- Повторный тест звуков, быстрые повторные нажатия, закрытие «Автоматических копий» и стабильность sheet/page: PASSED.
- Exact-head CI после acceptance: Build Android APK, UI Regression, Dependency Security Audit и CodeQL — SUCCESS.
- Runtime high/critical dependency audit: 0 findings.
- Известные build-time findings через `@capacitor/assets 3.0.5` продолжают отслеживаться отдельно.

### Известная проблема установки

Issue #18 остаётся открытым: на одном реальном устройстве официальный V18 5.8.1 не установился поверх существующей V18 без uninstall. Официальные APK 5.8.0 и 5.8.1 имеют одинаковый package ID и production certificate, поэтому root cause ещё не установлен. Перед uninstall/reinstall создайте и проверьте Full Backup. До закрытия Issue #18 in-place update не считается гарантированным.

Публикация V18 / 5.8.2 / versionCode 183 разрешена владельцем 2026-10-03.

## English

BP Diary 5.8.2 is a V18 bugfix release. It fixes reminder-sheet and popup stability without changing medical/core calculations, SCORE2, report formulas, the data schema, or the package ID.

### Fixes

- Repeated identical toast messages no longer accumulate indefinitely.
- Repeated “Test sound” requests are single-flight while the current native call is pending.
- The previous Android test notification is cancelled before replaying a reminder sound.
- No test notification is emitted when Android notification permission is denied.
- The Automatic backups sheet now has an explicit × close button.
- UI/regression coverage was added for repeated sound-test taps and backup-sheet dismissal.

### Verification

- The V18 / 5.8.2 / versionCode 183 candidate was accepted by the owner on a real Android device on 2026-10-03.
- Repeated sound tests, rapid repeated taps, Automatic backups dismissal and sheet/page stability: PASSED.
- Exact-head CI after acceptance: Build Android APK, UI Regression, Dependency Security Audit and CodeQL — SUCCESS.
- Runtime high/critical dependency audit: 0 findings.
- Known build-time findings through `@capacitor/assets 3.0.5` remain tracked separately.

### Known installation issue

Issue #18 remains open: on one real device, the official V18 5.8.1 APK did not install over an existing V18 installation without uninstalling first. The official 5.8.0 and 5.8.1 APKs have the same package ID and production certificate, so root cause is not yet established. Create and verify a Full Backup before any uninstall/reinstall path. Until Issue #18 is resolved, in-place update is not documented as guaranteed.

Publication of V18 / 5.8.2 / versionCode 183 was authorized by the owner on 2026-10-03.
