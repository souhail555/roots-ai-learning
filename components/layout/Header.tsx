"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const links = [
    ["How It Works", "/how-it-works"],
    ["Platform", "/platform"],
    ["Example Report", "/example-report"],
    ["Research", "/research"],
    ["About", "/about"],
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">ROOTS-AI<sup>TM</sup></Link>
        <nav className="site-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>)}
        </nav>
        <Link href="/assessment" className="header-cta">Start Assessment</Link>
      </div>
    </header>
  );
}
