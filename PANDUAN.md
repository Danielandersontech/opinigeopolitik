# PANDUAN OPINISCOPE 2.0
## Dari Menjalankan Lokal sampai Hosting di Vercel

Dokumen ini memandu langkah demi langkah: mengunggah model hasil notebook ke
Hugging Face, menjalankan aplikasi di komputer sendiri, sampai hosting publik
di Vercel. Ikuti berurutan; total waktu sekitar 30 sampai 45 menit di luar
waktu unggah model.

---

## 0. Arsitektur Sistem (kenapa modelnya tidak di Vercel)

Tiga model RoBERTa hasil fine-tuning berukuran sekitar 500 MB per dimensi,
sedangkan fungsi serverless Vercel dibatasi 250 MB dan tidak memiliki GPU.
Karena itu arsitekturnya dipisah:

    Peramban pengguna
        |
        v
    Vercel (Next.js)  ->  halaman antarmuka + API perantara /api/predict
        |                    (token Hugging Face tersimpan aman di server)
        v
    Hugging Face Inference API
        |
        v
    3 repo model: opiniscope-sentimen, opiniscope-sarkasme, opiniscope-stance

Keduanya gratis pada tier dasar. Konsekuensinya: permintaan pertama setelah
model lama tidak dipakai bisa lambat (cold start 20 sampai 60 detik) karena
Hugging Face memuat model dulu; permintaan berikutnya cepat.

Konsistensi dengan notebook dijaga di tiga titik dan JANGAN diubah:
1. Praproses: 400 karakter pertama + perapian spasi (lib/preprocess.js),
   sama dengan fungsi teks_untuk_transformer di notebook.
2. Urutan label per dimensi (lib/labels.js) sama dengan hasil sorted() di
   notebook: sentimen negative/neutral/positive, sarkasme irony/not_irony,
   stance against/favour/neutral.
3. Panjang token 128 mengikuti konfigurasi model yang diunggah.

---

## 1. Prasyarat

