"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ChevronDown, ChevronUp, Search, SlidersHorizontal, X } from "lucide-react";
import type { Asset, ScreenerSnapshot } from "@/lib/cmc-types";
import { applyFilters, DEFAULT_FILTERS, getMatchReasons, type ScreenerFilters } from "@/lib/screener";
import { formatCompact, formatPercent, formatPrice, formatTimestamp } from "@/lib/format";

type Props = { snapshot: ScreenerSnapshot | null; failure?: string };

function Metric({ label, value, suffix, negative }: { label: string; value: string; suffix?: string; negative?: boolean }) {
  return <div className="metric-block"><span>{label}</span><strong className={negative ? "negative" : ""}>{value}{suffix && <small>{suffix}</small>}</strong></div>;
}

function AssetRow({ asset, filters, expanded, onExpand }: { asset: Asset; filters: ScreenerFilters; expanded: boolean; onExpand: () => void }) {
  const change = asset.percentChange24h;
  return <>
    <tr className="asset-row" aria-expanded={expanded}>
      <td className="asset-name"><button className="asset-expand" type="button" onClick={onExpand} aria-expanded={expanded} aria-label={`${expanded ? "Hide" : "Show"} ${asset.name} filter reasons`}><span className="rank-num">{String(asset.rank).padStart(2, "0")}</span><span className="coin-avatar">{asset.symbol.slice(0, 1)}</span><span className="asset-copy"><b>{asset.name}</b><small>{asset.symbol}</small></span></button></td>
      <td className="numeric"><strong>{formatPrice(asset.price)}</strong></td>
      <td className="numeric hide-tablet"><span>{formatCompact(asset.marketCap)}</span></td>
      <td className="numeric hide-mobile"><span>{formatCompact(asset.volume24h)}</span></td>
      <td className="numeric"><span className={change > 0 ? "positive change" : change < 0 ? "negative change" : "change"}>{formatPercent(change)}</span></td>
      <td className="row-expand"><button type="button" aria-expanded={expanded} aria-label={`${expanded ? "Hide" : "Show"} ${asset.name} filter reasons`} onClick={onExpand}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button></td>
    </tr>
    {expanded && <tr className="explain-row"><td colSpan={6}><div className="explain-inner"><div><b>Why it matches</b><p>{getMatchReasons(asset, filters).join(" · ")}</p></div><div><b>7d change</b><p className={asset.percentChange7d >= 0 ? "positive" : "negative"}>{formatPercent(asset.percentChange7d)}</p></div><div><b>Market-cap rank</b><p>#{asset.rank} on CoinMarketCap</p></div><div><b>Updated</b><p>{formatTimestamp(asset.lastUpdated)}</p></div></div></td></tr>}
  </>;
}

export function Screener({ snapshot, failure }: Props) {
  const [filters, setFilters] = useState<ScreenerFilters>(DEFAULT_FILTERS);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const assets = useMemo(() => snapshot?.assets ?? [], [snapshot?.assets]);
  const results = useMemo(() => applyFilters(assets, { ...filters, query }), [assets, filters, query]);
  const update = (key: keyof ScreenerFilters, value: number | string) => setFilters((prev) => ({ ...prev, [key]: value }));
  const sort = (key: ScreenerFilters["sortBy"]) => setFilters((prev) => ({ ...prev, sortBy: key, direction: prev.sortBy === key && prev.direction === "desc" ? "asc" : "desc" }));
  const metrics = snapshot?.metrics;

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  return <div className="screener-page">
    <section className="page-heading screener-heading"><div><span className="eyebrow">MARKET SCREENER</span><h1>Find the market <span>that fits.</span></h1><p>Filter the top 100 assets by reported volume, size, and daily movement.</p></div><div className="snapshot-state"><span className={snapshot ? "status-led live" : "status-led"} />{snapshot ? "CMC snapshot" : "Waiting for data"}<small>{snapshot ? formatTimestamp(snapshot.retrievedAt) : ""}</small></div></section>
    {failure && <div className="notice error-notice" role="alert"><b>Market data is unavailable</b><span>{failure}</span></div>}
    {snapshot?.warnings.map((warning) => <div className="notice warning-notice" key={warning}>{warning}</div>)}
    <section className="metric-strip" aria-label="Market overview">
      <Metric label="TOTAL MARKET CAP" value={metrics ? formatCompact(metrics.marketCap) : "Unavailable"} />
      <Metric label="24H MARKET VOLUME" value={metrics ? formatCompact(metrics.volume24h) : "Unavailable"} />
      <Metric label="BTC DOMINANCE" value={metrics ? metrics.btcDominance.toFixed(1) : "Unavailable"} suffix={metrics ? "%" : undefined} />
      <Metric label="FEAR & GREED" value={snapshot?.fearGreed ? String(snapshot.fearGreed.value) : "Unavailable"} suffix={snapshot?.fearGreed ? ` · ${snapshot.fearGreed.classification}` : undefined} />
    </section>
    <section className="screener-workspace">
      <div className="table-toolbar"><div className="table-title"><div><span className="toolbar-title"><Activity size={15} /> Market universe</span><span className="result-count">{results.length} of {assets.length} assets match</span></div><button className="control-button filter-toggle" type="button" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={15} /> Filters {showFilters ? <X size={14} /> : null}</button></div>
        <div className="search-box"><Search size={16} /><input ref={searchRef} aria-label="Search assets" placeholder="Search assets or symbols" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div>
      </div>
      {showFilters && <div className="filter-panel">
        <label className="filter-field"><span>Market cap minimum</span><select value={filters.minMarketCap} onChange={(event) => update("minMarketCap", Number(event.target.value))}><option value={0}>Any size</option><option value={100_000_000}>$100M+</option><option value={1_000_000_000}>$1B+</option><option value={10_000_000_000}>$10B+</option></select></label>
        <label className="filter-field"><span>24h volume minimum</span><select value={filters.minVolume24h} onChange={(event) => update("minVolume24h", Number(event.target.value))}><option value={0}>Any volume</option><option value={10_000_000}>$10M+</option><option value={50_000_000}>$50M+</option><option value={250_000_000}>$250M+</option><option value={1_000_000_000}>$1B+</option></select></label>
        <label className="filter-field"><span>24h change floor</span><select value={filters.minChange24h} onChange={(event) => update("minChange24h", Number(event.target.value))}><option value={-25}>-25%</option><option value={-15}>-15%</option><option value={-5}>-5%</option><option value={0}>0%</option><option value={5}>+5%</option></select></label>
        <label className="filter-field"><span>24h change ceiling</span><select value={filters.maxChange24h} onChange={(event) => update("maxChange24h", Number(event.target.value))}><option value={5}>+5%</option><option value={10}>+10%</option><option value={15}>+15%</option><option value={25}>+25%</option><option value={100}>+100%</option></select></label>
        <button className="reset-link" type="button" onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(""); }}>Reset filters</button>
      </div>}
      {assets.length > 0 ? <div className="table-scroll"><table className="asset-table"><thead><tr><th><button className="head-sort" type="button" onClick={() => sort("rank")}>ASSET <small>/ RANK</small></button></th><th className="right-head">PRICE</th><th className="right-head hide-tablet"><button className="head-sort" type="button" onClick={() => sort("marketCap")}>MARKET CAP</button></th><th className="right-head hide-mobile"><button className="head-sort" type="button" onClick={() => sort("volume24h")}>VOLUME 24H</button></th><th className="right-head"><button className="head-sort" type="button" onClick={() => sort("change")}>CHANGE 24H</button></th><th aria-label="Expand details" /></tr></thead><tbody>{results.map((asset) => <AssetRow asset={asset} filters={{ ...filters, query }} key={asset.id} expanded={expanded === asset.id} onExpand={() => setExpanded(expanded === asset.id ? null : asset.id)} />)}</tbody></table>{results.length === 0 && <div className="empty-state"><b>No assets match these filters</b><span>Broaden the change range or lower a minimum to see more of the market.</span><button type="button" className="control-button" onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(""); }}>Reset filters</button></div>}</div> : <div className="empty-state"><b>Live listings need an API response</b><span>No sample prices are shown. Refresh the page after the market feed is available.</span></div>}
      <footer className="table-footer"><span>Source: <code>{snapshot?.source.listings.replace("GET https://pro-api.coinmarketcap.com", "CMC") ?? "CMC listings endpoint"}</code></span><span>Ranked and filtered by reported CMC data. Not a trading signal.</span></footer>
    </section>
  </div>;
}
