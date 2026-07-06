import { NextResponse } from "next/server";
import { modeDemo } from "../../../lib/hf";
import { DIMENSIONS } from "../../../lib/labels";

export const runtime = "nodejs";

export async function GET() {
  const demo = modeDemo();
  return NextResponse.json({
    status: "ok",
    engine: demo ? "demo" : "roberta-hf",
    demo,
    dimensi_aktif: DIMENSIONS.map((d) => d.key),
  });
}
