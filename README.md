# MarketLens

MarketLens turns a current CoinMarketCap market snapshot into a filterable, explainable shortlist. This is a hackathon MVP in the **Markets and Trading Tools** track, not a trading signal or advice product.

## Run locally

Requirements: Node.js 20.9+.

```bash
npm install
npm run dev
```

Open `http://localhost:3180`.

Optional: copy `.env.example` to `.env.local` and set `CMC_PRO_API_KEY` on the server only. Without a key, MarketLens uses CoinMarketCap's official keyless public API. The key must never use a `NEXT_PUBLIC_` prefix or enter the browser bundle.

## Product routes

- `/` product overview
- `/app` live screener for the top 100 CMC listings, search, market-cap and reported-volume minimums, daily change range, sort, and per-asset match explanations
- `/docs` data flow, rules, API endpoints, limits, and feedback
- `/traction` current snapshot health and JSON evidence download
- `/login` reviewer entry (public, no account or wallet)
- `/api/markets` normalized CMC snapshot; add `?download=1` to download evidence JSON
- `/api/health` process liveness
- Explicit `/app` loading and error boundaries, plus a custom 404 route and generated SVG favicon.

## CMC endpoints used

- `GET /v3/cryptocurrency/listings/latest?start=1&limit=100&convert=USD`
- `GET /v1/global-metrics/quotes/latest?convert=USD`
- `GET /v3/fear-and-greed/latest`

Fetches have a 12-second upstream timeout. Next.js caches upstream data for 60 seconds. Global metrics and Fear & Greed are optional. If they fail, listings remain visible with a warning. If listings fail, the app displays an error rather than invented data.

Keyless quota is shared by IP and may rate-limit. Use hackathon Startup enrollment or a server-side key for higher access. No account registration, wallet connection, trade execution, private key, or analytics is required for the reviewer.

## Filter method

An asset qualifies when the CMC-reported market cap and 24-hour volume meet the chosen minimums and its 24-hour percent change sits inside the inclusive range. Search matches asset name or symbol. Default results follow CMC rank. Filter changes use the same market snapshot and do not trigger additional upstream API requests.

The returned top 100 universe is selected by CMC market-cap rank, so filters do not evaluate assets outside those 100. CMC-reported volume is not order-book depth or guaranteed executable liquidity. Stablecoins and wrapped assets may appear. Results are not financial advice.

## Development checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

No public repo, deployment, hackathon registration, X post, or submission has been made by this repository yet. Those steps need their own credentials and review.
