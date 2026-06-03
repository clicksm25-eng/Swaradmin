import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NONCE_URL =
  process.env.NEXT_PUBLIC_WP_NONCE_URL ||
  "https://sewarmarine.com/wp-json/sewar/v1/nonce";

export async function GET() {
  console.log("[wp/nonce] fetching:", NONCE_URL);
  try {
    const r = await fetch(NONCE_URL, {
      cache: "no-store",
      headers: { "User-Agent": "SewarDashboard/1.0" },
    });
    const text = await r.text();
    console.log("[wp/nonce] status:", r.status);
    console.log("[wp/nonce] body:", text.slice(0, 500));
    if (!r.ok) {
      return NextResponse.json(
        { error: `nonce endpoint returned ${r.status}`, body: text.slice(0, 500) },
        { status: 502 }
      );
    }
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ error: "non-JSON response", body: text.slice(0, 500) }, { status: 502 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    console.error("[wp/nonce] fetch error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
