# Contributing / Участие в разработке

## Русский

Спасибо за интерес к BP Diary.

### Перед изменениями

1. Создайте отдельную ветку.
2. Не изменяйте медицинскую/core-логику без явной причины.
3. Сохраняйте совместимость package ID: `com.tokhirjonyuldoshev.bpdiary`.
4. Не ломайте update path и существующие пользовательские данные.
5. Не добавляйте runtime CDN dependency, если библиотека может быть упакована локально.

### Где вносить изменения

- основной исходник: `source/index.html`;
- mobile UI/UX: `assets/mobile-modern.js`, `assets/mobile-modern.css`;
- native Android: `scripts/patch-android.mjs`;
- web build: `scripts/prepare-web.mjs`;
- regression checks: `scripts/regression-v15.mjs`.

### Перед коммитом

```bash
npm install
npm run prepare:web
npm run qa
node --check assets/mobile-modern.js
```

Для Android-проверки также необходимо собрать debug/release APK и проверить подпись.

### Pull request

В PR укажите:

- что изменено;
- зачем;
- какие пользовательские сценарии затронуты;
- менялась ли core/medical logic;
- как проверено;
- есть ли влияние на data migration, backup или signing.

### Безопасность

Не публикуйте новые production signing keys, токены, пароли или персональные медицинские данные.

---

## English

Thanks for your interest in BP Diary.

### Before changing code

1. Work in a dedicated branch.
2. Do not change medical/core logic without a clear reason.
3. Preserve package ID compatibility: `com.tokhirjonyuldoshev.bpdiary`.
4. Do not break the existing update path or user data.
5. Avoid runtime CDN dependencies when a library can be packaged locally.

### Where to work

- primary source: `source/index.html`;
- mobile UI/UX: `assets/mobile-modern.js`, `assets/mobile-modern.css`;
- native Android: `scripts/patch-android.mjs`;
- web build: `scripts/prepare-web.mjs`;
- regression checks: `scripts/regression-v15.mjs`.

### Before committing

```bash
npm install
npm run prepare:web
npm run qa
node --check assets/mobile-modern.js
```

For Android changes, also build debug/release APKs and verify their signer.

### Pull requests

Describe what changed, why, affected user flows, whether medical/core logic changed, how the change was verified, and any impact on migration, backup or signing.

### Security

Never commit new production signing keys, tokens, passwords or personal medical data.
