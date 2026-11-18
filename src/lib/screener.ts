import type { Asset } from "./cmc-types";

export type ScreenerFilters = {
  query: string;
  minMarketCap: number;
  minVolume24h: number;
  minChange24h: number;
  maxChange24h: number;
  sortBy: "rank" | "change" | "volume24h" | "marketCap";
  direction: "asc" | "desc";
};

export const DEFAULT_FILTERS: ScreenerFilters = {
  query: "",
  minMarketCap: 1_000_000_000,
  minVolume24h: 50_000_000,
  minChange24h: -15,
  maxChange24h: 15,
  sortBy: "rank",
  direction: "asc",
};

export function getMatchReasons(asset: Asset, filters: ScreenerFilters): string[] {
  const reasons: string[] = [];
  if (asset.marketCap >= filters.minMarketCap) reasons.push("Market cap meets minimum");
  if (asset.volume24h >= filters.minVolume24h) reasons.push("24h volume meets minimum");
  if (asset.percentChange24h >= filters.minChange24h && asset.percentChange24h <= filters.maxChange24h) {
    reasons.push("24h change inside range");
  }
  return reasons;
}

export function applyFilters(assets: Asset[], filters: ScreenerFilters): Asset[] {
  const needle = filters.query.trim().toLowerCase();
  const filtered = assets.filter((asset) => {
    const matchesSearch = !needle || asset.name.toLowerCase().includes(needle) || asset.symbol.toLowerCase().includes(needle);
    return matchesSearch &&
      asset.marketCap >= filters.minMarketCap &&
      asset.volume24h >= filters.minVolume24h &&
      asset.percentChange24h >= filters.minChange24h &&
      asset.percentChange24h <= filters.maxChange24h;
  });
  const key: Record<ScreenerFilters["sortBy"], keyof Asset> = {
    rank: "rank",
    change: "percentChange24h",
    volume24h: "volume24h",
    marketCap: "marketCap",
  };
  const field = key[filters.sortBy];
  const direction = filters.direction === "asc" ? 1 : -1;
  return filtered.sort((a, b) => ((a[field] as number) - (b[field] as number)) * direction);
}
