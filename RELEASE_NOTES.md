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

The V18 / 5.8.1 / versionCode 182 candidate was accepted on a real device on 2026-10-02 and authorized for publication.
