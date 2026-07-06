import Link from "next/link";
import Icon from "../components/Icon";
import { DIMENSIONS } from "../lib/labels";
import { ringkasan, perbandinganModel } from "../lib/dashboardData";

const TAG_DIMENSI = {
  sentimen: "Emotion AI",
  sarkasme: "Literary Detection",
  stance: "Ideology Mapping",
};
const IKON_DIMENSI = { sentimen: "senyum", sarkasme: "kilat", stance: "timbangan" };

export default function Beranda() {
  const terbaikRoberta = Math.max(
    ...perbandinganModel.baris.filter((b) => b.model.includes("RoBERTa")).map((b) => b.accuracy)
  );
  const terbaikCNN = Math.max(
    ...perbandinganModel.baris.filter((b) => b.model.includes("CNN")).map((b) => b.accuracy)
  );
  const pct = (x) => `${Math.round(x * 100)}% Acc`;

  return (
    <div className="wrap">
      <section className="hero">
        <span className="eyebrow">
          <Icon nama="perisai" ukuran={14} /> Research Intelligence Platform
        </span>
        <h1>Analisis Opini Publik terhadap Konflik Geopolitik Global</h1>
        <p className="sub">
          Platform riset akademik untuk mendalami dinamika wacana publik melalui
          klasifikasi multi-dimensi (<b>Sentimen</b>, <b>Sarkasme</b>, dan{" "}
          <b>Stance</b>) dengan implementasi model <b>Deep Learning</b> dan{" "}
          <b>Transformer</b> terkini.
        </p>
        <div className="cta">
          <Link href="/analisis" className="btn btn-utama">Mulai Analisis</Link>
          <Link href="/dashboard" className="btn btn-garis">Lihat Dashboard</Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <b className="num">500K+</b>
            <span>Komentar pada dataset sumber</span>
          </div>
          <div className="stat">
            <b className="num">{ringkasan.totalKomentarBerlabel.toLocaleString("id-ID")}</b>
            <span>Komentar berlabel dan teranalisis</span>
          </div>
          <div className="stat">
            <b className="num">{ringkasan.dimensi} Dimensi</b>
            <span>Klasifikasi dalam satu analisis</span>
          </div>
          <div className="stat">
            <b className="num">3 Model</b>
            <span>RoBERTa produksi, satu per dimensi</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Tiga Dimensi Analisis</h2>
        <p className="dim">
          Mengurai kompleksitas opini melalui pendekatan berlapis untuk pemahaman
          konteks yang lebih mendalam.
        </p>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {DIMENSIONS.map((d) => (
            <div key={d.key} className="card card-hover hasil-kartu" style={{ "--aksen": d.aksen }}>
              <div className="ubin"><Icon nama={IKON_DIMENSI[d.key]} /></div>
              <h3>{d.nama}</h3>
              <p className="dim kecil">{d.deskripsi}</p>
              <span className="tag-kecil">{TAG_DIMENSI[d.key]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Dua Pendekatan Model</h2>
        <p className="dim">
          Arsitektur NLP dibandingkan secara ketat pada data yang sama; angka
          akurasi berikut hasil pengujian pada dimensi sentimen.
        </p>
        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card card-hover">
            <div className="hasil-kepala">
              <div className="ubin" style={{ marginBottom: 0 }}><Icon nama="kisi" /></div>
              <span className="badge badge-conf num">{pct(terbaikCNN)}</span>
            </div>
            <h3 style={{ marginTop: 12 }}>Word Embedding + TextCNN</h3>
            <p className="dim kecil">
              Ekstraksi fitur lokal dengan filter n-gram (2 sampai 5) di atas
              representasi Word2Vec dan GloVe untuk menangkap pola frasa pendek.
            </p>
            <p className="kecil" style={{ margin: "10px 0 0" }}>
              <Icon nama="centang" ukuran={14} /> Deep Feature Mapping
            </p>
            <p className="kecil" style={{ margin: "4px 0 0" }}>
              <Icon nama="centang" ukuran={14} /> Pattern Recognition
            </p>
          </div>
          <div className="card card-hover">
            <div className="hasil-kepala">
              <div className="ubin" style={{ marginBottom: 0 }}><Icon nama="lapis" /></div>
              <span className="badge badge-conf num">{pct(terbaikRoberta)}</span>
            </div>
            <h3 style={{ marginTop: 12 }}>RoBERTa Transformer</h3>
            <p className="dim kecil">
              Fine-tuning basis Twitter-RoBERTa yang memahami konteks dua arah
              untuk akurasi linguistik tertinggi; menjadi mesin produksi
              OpiniScope.
            </p>
            <p className="kecil" style={{ margin: "10px 0 0" }}>
              <Icon nama="centang" ukuran={14} /> Contextual Awareness
            </p>
            <p className="kecil" style={{ margin: "4px 0 0" }}>
              <Icon nama="centang" ukuran={14} /> Superior Nuance Detection
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Cara Kerja Sistem</h2>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <div className="card langkah">
            <div className="nomor">1</div>
            <div>
              <h3>Tulis atau unggah</h3>
              <p className="dim kecil">
                Ketik satu komentar pada halaman Analisis, atau unggah CSV pada
                Analisis Massal.
              </p>
            </div>
          </div>
          <div className="card langkah">
            <div className="nomor">2</div>
            <div>
              <h3>Model membaca</h3>
              <p className="dim kecil">
                Tiga model membaca 400 karakter pertama teks secara bersamaan,
                konsisten dengan pipeline pelatihan.
              </p>
            </div>
          </div>
          <div className="card langkah">
            <div className="nomor">3</div>
            <div>
              <h3>Tiga hasil sekaligus</h3>
              <p className="dim kecil">
                Label, tingkat keyakinan, dan probabilitas tiap kelas tampil
                untuk ketiga dimensi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card" style={{ textAlign: "center", padding: 36 }}>
          <h2>Siap Mengeksplorasi Opini Publik?</h2>
          <p className="dim" style={{ maxWidth: 560, margin: "8px auto" }}>
            Analisis komentar pertama Anda sekarang, tanpa akun dan tanpa
            pemasangan apa pun, atau telusuri data risetnya di Dashboard.
          </p>
          <div className="cta" style={{ justifyContent: "center" }}>
            <Link href="/analisis" className="btn btn-utama">Mulai Analisis</Link>
            <Link href="/metodologi" className="btn btn-garis">Baca Metodologi</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
