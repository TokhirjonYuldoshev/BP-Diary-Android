# BP Diary 5.8.0 — V18 Secure Signing & Supply Chain

## Русский

- Новая приватная production-подпись Android; ключ отделён от обычного CI и хранится в защищённом GitHub Environment.
- Проверка сертификата APK, защита от перезаписи существующего релиза, проверки зависимостей, CodeQL и контроль целостности SheetJS.
- jsPDF обновлён до 4.2.1; сохранение, печать и отправка PDF проверены на устройстве.
- Исправлено исчезновение окна пароля защищённого бэкапа и восстановления в Android WebView.
- Все проверки versionCode 181 на реальном устройстве подтверждены владельцем 01.10.2026.

### Переход с V17

Подпись V18 отличается от V17: старый ключ был доступен в публичной истории проекта и больше не используется для production. Перед удалением V17 создайте Full Backup и проверьте сохранённый файл. Затем удалите V17, установите V18 и восстановите данные. Для защищённого бэкапа потребуется ваш пароль.

Если уже установлен V18 с новой подписью, обновление устанавливается поверх него без удаления приложения.

Медицинские/core-расчёты, SCORE2, формулы отчёта, схема данных и package ID `com.tokhirjonyuldoshev.bpdiary` сохранены. RU / EN / UZ, напоминания, App Lock и обычные резервные копии поддерживаются.

## English

- New private Android production signer, isolated from ordinary CI in a protected GitHub Environment.
- APK certificate verification, release overwrite prevention, dependency audits, CodeQL and pinned SheetJS integrity.
- jsPDF updated to 4.2.1; PDF Save / Print / Share accepted on a real device.
- Fixed disappearing protected-backup and restore password dialogs in Android WebView.
- The owner accepted all versionCode 181 real-device checks on 2026-10-01.

### Migration from V17

V18 uses a new signing certificate because the old V17 key was exposed in public repository history. Create and verify a Full Backup before uninstalling V17. Then uninstall V17, install V18 and restore the backup. Encrypted backups require their original password. Existing V18 installations using the new signer can update in place.

Medical/core calculations, SCORE2, report formulas, data schema and package ID remain unchanged. RU / EN / UZ and existing reminders, privacy and backup features are preserved.

## Known build-tooling findings

The full toolchain audit continues to report upstream build-time findings through `@capacitor/assets 3.0.5`; they remain tracked. Runtime high/critical vulnerabilities are blocking checks.
