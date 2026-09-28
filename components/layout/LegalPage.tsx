import type { ReactNode } from "react";
import Link from "next/link";
import PrintButton from "@/components/layout/PrintButton";

export interface LegalSection {
  title: string;
  text: string;
}

export interface LegalLink {
  label: string;
  href: string;
}

export default function LegalPage({ eyebrow, title, intro, sections, children, relatedLinks = [] }: { eyebrow: string; title: string; intro: string; sections: LegalSection[]; children?: ReactNode; relatedLinks?: LegalLink[] }) {
  return <main className="legal-page">
    <section className="legal-heading"><p className="marketing-kicker">{eyebrow}</p><h1>{title}</h1><p className="legal-meta">Effective date: 21 July 2026 • Version: 1.0.1</p><PrintButton /></section>
    <div className={`legal-layout${sections.length === 0 ? " legal-layout-single" : ""}`}>{sections.length > 0 && <nav className="legal-contents" aria-label="On this page"><strong>Contents</strong>{sections.map((section, index) => <a key={section.title} href={`#legal-section-${index}`}>{index + 1}. {section.title}</a>)}</nav>}<article className="legal-article"><p className="legal-intro">{intro}</p>{sections.map((section, index) => <section id={`legal-section-${index}`} key={section.title}><h2>{index + 1}. {section.title}</h2><p>{section.text}</p></section>)}{children}{relatedLinks.length > 0 && <div className="legal-related"><h2>Related information</h2>{relatedLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>}</article></div>
  </main>;
}
