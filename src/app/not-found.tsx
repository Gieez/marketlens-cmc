import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return <><SiteHeader /><main className="not-found-page"><span className="eyebrow">404 / NOT FOUND</span><h1>This route does not exist.</h1><p>Use the navigation to return to the MarketLens workspace.</p><a className="primary-button" href="/app">Open screener</a></main></>;
}
