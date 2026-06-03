import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_WP_AJAX!;
  try {
    const form = await req.formData();
    const r = await fetch(url, { method: "POST", body: form, cache: "no-store" });
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return new NextResponse(text, { status: r.status });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ success: false, error: msg }, { status: 502 });
  }
}
