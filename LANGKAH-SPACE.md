# PERBAIKAN: SERVER MODEL VIA HUGGING FACE SPACE

Latar: layanan inference serverless gratis Hugging Face tidak lagi melayani
model kustom milik pengguna (galat "Model not supported by provider
hf-inference"). Solusi: server model gratis berbentuk Space. Frontend Vercel
tidak berubah; hanya dua berkas proyek diperbarui dan satu variabel baru.

Isi paket ini:
- space/         : 4 berkas untuk diunggah ke Hugging Face Space
- next-update/   : 2 berkas pengganti + contoh .env baru untuk proyek Next.js

---

## A. Buat Space (sekali, lewat browser, sekitar 10 menit)

1. Buka https://huggingface.co/new-space
2. Isi: Space name = opiniscope-api, License = mit (bebas),
   SDK = pilih DOCKER lalu template Blank, Hardware = CPU basic (Free),
   visibilitas = Public. Klik Create Space.
3. Masuk tab Settings pada Space, bagian "Variables and secrets",
   klik New secret: Name = HF_TOKEN, Value = token Hugging Face kamu.
   (Ini yang memberi Space izin membaca ketiga repo model private.)
4. Masuk tab Files, klik "Add file" lalu "Upload files", unggah EMPAT
   berkas dari folder space/ paket ini: app.py, requirements.txt,
   Dockerfile, README.md. Centang "Commit directly", klik Commit.
   Catatan: README.md bawaan Space boleh tertimpa; itu memang tujuannya.
5. Space otomatis build. Pantau tab Logs: build pertama 5 sampai 10 menit
   (memasang torch lalu mengunduh tiga model). Selesai ditandai baris
   "Seluruh model termuat." dan "Application startup complete".
6. Uji dari PowerShell:

       Invoke-RestMethod "https://danielanderson22-opiniscope-api.hf.space/health"

   Harus membalas status ok dengan tiga dimensi aktif.

## B. Perbarui proyek Next.js (2 menit)

1. Timpa dua berkas proyek dengan versi dari folder next-update/:
   - lib/hf.js
   - app/api/predict/route.js
2. Tambahkan satu baris ke .env.local:

       OPINISCOPE_API_URL=https://danielanderson22-opiniscope-api.hf.space

   Baris HF_TOKEN dan HF_MODEL_* boleh dibiarkan; mode Space otomatis
   diprioritaskan.
3. Jalankan ulang: npm run dev, buka /analisis, klik Contoh 1.
   Permintaan pertama setelah Space lama menganggur bisa 1 sampai 3 menit
   (Space bangun dari tidur); berikutnya 1 sampai 3 detik.

## C. Vercel

Saat deploy, tambahkan variabel OPINISCOPE_API_URL dengan nilai yang sama
pada Environment Variables. Selesai.

## Uji cepat endpoint prediksi (PowerShell)

    Invoke-RestMethod -Method Post -Uri "https://danielanderson22-opiniscope-api.hf.space/predict" -ContentType "application/json" -Body '{"text":"The ceasefire agreement is a significant step toward peace."}'

## Catatan

- Space gratis tidur setelah 48 jam tidak dipakai; kunjungan pertama
  membangunkannya (1 sampai 3 menit). Sebelum demo, panggil /health dulu.
- Space berstatus Public berarti endpoint bisa diakses siapa saja; wajar
  untuk demo akademik. Model tetap private karena diakses lewat secret.
