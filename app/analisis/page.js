"use client";

import { useState } from "react";
import { DIMENSIONS } from "../../lib/labels";
import { MAKS_KARAKTER_ANALISIS } from "../../lib/preprocess";
import DimensionCard from "../../components/DimensionCard";

const CONTOH = [
  "The ceasefire agreement is a significant step toward long-term peace in the region.",
  "Oh great, blocking the Strait of Hormuz, what a brilliant strategy that will surely fix everything.",
  "Another escalation like this will only bring more suffering to civilians on both sides.",
];

export default function Analisis() {
  const [teks, setTeks] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [galat, setGalat] = useState("");
  const [lihatJson, setLihatJson] = useState(false);

  async function analisis() {
    const t = teks.trim();
    if (!t) {
      setGalat("Tulis atau pilih satu komentar dulu.");
      return;
    }
    setMemuat(true);
    setGalat("");
    setHasil(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setHasil(data);
    } catch (e) {
      setGalat(e.message || String(e));
    } finally {
      setMemuat(false);
    }
  }

  return (
    <div className="wrap">
      <section className="section">
        <span className="eyebrow">Analisis</span>
        <h1 style={{ fontSize: "2.1rem" }}>Analysis Laboratory</h1>
        <p className="dim" style={{ maxWidth: 620 }}>
          Masukkan komentar berbahasa Inggris tentang isu konflik geopolitik.
          Sistem memprediksi tiga dimensi opini sekaligus.
        </p>

        <div className="card" style={{ marginTop: 18 }}>
          <textarea
            className="area"
            placeholder="Contoh: The blockade of the Strait of Hormuz will hurt the global economy..."
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
          />
          <div className="bar-bawah">
            <span className="kecil dim num">
              {teks.length.toLocaleString("id-ID")} karakter. Sistem menganalisis{" "}
              {MAKS_KARAKTER_ANALISIS} karakter pertama.
            </span>
            <button className="btn btn-utama" onClick={analisis} disabled={memuat}>
              {memuat ? "Menganalisis..." : "Analisis Teks"}
            </button>
          </div>
          <div className="contoh">
            {CONTOH.map((c, i) => (
              <button key={i} onClick={() => setTeks(c)} title={c}>
                Contoh {i + 1}
              </button>
            ))}
          </div>
        </div>

        {galat ? (
          <div className="banner banner-merah" style={{ marginTop: 16 }}>{galat}</div>
        ) : null}

        {memuat ? (
          <div className="card" style={{ marginTop: 18 }}>
            <div className="memuat-bar" />
            <p className="kecil dim" style={{ margin: "12px 0 0" }}>
              Ketiga model sedang membaca teks. Permintaan pertama setelah server
              lama tidak dipakai bisa memakan hingga satu menit.
            </p>
          </div>
        ) : null}

        {hasil ? (
          <section style={{ marginTop: 26 }}>
            <div className="hasil-kepala">
              <h2 style={{ margin: 0 }}>Intelligence Output</h2>
              <span className="badge">{hasil.demo ? "Mode demo" : "Engine: RoBERTa"}</span>
            </div>
            {hasil.demo ? (
              <div className="banner" style={{ margin: "12px 0 4px" }}>
                Mode demo aktif: server model belum terhubung, hasil di bawah
                adalah simulasi tampilan.
              </div>
            ) : null}
            <div className="grid grid-3" style={{ marginTop: 14 }}>
              {DIMENSIONS.map((d) => (
                <DimensionCard key={d.key} dim={d} hasil={hasil.results[d.key]} />
              ))}
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="hasil-kepala">
                <h3 style={{ margin: 0 }}>Teks yang dianalisis</h3>
                <button
                  className="btn btn-garis"
                  style={{ padding: "6px 13px", fontSize: "0.8rem" }}
                  onClick={() => setLihatJson(!lihatJson)}
                >
                  {lihatJson ? "Sembunyikan JSON" : "Lihat JSON"}
                </button>
              </div>
              <p className="kecil dim" style={{ marginTop: 10 }}>{hasil.preprocessed}</p>
              {lihatJson ? (
                <pre className="blok" style={{ marginTop: 10 }}>
                  {JSON.stringify(hasil, null, 2)}
                </pre>
              ) : null}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
