## Summary / Кратко

Describe what changed and why.
Опишите, что изменено и зачем.

## Scope / Область

- [ ] UI / UX
- [ ] Archive / Архив
- [ ] Analytics / Аналитика
- [ ] Reports / PDF
- [ ] Backup / Restore
- [ ] Android native bridge
- [ ] Build / CI / Repository
- [ ] Core / medical logic

## Safety / Безопасность изменений

- [ ] Package ID remains `com.tokhirjonyuldoshev.bpdiary`
- [ ] Existing user data/update path is preserved
- [ ] No production secrets or personal medical data were committed
- [ ] No new runtime CDN dependency was added

If core/medical logic changed, explain the exact reason and validation below.
Если менялась medical/core-логика, обязательно объясните причину и проверку ниже.

## Validation / Проверка

- [ ] `npm run prepare:web`
- [ ] `npm run qa`
- [ ] `node --check assets/mobile-modern.js`
- [ ] Android debug build
- [ ] Android release build
- [ ] APK signer verification
- [ ] Relevant device regression completed

## Notes / Примечания

Add screenshots, migration notes or compatibility details here.
Не прикладывайте реальные медицинские данные или секреты.
