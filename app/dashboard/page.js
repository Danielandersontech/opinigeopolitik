"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import { DIMENSIONS, tampil, WARNA_KELAS } from "../../lib/labels";
import {
  ringkasan,
  distribusiLabel,
  perbandinganModel,
  kataTeratas,
  subredditTeratas,
  trenMingguan,
} from "../../lib/dashboardData";

function TandaSample() {
  return <span className="tag-sample">data contoh</span>;
}

function BarisBar({ nama, teksNilai, persen, warna }) {
  return (
    <div className="baris-proba">
      <div className="nama">
        <span>{nama}</span>
        <span className="num">{teksNilai}</span>
      </div>
      <div className="trek">
        <div
          className="isi"
          style={{ width: `${Math.max(2, persen)}%`, "--warna": warna }}
        />
      </div>
    </div>
  );
}

function Sparkline({ titik }) {
  const nilai = titik.map((t) => t.jumlah);
  const maks = Math.max(...nilai);
  const min = Math.min(...nilai);
  const rentang = Math.max(1, maks - min);
  const W = 600;
  const H = 110;
  const poin = nilai
    .map((v, i) => {
      const x = (i / Math.max(1, nilai.length - 1)) * W;
      const y = H - ((v - min) / rentang) * (H - 14) - 7;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <polyline
        points={poin}
        fill="none"
        stroke="#00687a"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const [metrik, setMetrik] = useState("accuracy");
  const barisUrut = [...perbandinganModel.baris].sort((a, b) => b[metrik] - a[metrik]);
  const fmt = (v) =>
    metrik === "accuracy"
      ? `${(v * 100).toFixed(2).replace(".", ",")}%`
      : v.toFixed(4).replace(".", ",");

  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 24 }}>
        <span className="eyebrow">
          <Icon nama="grafik" ukuran={14} /> Dashboard
        </span>
        <h1 style={{ fontSize: "2.1rem" }}>Insight Overview</h1>
        <p className="dim">Visualisasi data riset opini publik dari korpus penelitian.</p>
        <div className="chiprow" style={{ marginTop: 14 }}>
          <span className="chip chip-aktif">Reddit 2023-2026</span>
          <span className="chip">Israel-Palestina</span>
          <span className="chip">Krisis Selat Hormuz</span>
          <span className="chip num">
            {ringkasan.totalKomentarBerlabel.toLocaleString("id-ID")} komentar berlabel
          </span>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid grid-3">
          <div className="card stat">
            <span className="dim kecil">Komentar berlabel</span>
            <b className="num">{ringkasan.totalKomentarBerlabel.toLocaleString("id-ID")}</b>
            <span className="dim kecil">
              {ringkasan.komentarHormuz.toLocaleString("id-ID")} Hormuz +{" "}
              {ringkasan.komentarIsraelPalestine.toLocaleString("id-ID")} Israel-Palestina
            </span>
          </div>
          <div className="card stat">
            <span className="dim kecil">Dimensi analisis</span>
            <b className="num">{ringkasan.dimensi}</b>
            <span className="dim kecil">sentimen, sarkasme, stance</span>
          </div>
          <div className="card stat">
            <span className="dim kecil">Kombinasi model dievaluasi</span>
            <b className="num">{ringkasan.modelDibandingkan}</b>
            <span className="dim kecil">TextCNN dua embedding + RoBERTa, per dimensi</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <h2>Distribusi Label</h2>
        <div className="grid grid-3" style={{ marginTop: 14 }}>
          {DIMENSIONS.map((d) => {
            const data = distribusiLabel[d.key];
            const total = data.reduce((a, x) => a + x.jumlah, 0);
            const teratas = data.reduce((a, x) => (x.jumlah > a.jumlah ? x : a), data[0]);
            const maks = Math.max(...data.map((x) => x.jumlah));
            return (
              <div key={d.key} className="card hasil-kartu" style={{ "--aksen": d.aksen }}>
                <span className="dim-nama">{d.nama}</span>
                <div className="angka-besar num" style={{ color: WARNA_KELAS[teratas.label] }}>
                  {Math.round((teratas.jumlah / total) * 100)}%
                </div>
                <div className="kecil" style={{ color: WARNA_KELAS[teratas.label], fontWeight: 700 }}>
                  {tampil(teratas.label)}
                </div>
                <div style={{ marginTop: 6 }}>
                  {data.map((x) => (
                    <BarisBar
                      key={x.label}
                      nama={tampil(x.label)}
                      teksNilai={x.jumlah.toLocaleString("id-ID")}
                      persen={(x.jumlah / maks) * 100}
                      warna={WARNA_KELAS[x.label]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="card">
          <div className="panel-kepala">
            <h3>Perbandingan Model</h3>
            <div className="toggle" role="group" aria-label="Pilih metrik">
              <button
                className={metrik === "accuracy" ? "aktif" : ""}
                onClick={() => setMetrik("accuracy")}
              >
                ACCURACY
              </button>
              <button
                className={metrik === "f1" ? "aktif" : ""}
                onClick={() => setMetrik("f1")}
              >
                F1-MACRO
              </button>
            </div>
          </div>
          {barisUrut.map((b, i) => (
            <BarisBar
              key={`${b.model}-${b.dimensi}`}
              nama={`${i + 1}. ${b.model} \u00b7 ${b.dimensi}`}
              teksNilai={fmt(b[metrik])}
              persen={b[metrik] * 100}
              warna={b.model.includes("RoBERTa") ? "#00687a" : "#94a3b8"}
            />
          ))}
          <p className="kecil dim" style={{ marginTop: 12 }}>
            {perbandinganModel.catatan} Sembilan kombinasi model dan dimensi
            diurutkan menurut metrik terpilih.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid grid-2">
          <div className="card">
            <div className="panel-kepala">
              <h3>WordCloud per Sentimen</h3>
              {kataTeratas.sample ? <TandaSample /> : null}
            </div>
            {["positive", "negative", "neutral"].map((s) => (
              <div key={s} style={{ marginTop: 10 }}>
                <span className="kecil" style={{ color: WARNA_KELAS[s], fontWeight: 600 }}>
                  {tampil(s)}
                </span>
                <div>
                  {kataTeratas[s].map((k) => (
                    <span className="kata" key={k}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="panel-kepala">
              <h3>Subreddit Teratas</h3>
              {subredditTeratas.sample ? <TandaSample /> : null}
            </div>
            <div className="tabel-bungkus">
              <table className="tabel">
                <thead>
                  <tr>
                    <th>Community</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {subredditTeratas.baris.map((s) => (
                    <tr key={s.nama}>
                      <td>{s.nama}</td>
                      <td className="num">{s.jumlah.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="card">
          <div className="panel-kepala">
            <h3>Tren Komentar per Minggu</h3>
            {trenMingguan.sample ? <TandaSample /> : null}
          </div>
          <Sparkline titik={trenMingguan.titik} />
          <p className="kecil dim">
            Total komentar per minggu, {trenMingguan.titik[0].minggu} sampai{" "}
            {trenMingguan.titik[trenMingguan.titik.length - 1].minggu}. Lonjakan
            diskusi umumnya mengikuti eskalasi peristiwa di lapangan.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <h2>Sorotan Riset</h2>
        <div className="grid grid-3" style={{ marginTop: 14 }}>
          <div className="card card-hover riset-kartu">
            <span className="kategori">Sentimen</span>
            <h4>RoBERTa menembus 91,66 persen</h4>
            <p className="kecil dim">
              Fine-tuning basis Twitter-RoBERTa unggul sekitar 16 poin akurasi
              di atas TextCNN terbaik pada dimensi sentimen, satu-satunya model
              yang melampaui target 90 persen.
            </p>
          </div>
          <div className="card card-hover riset-kartu">
            <span className="kategori">Sarkasme</span>
            <h4>44 persen komentar bernada ironi</h4>
            <p className="kecil dim">
              Hampir separuh komentar terdeteksi sarkastik. Kalimat berpilihan
              kata positif kerap menyampaikan sindiran, alasan utama sentimen
              tidak bisa dibaca sendirian.
            </p>
          </div>
          <div className="card card-hover riset-kartu">
            <span className="kategori">Stance</span>
            <h4>Opini terpolarisasi, netral langka</h4>
            <p className="kecil dim">
              Sekitar 79 persen komentar bersikap menentang dan kelas netral
              hanya 2,7 persen data, tantangan terbesar bagi F1-Macro pada
              dimensi stance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
