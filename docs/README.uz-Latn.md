# 🇺🇿 BP Diary — O‘zbekcha hujjatlar (Lotin)

[← Bosh sahifa](../README.md) · [Русский](README.ru.md) · [English](README.en.md)

## Loyiha haqida

**BP Diary V17 / 5.7.0** — qon bosimi kundaligini yuritish, takroriy o‘lchovlarni saqlash, dinamikani tahlil qilish, eslatmalarni sozlash, zaxira nusxalar yaratish va shifokor uchun hisobot tayyorlashga mo‘ljallangan Android ilova.

Ilova local-first tamoyiliga asoslangan: kundalik yozuvlari va profil ma’lumotlari foydalanuvchi ularni o‘zi eksport qilmaguncha yoki ulashmaguncha qurilmada qoladi.

## Asosiy imkoniyatlar

### 🩺 O‘lchovlar

- bitta seansda 3 tagacha takroriy o‘lchov;
- SAB / DAB / puls qiymatlarini kiritish;
- chap va o‘ng qo‘l o‘lchovlarini qo‘llab-quvvatlash;
- yangi va tahrirlangan qiymatlarni saqlashdan oldin tekshirish;
- aniq noto‘g‘ri qiymatlar saqlanmaydi;
- juda yuqori yoki noodatiy, ammo qabul qilinadigan qiymatlar uchun alohida ogohlantirish saqlanadi;
- yangi validatsiya eski tarixiy yozuvlarni o‘zgartirmaydi.

### 📊 Arxiv va tahlil

- o‘lchov seanslari arxivi;
- tezkor qidiruv;
- davr bo‘yicha filtrlash;
- sana bo‘yicha saralash;
- tahrirlash va o‘chirish;
- grafiklar va umumiy ko‘rsatkichlar;
- yorug‘ va qorong‘i mavzu.

### ⏰ Eslatmalar

Quyidagilarni sozlash mumkin:

- kuniga 3 tagacha o‘lchov vaqti;
- 1 / 2 / 3 signal;
- takrorlash oralig‘i 5 / 10 / 15 / 30 daqiqa;
- 3 ta Android tizim ovozi;
- vibratsiya;
- ovozni sinab ko‘rish;
- **O‘lchandi** amali;
- **Keyinroq eslatish** amali.

Jadval qurilma qayta ishga tushirilgandan keyin ham, vaqt yoki vaqt mintaqasi o‘zgargandan keyin ham tiklanadi.

### 📄 Shifokor uchun hisobot

Mobil hisobot kompyuter uslubiga mos **A4 landscape** formatida tayyorlanadi.

Qo‘llab-quvvatlanadi:

- davrni tanlash;
- oldindan ko‘rish;
- umumiy ko‘rsatkichlar;
- profil va kontekst;
- to‘liq o‘lchov jadvali;
- Print;
- Save PDF;
- Share PDF.

Mobil eksport hisobotdagi medical/core hisob-kitoblarni o‘zgartirmaydi.

### 🔐 Maxfiylik

V17 quyidagilarni o‘z ichiga oladi:

- Android tizim App Lock;
- biometric/device credential orqali autentifikatsiya;
- fon rejimida 10 soniyadan keyin qayta qulflash;
- ekran jismonan qulflangandan keyin darhol qayta autentifikatsiya;
- Android `FLAG_SECURE` orqali Screen Privacy;
- himoya yoqilganda Recent Apps oynasida ilova mazmunini yashirish.

### 💾 Zaxira nusxalar

Ikki xil rejim mavjud.

**Oddiy Full Backup**
- JSON;
- moslik va oddiy eksport uchun.

**Himoyalangan Full Backup**
- parol BP Diary tomonidan saqlanmaydi;
- PBKDF2-SHA-256;
- 310 000 iteratsiya;
- tasodifiy 16 baytli salt;
- AES-GCM-256;
- tasodifiy 12 baytli IV;
- noto‘g‘ri parol yoki o‘zgartirilgan ciphertext joriy ma’lumotlar almashtirilishidan oldin rad etiladi.

Himoyalangan zaxira paroli yo‘qolsa, BP Diary uni tiklay olmaydi.

## 🌐 Tillar

Ilova interfeysi:

- Русский;
- English;
- O‘zbekcha — Lotin.

