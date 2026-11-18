import { describe, expect, it, vi, afterEach } from "vitest";
import { getScreenerSnapshot, toApiError } from "./cmc";

afterEach(() => vi.unstubAllGlobals());

describe("CoinMarketCap adapter", () => {
  it("normalizes listings and retains endpoint provenance", async () => {
    const base = {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      slug: "bitcoin",
      cmc_rank: 1,
      last_updated: "2026-11-18T12:00:00.000Z",
      quote: [{ symbol: "USD", price: 42, market_cap: 10_000, volume_24h: 500, percent_change_1h: 1, percent_change_24h: 2, percent_change_7d: 3, last_updated: "2026-11-18T12:00:00.000Z" }],
    };
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("listings/latest")) return Response.json({ data: [base], status: { error_code: 0 } });
      if (url.includes("global-metrics")) return Response.json({ data: { quote: { USD: { total_market_cap: 100, total_volume_24h: 20, total_market_cap_yesterday_percentage_change: -0.5 } }, btc_dominance: 40, eth_dominance: 20, active_cryptocurrencies: 123, last_updated: "now" }, status: { error_code: 0 } });
      if (url.includes("fear-and-greed")) return Response.json({ data: { value: 13, value_classification: "Extreme fear", update_time: "now" }, status: { error_code: 0 } });
      return new Response("not found", { status: 404 });
    }));
    const result = await getScreenerSnapshot();
    expect(result.assets[0]).toMatchObject({ symbol: "BTC", price: 42, marketCap: 10_000, percentChange24h: 2 });
    expect(result.metrics?.btcDominance).toBe(40);
    expect(result.fearGreed?.classification).toBe("Extreme fear");
    expect(result.source.listings).toContain("/v3/cryptocurrency/listings/latest");
  });

  it("fails loudly when the critical market listing endpoint fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ status: { error_code: 429, error_message: "rate limited" } }), { status: 429 })));
    await expect(getScreenerSnapshot()).rejects.toThrow("rate limited");
  });

  it("returns a short, newline-safe timeout message", () => {
    const error = toApiError(Object.assign(new Error("abort"), { name: "AbortError" }));
    expect(error.code).toBe("CMC_TIMEOUT");
    expect(error.message).toContain("12 seconds");
  });
});
