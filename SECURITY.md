# Security / Безопасность / Xavfsizlik

[🇷🇺 Русский](#-русский) · [🇬🇧 English](#-english) · [🇺🇿 O‘zbekcha](#-ozbekcha-lotin)

Supported stable line: **BP Diary 5.8.x / V18**

---

## 🇷🇺 Русский

### Сообщение об уязвимости

Для обычных UI/functional bugs используйте GitHub Issues.

Если проблема может:

- раскрывать данные пользователя;
- нарушать целостность backup/restore;
- обходить App Lock или Screen Privacy;
- позволять подмену APK;
- раскрывать секреты/ключи;
- влиять на update/release path;

не публикуйте exploit details, реальные медицинские данные, токены или другие чувствительные материалы в публичном Issue.

Если в репозитории доступен private vulnerability reporting, используйте его. Иначе свяжитесь с владельцем репозитория приватным способом через GitHub и сначала передайте минимальное описание без чувствительных данных.

### Локальные данные

BP Diary хранит дневник и профиль локально в области приложения/WebView.

- обычная работа приложения не отправляет записи дневника в GitHub;
- автоматические локальные backups остаются на устройстве;
- reminder preferences содержат только параметры расписания/уведомления;
- экспорт или Share выполняется только по действию пользователя;
- перед uninstall или переносом устройства рекомендуется создать Full Backup.

Не прикладывайте реальные медицинские данные к публичным bug reports.

### Проверка обновлений

Проверка обновлений выполняет сетевой запрос только после явного действия пользователя.

Запрос направляется к официальному GitHub Releases API этого репозитория.

BP Diary не выполняет скрытую загрузку или автоматическую установку APK.

### Protected Backup

Защищённый Full Backup использует:

- PBKDF2-SHA-256;
- 310 000 итераций;
- случайную 16-байтовую соль;
- AES-GCM-256;
- случайный 12-байтовый IV;
- authenticated decryption.

Пароль защищённого бэкапа BP Diary не сохраняет.

Неверный пароль или изменённый ciphertext отклоняется до замены текущих данных приложения.

Если пароль потерян, приложение не может восстановить или обойти его.

### App Lock и Screen Privacy

App Lock использует системную Android-аутентификацию: biometric и/или device credential в зависимости от устройства.

Screen Privacy использует Android `FLAG_SECURE`.

Эти функции повышают приватность интерфейса, но не заменяют:

- шифрование всего устройства;
- безопасный PIN/пароль Android;
- физическую защиту устройства;
- полноценную модель защиты от root/compromised OS.

### APK integrity

Устанавливайте APK из официального GitHub Release.

Текущий stable asset:

```text
BP-Diary-5.8.1-V18.apk
SHA-256:
38b1e92307df61915ff85edc8e447688f4f36010ec39c6e01178a9f5796b1301
```

Официальный Release:
https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.1

### Signing

V18 использует новый приватный production-сертификат:

`a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`

Signing secrets доступны только release workflow через `production-signing`, разрешённую ветку `main`. Старый V17 signer скомпрометирован публичной историей и больше не используется. Переход с V17: backup → uninstall → install V18 → restore. Для V18 5.8.x in-place update не считается гарантированным до закрытия Issue #18: на одном реальном устройстве официальный 5.8.1 был отклонён при установке поверх существующей V18. Перед uninstall/reinstall сначала создайте и проверьте Full Backup.

### Медицинские данные

Репозиторий публичный. Никогда не публикуйте в Issues, PR, Actions logs или test fixtures:

- ФИО пациента;
- реальные показатели, если они позволяют идентифицировать человека;
- медицинские документы;
- адреса, телефоны, даты рождения;
- экспортированные пользовательские backups.

---

## 🇬🇧 English

### Reporting a vulnerability

Use GitHub Issues for ordinary UI and functional bugs.

If a problem could:

- expose user data;
- compromise backup/restore integrity;
- bypass App Lock or Screen Privacy;
- enable APK substitution;
- expose secrets or keys;
- affect the update/release path;

do not publish exploit details, real medical data, tokens or other sensitive material in a public Issue.

If private vulnerability reporting is available for the repository, use it. Otherwise contact the repository owner privately through GitHub first and share only the minimum non-sensitive description needed to establish contact.

### Local data

BP Diary keeps diary and profile data locally in the app/WebView storage area.

- normal application use does not upload diary records to GitHub;
- automatic local backups remain on the device;
- reminder preferences contain schedule/notification configuration only;
- export and Share actions happen only after user action;
- create a Full Backup before uninstalling or migrating devices.

Never attach real medical data to public bug reports.

### Update checking

The update checker performs a network request only after an explicit user action.

It targets the official GitHub Releases API for this repository.

BP Diary does not silently download or automatically install APK updates.

### Protected Backup

Protected Full Backup uses:

- PBKDF2-SHA-256;
- 310,000 iterations;
- random 16-byte salt;
- AES-GCM-256;
- random 12-byte IV;
- authenticated decryption.

BP Diary does not persist the protected-backup password.

A wrong password or modified ciphertext is rejected before current application data are replaced.

If the password is lost, the application cannot recover or bypass it.

### App Lock and Screen Privacy

App Lock uses system Android authentication: biometric and/or device credential depending on the device.

Screen Privacy uses Android `FLAG_SECURE`.

These features improve interface privacy but do not replace:

- full-device encryption;
- a strong Android PIN/password;
- physical device security;
- protection against a rooted or compromised operating system.

### APK integrity

Install APKs from the official GitHub Release.

Current stable asset:

```text
BP-Diary-5.8.1-V18.apk
SHA-256:
38b1e92307df61915ff85edc8e447688f4f36010ec39c6e01178a9f5796b1301
```

Official Release:
https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.1

### Signing

V18 uses a new private production certificate:

`a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`

Signing secrets are isolated in `production-signing`, restricted to `main`. The exposed legacy V17 signer is compromised and is no longer used. V17 migration: backup → uninstall → install V18 → restore. For V18 5.8.x, in-place update is not treated as guaranteed until Issue #18 is resolved: one real device rejected the official 5.8.1 APK over an existing V18 installation. Create and verify a Full Backup before any uninstall/reinstall path.

### Medical data

This repository is public. Never place the following in Issues, PRs, Actions logs or test fixtures:

- patient names;
- identifiable real measurements;
- medical documents;
- addresses, phone numbers or dates of birth;
- exported user backups.

---

## 🇺🇿 O‘zbekcha (Lotin)

### Xavfsizlik muammosini xabar qilish

Oddiy UI va funksional xatolar uchun GitHub Issues’dan foydalaning.

Agar muammo:

- foydalanuvchi ma’lumotlarini oshkor qilishi;
- backup/restore yaxlitligini buzishi;
- App Lock yoki Screen Privacy’ni chetlab o‘tishi;
- APK almashtirishga imkon berishi;
- secret yoki key’larni oshkor qilishi;
- update/release jarayoniga ta’sir qilishi mumkin bo‘lsa;

exploit tafsilotlari, haqiqiy tibbiy ma’lumotlar, tokenlar yoki boshqa maxfiy ma’lumotlarni public Issue’da yozmang.

Agar repository private vulnerability reporting’ni qo‘llab-quvvatlasa, undan foydalaning. Aks holda repository egasi bilan GitHub orqali avval shaxsiy aloqa o‘rnating va birinchi xabarda faqat minimal, maxfiy bo‘lmagan ma’lumotni yuboring.

### Lokal ma’lumotlar

BP Diary kundalik va profil ma’lumotlarini ilova/WebView storage hududida lokal saqlaydi.

- ilovaning oddiy ishlashi kundalik yozuvlarini GitHub’ga yubormaydi;
- avtomatik lokal zaxira nusxalar qurilmada qoladi;
- reminder preferences faqat jadval/bildirishnoma sozlamalarini saqlaydi;
- eksport va Share faqat foydalanuvchi amali bilan bajariladi;
- uninstall yoki qurilma ko‘chirishdan oldin Full Backup yarating.

Public bug report’ga haqiqiy tibbiy ma’lumotlarni biriktirmang.

### Yangilanishni tekshirish

Yangilanishni tekshirish faqat foydalanuvchi aniq amal bajargandan keyin tarmoq so‘rovini yuboradi.

So‘rov ushbu repository’ning rasmiy GitHub Releases API’iga yuboriladi.

BP Diary APK’ni yashirincha yuklab olmaydi va avtomatik o‘rnatmaydi.

### Himoyalangan Backup

Protected Full Backup quyidagilarni ishlatadi:

- PBKDF2-SHA-256;
- 310 000 iteratsiya;
- tasodifiy 16 baytli salt;
- AES-GCM-256;
- tasodifiy 12 baytli IV;
- authenticated decryption.

BP Diary himoyalangan zaxira parolini saqlamaydi.

Noto‘g‘ri parol yoki o‘zgartirilgan ciphertext joriy ilova ma’lumotlari almashtirilishidan oldin rad etiladi.

Parol yo‘qolsa, ilova uni tiklay olmaydi yoki chetlab o‘ta olmaydi.

### App Lock va Screen Privacy

App Lock qurilmaga qarab Android tizim biometric va/yoki device credential autentifikatsiyasidan foydalanadi.

Screen Privacy Android `FLAG_SECURE` dan foydalanadi.

Bu funksiyalar interfeys maxfiyligini oshiradi, ammo quyidagilarni almashtirmaydi:

- butun qurilma shifrlanishi;
- kuchli Android PIN/parol;
- qurilmaning jismoniy himoyasi;
- root qilingan yoki buzilgan operatsion tizimdan himoya.

### APK yaxlitligi

APK’ni rasmiy GitHub Release’dan o‘rnating.

Joriy stable asset:

```text
BP-Diary-5.8.1-V18.apk
SHA-256:
38b1e92307df61915ff85edc8e447688f4f36010ec39c6e01178a9f5796b1301
```

Rasmiy Release:
https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.1

### Signing

V18 yangi private production certificate’dan foydalanadi:

`a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`

Signing secrets `production-signing` ichida, faqat `main` uchun saqlanadi. Eski V17 signer public tarixda oshkor bo‘lgan va endi ishlatilmaydi. V17’dan o‘tish: backup → uninstall → install V18 → restore. V18 5.8.x uchun in-place update Issue #18 yopilmaguncha kafolatlangan deb hisoblanmaydi: bitta haqiqiy qurilmada rasmiy 5.8.1 mavjud V18 ustiga o‘rnatilmadi. Uninstall/reinstall oldidan Full Backup yarating va tekshiring.

### Tibbiy ma’lumotlar

Bu repository public. Issues, PR, Actions logs yoki test fixtures ichiga quyidagilarni joylamang:

- bemor F.I.Sh.;
- odamni aniqlash mumkin bo‘lgan haqiqiy o‘lchovlar;
- tibbiy hujjatlar;
- manzil, telefon raqami yoki tug‘ilgan sana;
- eksport qilingan foydalanuvchi backup’lari.

---

Copyright © 2026 Tokhirjon Yuldoshev · [Apache-2.0](LICENSE)
