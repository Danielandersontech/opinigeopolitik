# OpiniScope 2.0 (Next.js)

Sistem analisis opini publik tiga dimensi (sentimen, sarkasme, stance) untuk
komentar Reddit bertopik konflik geopolitik global. Antarmuka Next.js siap
deploy ke Vercel; mesin prediksi memakai tiga model RoBERTa hasil fine-tuning
yang di-hosting di Hugging Face Hub.

Panduan lengkap dari menjalankan lokal sampai hosting: baca **PANDUAN.md**.

Ringkas:

    npm install
    cp .env.example .env.local   # isi token dan nama repo model
    npm run dev                  # buka http://localhost:3000

Tanpa konfigurasi model, aplikasi berjalan dalam mode demo (hasil simulasi,
ditandai jelas di antarmuka).

Halaman: `/` Beranda, `/analisis`, `/analisis-massal`, `/dashboard`.
API: `POST /api/predict` {"text": "..."}, `GET /api/health`.
