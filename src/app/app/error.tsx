"use client";

import { useEffect } from "react";

export default function ScreenerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("MarketLens route error", error); }, [error]);
  return <main className="workspace-content"><section className="route-error" role="alert">
    <span className="eyebrow">MARKET DATA</span>
    <h1>The screener stopped loading.</h1>
    <p>MarketLens could not render this page. No sample prices have been substituted.</p>
    <button className="primary-button" type="button" onClick={reset}>Try again</button>
  </section></main>;
}