- Node.js 18.17 atau lebih baru (cek: `node --version`), dari https://nodejs.org
- Akun GitHub (https://github.com)
- Akun Vercel (https://vercel.com, masuk dengan GitHub)
- Akun Hugging Face (https://huggingface.co)
- Notebook final sudah selesai dijalankan sampai Bagian 8 (folder
  model_transformer_sentimen, _sarkasme, _stance ada di sesi Colab)

---

## 2. Langkah 1: Unggah Tiga Model ke Hugging Face

1. Buka https://huggingface.co/settings/tokens, buat token baru dengan akses
   **Write**, salin tokennya.
2. Di Colab (sesi yang sama dengan pelatihan), buat sel baru, tempel seluruh
   isi `scripts/1_upload_model_ke_hf.py`.
3. Ganti `ISI_USERNAME_HF_ANDA` dengan username Hugging Face kalian.
4. Jalankan sel; tempel token saat kotak login muncul. Unggahan tiga model
   memakan waktu 5 sampai 15 menit tergantung koneksi Colab.
5. Catat tiga nama repo yang tercetak, contohnya:
   `kelompok4pcr/opiniscope-sentimen`, dan seterusnya.

Catatan penting:
- Skrip menanam `id2label` ke config sehingga API mengembalikan nama kelas
  asli. Ini disengaja dan aman.
- Repo dibuat `private=True`; aplikasi tetap bisa mengaksesnya karena memakai
  token kalian. Boleh diubah ke publik bila ingin.
- Setelah selesai, buat juga token kedua dengan akses **Read** saja; token
  inilah yang dipakai aplikasi (lebih aman daripada menaruh token Write).

---

## 3. Langkah 2: Jalankan Lokal

1. Ekstrak `opiniscope-next.zip`, buka terminal di folder hasil ekstrak.
2. Pasang dependensi:

       npm install

3. Salin berkas contoh konfigurasi lalu isi:

       cp .env.example .env.local        (Windows: copy .env.example .env.local)

   Isi `.env.local`:

       HF_TOKEN=hf_xxxxxxxxxxxxxxxxx
       HF_MODEL_SENTIMEN=usernameanda/opiniscope-sentimen
       HF_MODEL_SARKASME=usernameanda/opiniscope-sarkasme
       HF_MODEL_STANCE=usernameanda/opiniscope-stance

4. Jalankan:

       npm run dev

5. Buka http://localhost:3000, masuk ke halaman Analisis, klik salah satu
   tombol contoh, lalu Analisis Teks. Permintaan pertama bisa sampai satu
   menit (model sedang dimuat di Hugging Face); berikutnya cepat.

Ingin melihat antarmuka tanpa model dulu? Lewati langkah 3; aplikasi otomatis
masuk mode demo dengan hasil simulasi yang ditandai spanduk kuning.

---

## 4. Langkah 3: Hosting di Vercel

Cara A (disarankan, lewat GitHub):

1. Buat repository baru di GitHub, misalnya `opiniscope`, lalu dari folder
   proyek:

       git init
       git add .
       git commit -m "OpiniScope 2.0"
       git branch -M main
       git remote add origin https://github.com/USERNAME/opiniscope.git
       git push -u origin main

   Berkas `.gitignore` sudah mencegah `.env.local` ikut terunggah, jadi token
   kalian tidak bocor ke GitHub.
2. Buka https://vercel.com, klik **Add New > Project**, pilih repo
   `opiniscope`, biarkan seluruh pengaturan build bawaan (framework Next.js
   terdeteksi otomatis).
3. Sebelum menekan Deploy, buka bagian **Environment Variables** dan tambahkan
   empat variabel yang sama seperti `.env.local`:
   `HF_TOKEN`, `HF_MODEL_SENTIMEN`, `HF_MODEL_SARKASME`, `HF_MODEL_STANCE`.
4. Klik **Deploy**. Dua menit kemudian aplikasi tayang di alamat
   `https://opiniscope-xxxx.vercel.app`.

Cara B (lewat terminal, tanpa GitHub):

       npm install -g vercel
       vercel login
       vercel                       (ikuti pertanyaan, terima default)
       vercel env add HF_TOKEN      (ulangi untuk tiga variabel model)
       vercel --prod

Setiap `git push` ke branch main (Cara A) otomatis memicu deploy ulang.

---

## 5. Langkah Opsional: Isi Dashboard dengan Angka Nyata

Panel Distribusi Label dan Perbandingan Model sudah berisi angka nyata dari
run pelatihan. Tiga panel lain (Kata Teratas, Subreddit Teratas, Tren
Mingguan) masih berisi data contoh dan diberi tanda "data contoh" di layar.
Untuk menggantinya:

1. Di Colab (setelah notebook selesai), jalankan sel berisi
   `scripts/2_ekspor_dashboard_data.py`.
2. Salin SELURUH keluaran sel tersebut.
3. Timpa isi berkas `lib/dashboardData.js` dengan hasil salinan.
4. Commit dan push; Vercel deploy ulang otomatis.

Setelah run final selesai, perbarui juga angka accuracy dan F1 pada tabel
Perbandingan Model dengan cara yang sama (skrip membacanya dari
perbandingan_model.csv).

---

## 6. Struktur Proyek

    app/
      page.js                Beranda
      analisis/page.js       Analisis satu teks
      analisis-massal/page.js  Unggah CSV, analisis bertahap, unduh hasil
      dashboard/page.js      Insight Overview
      api/predict/route.js   POST {text} -> 3 prediksi (panggil Hugging Face)
      api/health/route.js    Status mesin
      layout.js, globals.css Kerangka dan tema
    components/              Navbar, kartu hasil per dimensi
    lib/
      labels.js              Definisi dimensi, urutan kelas, nama tampilan
      preprocess.js          Praproses 400 karakter (identik notebook)
      hf.js                  Pemanggil Inference API + retry + mode demo
      dashboardData.js       Data dashboard (bisa diganti hasil ekspor)
    scripts/                 Dua skrip Colab pendamping

Format respons `POST /api/predict` sengaja dibuat sama dengan sistem Flask
lama (input, preprocessed, engine, results per dimensi) agar integrasi lain
yang sudah ada tetap kompatibel.

---

## 7. Pemecahan Masalah

**Spanduk kuning "Mode demo aktif" tidak hilang.**
Variabel lingkungan belum terbaca. Lokal: pastikan nama berkas `.env.local`
(bukan `.env.example`) dan jalankan ulang `npm run dev`. Vercel: cek menu
Settings > Environment Variables, lalu Redeploy.

**Galat "Model ... gagal dipanggil (HTTP 404)".**
Nama repo salah ketik, atau repo private tetapi token yang dipakai bukan
milik akun yang sama. Cocokkan persis dengan alamat di halaman Hugging Face.

**Galat HTTP 503 atau menunggu sangat lama pada permintaan pertama.**
Normal: Hugging Face sedang memuat model (cold start). Aplikasi sudah
menunggu dan mencoba ulang otomatis sampai tiga kali. Coba lagi setelah satu
menit. Model yang sering dipakai tetap hangat.

**Galat HTTP 401.**
Token salah, kedaluwarsa, atau belum diberi akses Read. Buat token baru.

**Semua konfigurasi benar tetapi tetap 404 dari Hugging Face.**
Beberapa akun diarahkan ke endpoint baru. Tambahkan satu variabel lingkungan:

       HF_API_BASE=https://router.huggingface.co/hf-inference/models

**Analisis massal terasa lambat.**
Setiap baris adalah satu panggilan model dan dibatasi tiga panggilan
bersamaan agar tidak terkena rate limit gratis. Untuk berkas besar, analisis
bertahap 50 baris adalah pengaturan paling aman.

**Batas waktu fungsi di Vercel.**
API sudah menyetel `maxDuration = 60` detik (maksimum paket Hobby). Bila
cold start melebihi itu, panggilan pertama gagal dan panggilan kedua berhasil
karena model sudah termuat.

---

## 8. Batasan yang Perlu Diketahui (untuk laporan dan demo)

- Tier gratis Hugging Face Inference API memiliki rate limit dan cold start;
  cukup untuk demo dan pemakaian riset, bukan untuk trafik produksi besar.
- Prediksi web memakai model RoBERTa terbaik dari notebook; model CNN tidak
  disertakan di web karena tujuan produksi cukup satu mesin terbaik.
- Metrik pada dashboard mengukur kesepakatan model terhadap model pelabel
  (pseudo-label), konsisten dengan pernyataan keterbatasan pada notebook.
