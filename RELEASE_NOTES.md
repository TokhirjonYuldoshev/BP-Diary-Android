# BP Diary 5.7.0 — V17 Privacy & Resilience

## 🇷🇺 Что нового

V17 усиливает приватность и защиту резервных копий, не меняя медицинскую/core-логику дневника.

- опциональная **биометрическая блокировка** BP Diary;
- автоматическая повторная блокировка после нахождения приложения в фоне;
- опциональная **защита экрана Android**: блокировка обычных скриншотов и содержимого превью Recent Apps;
- новый **Защищённый бэкап** с паролем;
- PBKDF2-SHA-256 (310 000 итераций) для получения ключа из пароля;
- AES-GCM-256 для аутентифицированного шифрования резервной копии;
- восстановление защищённого бэкапа с проверкой пароля/целостности;
- пароль защищённого бэкапа BP Diary не сохраняет;
- обычный JSON Full Backup остаётся доступным для совместимости;
- все функции V16 — нативные напоминания, проверка обновлений, PDF, Archive, Voice/TTS, RU/EN и light/dark — сохранены.

> Если пароль от защищённого бэкапа потерян, BP Diary не может восстановить или обойти его.

## 🇬🇧 What’s new

V17 strengthens privacy and backup protection without changing the diary’s medical/core calculations.

- optional **biometric app lock**;
- automatic re-lock after the app spends time in the background;
- optional Android **screen privacy** blocking normal screenshots and Recent Apps previews;
- password-protected **Protected Backup**;
- PBKDF2-SHA-256 with 310,000 iterations for password-based key derivation;
- AES-GCM-256 authenticated encryption;
- protected-backup restore with password/integrity verification;
- BP Diary never stores the protected-backup password;
- plain JSON Full Backup remains available for compatibility;
- V16 native reminders, update checker, PDF, Archive, Voice/TTS, RU/EN and light/dark behavior are preserved.

> If the protected-backup password is lost, BP Diary cannot recover or bypass it.
