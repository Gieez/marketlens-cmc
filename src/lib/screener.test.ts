import { describe, expect, it } from "vitest";
import type { Asset } from "./cmc-types";
import { applyFilters, DEFAULT_FILTERS, getMatchReasons, type ScreenerFilters } from "./screener";

const asset = (overrides: Partial<Asset> = {}): Asset => ({
  id: 1,
  rank: 1,
  name: "Bitcoin",
  symbol: "BTC",
  slug: "bitcoin",
  price: 67234.567,
  marketCap: 1_300_000_000_000,
  volume24h: 28_000_000_000,
  percentChange1h: 0.5,
  percentChange24h: 3.2,
  percentChange7d: -1.8,
  lastUpdated: "2026-11-18T12:00:00.000Z",
  ...overrides,
});

const filters: ScreenerFilters = { ...DEFAULT_FILTERS, minMarketCap: 1_000_000_000_000, minVolume24h: 20_000_000_000, minChange24h: 0, maxChange24h: 5 };

describe("explainable market screener", () => {
  it("keeps assets inside all inclusive thresholds", () => {
    expect(applyFilters([asset()], filters).map((row) => row.symbol)).toEqual(["BTC"]);
  });

  it("excludes assets that miss any criterion", () => {
    const result = applyFilters([
      asset({ symbol: "SMALL", marketCap: 999_999_999_999 }),
      asset({ id: 2, symbol: "THIN", volume24h: 19_999_999_999 }),
      asset({ id: 3, symbol: "BELOW", percentChange24h: -0.01 }),
      asset({ id: 4, symbol: "ABOVE", percentChange24h: 5.01 }),
    ], filters);
    expect(result).toEqual([]);
  });

  it("explains each passed filter without inventing recommendations", () => {
    expect(getMatchReasons(asset(), filters)).toEqual([
      "Market cap meets minimum",
      "24h volume meets minimum",
      "24h change inside range",
    ]);
  });

  it("searches by symbol and name without case sensitivity", () => {
    expect(applyFilters([asset()], { ...DEFAULT_FILTERS, query: "bit" }).length).toBe(1);
    expect(applyFilters([asset()], { ...DEFAULT_FILTERS, query: "btc" }).length).toBe(1);
    expect(applyFilters([asset()], { ...DEFAULT_FILTERS, query: "eth" })).toEqual([]);
  });

  it("sorts by percent change and market cap in either direction", () => {
    const rows = [asset({ symbol: "A", percentChange24h: 2, marketCap: 5 }), asset({ id: 2, symbol: "B", percentChange24h: 8, marketCap: 10 })];
    expect(applyFilters(rows, { ...DEFAULT_FILTERS, minMarketCap: 0, minVolume24h: 0, sortBy: "change", direction: "desc" }).map((row) => row.symbol)).toEqual(["B", "A"]);
    expect(applyFilters(rows, { ...DEFAULT_FILTERS, minMarketCap: 0, minVolume24h: 0, sortBy: "marketCap", direction: "asc" }).map((row) => row.symbol)).toEqual(["A", "B"]);
  });
});
