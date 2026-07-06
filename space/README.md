---
title: OpiniScope API
emoji: "\U0001F6F0"
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# OpiniScope API

Server inferensi tiga dimensi opini (sentimen, sarkasme, stance) untuk
aplikasi OpiniScope. Memuat tiga model RoBERTa hasil fine-tuning dan
menyajikan endpoint:

- GET  /health  -> status server
- POST /predict -> {"text": "..."} menghasilkan tiga prediksi sekaligus

Bila repo model bersifat private, isi secret HF_TOKEN pada Settings Space.
