// Definisi tiga dimensi analisis. Urutan kelas WAJIB sama dengan urutan
// label pada notebook (hasil sorted() saat pelatihan):
//   sentimen : 0=negative, 1=neutral, 2=positive
//   sarkasme : 0=irony,    1=not_irony
//   stance   : 0=against,  1=favour,  2=neutral

export const DIMENSIONS = [
  {
    key: "sentimen",
    nama: "Sentimen",
    deskripsi: "Polaritas emosi komentar: positif, negatif, atau netral.",
    classes: ["negative", "neutral", "positive"],
    aksen: "#3b6fb5",
  },
  {
    key: "sarkasme",
    nama: "Sarkasme",
    deskripsi: "Keberadaan nada ironi atau sarkasme pada komentar.",
    classes: ["irony", "not_irony"],
    aksen: "#7e5fc0",
  },
  {
    key: "stance",
    nama: "Stance",
    deskripsi: "Sikap komentar terhadap isu: mendukung, menentang, atau netral.",
    classes: ["against", "favour", "neutral"],
    aksen: "#00687a",
  },
];

// Peta cadangan bila config model masih memakai label generik LABEL_i
export const LABEL_FALLBACK = {
  sentimen: { LABEL_0: "negative", LABEL_1: "neutral", LABEL_2: "positive" },
  sarkasme: { LABEL_0: "irony", LABEL_1: "not_irony" },
  stance: { LABEL_0: "against", LABEL_1: "favour", LABEL_2: "neutral" },
};

// Nama tampilan berbahasa Indonesia
export const DISPLAY = {
  negative: "Negatif",
  neutral: "Netral",
  positive: "Positif",
  irony: "Sarkastik",
  not_irony: "Tidak Sarkastik",
  favour: "Mendukung",
  against: "Menentang",
};

export const WARNA_KELAS = {
  negative: "#c4544c",
  neutral: "#64748b",
  positive: "#2f8f5b",
  irony: "#7e5fc0",
  not_irony: "#5c6b77",
  favour: "#0e7c8c",
  against: "#c06a2e",
};

export function tampil(label) {
  return DISPLAY[label] || label;
}
