import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MarketLens | Explainable crypto market screener", template: "%s | MarketLens" },
  description: "Filter a live CoinMarketCap snapshot by market cap, volume, and 24-hour price change. See exactly why an asset matches.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><body>{children}</body></html>;
}
