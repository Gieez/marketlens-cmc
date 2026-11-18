import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined, CircleHelp, ScanSearch } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/app", label: "Screener", icon: ScanSearch },
  { href: "/traction", label: "Data", icon: ChartNoAxesCombined },
  { href: "/docs", label: "Docs", icon: CircleHelp },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="MarketLens home">
        <Image className="brand-mark" src="/marketlens-mark.svg" alt="" width={32} height={32} priority />
        <span className="brand-name">market<span>lens</span></span>
      </Link>
      <nav className="primary-nav" aria-label="Main navigation">
        {links.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}><Icon size={15} strokeWidth={1.8} /><span>{label}</span></Link>
        ))}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link className="nav-cta" href="/app">Open screener <ArrowUpRight size={15} /></Link>
      </div>
    </header>
  );
}
