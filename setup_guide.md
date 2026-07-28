# Panduan Ringkas & Penyelesaian Isu Login Domain Organisasi (moh.my)

## 📌 Punca Isu Login Domain (`moh.my`)
Apabila menggunakan **Google Apps Script Web App** biasa (`google.script.run`), Google mewajibkan pengguna untuk log masuk ke dalam Akaun Google/Workspace. Bagi pengguna yang menggunakan **email rasmi kementerian / organisasi (seperti @moh.my)**, sistem keselamatan IT organisasi sering menyekat OAuth / popup kelulusan atau menghalang akaun luar daripada mengakses Web App tersebut.

---

## ⚡ Penyelesaian Terbaik (Cara Mengatasi Isu Login 100%)

Sistem baharu ini telah direkabentuk dengan **Dua (2) Cara Penggunaan**:

### Cara A: Guna Standalone Web App (`standalone_app.html`) — *DISYORKAN (Bypass Login)*
1. Pengguna membuka borang web standalone ini pada **mana-mana browser (Telefon / PC / Tablet)** tanpa perlu login Google.
2. Data dihantar terus ke Google Spreadsheet melalui **Webhook REST API (`doPost`)**.
3. **Tiada popup kebenaran Google / tiada isu login @moh.my!**

---

## 🛠️ Langkah Set Up Google Apps Script & Google Sheet

### Langkah 1: Sediakan Google Spreadsheet
Buka atau cipta Google Sheet untuk setiap peti sejuk (atau 1 Spreadsheet dengan 4 tab). 
Pastikan baris tajuk (Row 1) mempunyai 7 lajur berikut:
- **Col A**: `Tarikh`
- **Col B**: `Waktu`
- **Col C**: `Suhu Minimum`
- **Col D**: `Suhu Semasa`
- **Col E**: `Suhu Maksimum`
- **Col F**: `Perkara`
- **Col G**: `Tandatangan Pencatat`

---

### Langkah 2: Copy Code Apps Script
1. Di Google Sheet anda, klik **Extensions (Pelanjutan) > Apps Script**.
2. Padam semua kod asal, dan salin (copy & paste) keseluruhan kod daripada fail [`Code.gs`](file:///C:/Users/fatha/.gemini/antigravity-ide/scratch/fridge-temp-logger/Code.gs).
3. Masukkan ID Google Sheet bagi setiap Peti Sejuk pada pembolehubah `SPREADSHEET_IDS`:
   ```javascript
   const SPREADSHEET_IDS = {
     'PETI_SEJUK_1': 'ID_SPREADSHEET_PETI_SEJUK_1',
     'PETI_SEJUK_2': 'ID_SPREADSHEET_PETI_SEJUK_2',
     'PETI_SEJUK_3': 'ID_SPREADSHEET_PETI_SEJUK_3',
     'PETI_SEJUK_4': 'ID_SPREADSHEET_PETI_SEJUK_4'
   };
   ```

---

### Langkah 3: Deploy Sebagai Web App (PENTING!)
Supaya semua staf boleh guna **tanpa masalah login domain MOH**:
1. Klik butang **Deploy > New deployment** di bahagian atas kanan Apps Script.
2. Pilih jenis: **Web app**.
3. Tetapkan tetapan seperti berikut:
   - **Description**: `Sistem Rekod Suhu Peti Sejuk`
   - **Execute as**: `Me (email anda)`
   - **Who has access**: `Anyone` *(Sesiapa sahaja - PENTING supaya bypass login)*
4. Klik **Deploy** dan luluskan Kebenaran (Authorize Access).
5. Copy **Web App URL** yang terhasil (Contoh: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Langkah 4: Hubungkan Borang Web
1. Buka fail [`standalone_app.html`](file:///C:/Users/fatha/.gemini/antigravity-ide/scratch/fridge-temp-logger/standalone_app.html).
2. Klik butang **⚙️ WebApp URL** di bahagian bawah borang.
3. Paste Web App URL yang disalin dari Langkah 3 tadi.
4. Klik **Simpan**.

Selesai! Kini staf boleh merekodkan suhu 4 peti sejuk dengan pantas, tepat mengikut format spreadsheet, auto-detect sesi AM (7am-1pm) & PM (2pm-6pm), serta data terus disimpan ke dalam Google Sheet!
