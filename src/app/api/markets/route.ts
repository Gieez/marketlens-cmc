import { NextResponse } from "next/server";
import { getScreenerSnapshot, toApiError } from "@/lib/cmc";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const snapshot = await getScreenerSnapshot();
    const download = new URL(request.url).searchParams.get("download") === "1";
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        ...(download ? { "Content-Disposition": "attachment; filename=marketlens-cmc-snapshot.json" } : {}),
      },
    });
  } catch (error) {
    const failure = toApiError(error);
    return NextResponse.json({ error: failure, retrievedAt: new Date().toISOString(), source: "CoinMarketCap" }, { status: 503 });
  }
}
