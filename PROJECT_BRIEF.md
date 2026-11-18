# MarketLens

MarketLens is a CoinMarketCap-powered market screener that explains why each asset matches a user's filters. Product is a research and discovery tool, not investment advice.

## Product Direction

- Audience: retail crypto researchers who need to narrow broad markets into a reviewable shortlist.
- Track: Markets and Trading Tools.
- Main job: filter a CMC market snapshot by change, market capitalization, and reported 24-hour volume, then make each match explainable.
- Core differentiator: every row exposes the explicit filter conditions it passed, the snapshot timestamp, and why another asset did not pass.
- No AI verdicts, promises of returns, or fake performance metrics.
- No wallet connections, orders, alerts, personalization account, or paid-tier assumptions in MVP.

## Scope

### MVP

- `/`: public product entry, live global market context, and link into screener.
- `/app`: interactive screener with server-fetched CMC listings, search, sorting, and editable minimum market-cap, minimum reported volume, and 24-hour change range filters. Display passed conditions per result and an explicit no-match state.
- `/docs`: system/data flow, explicit endpoint catalogue, limitations, privacy/security, and CMC API feedback section.
- `/traction`: data-source health, current sample size, snapshot timestamp, and downloadable snapshot evidence. No fabricated user counts or traction.
- `/login`: reviewer/demo access information; no real identity system in MVP.
- `/api/markets`, `/api/health`: server API surface. `/api/markets` supports the free keyless route and CMC key via server-only env.
- `/app/loading`, `/app/error`, `/not-found`: explicit loading, failure, and 404 states; generated SVG favicon via `app/icon.svg`.
- Show market-data freshness and stale/degraded/error states. Cache market snapshot server-side; do not poll in a tight loop.
- Search by name/symbol, filter, sort, responsive and accessible interactions.
- Public GitHub-ready repository, README, `.env.example`, tests, record real endpoint names and unmodified sanitized API sample data from an actual request.

### Post-MVP

- Real CMC hackathon Startup access activation and validation with the user's enrolled API email.
- Register and submit the project on DoraHacks, post on X, publish/deploy externally only after explicit approval of the target account, exact content, URL/repo and credentials.
- Public GitHub publication, Vercel deployment, and social posting require explicit confirmation.
- Refined branded demo video and final evidence capture.

## Technical Decisions

- Next.js App Router + TypeScript + minimal CSS, React Server Components for market pages, small client islands for filters/theme controls.
- Dark by default, manual light/dark toggle, domain-native trading-terminal layout, split wide desktop canvas and responsive single-column mobile.
- No database, authentication provider, wallet connection, chain integration, browser storage of secrets, or external analytics in MVP.
- CMC public keyless API is the fallback. An optional `CMC_PRO_API_KEY` is server-only. The public keyless endpoints are subject to shared IP-based rate limits, so cache on the server and refresh manually or conservatively.
- Never expose/commit CMC credentials. Never substitute fixture/mock prices for the live market screen. A failed API response must show an honest unavailable/stale state.
- Make no performance or trading recommendation claims. Ranking must state its precise neutral sort/filter rule.

## Acceptance Criteria

- Every visible market value in the screener is fetched from a named CMC endpoint at runtime, with HTTP response/status/freshness traceability.
- Filter and sorting work on real listings without creating network requests on every input change.
- Unit tests verify filter boundaries, exclusion reasons, sorting, and safe CMC error handling.
- Build, lint, typecheck, tests and a real HTTP smoke test pass.
- All routes load and navigate from desktop and mobile viewport. No console exceptions during the core screener flow.
- Error, loading, empty, stale, and healthy states do not display fake evidence.
- `.env.example` is committed-safe; environment files and API secrets stay out of public git history.

## Open Items

- Real CMC hackathon key is not activated/present in this workstation environment. No credentials have been created or stored.
- User registration/enrollment for the CMC free Startup tier remains to be done in CMC/DoraHacks accounts.
- Repo remote, public deployment, DoraHacks submission and X post are not authorized/published yet.
