import Link from "next/link";

const pillars = [
  ["01", "Structured assessment", "A governed experience designed to capture clear, consistent responses."],
  ["02", "AI-assisted reporting", "Approved rules turn assessment results into language you can understand."],
  ["03", "Secure by design", "Access controls and transparent consent keep participant data protected."],
];

export default function Home() {
  return (
    <main className="marketing-page">
      <section className="hero-section">
        <div className="hero-copy"><p className="marketing-kicker">BIOLOGICAL CONTEXT, MADE CLEAR</p><h1>Understand the signals that shape <em>you.</em></h1><p>ROOTS-AI turns validated biological and personal context into clear, educational insight.</p><div className="hero-actions"><Link href="/assessment" className="primary-button">Start Your Assessment</Link><Link href="/how-it-works" className="secondary-button">How It Works</Link></div></div>
        <div className="hero-graphic" aria-label="Abstract roots and branching signals"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-core">R</div><span className="signal signal-one">01</span><span className="signal signal-two">AI</span><span className="signal signal-three">DNA</span></div>
      </section>
      <section className="intro-band"><p className="marketing-kicker">A DIFFERENT KIND OF BIOLOGICAL ASSESSMENT</p><h2>From complex inputs to a report you can use.</h2><p>ROOTS-AI is built around validated responses, governed processing, and language that respects the limits of what data can say.</p></section>
      <section className="pillar-grid">{pillars.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</section>
      <section className="home-cta"><h2>Your next layer of understanding starts here.</h2><Link href="/assessment" className="primary-button">Start Your Assessment →</Link></section>
    </main>
  );
}
