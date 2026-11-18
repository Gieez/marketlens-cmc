import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function LoginPage() {
  return <AppShell><section className="reviewer-page"><span className="eyebrow">REVIEWER ACCESS</span><h1>Open the workspace.</h1><p className="lead">MarketLens is public. Explore the screener without an account or wallet.</p><div className="access-panel"><h2>Public research session</h2><p>Your filters run in this browser. This MVP does not save a personal watchlist or offer account synchronization.</p><Link className="primary-button" href="/app">Open screener →</Link><Link className="text-link" href="/docs">Read the endpoint reference</Link></div></section></AppShell>;
}
