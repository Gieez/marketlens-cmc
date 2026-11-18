import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "./site-header";

type AppShellProps = { children: ReactNode; active?: string };

const navItems = [
  { href: "/app", label: "Market screener" },
  { href: "/traction", label: "Data status" },
  { href: "/docs", label: "Documentation" },
];

export function AppShell({ children, active = "" }: AppShellProps) {
  return (
    <>
      <SiteHeader />
      <div className="workspace-shell">
        <aside className="workspace-rail">
          <div className="rail-section"><span className="rail-label">WORKSPACE</span>
            {navItems.map((item) => (
              <Link className={active === item.href ? "rail-link active" : "rail-link"} href={item.href} key={item.href}>
                <span>{item.label}</span>{item.href === active && <span className="rail-active-mark" />}
              </Link>
            ))}
          </div>
          <div className="rail-note">
            <span className="rail-label">MARKET DATA</span>
            <p>CoinMarketCap snapshot. Rankings show market capitalization, not a trade signal.</p>
            <Link href="/docs">Read methodology <ArrowUpRight size={13} /></Link>
          </div>
          <div className="rail-footer">MarketLens · Research tool</div>
        </aside>
        <main className="workspace-content">{children}</main>
      </div>
    </>
  );
}
