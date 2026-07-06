"use client";

import { useRef, useState } from "react";
import { tampil } from "../../lib/labels";

// Parser CSV sederhana yang mendukung tanda kutip, koma di dalam kutip,
// baris baru di dalam kutip, dan kutip ganda ("" menjadi ").
function parseCSV(raw) {
  const rows = [];
  let baris = [];
  let sel = "";
  let dalamKutip = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (dalamKutip) {
      if (ch === '"') {
        if (raw[i + 1] === '"') {
          sel += '"';
          i++;
        } else {
          dalamKutip = false;
        }
      } else {
        sel += ch;
      }
    } else if (ch === '"') {
      dalamKutip = true;
    } else if (ch === ",") {
      baris.push(sel);
      sel = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && raw[i + 1] === "\n") i++;
      baris.push(sel);
      sel = "";
      if (baris.some((c) => c.trim() !== "")) rows.push(baris);
      baris = [];
    } else {
      sel += ch;
    }
  }
  baris.push(sel);
  if (baris.some((c) => c.trim() !== "")) rows.push(baris);
  return rows;
}

function pilihKolomTeks(rows) {
  const header = rows[0].map((h) => h.trim().toLowerCase());
  if (header.includes("body")) return { col: header.indexOf("body"), data: rows.slice(1) };
  if (header.includes("text")) return { col: header.indexOf("text"), data: rows.slice(1) };
  const data = rows.length > 1 && rows[0].length > 1 ? rows.slice(1) : rows;
  return { col: 0, data };
}

export default function AnalisisMassal() {
  const fileRef = useRef(null);
  const [namaFile, setNamaFile] = useState("");
  const [teksList, setTeksList] = useState([]);
  const [batas, setBatas] = useState(50);
  const [jalan, setJalan] = useState(false);
  const [progres, setProgres] = useState(0);
  const [hasil, setHasil] = useState([]);
  const [demo, setDemo] = useState(false);
  const [galat, setGalat] = useState("");

  function bacaFile(e) {
    setGalat("");
    setHasil([]);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setNamaFile(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCSV(String(reader.result || ""));
        if (!rows.length) throw new Error("File CSV kosong.");
        const { col, data } = pilihKolomTeks(rows);
        const teks = data
          .map((r) => (r[col] || "").trim())
          .filter((t) => t.length > 0);
        if (!teks.length) throw new Error("Tidak ada teks yang dapat dibaca dari file.");
        setTeksList(teks);
      } catch (err) {
        setGalat(err.message || String(err));
        setTeksList([]);
      }
    };
    reader.readAsText(f);
  }

  async function prosesSemua() {
    if (!teksList.length) {
      setGalat("Unggah file CSV terlebih dahulu.");
      return;
    }
    setJalan(true);
    setGalat("");
    setHasil([]);
    setProgres(0);

    const antrean = teksList.slice(0, batas);
    const keluaran = new Array(antrean.length);
    let selesai = 0;
    let indeks = 0;
    const KONKUREN = 3;

    async function pekerja() {
      while (indeks < antrean.length) {
        const i = indeks++;
        const teks = antrean[i];
        try {
          const res = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: teks }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
          if (data.demo) setDemo(true);
          const r = data.results || {};
          keluaran[i] = {
            id: i + 1,
            teks: teks.slice(0, 160),
            sentimen: r.sentimen && r.sentimen.label ? r.sentimen.label : "-",
            sarkasme: r.sarkasme && r.sarkasme.label ? r.sarkasme.label : "-",
            stance: r.stance && r.stance.label ? r.stance.label : "-",
            confidence:
              r.sentimen && typeof r.sentimen.confidence === "number"
                ? r.sentimen.confidence
                : 0,
          };
        } catch (err) {
          keluaran[i] = {
            id: i + 1,
            teks: teks.slice(0, 160),
            sentimen: "gagal",
            sarkasme: "gagal",
            stance: "gagal",
            confidence: 0,
          };
        } finally {
          selesai++;
          setProgres(Math.round((selesai / antrean.length) * 100));
          setHasil(keluaran.filter(Boolean));
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(KONKUREN, antrean.length) }, pekerja)
    );
    setJalan(false);
  }

  function unduhCSV() {
    const kepala = "id,teks,sentimen,sarkasme,stance,confidence_sentimen";
    const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const baris = hasil.map((h) =>
      [h.id, esc(h.teks), h.sentimen, h.sarkasme, h.stance, h.confidence].join(",")
    );
    const blob = new Blob([[kepala, ...baris].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hasil_opiniscope.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="wrap">
      <section className="section">
        <span className="eyebrow">Analisis Massal</span>
        <h1 style={{ fontSize: "2.2rem" }}>Baca banyak komentar sekaligus</h1>
        <p className="dim">
          Unggah file CSV berisi komentar (kolom <code className="inline">body</code>{" "}
          atau <code className="inline">text</code>; jika tidak ada, kolom pertama
          yang dipakai). Analisis dijalankan bertahap dari peramban Anda.
        </p>

        <div className="card" style={{ marginTop: 18 }}>
          <div className="bar-bawah" style={{ justifyContent: "flex-start" }}>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={bacaFile}
            />
          </div>
          {namaFile ? (
            <p className="kecil dim" style={{ marginTop: 8 }}>
              {namaFile}: {teksList.length.toLocaleString("id-ID")} baris teks
              terbaca.
            </p>
          ) : null}
          <div className="bar-bawah">
            <label className="kecil dim">
              Jumlah baris dianalisis:{" "}
              <select
                value={batas}
                onChange={(e) => setBatas(Number(e.target.value))}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  color: "inherit",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: "4px 8px",
                }}
              >
                {[10, 25, 50, 100, 200].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="btn btn-utama"
              onClick={prosesSemua}
              disabled={jalan || !teksList.length}
            >
              {jalan ? `Membaca... ${progres}%` : "Mulai analisis massal"}
            </button>
          </div>
          {jalan || progres > 0 ? (
            <div className="progress" style={{ marginTop: 12 }}>
              <div style={{ width: `${progres}%` }} />
            </div>
          ) : null}
        </div>

        {galat ? (
          <div className="banner banner-merah" style={{ marginTop: 16 }}>
            {galat}
          </div>
        ) : null}
        {demo ? (
          <div className="banner" style={{ marginTop: 16 }}>
            Mode demo aktif: server model belum terhubung, label pada tabel
            adalah simulasi.
          </div>
        ) : null}

        {hasil.length ? (
          <div className="card" style={{ marginTop: 18 }}>
            <div className="hasil-kepala">
              <h2 style={{ margin: 0 }}>Hasil analisis</h2>
              <button
                className="btn btn-garis"
                style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                onClick={unduhCSV}
              >
                Unduh hasil (CSV)
              </button>
            </div>
            <div className="tabel-bungkus" style={{ marginTop: 10 }}>
              <table className="tabel">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Teks</th>
                    <th>Sentimen</th>
                    <th>Sarkasme</th>
                    <th>Stance</th>
                    <th>Conf. Sentimen</th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((h) => (
                    <tr key={h.id}>
                      <td>{h.id}</td>
                      <td>{h.teks}</td>
                      <td>{tampil(h.sentimen)}</td>
                      <td>{tampil(h.sarkasme)}</td>
                      <td>{tampil(h.stance)}</td>
                      <td>{(h.confidence * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
