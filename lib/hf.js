// Pemanggil mesin prediksi (dijalankan di server, token aman).
// Dua mode, urutan prioritas:
// 1. Mode Space  : OPINISCOPE_API_URL terisi -> satu panggilan ke server
//                  FastAPI di Hugging Face Space, langsung tiga dimensi.
// 2. Mode HF-API : token + tiga repo model via Inference API (bila tersedia).
// Tanpa keduanya -> mode demo (hasil simulasi, ditandai di antarmuka).
import { LABEL_FALLBACK, DIMENSIONS } from "./labels";

const REPO_ENV = {
  sentimen: "HF_MODEL_SENTIMEN",
  sarkasme: "HF_MODEL_SARKASME",
  stance: "HF_MODEL_STANCE",
};

export function modeSpace() {
  return Boolean(process.env.OPINISCOPE_API_URL);
}

export function modeDemo() {
  if (modeSpace()) return false;
  return !process.env.HF_TOKEN ||
    DIMENSIONS.some((d) => !process.env[REPO_ENV[d.key]]);
}

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Mode Space: satu panggilan, tiga dimensi ----------
export async function panggilSpace(text) {
  const base = String(process.env.OPINISCOPE_API_URL).replace(/\/+$/, "");
  const maksCoba = 3;
  let terakhir = "";

  for (let percobaan = 1; percobaan <= maksCoba; percobaan++) {
    let res;
    try {
      res = await fetch(`${base}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        cache: "no-store",
      });
    } catch (e) {
      terakhir = "server tidak terjangkau";
      await tidur(5000 * percobaan);
      continue;
    }

    // Space yang sedang bangun dari tidur biasanya membalas 502/503/504
    if ([502, 503, 504].includes(res.status)) {
      terakhir = `HTTP ${res.status} (Space sedang bangun, model dimuat)`;
      await tidur(8000 * percobaan);
      continue;
    }
    if (!res.ok) {
      throw new Error(`Server OpiniScope membalas HTTP ${res.status}.`);
    }

    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    if (!data || !data.results) {
      throw new Error("Respons server tidak dikenal.");
    }
    return data;
  }
  throw new Error(
    `Server model belum siap setelah ${maksCoba} percobaan (${terakhir}). ` +
    "Space gratis butuh 1 sampai 3 menit untuk bangun; coba lagi sebentar."
  );
}

// ---------- Mode HF Inference API (per model) ----------
function urlModel(repo) {
  const base = process.env.HF_API_BASE ||
    "https://api-inference.huggingface.co/models";
  return `${base.replace(/\/$/, "")}/${repo}`;
}

export async function panggilHF(dimKey, text) {
  const repo = process.env[REPO_ENV[dimKey]];
  const dim = DIMENSIONS.find((d) => d.key === dimKey);
  const maksCoba = 3;
  let terakhir = "";

  for (let percobaan = 1; percobaan <= maksCoba; percobaan++) {
    const res = await fetch(urlModel(repo), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
      cache: "no-store",
    });

    if (res.status === 503 || res.status === 429) {
      terakhir = `HTTP ${res.status} (model sedang dimuat / rate limit)`;
      await tidur(4000 * percobaan);
      continue;
    }
    if (!res.ok) {
      let pesan = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j && j.error) pesan += `: ${j.error}`;
      } catch {}
      throw new Error(`Model ${repo} gagal dipanggil (${pesan}).`);
    }

    const data = await res.json();
    let daftar = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
    if (!Array.isArray(daftar)) {
      throw new Error(`Respons tidak dikenal dari ${repo}.`);
    }

    const proba = {};
    for (const item of daftar) {
      if (!item || typeof item.label === "undefined") continue;
      const nama = LABEL_FALLBACK[dimKey][item.label] || item.label;
      proba[nama] = Number(item.score) || 0;
    }
    for (const c of dim.classes) if (!(c in proba)) proba[c] = 0;
    return proba;
  }
  throw new Error(`Model ${repo} tidak merespons setelah ${maksCoba} percobaan. ${terakhir}`);
}

// ---------- Mode demo ----------
export function prediksiDemo(text, dim) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const skorKasar = dim.classes.map((_, i) => {
    const x = Math.abs(Math.sin((h % 1000) * (i + 1) * 0.37)) + 0.15;
    return x;
  });
  const total = skorKasar.reduce((a, b) => a + b, 0);
  const proba = {};
  dim.classes.forEach((c, i) => {
    proba[c] = skorKasar[i] / total;
  });
  return proba;
}
