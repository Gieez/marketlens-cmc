import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return <><SiteHeader /><main className="landing-page">
    <section className="landing-hero">
      <div className="hero-copy"><span className="eyebrow">CRYPTO RESEARCH WORKSPACE</span><h1>Markets move.<br /><span>Know what fits.</span></h1><p>Build a shortlist from CoinMarketCap data. Set your criteria and inspect every match.</p><div className="hero-actions"><Link className="primary-button" href="/app">Open screener <ArrowRight size={17} /></Link><Link className="text-link" href="/docs">How it works <ArrowUpRight size={15} /></Link></div></div>
      <div className="hero-method"><span className="eyebrow">YOUR CRITERIA, IN VIEW</span><h2>A market snapshot.<br />A clear selection.</h2><dl><div><dt>Universe</dt><dd>Top 100 by market cap</dd></div><div><dt>Size</dt><dd>Your minimum capitalization</dd></div><div><dt>Activity</dt><dd>Your minimum 24h volume</dd></div><div><dt>Movement</dt><dd>Your 24h change range</dd></div></dl><Link href="/app">Inspect live results <ArrowRight size={16} /></Link></div>
    </section>
    <section className="landing-purpose"><div><h2>Every shortlist should have a reason.</h2><p>MarketLens shows which thresholds each asset passed, when its data updated, and where the figures came from.</p></div><div className="capability-list"><article><h3>Choose the boundaries</h3><p>Filter market cap, reported volume, and daily movement without making a request on every keystroke.</p></article><article><h3>Inspect each result</h3><p>Open a row to see its filter reasons, weekly change, CMC rank, and update timestamp.</p></article><article><h3>Check the source</h3><p>Read the endpoint reference and export the current market snapshot from the data workspace.</p></article></div></section>
    <footer className="landing-footer"><span>MarketLens / Built with CoinMarketCap</span><Link href="/traction">Data status</Link><Link href="/login">Reviewer access</Link></footer>
  </main></>;
}
