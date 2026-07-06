# ============================================================
# LANGKAH OPSIONAL - EKSPOR DATA DASHBOARD NYATA
# Jalankan sel ini di Colab setelah seluruh notebook selesai.
# Skrip mencetak isi lengkap berkas lib/dashboardData.js;
# salin seluruh keluarannya lalu timpa berkas tersebut di proyek.
# ============================================================
import json, re
import pandas as pd
import nltk

df = pd.read_csv("reddit_labeled.csv")
banding = pd.read_csv("perbandingan_model.csv")

def js(obj):
    return json.dumps(obj, ensure_ascii=False)

# --- ringkasan ---
n_hormuz = int((df["topik"] == "hormuz").sum()) if "topik" in df.columns else 0
ringkasan = {
    "totalKomentarBerlabel": int(len(df)),
    "komentarHormuz": n_hormuz,
    "komentarIsraelPalestine": int(len(df) - n_hormuz),
    "dimensi": 3,
    "modelDibandingkan": int(len(banding)),
}

# --- distribusi label ---
def dist(kolom):
    vc = df[kolom].value_counts()
    return [{"label": str(k), "jumlah": int(v)} for k, v in vc.items()]

# --- perbandingan model ---
baris_model = [
    {"model": r["Model"].split(" (")[0], "dimensi": r["Dimensi"],
     "accuracy": float(r["Accuracy"]), "f1": float(r["F1-Macro"])}
    for _, r in banding.iterrows()
]

# --- kata teratas per sentimen ---
stop = set(nltk.corpus.stopwords.words("english"))
def kata_top(sub, n=6):
    from collections import Counter
    c = Counter()
    for t in sub["body"].astype(str).head(4000):
        for w in re.findall(r"[a-z]{3,}", t.lower()):
            if w not in stop:
                c[w] += 1
    return [w for w, _ in c.most_common(n)]

kata = {s: kata_top(df[df["label_sentimen"] == s])
        for s in ["negative", "neutral", "positive"]}

# --- subreddit teratas ---
sub_top = []
if "subreddit" in df.columns:
    vc = df["subreddit"].value_counts().head(5)
    sub_top = [{"nama": f"r/{k}", "jumlah": int(v)} for k, v in vc.items()]

# --- tren mingguan ---
tren = []
if "created_utc" in df.columns:
    t = pd.to_datetime(df["created_utc"], errors="coerce", utc=True)
    per = t.dt.to_period("W").value_counts().sort_index().tail(12)
    tren = [{"minggu": str(k.start_time.date()), "jumlah": int(v)} for k, v in per.items()]

print(f"""// Berkas ini dihasilkan otomatis dari notebook (skrip 2_ekspor_dashboard_data.py).
export const ringkasan = {js(ringkasan)};

export const distribusiLabel = {{
  sample: false,
  sentimen: {js(dist("label_sentimen"))},
  sarkasme: {js(dist("label_sarkasme"))},
  stance: {js(dist("label_stance"))},
}};

export const perbandinganModel = {{
  sample: false,
  catatan: "Angka dari run final notebook.",
  baris: {js(baris_model)},
}};

export const kataTeratas = {{
  sample: false,
  negative: {js(kata["negative"])},
  neutral: {js(kata["neutral"])},
  positive: {js(kata["positive"])},
}};

export const subredditTeratas = {{ sample: false, baris: {js(sub_top)} }};

export const trenMingguan = {{ sample: false, titik: {js(tren)} }};
""")
