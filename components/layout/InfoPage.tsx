import Link from "next/link";

export interface InfoPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; text: string }>;
}

export default function InfoPage({ eyebrow, title, intro, sections }: InfoPageProps) {
  return (
    <main className="marketing-page inner-page">
      <section className="page-heading">
        <p className="marketing-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="info-section-grid">
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
      <div className="center-actions"><Link href="/assessment" className="primary-button">Start Your Assessment</Link></div>
    </main>
  );
}
