# BP Diary 5.7.0 — V17 Reminders, Reports, Privacy & Localization

## 🇷🇺 Что нового

V17 заметно расширяет Android-версию BP Diary, не меняя medical/core-расчёты дневника, SCORE2, формулы отчёта или существующую схему данных.

### Напоминания
- до **3 времён измерения в день**;
- **1 / 2 / 3 сигнала** на одно напоминание;
- интервалы повтора **5 / 10 / 15 / 30 минут**;
- **3 системные мелодии Android**;
- включаемая/выключаемая вибрация;
- кнопка проверки звука;
- действия уведомления **«Измерено»** и **«Напомнить позже»**;
- восстановление расписания после перезагрузки, изменения времени/часового пояса и обновления приложения.

### Замеры и локализация
- добавлен **узбекский язык (Latin)** вместе с RU/EN;
- исправлены мобильные UZ-строки, включая `Barchasi / 7 kun / 30 kun / 90 kun`;
- для новых/редактируемых замеров добавлена проверка ввода: SYS 60–260, DIA 40–160, пульс 30–220 при заполнении и SYS > DIA;
- существующие исторические записи эта новая проверка не переписывает;
- предупреждение перед сохранением экстремального, но допустимого замера сохранено.

### Отчёт врачу
- мобильный **Save PDF / Print / Share** теперь использует **A4 Landscape**, как ПК-версия;
- в отчёте сохраняются сводные показатели, профиль/контекст и полная таблица измерений;
- расчёты отчёта не изменены.

### Руководство
- полноценное руководство **RU / EN / UZ** внутри приложения;
- объясняются САД/SYS, ДАД/DIA, пульс, Замер 1–3, Архив, Аналитика, отчёты, напоминания и резервные копии.

### Приватность и резервные копии
- системная блокировка приложения через Android biometric/device credential;
- повторная блокировка после **10 секунд** в фоне и сразу после блокировки экрана;
- опциональный Android `FLAG_SECURE` для защиты скриншотов и Recent Apps;
- защищённый Full Backup с PBKDF2-SHA-256 (310 000 итераций) и AES-GCM-256;
- пароль защищённого бэкапа BP Diary не сохраняет;
- неверный пароль/повреждённый ciphertext отклоняется до изменения текущих данных;
- обычный JSON Full Backup остаётся доступным.

### Совместимость
- Package ID: `com.tokhirjonyuldoshev.bpdiary`;
- сохранён существующий direct-distribution update signer;
- V17 устанавливается поверх официального V16 без удаления приложения при сохранении той же signing lineage;
- blood-pressure calculations, session averages, SCORE2, target range, report formulas and patient/data schema intentionally remain unchanged.

> Если пароль от защищённого бэкапа потерян, BP Diary не может восстановить или обойти его.

## 🇬🇧 What’s new

V17 substantially expands BP Diary on Android without changing the diary’s medical/core calculations, SCORE2 logic, report formulas or existing data schema.

### Reminders
- up to **3 measurement times per day**;
- **1 / 2 / 3 alerts** per reminder;
- repeat intervals of **5 / 10 / 15 / 30 minutes**;
- **3 Android system sound choices**;
- optional vibration;
- test-sound control;
- notification actions for **Done** and **Remind later**;
- schedule restoration after reboot, time/timezone changes and application updates.

### Measurements and localization
- **Uzbek (Latin)** joins Russian and English;
- mobile UZ strings were completed, including `Barchasi / 7 kun / 30 kun / 90 kun`;
- new/edited reading input now uses guardrails: SYS 60–260, DIA 40–160, optional pulse 30–220, and SYS > DIA;
- existing historical records are not rewritten by these entry checks;
- the pre-save safety warning remains for accepted extreme readings.

### Doctor report
- mobile **Save PDF / Print / Share** now uses **A4 landscape**, matching the desktop-style report;
- summary metrics, patient/context information and the full measurement table are preserved;
- report calculations are unchanged.

### User guide
- full in-app **RU / EN / UZ user guide**;
- explains SYS/DIA/pulse, readings 1–3, Archive, Analytics, reports, reminders and backups.

### Privacy and backups
- system Android App Lock using biometric and/or device credential;
- automatic re-lock after **10 seconds** in background and immediately after physical screen lock;
- optional Android `FLAG_SECURE` for screenshots and Recent Apps previews;
- password-protected Full Backup using PBKDF2-SHA-256 (310,000 iterations) and AES-GCM-256;
- BP Diary never stores the protected-backup password;
- wrong password/corrupted ciphertext is rejected before current data change;
- plain JSON Full Backup remains available.

### Compatibility
- Package ID: `com.tokhirjonyuldoshev.bpdiary`;
- existing direct-distribution update signer is preserved;
- V17 can install over official V16 without uninstalling when the signing lineage matches;
- blood-pressure calculations, session averages, SCORE2, target range, report formulas and patient/data schema intentionally remain unchanged.

> If the protected-backup password is lost, BP Diary cannot recover or bypass it.
