# Design Direction

## Project & Purpose
MarketLens is a research terminal that turns a current CoinMarketCap market snapshot into a filterable, explainable watchlist.

## Audience & Vibe Read
Crypto researchers and retail traders. Precise, fast, calm, data-forward.

## Visual Dials
- DESIGN_VARIANCE: 6
- MOTION_INTENSITY: 3
- VISUAL_DENSITY: 7

## Typography
- Display: Geist Sans, self-host with `next/font`.
- Body: Geist Sans, legible 1.5 line height.
- Market figures and timestamps: Geist Mono.

## Color System
- Background: #0b1011
- Surface: #131a19
- Raised surface: #1a2321
- Text: #ecf2ee
- Muted: #98a6a0
- Single accent: muted mint #79e0b1
- Loss indicator: desaturated red #e88989; gain/loss is semantic market information, not a second brand accent.
- No neon glow or gradient chrome.

## Composition & Canvas
- 1280-1440px wide terminal, desktop split between navigation/market context and screener workspace.
- Dense data rows with clear alignment, selective separators, no generic three-card promo grid.
- Explicit mobile layout: navigation collapses, controls stack, tables become scroll-safe or row summaries.
- Dark theme default; functional light-theme toggle across all routes.

## Interaction
- Filter controls update local results only; never fire a CMC call on each keystroke.
- Asynchronous errors, stale cache, loading and empty states are visible and distinct.
- No motion beyond restrained state transitions; honor prefers-reduced-motion.

## Copy Rules
- English product UI for hackathon judges.
- Active, short copy with real CMC field names and endpoint labels.
- Do not imply forecast, buy/sell advice, or risk-free returns.
- Avoid em dashes, AI clichés, invented activity numbers, and generated market data.

## Forbidden Patterns
- Mock live-data cards, fake metrics, fabricated testing quotes.
- AI-purple gradients, decorative status dots, three equal feature cards, oversized hero.
- Triggering requests directly per search-input change.
- Calling a neutral liquidity/momentum filter a predictive signal.
