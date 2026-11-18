export default function ScreenerLoading() {
  return <main className="workspace-content" aria-label="Loading market screener">
    <div className="screener-page loading-screen" aria-busy="true">
      <div className="skeleton-block skeleton-heading" />
      <div className="skeleton-block skeleton-metrics" />
      <div className="skeleton-block skeleton-controls" />
      <div className="skeleton-table">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-row" key={index}><span /><span /><span /></div>)}</div>
      <span className="sr-only">Loading CoinMarketCap listings</span>
    </div>
  </main>;
}
