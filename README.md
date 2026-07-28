# ❄️ Sistem Rekod Suhu — Unit Farmasi Klinik Kesihatan Sik

Sistem Pemantauan Suhu Standalone (Peti Sejuk, Bilik, Substor) yang boleh dilancarkan secara percuma di **GitHub Pages** dan disinkronkan secara langsung ke **Google Sheets**.

---

## 🔒 Privasi & Akses Halaman Live GitHub Pages

### Adakah Halaman Live GitHub Pages Awam (Public)?
- **Ya**: Jika repository GitHub anda ditetapkan sebagai **Public**, URL link GitHub Pages (contoh: `https://<username>.github.io/fridge-temp-logger/`) boleh dibuka oleh sesiapa sahaja di internet yang mempunyai link tersebut.
- **Hanya orang yang diberi link**: Halaman ini **tidak secara automatik muncul di enjin carian Google** kecuali jika link tersebut ditampal di laman web awam lain. Oleh itu, hanya staff/pegawai yang menerima pautan link sahaja yang akan mengetahuinya.

### Cara Menjaga Keselamatan Data:
1. **PIN Security Admin**: Aplikasi ini sudah dilengkapi dengan sistem **PIN Security (Default: 2104)** untuk mengunci URL Google Apps Script dan tetapan sensitif.
2. **Kunci Kebenaran Google Apps Script**: Hanya akaun Google Sheets anda yang mempunyai spreadsheet ID sah sahaja yang boleh menulis data ke dalam Sheet.
3. **Repository Private (Pilihan Pro)**: Jika anda memiliki akaun GitHub Enterprise / Team, anda boleh menetapkan repository sebagai **Private** sambil mengekalkan GitHub Pages.

---

## 🚀 Panduan Pelancaran Halaman Live di GitHub Pages (3 Langkah Mudah)

### Langkah 1: Cipta Repository di GitHub
1. Buka [GitHub.com](https://github.com) dan log masuk ke akaun anda.
2. Klik butang **New Repository** (Repository Baru).
3. Berikan nama repository, contohnya: `rekod-suhu-kk-sik`.
4. Pilih **Public** (atau Private jika menyokong).
5. Klik **Create repository**.

### Langkah 2: Muat Naik (Push) Fail Projek ke GitHub
Jalankan arahan berikut di terminal komputer anda (di dalam folder projek ini):

```bash
git init
git add .
git commit -m "Pelancaran Sistem Rekod Suhu Unit Farmasi KK Sik"
git branch -M main
git remote add origin https://github.com/<USERNAME-ANDA>/rekod-suhu-kk-sik.git
git push -u origin main
```

*(Atau anda juga boleh memuat naik fail `index.html`, `styles.css`, `app.js`, dan `Code.gs` secara terus melalui butang **Upload files** di laman web GitHub).*

### Langkah 3: Aktifkan GitHub Pages
1. Di halaman repository GitHub anda, klik tab **Settings** ⚙️.
2. Di menu sebelah kiri, klik **Pages**.
3. Under **Build and deployment > Source**, pilih **Deploy from a branch**.
4. Di bawah **Branch**, pilih **main** dan folder **/(root)**.
5. Klik **Save**.
6. Dalam tempoh 1 - 2 minit, link web app anda akan sedia dilancarkan di:
   `https://<USERNAME-ANDA>.github.io/rekod-suhu-kk-sik/`

---

## ⚙️ Cara Menyambung ke Google Apps Script (Google Sheets)

1. Buka Google Apps Script anda dan gantikan kod `Code.gs` dengan kod terbaharu yang terdapat dalam projek ini.
2. Klik **Deploy > New Deployment**.
3. Select type: **Web app**.
4. Tetapkan:
   - **Execute as**: *Me (email anda)*
   - **Who has access**: *Anyone* (Supaya web app dari GitHub Pages boleh berinteraksi)
5. Klik **Deploy** dan salin URL Web App (berakhir dengan `/exec`).
6. Di Web App GitHub Pages, klik **⚙️ Tetapan Server**, masukkan PIN `2104`, dan simpan URL Web App anda!

---

## 📋 Ciri-Ciri Utama Sistem

- **Multi-Lokasi**: Sokongan berasingan untuk **Peti Sejuk** (-4 ke 17 °C), **Bilik** (12 ke 34 °C), dan **Substor** (12 ke 34 °C).
- **Pengiraan Baris Automatik**: Menunjukkan baris sasaran tepat di Google Sheets (`Target Row`) mengikut formula `rowFor_(date, slot)`.
- **Pengesanan Sesi AM/PM**: Pengesanan automatik waktu AM/PM berdasarkan jam semasa serta amaran luar waktu.
- **Catatan Suhu Luar Julat (Incident Log)**: Menyimpan maklumat pegawai dan tindakan susulan ke tab sheet `CATATAN SUHU LUAR JULAT`.
- **Eksport CSV & Graf Trend**: Boleh memuat turun laporan CSV dan melihat graf trend suhu secara masa nyata.