Tilni ilova interfeysi yoki Sozlamalar orqali almashtirish mumkin.

## 📦 O‘rnatish

Rasmiy stable release:

**V17 / 5.7.0**

[Rasmiy GitHub Release sahifasini ochish](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/releases/tag/v5.7.0)

Fayl:

```text
BP-Diary-5.7-V17.apk
```

SHA-256:

```text
5c328d79badfcb84f3160089aaa2dc7d2dd48f3a5aa2d91e5bdd0cec7d3c31f9
```

Linux/macOS da tekshirish:

```bash
sha256sum BP-Diary-5.7-V17.apk
```

V17 Package ID va amaldagi direct-distribution signing lineage’ni saqlaydi. Shu sababli rasmiy APK mos keladigan oldingi o‘rnatish ustiga ilovani o‘chirmasdan o‘rnatilishi mumkin.

Ilovani o‘chirish yoki boshqa qurilmaga ko‘chirishdan oldin Full Backup yaratish tavsiya etiladi.

## 🧱 Repozitoriy arxitekturasi

Asosiy fayllar:

```text
source/index.html
assets/mobile-modern.js
assets/mobile-modern.css
scripts/prepare-web.mjs
scripts/patch-android.mjs
scripts/regression.mjs
tests/ui-v17.spec.mjs
version.json
release-request.json
```

Vazifalar taqsimoti:

- `source/index.html` — asosiy ilova va core;
- `assets/mobile-modern.*` — mobil UI/UX;
- `scripts/prepare-web.mjs` — offline web bundle tayyorlash;
- `scripts/patch-android.mjs` — Android-native bridge;
- `scripts/regression.mjs` — statik regression;
- `tests/ui-v17.spec.mjs` — Playwright UI regression.

Batafsil: [ARCHITECTURE.md](../ARCHITECTURE.md).

## 🛠️ Lokal build

Talablar:

- Node.js 22;
- Java 21;
- Android SDK;
- npm.

Asosiy ketma-ketlik:

```bash
npm ci
npm run prepare:web
npm run qa
npx cap add android
node scripts/patch-android.mjs
npm run cap:sync
```

Yaratiladigan `www/`, `android/` va `node_modules/` kataloglari asosiy manba kodi hisoblanmaydi va Git’da saqlanmaydi.

## ✅ QA va himoyalangan main

`main` branch repository ruleset bilan himoyalangan.

Commit `main` ga kirishidan oldin quyidagi ikkita check muvaffaqiyatli o‘tishi shart:

- `build-apk`;
- `mobile-ui`.

Ikkala check ham GitHub Actions orqali ishchi branchlarda ishga tushadi. Shu sababli aynan o‘sha commit `main` ga qo‘shilishidan oldin tekshiriladi.

Release nashri qo‘shimcha ravishda `release-request.json` bilan himoyalangan. Oddiy holat:

```json
{
  "publish": false
}
```

Nashr faqat alohida va ongli release commit orqali ochiladi.

## 🔒 Xavfsizlik

Kundalik ma’lumotlari ilovaning oddiy ishlashi davomida GitHub’ga yuborilmaydi.

Yangilanishni tekshirish faqat foydalanuvchi aniq amal bajargandan keyin tarmoq so‘rovini yuboradi va ushbu repozitoriyning rasmiy GitHub Releases API’iga murojaat qiladi.

Batafsil: [SECURITY.md](../SECURITY.md).

## ⚕️ Tibbiy maqsad

BP Diary yozuvlarni tartibga solish va shifokor bilan muhokama qilish uchun ma’lumot tayyorlashga yordam beradi.

Ilova:

- tashxis qo‘ymaydi;
- davolash buyurmaydi;
- shifokorni almashtirmaydi;
- favqulodda vaziyatda yagona qaror manbai sifatida ishlatilmasligi kerak.

## 📜 Litsenziya

Copyright © 2026 **Tokhirjon Yuldoshev**.

Loyiha **Apache License 2.0** asosida tarqatiladi.

[LICENSE](../LICENSE) fayliga qarang.

## 🤝 Hissa qo‘shish

Branch jarayoni, majburiy checks va Pull Request talablari [CONTRIBUTING.md](../CONTRIBUTING.md) da yozilgan.

---

[← Bosh sahifaga qaytish](../README.md)
