# OpiniScope API - server inferensi tiga dimensi (Hugging Face Space, Docker)
import os
import re
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification

HF_TOKEN = os.environ.get("HF_TOKEN")  # secret Space; perlu bila repo model private
OWNER = os.environ.get("MODEL_OWNER", "Danielanderson22")

REPO = {
    "sentimen": f"{OWNER}/opiniscope-sentimen",
    "sarkasme": f"{OWNER}/opiniscope-sarkasme",
    "stance": f"{OWNER}/opiniscope-stance",
}
MAX_LEN = 128  # sama dengan konfigurasi pelatihan

print("Memuat tiga model, mohon tunggu...")
MODELS = {}
for dim, repo in REPO.items():
    tok = AutoTokenizer.from_pretrained(repo, token=HF_TOKEN)
    mdl = AutoModelForSequenceClassification.from_pretrained(repo, token=HF_TOKEN)
    mdl.eval()
    MODELS[dim] = (tok, mdl)
    print("Siap:", repo)
print("Seluruh model termuat.")

app = FastAPI(title="OpiniScope API", version="2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def praproses(t: str) -> str:
    """400 karakter pertama + perapian spasi, identik dengan pipeline pelatihan."""
    return re.sub(r"\s+", " ", str(t)[:400]).strip()


def nama_label(mdl, i: int) -> str:
    id2label = mdl.config.id2label or {}
    return id2label.get(i) or id2label.get(str(i)) or f"LABEL_{i}"


class Masukan(BaseModel):
    text: str


@app.get("/")
@app.get("/health")
def health():
    return {
        "status": "ok",
        "engine": "roberta-space",
        "dimensi_aktif": list(MODELS.keys()),
    }


@app.post("/predict")
def predict(m: Masukan):
    text = (m.text or "").strip()
    if not text:
        return {"error": "Teks tidak boleh kosong."}
    clean = praproses(text)

    results = {}
    with torch.no_grad():
        for dim, (tok, mdl) in MODELS.items():
            enc = tok(clean, max_length=MAX_LEN, padding="max_length",
                      truncation=True, return_tensors="pt")
            logits = mdl(**enc).logits[0]
            proba = torch.softmax(logits, dim=-1).tolist()
            pmap = {nama_label(mdl, i): round(float(p), 4)
                    for i, p in enumerate(proba)}
            terbaik = max(pmap, key=pmap.get)
            results[dim] = {
                "label": terbaik,
                "confidence": pmap[terbaik],
                "proba": pmap,
            }

    return {
        "input": text,
        "preprocessed": clean,
        "engine": "roberta-space",
        "results": results,
    }
