// Menyamakan praproses dengan fungsi teks_untuk_transformer pada notebook:
// 400 karakter pertama komentar dengan spasi dirapikan. URL tidak dihapus
// karena tahap pelabelan dan pelatihan juga membacanya.
export const MAKS_KARAKTER_ANALISIS = 400;

export function preprocess(text) {
  return String(text)
    .slice(0, MAKS_KARAKTER_ANALISIS)
    .replace(/\s+/g, " ")
    .trim();
}
