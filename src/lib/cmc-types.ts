export type Asset = {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  price: number;
  marketCap: number;
  volume24h: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  lastUpdated: string;
};

export type GlobalMetrics = {
  marketCap: number;
  volume24h: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  activeCryptocurrencies: number;
};

export type FearGreed = {
  value: number;
  classification: string;
  updatedAt: string;
};

export type ScreenerSnapshot = {
  assets: Asset[];
  metrics: GlobalMetrics | null;
  fearGreed: FearGreed | null;
  status: "live" | "cached";
  retrievedAt: string;
  source: {
    listings: string;
    globalMetrics: string | null;
    fearAndGreed: string | null;
  };
  warnings: string[];
};
