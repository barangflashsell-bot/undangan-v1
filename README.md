# 💍 Undangan Digital Interaktif Modern (TypeScript + Vite)

Aplikasi web undangan digital pernikahan modern dan mewah dengan arsitektur modular **TypeScript**, **Vite**, dan **Vanilla CSS**. Proyek ini telah dipisahkan menjadi file-file modular yang rapi agar sangat mudah dikelola, dimodifikasi, dan di-upload ke **GitHub**.

---

## 📁 Struktur Direktori & Pemisahan File Modular

Semua kode telah dipisahkan secara rapi berdasarkan tanggung jawabnya:

```
UNDANGAN/V1/
├── index.html                      # Struktur markup semantik & SEO
├── package.json                    # Konfigurasi dependensi (Vite, TypeScript, canvas-confetti)
├── tsconfig.json                   # Konfigurasi TypeScript
├── .gitignore                      # Mengabaikan node_modules dan file build
├── README.md                       # Panduan lengkap proyek
│
├── public/                         # Aset statis
│   └── images/
│       ├── hero.jpg                # Foto utama banner
│       ├── groom.jpg               # Foto mempelai pria
│       ├── bride.jpg               # Foto mempelai wanita
│       ├── gallery-1.jpg           # Galeri prewedding 1
│       ├── gallery-2.jpg           # Galeri prewedding 2
│       └── qris.jpg                # Kartu QRIS angpao digital
│
└── src/
    ├── main.ts                     # Inisialisasi utama aplikasi
    ├── style.css                   # Master CSS (mengimpor semua modul CSS di bawah)
    │
    ├── types/
    │   └── index.ts                # Definisi antarmuka/tipe data TypeScript
    │
    ├── data/
    │   └── invitationData.ts       # ⭐ PUSAT PENGATURAN DATA (Nama mempelai, tgl, bank, dll)
    │
    ├── modules/                    # Modul Logika TypeScript
    │   ├── audioPlayer.ts          # Pemutar audio romantis (Web Audio API Synthesizer)
    │   ├── countdown.ts            # Live countdown timer & Google Calendar generator
    │   ├── guest.ts                # Parser personalisasi nama tamu (?to=Nama)
    │   ├── lightbox.ts             # Modal penampil galeri foto zoom
    │   ├── petals.ts               # Animasi kanvas kelopak bunga melayang
    │   └── rsvp.ts                 # Form RSVP, buku tamu, copy rekening, & konfeti
    │
    └── styles/                     # Modul Tampilan CSS Terpisah
        ├── variables.css           # Token warna, tipografi, bayangan, & transisi
        ├── base.css                # Reset, kanvas, container mobile-first, & tombol
        ├── cover.css               # Layar sampul amplop & kartu nama tamu
        ├── hero.css                # Banner hero & kartu kutipan ayat suci
        ├── couple.css              # Kartu profil mempelai berbingkai lengkung
        ├── countdown.css           # Tampilan kotak hitung mundur waktu
        ├── events.css              # Jadwal Akad & Resepsi pernikahan
        ├── story.css               # Garis waktu perjalanan cinta (Love Story)
        ├── gallery.css             # Grid foto prewedding & modal lightbox
        ├── gift.css                # Kartu rekening bank & amplop digital QRIS
        ├── rsvp.css                # Formulir konfirmasi kehadiran & daftar ucapan
        ├── audio.css               # Tombol piringan hitam pemutar musik mengambang
        └── toast.css               # Notifikasi toast alert & animasi keyframe
```

---

## ⚙️ Cara Mengubah Data Undangan

Anda **tidak perlu** mengedit kode HTML atau logika TypeScript yang rumit. Cukup buka satu file:
👉 `src/data/invitationData.ts`

Di file tersebut Anda bisa langsung mengubah:
- **Nama Mempelai**: Nama lengkap, panggilan, orang tua, dan akun Instagram.
- **Tanggal Acara**: Format tanggal untuk live countdown dan Google Calendar.
- **Lokasi & Agenda**: Alamat masjid/gedung dan link Google Maps.
- **Nomor Rekening**: Bank BCA, Mandiri, atau rekening lainnya.
- **Foto**: Arahkan ke file foto Anda di folder `public/images/`.

---

## 🌐 Personalisasi Nama Tamu via Link

Kirim link undangan ke tamu dengan menambahkan parameter `?to=`:
- `https://domain-anda.com/?to=Bapak+Hendy+%26+Partner`
- `https://domain-anda.com/?to=Sarah+Wulandari`
- `https://domain-anda.com/?to=Keluarga+Besar+Bpk+Joko`

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. **Buka Terminal / PowerShell di folder proyek ini**:
   ```bash
   npm install
   ```

2. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173/`

3. **Build untuk Produksi**:
   ```bash
   npm run build
   ```
   File hasil build akan berada di folder `dist/` siap dideploy.

---

## 📤 Panduan Lengkap Upload ke GitHub

Ikuti langkah mudah berikut untuk mengupload seluruh proyek ke GitHub Anda:

### 1. Buat Repositori Baru di GitHub
1. Buka [github.com/new](https://github.com/new)
2. Masukkan nama repositori, misal: `undangan-digital-v1`
3. Pilih **Public**
4. Biarkan opsi *"Initialize this repository with a README"* **tidak tercentang** (karena kita sudah punya README)
5. Klik **Create repository**

### 2. Jalankan Perintah Git di Terminal Folder Proyek
Jalankan baris perintah berikut secara berurutan:

```bash
# 1. Inisialisasi git lokal
git init

# 2. Buat branch utama bernama main
git branch -M main

# 3. Tambahkan semua file (folder node_modules otomatis diabaikan oleh .gitignore)
git add .

# 4. Simpan commit awal
git commit -m "feat: inisialisasi undangan digital interaktif modern"

# 5. Hubungkan ke repositori GitHub Anda (ganti URL dengan link GitHub Anda)
git remote add origin https://github.com/USERNAME_ANDA/undangan-digital-v1.git

# 6. Upload ke GitHub
git push -u origin main
```

---

## ☁️ Deploy Online Gratis (Opsional)

Setelah terupload ke GitHub, Anda bisa mempublikasikannya secara online dan gratis menggunakan:
- **Vercel**: Masuk ke [vercel.com](https://vercel.com), pilih *Import Git Repository*, pilih repositori ini, lalu klik *Deploy*.
- **Netlify**: Masuk ke [netlify.com](https://netlify.com), pilih *Add new site* > *Import from existing repository*.
