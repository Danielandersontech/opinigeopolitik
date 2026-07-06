import { NextResponse } from "next/server";
import { preprocess } from "../../../lib/preprocess";
import { DIMENSIONS } from "../../../lib/labels";
import {
  panggilHF,
  panggilSpace,
  prediksiDemo,
  modeDemo,
  modeSpace,
} from "../../../lib/hf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {}
  const text = String(body.text || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Teks tidak boleh kosong." }, { status: 400 });
  }

  const clean = preprocess(text);

  // ---- Mode Space: satu panggilan membawa ketiga dimensi ----
  if (modeSpace()) {
    try {
      const data = await panggilSpace(text);
      return NextResponse.json({
        input: text,
        preprocessed: data.preprocessed || clean,
        engine: data.engine || "roberta-space",
        demo: false,
        results: data.results,
      });
    } catch (e) {
      const pesan = e && e.message ? e.message : String(e);
      const results = {};
      for (const dim of DIMENSIONS) results[dim.key] = { error: pesan };
      return NextResponse.json({
        input: text,
        preprocessed: clean,
        engine: "roberta-space",
        demo: false,
        results,
      });
    }
  }

  // ---- Mode HF Inference API / demo: per dimensi ----
  const demo = modeDemo();
  const results = {};

  await Promise.all(
    DIMENSIONS.map(async (dim) => {
      try {
        const proba = demo
          ? prediksiDemo(clean, dim)
          : await panggilHF(dim.key, clean);
        let terbaik = dim.classes[0];
        for (const c of dim.classes) {
          if ((proba[c] || 0) > (proba[terbaik] || 0)) terbaik = c;
        }
        const rapikan = {};
        for (const c of dim.classes) rapikan[c] = Number((proba[c] || 0).toFixed(4));
        results[dim.key] = {
          label: terbaik,
          confidence: rapikan[terbaik],
          proba: rapikan,
        };
      } catch (e) {
        results[dim.key] = { error: e && e.message ? e.message : String(e) };
      }
    })
  );

  return NextResponse.json({
    input: text,
    preprocessed: clean,
    engine: demo ? "demo" : "roberta-hf",
    demo,
    results,
  });
}
