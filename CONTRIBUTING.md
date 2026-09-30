# Contributing / Участие в разработке / Hissa qo‘shish

[🇷🇺 Русский](#-русский) · [🇬🇧 English](#-english) · [🇺🇿 O‘zbekcha](#-ozbekcha-lotin)

---

## 🇷🇺 Русский

Спасибо за интерес к BP Diary.

### Рабочий процесс

1. Не работайте напрямую в `main`.
2. Создайте отдельную ветку от актуального `main`.
3. Внесите изменения и запустите локальные проверки.
4. Отправьте branch в GitHub.
5. Дождитесь обязательных checks:
   - `build-apk`
   - `mobile-ui`
6. Только после зелёных checks изменение может быть интегрировано в защищённый `main`.

Для сторонних contributors предпочтителен Pull Request.

### Что нельзя менять случайно

Без отдельного решения и проверки не изменяйте:

- medical/core расчёты;
- SCORE2;
- формулы отчёта;
- patient/data schema;
- Package ID `com.tokhirjonyuldoshev.bpdiary`;
- signing lineage;
- формат release gate;
- существующие данные пользователей и upgrade path.

Если изменение действительно требует затронуть эти области, это должно быть явно описано в PR.

### Где вносить изменения

- `source/index.html` — основное приложение/core;
- `assets/mobile-modern.js` — мобильный UX;
- `assets/mobile-modern.css` — мобильный visual layer;
- `scripts/prepare-web.mjs` — offline web bundle;
- `scripts/patch-android.mjs` — Android-native bridge;
- `scripts/regression.mjs` — статический regression;
- `tests/ui-v17.spec.mjs` — Playwright mobile regression;
- `version.json` — версия;
- `release-request.json` — publication gate.

### Перед commit

```bash
npm ci
npm run prepare:web
npm run qa
node --check assets/mobile-modern.js
```

Для Android-изменений также соберите debug/release APK и проверьте signer.

### Pull Request checklist

Укажите:

- что изменено;
- зачем это нужно;
- какие пользовательские сценарии затронуты;
- менялась ли medical/core logic;
- менялась ли схема данных;
- есть ли влияние на backup/restore;
- есть ли влияние на signing/update path;
- какие тесты добавлены или обновлены;
- как проверено на реальном устройстве, если это требуется.

### Документация

Если поведение пользователя изменилось, обновите соответствующую документацию:

- `README.md`;
- `docs/README.ru.md`;
- `docs/README.en.md`;
- `docs/README.uz-Latn.md`;
- `CHANGELOG.md`;
- `SECURITY.md`, если изменение связано с безопасностью или приватностью.

### Безопасность

Не публикуйте:

- production signing keys;
- токены;
- пароли;
- private API credentials;
- реальные медицинские данные пользователей.

### Лицензия вкладов

Проект распространяется по **Apache License 2.0**. Если вы намеренно отправляете contribution для включения в проект, он принимается на условиях этой лицензии, если явно не согласовано иное.

---

## 🇬🇧 English

Thanks for your interest in BP Diary.

### Workflow

1. Do not work directly on `main`.
2. Create a dedicated branch from the current `main`.
3. Make the change and run local checks.
4. Push the branch to GitHub.
5. Wait for the required checks:
   - `build-apk`
   - `mobile-ui`
6. Integrate only after both checks are green.

A Pull Request is preferred for external contributors.

### Areas that must not change accidentally

Do not change these without an explicit decision and dedicated review:

- medical/core calculations;
- SCORE2;
- report formulas;
- patient/data schema;
- Package ID `com.tokhirjonyuldoshev.bpdiary`;
- signing lineage;
- release-gate behavior;
- existing user data and upgrade path.

If a change really needs to touch one of these areas, make that explicit in the PR.

### Where to work

- `source/index.html` — primary application/core;
- `assets/mobile-modern.js` — mobile UX;
- `assets/mobile-modern.css` — mobile visual layer;
- `scripts/prepare-web.mjs` — offline web bundle;
- `scripts/patch-android.mjs` — Android-native bridge;
- `scripts/regression.mjs` — static regression;
- `tests/ui-v17.spec.mjs` — Playwright mobile regression;
- `version.json` — version metadata;
- `release-request.json` — publication gate.

### Before committing

```bash
npm ci
npm run prepare:web
npm run qa
node --check assets/mobile-modern.js
```

For Android changes, also build debug/release APKs and verify their signer.

### Pull Request checklist

Describe:

- what changed;
- why;
- affected user flows;
- whether medical/core logic changed;
- whether the data schema changed;
- impact on backup/restore;
- impact on signing/update path;
- tests added or updated;
- real-device verification when required.

### Documentation

If user-facing behavior changes, update the relevant documentation:

- `README.md`;
- `docs/README.ru.md`;
- `docs/README.en.md`;
- `docs/README.uz-Latn.md`;
- `CHANGELOG.md`;
- `SECURITY.md` for security/privacy changes.

### Security

Never commit:

- production signing keys;
- tokens;
- passwords;
- private API credentials;
- real user medical data.

### Contribution license

The project is licensed under **Apache License 2.0**. Unless explicitly agreed otherwise, intentional contributions submitted for inclusion in the project are accepted under the same license.

---

## 🇺🇿 O‘zbekcha (Lotin)

BP Diary loyihasiga qiziqish bildirganingiz uchun rahmat.

### Ish jarayoni

1. Bevosita `main` branchda ishlamang.
2. Amaldagi `main` dan alohida branch yarating.
3. O‘zgarishni kiriting va lokal tekshiruvlarni bajaring.
4. Branchni GitHub’ga yuboring.
5. Majburiy checks yakunlanishini kuting:
   - `build-apk`
   - `mobile-ui`
6. Faqat ikkala check ham yashil bo‘lgandan keyin o‘zgarishni himoyalangan `main` ga qo‘shing.

Tashqi contributorlar uchun Pull Request tavsiya etiladi.

### Tasodifan o‘zgartirilmasligi kerak bo‘lgan qismlar

Alohida qaror va maxsus review bo‘lmasa, quyidagilarni o‘zgartirmang:

- medical/core hisob-kitoblar;
- SCORE2;
- hisobot formulalari;
- patient/data schema;
- Package ID `com.tokhirjonyuldoshev.bpdiary`;
- signing lineage;
- release gate ishlashi;
- mavjud foydalanuvchi ma’lumotlari va upgrade path.

Agar o‘zgarish shu qismlardan biriga tegishi kerak bo‘lsa, PR ichida buni aniq yozing.

### Qayerda ishlash kerak

- `source/index.html` — asosiy ilova/core;
- `assets/mobile-modern.js` — mobil UX;
- `assets/mobile-modern.css` — mobil visual layer;
- `scripts/prepare-web.mjs` — offline web bundle;
- `scripts/patch-android.mjs` — Android-native bridge;
- `scripts/regression.mjs` — statik regression;
- `tests/ui-v17.spec.mjs` — Playwright mobile regression;
- `version.json` — versiya metadata;
- `release-request.json` — publication gate.

### Commitdan oldin

```bash
npm ci
npm run prepare:web
npm run qa
node --check assets/mobile-modern.js
```

Android o‘zgarishlari uchun debug/release APK’larni ham yig‘ing va signer’ni tekshiring.

### Pull Request checklist

Quyidagilarni yozing:

- nima o‘zgardi;
- nima uchun kerak;
- qaysi foydalanuvchi ssenariylari ta’sirlandi;
- medical/core logic o‘zgardimi;
- data schema o‘zgardimi;
- backup/restore ga ta’siri;
- signing/update path ga ta’siri;
- qaysi testlar qo‘shildi yoki yangilandi;
- zarur bo‘lsa real qurilmada qanday tekshirildi.

### Hujjatlar

Foydalanuvchiga ko‘rinadigan xatti-harakat o‘zgarsa, tegishli hujjatlarni yangilang:

- `README.md`;
- `docs/README.ru.md`;
- `docs/README.en.md`;
- `docs/README.uz-Latn.md`;
- `CHANGELOG.md`;
- xavfsizlik/maxfiylik o‘zgarishlari uchun `SECURITY.md`.

### Xavfsizlik

Quyidagilarni Git’ga joylamang:

- production signing keys;
- tokenlar;
- parollar;
- private API credentials;
- haqiqiy foydalanuvchi tibbiy ma’lumotlari.

### Contribution litsenziyasi

Loyiha **Apache License 2.0** asosida tarqatiladi. Alohida kelishuv bo‘lmasa, loyihaga qo‘shish uchun ataylab yuborilgan contribution shu litsenziya shartlari asosida qabul qilinadi.

---

Copyright © 2026 Tokhirjon Yuldoshev · [Apache-2.0](LICENSE)
