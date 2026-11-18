import { AppShell } from "@/components/app-shell";
import { getScreenerSnapshot, toApiError } from "@/lib/cmc";
import { formatTimestamp } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DataPage() {
  let snapshot = null;
  let failure = "";
  try { snapshot = await getScreenerSnapshot(); }
  catch (error) { failure = toApiError(error).message; }
  return <AppShell active="/traction"><article className="docs-page"><span className="eyebrow">DATA WORKSPACE</span><h1>Follow the source.</h1><p className="lead">Inspect the current snapshot, its coverage, and its source endpoints.</p>
    {failure && <p role="alert" className="notice error-notice">{failure}</p>}
    <section><h2>Snapshot status</h2><dl className="status-list"><div><dt>Provider</dt><dd>CoinMarketCap</dd></div><div><dt>Listings</dt><dd>{snapshot ? `${snapshot.assets.length} assets received` : "Unavailable"}</dd></div><div><dt>Retrieved</dt><dd>{snapshot ? formatTimestamp(snapshot.retrievedAt) : "Unavailable"}</dd></div><div><dt>Cache policy</dt><dd>60-second server revalidation</dd></div></dl></section>
    {snapshot && <section><h2>Request evidence</h2><p>These are the source requests used for this snapshot. Export returns the currently available normalized snapshot, which may be newer than this page.</p><div className="endpoint-list">{Object.entries(snapshot.source).map(([label, source]) => <p key={label}><b>{label}</b><br /><code>{source ?? "Unavailable"}</code></p>)}</div><a className="primary-button" href="/api/markets?download=1">Export snapshot JSON ↓</a>{snapshot.warnings.map((warning) => <p className="notice" key={warning}>{warning}</p>)}</section>}
    <section><h2>Coverage, not traction</h2><p>This page reports market-data availability. MarketLens does not collect user analytics and has no verified user-growth or trading-performance figures to report.</p></section>
  </article></AppShell>;
}
