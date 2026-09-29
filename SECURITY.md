# Security / Безопасность

## Русский

### Сообщение об уязвимости

Если проблема может раскрывать пользовательские данные, нарушать целостность backup/restore, позволять подмену APK или затрагивать другие security-sensitive сценарии, не публикуйте чувствительные данные в issue.

Для обычных ошибок интерфейса и функциональности используйте GitHub Issues.

### Данные пользователя

BP Diary хранит данные дневника локально в области приложения/WebView. Автоматические резервные копии также локальные.

- не прикладывайте реальные медицинские данные к публичным bug reports;
- перед uninstall/device migration делайте Full Backup;
- проверяйте источник APK и SHA-256 при ручном распространении.

### Signing key

В V8–V15 для direct-distribution update path использовался стабильный ключ, который присутствовал в истории публичного репозитория.

Следствие: этот ключ подходит для совместимости существующих тестовых установок, но **не должен считаться безопасным production signing key**.

Для Google Play или другого production channel:

1. создайте новый приватный ключ;
2. не храните его в Git;
3. используйте GitHub Actions Secrets / secure CI secret storage;
4. предпочтительно используйте Google Play App Signing;
5. публикуйте AAB, если это соответствует каналу распространения.

Смена ключа ломает прямое обновление существующих APK с другой signing lineage, поэтому такую миграцию необходимо планировать отдельно.

---

## V16 privacy notes

- Native reminders store only reminder configuration (enabled/time/title/body) in Android app preferences.
- Reminder notifications do not upload diary measurements.
- The update checker performs a network request **only when the user explicitly taps “Check for updates”**.
- That request goes to the official GitHub Releases API for this repository.
- BP Diary does not silently download or install APK updates.
- Existing diary measurements, backups and medical/profile data remain local unless the user explicitly exports or shares them.

## English

### Reporting a vulnerability

If an issue could expose user data, compromise backup/restore integrity, enable APK substitution, or otherwise affect a security-sensitive flow, do not place sensitive details in a public issue.

Use GitHub Issues for ordinary UI and functional bugs.

### User data

BP Diary stores diary data locally in the app/WebView area. Automatic backups are local as well.

- never attach real medical data to public bug reports;
- create a Full Backup before uninstalling or migrating devices;
- verify APK source and SHA-256 when distributing manually.

### Signing key

The V8–V15 direct-distribution update path used a stable key that has existed in the public repository history.

As a result, it preserves compatibility with existing test installations but **must not be treated as a secure production signing key**.

For Google Play or another production channel:

1. create a new private key;
2. never commit it to Git;
3. store it in GitHub Actions Secrets or equivalent secure CI storage;
4. prefer Google Play App Signing;
5. publish an AAB when appropriate.

Changing the signing lineage breaks direct upgrades from APKs signed by a different key, so such a migration must be planned explicitly.


## V16 privacy notes — English

- Native reminders store only reminder configuration (enabled/time/title/body) in Android app preferences.
- Reminder notifications do not upload diary measurements.
- The update checker makes a network request **only after the user explicitly chooses “Check for updates”**.
- The request targets the official GitHub Releases API for this repository.
- BP Diary does not silently download or install APK updates.
- Diary measurements, backups and profile/medical data remain local unless the user explicitly exports or shares them.
