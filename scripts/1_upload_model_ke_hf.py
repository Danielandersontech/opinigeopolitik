# ============================================================
# LANGKAH 1 - UNGGAH TIGA MODEL KE HUGGING FACE HUB
# Jalankan sel ini di Colab SETELAH Bagian 8 notebook selesai
# (folder model_transformer_sentimen / _sarkasme / _stance sudah ada).
#
# Persiapan:
# 1. Buat akun di https://huggingface.co (gratis).
# 2. Buat token WRITE di https://huggingface.co/settings/tokens.
# 3. Isi USERNAME di bawah, jalankan sel, tempel token saat diminta.
# ============================================================
from huggingface_hub import login
from transformers import AutoModelForSequenceClassification, AutoTokenizer

login()  # tempel token WRITE ketika kotak input muncul

USERNAME = "ISI_USERNAME_HF_ANDA"   # contoh: "kelompok4pcr"

# Urutan label WAJIB sama dengan urutan sorted() pada notebook
LABELS = {
    "sentimen": ["negative", "neutral", "positive"],
    "sarkasme": ["irony", "not_irony"],
    "stance":   ["against", "favour", "neutral"],
}

for dim, kelas in LABELS.items():
    folder = f"./model_transformer_{dim}"
    model = AutoModelForSequenceClassification.from_pretrained(folder)
    tok = AutoTokenizer.from_pretrained(folder)

    # Menanam nama kelas ke config agar Inference API mengembalikan label
    # asli (negative/neutral/positive), bukan LABEL_0/1/2.
    model.config.id2label = {i: k for i, k in enumerate(kelas)}
    model.config.label2id = {k: i for i, k in enumerate(kelas)}

    repo = f"{USERNAME}/opiniscope-{dim}"
    model.push_to_hub(repo, private=True)
    tok.push_to_hub(repo, private=True)
    print("Terunggah:", f"https://huggingface.co/{repo}")

print("\nSelesai. Salin ketiga nama repo di atas ke berkas .env.local proyek Next.js.")
