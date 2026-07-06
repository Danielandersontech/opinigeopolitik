import Icon from "../../components/Icon";

export default function Metodologi() {
  return (
    <div className="wrap">
      <section className="section">
        <span className="eyebrow"><Icon nama="lapis" ukuran={14} /> Metodologi</span>
        <h1 style={{ fontSize: "2.1rem" }}>Bagaimana OpiniScope dibangun</h1>
        <p className="dim" style={{ maxWidth: 660 }}>
          Ringkasan metodologi riset di balik platform ini, dari data mentah
          sampai model yang melayani prediksi.
        </p>

        <div className="card" style={{ marginTop: 18 }}>
          <h3>Data dan pelabelan otomatis</h3>
          <p className="kecil dim">
            Sumber data adalah dataset publik Kaggle berisi lebih dari 500 ribu
            komentar Reddit tentang konflik Israel-Palestina (Oktober 2023
            sampai 2026), termasuk periode krisis Selat Hormuz. Sebanyak 40.000
            komentar dilabeli otomatis dengan pendekatan pseudo-labeling
            menggunakan tiga model pretrained tervalidasi: Twitter-RoBERTa
            untuk sentimen, Twitter-RoBERTa Irony untuk sarkasme, dan BART-MNLI
            zero-shot untuk stance. Kualitas label ditinjau melalui rekam jejak
            benchmark model pelabel dan pemeriksaan konsistensi pada data.
          </p>
        </div>

        <div className="card">
          <h3>Dua pendekatan pemodelan</h3>
          <p className="kecil dim">
            Pendekatan pertama memakai representasi Word2Vec dan GloVe dengan
            arsitektur TextCNN multi-kernel. Pendekatan kedua melakukan
            fine-tuning basis Twitter-RoBERTa per dimensi dengan weighted
            cross-entropy untuk menangani ketimpangan kelas. Keduanya dilatih
            dan diuji pada pembagian data yang sama (80 banding 20, berstrata).
          </p>
        </div>

        <div className="card">
          <h3>Evaluasi</h3>
          <p className="kecil dim">
            Seluruh model dievaluasi dengan accuracy, precision, recall,
            F1-Macro, dan confusion matrix pada 7.994 komentar uji. Model
            terbaik, RoBERTa hasil fine-tuning, mencapai akurasi 91,66 persen
            pada dimensi sentimen dan menjadi mesin prediksi platform ini.
            Karena label merupakan pseudo-label, seluruh metrik bermakna
            tingkat kesepakatan terhadap model pelabel.
          </p>
        </div>

        <div className="card">
          <h3>Arsitektur layanan</h3>
          <p className="kecil dim">
            Antarmuka web berjalan di Vercel dan meneruskan permintaan ke
            server model FastAPI yang memuat tiga model RoBERTa. Praproses
            masukan identik dengan pelatihan, yaitu 400 karakter pertama teks,
            sehingga hasil di web setara dengan evaluasi riset.
          </p>
        </div>
      </section>
    </div>
  );
}
