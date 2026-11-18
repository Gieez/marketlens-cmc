import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", service: "marketlens-cmc", marketData: "CoinMarketCap" }, {
    headers: { "Cache-Control": "no-store" },
  });
}
