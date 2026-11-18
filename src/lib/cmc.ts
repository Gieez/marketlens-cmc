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

type CmcEnvelope<T> = {
  data: T;
  status?: { timestamp?: string; error_code?: number | string; error_message?: string | null };
};

type CmcAsset = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  last_updated: string;
  quote: Array<{
    symbol: string;
    price: number;
    market_cap: number;
    volume_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    last_updated: string;
  }>;
};

type CmcGlobal = {
  quote: { USD: { total_market_cap: number; total_volume_24h: number; total_market_cap_yesterday_percentage_change: number } };
  btc_dominance: number;
  eth_dominance: number;
  active_cryptocurrencies: number;
  last_updated: string;
};

type CmcFearGreed = { value: number; value_classification: string; update_time: string };

const BASE = process.env.CMC_PRO_API_KEY
  ? "https://pro-api.coinmarketcap.com"
  : "https://pro-api.coinmarketcap.com/public-api";

const FETCH_HEADERS: Record<string, string> = {
  Accept: "application/json",
  ...(process.env.CMC_PRO_API_KEY ? { "X-CMC_PRO_API_KEY": process.env.CMC_PRO_API_KEY } : {}),
};

const TIMEOUT_MS = 12_000;
const LISTINGS_ENDPOINT = "/v3/cryptocurrency/listings/latest";

async function fetchCmc<T>(path: string): Promise<CmcEnvelope<T>> {
  const url = new URL(`${BASE}${path}`);
  if (path.includes("listings/latest")) {
    url.searchParams.set("start", "1");
    url.searchParams.set("limit", "100");
  }
  url.searchParams.set("convert", "USD");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: controller.signal,
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    const body = (await response.json()) as CmcEnvelope<T>;
    if (!response.ok || (body.status && Number(body.status.error_code) !== 0)) {
      const message = body.status?.error_message || `CoinMarketCap returned HTTP ${response.status}`;
      throw new Error(message);
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

function toAsset(record: CmcAsset): Asset {
  const usd = record.quote.find((quote) => quote.symbol === "USD") ?? record.quote[0];
  if (!usd) throw new Error(`CoinMarketCap omitted USD quote for ${record.symbol}`);

  return {
    id: record.id,
    rank: record.cmc_rank,
    name: record.name,
    symbol: record.symbol,
    slug: record.slug,
    price: usd.price,
    marketCap: usd.market_cap,
    volume24h: usd.volume_24h,
    percentChange1h: usd.percent_change_1h,
    percentChange24h: usd.percent_change_24h,
    percentChange7d: usd.percent_change_7d,
    lastUpdated: usd.last_updated,
  };
}

export async function getScreenerSnapshot(): Promise<ScreenerSnapshot> {
  const warnings: string[] = [];
  const listingsResult = await fetchCmc<CmcAsset[]>(LISTINGS_ENDPOINT);
  const assets = listingsResult.data.map(toAsset);

  const [globalResult, fearResult] = await Promise.allSettled([
    fetchCmc<CmcGlobal>("/v1/global-metrics/quotes/latest"),
    fetchCmc<CmcFearGreed>("/v3/fear-and-greed/latest"),
  ]);

  const metrics =
    globalResult.status === "fulfilled"
      ? {
          marketCap: globalResult.value.data.quote.USD.total_market_cap,
          volume24h: globalResult.value.data.quote.USD.total_volume_24h,
          btcDominance: globalResult.value.data.btc_dominance,
          ethDominance: globalResult.value.data.eth_dominance,
          marketCapChange24h: globalResult.value.data.quote.USD.total_market_cap_yesterday_percentage_change,
          activeCryptocurrencies: globalResult.value.data.active_cryptocurrencies,
        }
      : null;
  if (globalResult.status === "rejected") warnings.push("Global market metrics are unavailable.");

  const fearGreed =
    fearResult.status === "fulfilled"
      ? {
          value: fearResult.value.data.value,
          classification: fearResult.value.data.value_classification,
          updatedAt: fearResult.value.data.update_time,
        }
      : null;
  if (fearResult.status === "rejected") warnings.push("Fear and Greed data is unavailable.");

  return {
    assets,
    metrics,
    fearGreed,
    status: "live",
    retrievedAt: new Date().toISOString(),
    source: {
      listings: `GET ${BASE}/v3/cryptocurrency/listings/latest?start=1&limit=100&convert=USD`,
      globalMetrics: metrics ? `GET ${BASE}/v1/global-metrics/quotes/latest?convert=USD` : null,
      fearAndGreed: fearGreed ? `GET ${BASE}/v3/fear-and-greed/latest` : null,
    },
    warnings,
  };
}

export function toApiError(error: unknown): { code: string; message: string } {
  if (error instanceof Error && error.name === "AbortError") {
    return { code: "CMC_TIMEOUT", message: "CoinMarketCap did not respond within 12 seconds. Retry in a moment." };
  }
  const detail = error instanceof Error ? error.message : "Unknown upstream error";
  const sanitized = detail.replace(/[\r\n\t]/g, " ").slice(0, 220);
  return { code: "CMC_UNAVAILABLE", message: `Live market data is unavailable. ${sanitized}` };
}
