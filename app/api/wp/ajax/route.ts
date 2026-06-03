import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AJAX_URL =
  process.env.NEXT_PUBLIC_WP_AJAX ||
  "https://sewarmarine.com/wp-admin/admin-ajax.php";

export async function POST(req: NextRequest) {
  console.log("[wp/ajax] proxying to:", AJAX_URL);
  try {
    const form = await req.formData();
    const action = form.get("action");
    console.log("[wp/ajax] action:", action);

    const r = await fetch(AJAX_URL, {
      method: "POST",
      body: form,
      cache: "no-store",
      headers: { "User-Agent": "SewarDashboard/1.0" },
    });
    const text = await r.text();
    console.log("[wp/ajax] status:", r.status);
    console.log("[wp/ajax] body:", text.slice(0, 800));

    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return new NextResponse(text, { status: r.status });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    console.error("[wp/ajax] fetch error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 502 });
  }
}
