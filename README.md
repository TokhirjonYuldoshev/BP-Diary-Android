<div align="center">

<img src="assets/logo.svg" alt="BP Diary" width="104">

# BP Diary

**Дневник артериального давления для Android**

Локальное хранение данных, повторные замеры, аналитика, гибкие напоминания, защищённые резервные копии и отчёты для врача.

[![Release](https://img.shields.io/badge/Stable-V18%20%2F%205.8.0-2f6feb?style=flat-square)](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.0)
[![Android](https://img.shields.io/badge/Android-Build%20passing-3DDC84?style=flat-square&logo=android&logoColor=white)](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/build-android.yml)
[![UI Regression](https://img.shields.io/badge/UI%20Regression-passing-2ea44f?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/actions/workflows/ui-regression.yml)
[![License](https://img.shields.io/badge/License-Apache--2.0-d22128?style=flat-square&logo=apache&logoColor=white)](LICENSE)

**Русский** · [English](docs/README.en.md) · [O‘zbekcha (Lotin)](docs/README.uz-Latn.md)

[Скачать стабильную версию](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.0) ·
[Что нового](RELEASE_NOTES.md) ·
[Безопасность](SECURITY.md) ·
[Участие в разработке](CONTRIBUTING.md)

</div>

---

## О приложении

**BP Diary V18 / 5.8.0** помогает вести структурированный дневник артериального давления на Android и готовить данные для обсуждения с врачом.

Приложение работает по принципу **local-first**: записи дневника и профиль остаются на устройстве, пока пользователь сам не экспортирует, не создаёт отчёт или не делится данными.

| Возможность | Что доступно |
|---|---|
| **Замеры** | До 3 повторных измерений в одном сеансе, левая/правая рука, САД, ДАД, пульс, проверка ввода |
| **Архив и аналитика** | Поиск, периоды, сортировка, графики, сводные показатели |
| **Напоминания** | До 3 времён в день, 1–3 сигнала, интервалы, 3 системных звука, вибрация |
| **Отчёт врачу** | Предпросмотр, A4 landscape, Save PDF, Print, Share |
| **Резервные копии** | Обычный JSON backup и защищённый backup с паролем |
| **Приватность** | App Lock, системная Android-аутентификация, Screen Privacy |
| **Языки** | Русский, English, O‘zbekcha (Lotin) |
| **Интерфейс** | Светлая/тёмная темы, мобильная навигация, Android-native flows |

## Стабильная версия

Текущий официальный релиз:

**BP Diary V18 / 5.8.0**  
`versionCode 181`

[Открыть официальный GitHub Release](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.0)

Официальный APK:

```text
BP-Diary-5.8-V18.apk
```

SHA-256:

```text
802b608d2828c4513be644cdbb4287bf922dadec4fe3a6469378ee5c50c3d15c
```

Проверка на Linux/macOS:

```bash
sha256sum BP-Diary-5.8-V18.apk
```

V18 сохраняет Package ID, но использует новую приватную подпись. Для перехода с V17: создайте и проверьте Full Backup, удалите V17, установите V18 и восстановите данные. Уже установленный V18 с новой подписью обновляется без удаления приложения.

Перед uninstall или переносом на другое устройство рекомендуется создать Full Backup.

## Напоминания

BP Diary поддерживает полноценное расписание измерений:

- до 3 времён в день;
- 1, 2 или 3 сигнала;
- повтор через 5, 10, 15 или 30 минут;
- 3 системных Android-звука;
- вибрация;
- тест сигнала;
- действие **«Измерено»**;
- действие **«Напомнить позже»**.

Расписание восстанавливается после перезагрузки устройства и после изменения времени или часового пояса.

## Отчёты

Мобильный отчёт формируется в **A4 landscape** и рассчитан на удобное чтение на ПК или при печати.

В отчёте доступны:

- сводные показатели;
- профиль и контекст;
- полная таблица измерений;
- выбранный период;
- Print;
- Save PDF;
- Share PDF.

Мобильный export не изменяет medical/core-расчёты отчёта.

## Приватность и резервные копии

### App Lock

Используется системная Android-аутентификация: biometric и/или device credential в зависимости от устройства.

### Screen Privacy

При включении используется Android `FLAG_SECURE`, чтобы ограничить обычные screenshots и превью приложения в Recent Apps.

### Protected Backup

Защищённый Full Backup использует:

- PBKDF2-SHA-256;
- 310 000 итераций;
- случайную 16-байтовую соль;
- AES-GCM-256;
- случайный 12-байтовый IV;
- authenticated decryption.

Пароль защищённого бэкапа BP Diary не сохраняет.

Подробнее: [SECURITY.md](SECURITY.md).

## Архитектура репозитория

Основные исходники:

```text
source/index.html
assets/mobile-modern.js
assets/mobile-modern.css
scripts/prepare-web.mjs
scripts/patch-android.mjs
scripts/regression.mjs
tests/ui-v18.spec.mjs
version.json
release-request.json
```

| Файл | Назначение |
|---|---|
| `source/index.html` | Основное приложение и core |
| `assets/mobile-modern.js` | Мобильный UX |
| `assets/mobile-modern.css` | Мобильный visual layer |
| `scripts/prepare-web.mjs` | Подготовка offline web bundle |
| `scripts/patch-android.mjs` | Android-native bridge |
| `scripts/regression.mjs` | Статический regression |
| `tests/ui-v18.spec.mjs` | Playwright mobile regression |
| `version.json` | Источник версии |
| `release-request.json` | Publication gate |

Сгенерированные `www/`, `android/` и `node_modules/` не являются primary source и не хранятся в Git.

Подробнее: [ARCHITECTURE.md](ARCHITECTURE.md).

## Разработка и QA

`main` защищён repository ruleset.

Перед интеграцией commit в `main` обязательны два GitHub Actions check:

```text
build-apk
mobile-ui
```

Рекомендуемый процесс:

```text
рабочая ветка
    |
    +-- build-apk
    |
    +-- mobile-ui
    |
    v
protected main
```

Для внешних contributors предпочтителен Pull Request.

Инструкции: [CONTRIBUTING.md](CONTRIBUTING.md).

## Release gate

Обычное состояние:

```json
{
  "publish": false
}
```

Публикация официального релиза открывается только отдельным намеренным release-коммитом и после проверки снова закрывается.

## Документация

| Раздел | Ссылка |
|---|---|
| Русский | [docs/README.ru.md](docs/README.ru.md) |
| English | [docs/README.en.md](docs/README.en.md) |
| O‘zbekcha (Lotin) | [docs/README.uz-Latn.md](docs/README.uz-Latn.md) |
| Архитектура | [ARCHITECTURE.md](ARCHITECTURE.md) |
| История изменений | [CHANGELOG.md](CHANGELOG.md) |
| Release notes | [RELEASE_NOTES.md](RELEASE_NOTES.md) |
| QA V18 | [QA_V18.md](QA_V18.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Security | [SECURITY.md](SECURITY.md) |
| License | [Apache-2.0](LICENSE) |

История прошлых версий хранится в [CHANGELOG.md](CHANGELOG.md) и [GitHub Releases](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases), а главный README описывает только текущую стабильную версию.

## Медицинское назначение

BP Diary предназначен для ведения записей и подготовки информации для обсуждения со специалистом.

Приложение:

- не ставит диагноз;
- не назначает лечение;
- не заменяет врача;
- не должно использоваться как единственный источник решения в экстренной ситуации.

## Лицензия

Copyright © 2026 **Tokhirjon Yuldoshev**.

Проект распространяется по лицензии **Apache License 2.0**.

[Полный текст лицензии](LICENSE)

---

<div align="center">

**BP Diary V18 / 5.8.0**

[Release](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.8.0) ·
[Issues](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues) ·
[Contributing](CONTRIBUTING.md) ·
[Security](SECURITY.md) ·
[License](LICENSE)

</div>
