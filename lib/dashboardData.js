// ============================================================
// DATA DASHBOARD OPINISCOPE (sinkron dengan run final notebook)
// Bagian bertanda sample:false berisi angka nyata dari run final.
// Bagian bertanda sample:true adalah data contoh; ganti dengan hasil
// skrip scripts/2_ekspor_dashboard_data.py bila diinginkan.
// ============================================================

export const ringkasan = {
  totalKomentarBerlabel: 40000,
  komentarHormuz: 8000,
  komentarIsraelPalestine: 32000,
  dimensi: 3,
  modelDibandingkan: 9,
};

// Distribusi label hasil auto-labeling (angka nyata run final)
export const distribusiLabel = {
  sample: false,
  sentimen: [
    { label: "negative", jumlah: 25247 },
    { label: "neutral", jumlah: 12703 },
    { label: "positive", jumlah: 2050 },
  ],
  sarkasme: [
    { label: "not_irony", jumlah: 22308 },
    { label: "irony", jumlah: 17692 },
  ],
  stance: [
    { label: "against", jumlah: 31556 },
    { label: "favour", jumlah: 7366 },
    { label: "neutral", jumlah: 1078 },
  ],
};

// Perbandingan model (angka run final, urut peringkat F1-Macro)
export const perbandinganModel = {
  sample: false,
  catatan: "Angka dari run final notebook (Tabel Bagian 9).",
  baris: [
    { model: "RoBERTa FT", dimensi: "sentimen", accuracy: 0.9166, f1: 0.8884 },
    { model: "RoBERTa FT", dimensi: "sarkasme", accuracy: 0.8272, f1: 0.824 },
    { model: "CNN + GloVe", dimensi: "sarkasme", accuracy: 0.7101, f1: 0.7056 },
    { model: "CNN + Word2Vec", dimensi: "sarkasme", accuracy: 0.7136, f1: 0.7045 },
    { model: "RoBERTa FT", dimensi: "stance", accuracy: 0.8715, f1: 0.6891 },
    { model: "CNN + GloVe", dimensi: "sentimen", accuracy: 0.7522, f1: 0.6685 },
    { model: "CNN + Word2Vec", dimensi: "sentimen", accuracy: 0.7588, f1: 0.6607 },
    { model: "CNN + GloVe", dimensi: "stance", accuracy: 0.7759, f1: 0.5033 },
    { model: "CNN + Word2Vec", dimensi: "stance", accuracy: 0.7867, f1: 0.4983 },
  ],
};

// Kata teratas per sentimen (CONTOH; ganti lewat skrip ekspor)
export const kataTeratas = {
  sample: true,
  negative: ["war", "attack", "killed", "blockade", "crisis", "sanctions"],
  neutral: ["iran", "israel", "strait", "hormuz", "report", "statement"],
  positive: ["peace", "ceasefire", "agreement", "hope", "support", "talks"],
};

// Subreddit teratas (CONTOH; ganti lewat skrip ekspor)
export const subredditTeratas = {
  sample: true,
  baris: [
    { nama: "r/worldnews", jumlah: 12400 },
    { nama: "r/geopolitics", jumlah: 6800 },
    { nama: "r/MiddleEast", jumlah: 4100 },
    { nama: "r/news", jumlah: 3300 },
    { nama: "r/IsraelPalestine", jumlah: 2900 },
  ],
};

// Tren komentar per minggu (CONTOH; ganti lewat skrip ekspor)
export const trenMingguan = {
  sample: true,
  titik: [
    { minggu: "2026-01", jumlah: 1800 },
    { minggu: "2026-02", jumlah: 2100 },
    { minggu: "2026-03", jumlah: 2600 },
    { minggu: "2026-04", jumlah: 2400 },
    { minggu: "2026-05", jumlah: 3900 },
    { minggu: "2026-06", jumlah: 5200 },
    { minggu: "2026-07", jumlah: 4700 },
    { minggu: "2026-08", jumlah: 4100 },
    { minggu: "2026-09", jumlah: 3600 },
    { minggu: "2026-10", jumlah: 3200 },
    { minggu: "2026-11", jumlah: 2900 },
    { minggu: "2026-12", jumlah: 2700 },
  ],
};
