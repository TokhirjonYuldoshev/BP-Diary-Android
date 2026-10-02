# BP Diary 5.8.2 — V18 Maintenance Candidate

## Русский

BP Diary 5.8.2 — maintenance-кандидат линии V18. Он исправляет проблемы интерфейса и теста напоминаний, замеченные владельцем на реальном устройстве, и усиливает безопасное тестирование APK. Medical/core-логика, SCORE2, формулы отчётов, схема данных и production package ID не меняются.

### Исправления

- Повторные быстрые нажатия больше не создают стопку одинаковых информационных toast/snackbar.
- Кнопка «Проверить звук» блокирует параллельные повторные нажатия до завершения текущего native-вызова.
- Перед новым тестовым Android-уведомлением предыдущий test notification отменяется, чтобы новый тест запускался как отдельный alert.
- Если Android notifications запрещены, тестовый broadcast не отправляется; UI показывает одно понятное сообщение.
- Окно «Автоматические копии» получило явную кнопку закрытия и покрыто UI regression test.

### Усиление процесса сборки

- CI/debug APK получает отдельный package ID `com.tokhirjonyuldoshev.bpdiary.debug`.
- Debug-приложение называется **BP Diary Dev** и может быть установлено рядом с production BP Diary.
- Release APK сохраняет production package ID `com.tokhirjonyuldoshev.bpdiary`.
- Production release workflow перед публикацией сравнивает новый подписанный APK с предыдущим stable release: package ID, versionCode и signing certificate должны быть совместимы.
- Publication gate остаётся `false` до отдельного device acceptance и отдельного разрешения владельца.

### Связанные вопросы

Issue #18 по отказу установки официального 5.8.1 поверх существующей установки остаётся открытым до проверки фактически установленного APK на устройстве. Разделение debug package ID предотвращает повторение ситуации, когда тестовая сборка может занять production package slot.

## English

BP Diary 5.8.2 is a V18 maintenance candidate. It fixes UI/reminder-test issues reported by the owner on a real device and hardens APK testing. Medical/core calculations, SCORE2, report formulas, the data schema, and the production package ID remain unchanged.

### Fixes

- Rapid repeated actions no longer stack identical informational toast/snackbar messages.
- The Test sound button blocks concurrent taps until the current native request completes.
- The previous Android test notification is cancelled before a new test alert is triggered.
- If Android notifications are not allowed, the test broadcast is not sent and the UI shows a single clear message.
- The Automatic backups sheet now has an explicit close control and dedicated UI regression coverage.

### Build hardening

- CI/debug APK uses the isolated package ID `com.tokhirjonyuldoshev.bpdiary.debug`.
- The debug app is labeled **BP Diary Dev** and can coexist with the production app.
- Release APK retains `com.tokhirjonyuldoshev.bpdiary`.
- The production release workflow compares the newly signed APK with the previous stable release before publication: package ID, versionCode, and signing certificate must remain upgrade-compatible.
- The publication gate remains `false` until separate owner device acceptance and explicit publication authorization.

Issue #18 remains open until the exact APK currently installed on the affected device is identified.
