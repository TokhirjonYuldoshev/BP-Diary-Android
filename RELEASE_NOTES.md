# BP Diary 5.8.1 — V18 Maintenance Release

## Русский

BP Diary 5.8.1 — maintenance-обновление линии V18. Оно не меняет medical/core-логику, SCORE2, формулы отчётов, схему данных или package ID.

### Что изменено

- Chart.js обновлён с 4.4.0 до 4.5.1.
- Font Awesome Free обновлён с 6.0.0-beta3 до 7.3.1.
- GitHub Actions обновлены и закреплены на immutable full commit SHA.
- Добавлен `THIRD_PARTY_NOTICES.md`.
- Сохранён текущий private production signer V18.
- Публикация 5.8.1 разрешена владельцем 2026-10-02 после успешной проверки кандидата.

### Проверки

- Chart.js 4.5.1: автоматические проверки SUCCESS; real-device analytics/rotation/RU-EN-UZ check PASSED.
- Font Awesome Free 7.3.1: автоматические проверки SUCCESS; real-device icon/light-dark/RU-EN-UZ check PASSED.
- Runtime high/critical dependency audit: 0 findings.
- Известные build-time findings через `@capacitor/assets 3.0.5` остаются отслеживаемыми отдельно.

### Известная проблема установки

После публикации владелец сообщил, что официальный 5.8.1 не установился поверх уже установленной V18 без uninstall. При этом официальные APK 5.8.0 и 5.8.1 имеют одинаковый package ID и один и тот же production certificate, а versionCode повышен 181 → 182. Причина пока не установлена и отслеживается в Issue #18. Перед uninstall/reinstall необходимо создать и проверить Full Backup.

Кандидат V18 / 5.8.1 / versionCode 182 принят владельцем на реальном устройстве 2026-10-02 и разрешён к публикации.

## English

BP Diary 5.8.1 is a maintenance update for the V18 line. It does not change medical/core calculations, SCORE2, report formulas, the data schema, or the package ID.

### Changes

- Chart.js updated from 4.4.0 to 4.5.1.
- Font Awesome Free updated from 6.0.0-beta3 to 7.3.1.
- GitHub Actions upgraded and pinned to immutable full commit SHAs.
- Added `THIRD_PARTY_NOTICES.md`.
- The existing private V18 production signer is retained.
- Publication was authorized by the owner on 2026-10-02 after candidate acceptance.

### Verification

- Chart.js 4.5.1: automated checks SUCCESS; real-device analytics/rotation/RU-EN-UZ check PASSED.
- Font Awesome Free 7.3.1: automated checks SUCCESS; real-device icon/light-dark/RU-EN-UZ check PASSED.
- Runtime high/critical dependency audit: 0 findings.
- Known build-time findings through `@capacitor/assets 3.0.5` remain tracked separately.

### Known installation issue

After publication, the owner reported that the official 5.8.1 APK did not install over an existing V18 installation without uninstalling first. The official 5.8.0 and 5.8.1 APKs have the same package ID and production certificate, and versionCode increases from 181 to 182. Root cause is not yet established and is tracked in Issue #18. Create and verify a Full Backup before any uninstall/reinstall path.

The V18 / 5.8.1 / versionCode 182 candidate was accepted on a real device on 2026-10-02 and authorized for publication.
