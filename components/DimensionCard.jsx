import { tampil, WARNA_KELAS } from "../lib/labels";

export default function DimensionCard({ dim, hasil }) {
  if (!hasil) return null;

  if (hasil.error) {
    return (
      <div className="card hasil-kartu" style={{ "--aksen": dim.aksen }}>
        <span className="dim-nama">{dim.nama}</span>
        <div className="banner banner-merah kecil" style={{ marginTop: 12 }}>
          {hasil.error}
        </div>
      </div>
    );
  }

  return (
    <div className="card hasil-kartu" style={{ "--aksen": dim.aksen }}>
      <div className="hasil-kepala">
        <span className="dim-nama">{dim.nama}</span>
        <span className="badge badge-conf num">
          {(hasil.confidence * 100).toFixed(1)}% yakin
        </span>
      </div>
      <div className="label-utama" style={{ color: WARNA_KELAS[hasil.label] }}>
        {tampil(hasil.label)}
      </div>
      <div style={{ marginTop: 8 }}>
        {dim.classes.map((c) => {
          const p = hasil.proba[c] || 0;
          return (
            <div className="baris-proba" key={c}>
              <div className="nama">
                <span>{tampil(c)}</span>
                <span className="num">{(p * 100).toFixed(1)}%</span>
              </div>
              <div className="trek">
                <div
                  className="isi"
                  style={{ width: `${Math.max(2, p * 100)}%`, "--warna": WARNA_KELAS[c] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
