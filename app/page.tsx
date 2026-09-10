"use client";

import Link from "next/link";
import { useState } from "react";

const domains = [
  ["MR", "Metabolic Resistance™", "Self-reported resistance to expected weight change and activity-related metabolic context."],
  ["HS", "Hunger & Satiety Signals™", "Hunger, craving, fullness and post-meal response patterns."],
  ["SR", "Sleep Recovery Index™", "Sleep duration, continuity and perceived restoration."],
  ["CH", "Circadian Health Score™", "Alignment of light, screen, meal and sleep timing."],
  ["SL", "Stress Load™", "Perceived tension, cognitive activation and stress-linked eating."],
  ["IB", "Inflammation Burden Index™", "Non-specific symptom burden; not a laboratory or clinical inflammation measure."],
  ["BS", "Biological Safety Signals™", "Perceived energy, appetite drive and resistance signals."],
];

const features = [
  ["Beyond a number on the scale", "See the pattern behind the struggle."],
  ["Seven biological domains", "One connected view."],
  ["Deterministic scores", "AI assists with explanation, not calculation."],
  ["Your report", "19 transparent sections with your answers and limitations."],
  ["Private by design", "Controlled access, versioning and audit."],
  ["Educational, not diagnostic", "Designed to support informed conversations and realistic next steps."],
];

const steps = [
  ["Assess", "Complete the structured 73-question assessment."],
  ["Validate", "Normalise approved responses and preserve N/A."],
  ["Analyse", "Deterministic rules calculate seven domains and derived indicators, then select drivers, confidence and eligible content."],
  ["Explain & Render", "Governed AI turns approved explanation objects into clear language; web and PDF reports are produced from the same immutable report."],
];

export default function Home() {
  const [reportState, setReportState] = useState<"loaded" | "loading" | "error">("loaded");
  return (
    <main id="main-content" className="pub-page">
      <section className="pub-hero pub-zone">
        <span className="pub-zone-label">PUB01-Z02 · HERO</span>
        <div className="pub-shell hero-layout">
          <div className="hero-copy">
            <p className="pub-kicker">BIOLOGICAL INTELLIGENCE PLATFORM</p>
            <h1>Decode the biology before you fight the weight.</h1>
            <p className="hero-lede">ROOTS-AI™ turns a structured assessment into a governed biological intelligence report—helping you understand patterns in metabolism, hunger, sleep, circadian timing, stress, inflammation-related signals and perceived biological resistance.</p>
            <div className="hero-actions"><Link href="/assessment/start" className="primary-button">Start Your Assessment</Link><Link href="/example-report" className="secondary-button">View Example Report</Link></div>
            <div className="hero-proof"><span>73 questions</span><span>7 domains</span><span>1 connected view</span></div>
          </div>
          <div className="biology-visual hero-signature" aria-label="Biological State connected to seven biological domains">
            <div className="visual-grid" />
            <div className="visual-ring signature-path ring-outer" /><div className="visual-ring signature-path ring-middle" /><div className="visual-ring signature-path ring-inner" />
            <div className="visual-core signature-center"><span>BIOLOGICAL</span><strong>STATE</strong><small>61 / 100 · STRAINED</small></div>
            <span className="signal-node signature-node node-metabolic">ME<span>Metabolic</span></span>
            <span className="signal-node signature-node node-hunger">HU<span>Hunger</span></span>
            <span className="signal-node signature-node node-sleep">SL<span>Sleep</span></span>
            <span className="signal-node signature-node node-circadian">CI<span>Circadian</span></span>
            <span className="signal-node signature-node node-stress">ST<span>Stress</span></span>
            <span className="signal-node signature-node node-inflammation">IN<span>Inflammation</span></span>
            <span className="signal-node signature-node node-safety">SA<span>Safety</span></span>
          </div>
        </div>
      </section>

      <section className="trust-strip pub-zone"><span className="pub-zone-label">PUB01-Z03 · TRUST STRIP</span><div className="pub-shell trust-grid"><span>Educational, not diagnostic</span><span>Private by design</span><span>Deterministic scoring</span><span>AI assists with explanation, not calculation</span></div></section>
      <section className="pub-section pub-shell pub-zone"><span className="pub-zone-label">PUB01-Z04 · SIX FEATURES</span><div className="section-heading"><p className="pub-kicker">WHAT CHANGES</p><h2>A connected view of the patterns behind the struggle.</h2></div><div className="feature-grid">{features.map(([title, text], index) => <article className="feature-card" key={title}><span className="card-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="pub-section domain-section pub-zone"><span className="pub-zone-label">PUB01-Z05 · SEVEN DOMAINS</span><div className="pub-shell"><div className="section-heading"><p className="pub-kicker">SEVEN CONNECTED DOMAINS</p><h2>One biological intelligence framework.</h2><p>Signals move through adaptation, compensation and resistance before becoming a readable Biological State.</p></div><div className="domain-story" aria-label="Seven connected biological domains"><div className="domain-track" aria-hidden="true" /><div className="domain-story-grid">{domains.map(([code, title, text]) => <article className="domain-node" key={code}><span className="domain-code">{code}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="domain-narrative">Signals <span>→</span> Adaptation <span>→</span> Compensation <span>→</span> Resistance <span>→</span> State <span>→</span> Opportunity</p></div></div></section>
      <section className="pub-section pub-shell pub-zone"><span className="pub-zone-label">PUB01-Z06 · HOW IT WORKS</span><div className="section-heading"><p className="pub-kicker">HOW IT WORKS</p><h2>From structured answers to governed explanation.</h2></div><div className="steps-grid">{steps.map(([title, text], index) => <article className="step-card" key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="report-section pub-zone"><span className="pub-zone-label">PUB01-Z07 · EXAMPLE REPORT</span><div className="pub-shell report-layout"><div className="report-intro"><p className="pub-kicker">EXAMPLE REPORT</p><h2>See the state, drivers and boundaries clearly.</h2><p>The preview uses approved sample values and demonstrates the required loaded, loading and error states.</p><Link href="/example-report" className="secondary-button">View Example Report</Link></div><div className="report-shell" aria-live="polite"><div className="report-tabs">{(["loaded", "loading", "error"] as const).map((state) => <button key={state} type="button" className={reportState === state ? "active" : ""} onClick={() => setReportState(state)}>{state}</button>)}</div>{reportState === "loaded" && <div className="report-state"><div className="score-row"><div><small>Biological State</small><strong>61<em>/100</em></strong></div><span className="state-pill">Strained</span></div><div className="driver-bar" style={{ "--value": "75%" } as React.CSSProperties}><span>Stress Load</span><b>75</b></div><div className="protection-field"><span>Sleep Recovery Index™</span><b>68</b></div><div className="confidence-meter"><span>Confidence</span><b>High · 0.86</b></div><div className="opportunity-field"><span>Opportunity</span><b>Metabolic Resistance</b></div><p className="boundary-note">This is a questionnaire summary, not a medical risk probability.</p></div>}{reportState === "loading" && <div className="report-state loading-state"><h3>Preparing example report</h3><span /><span /><span /><p>No score is shown until approved sample data is available.</p></div>}{reportState === "error" && <div className="report-state error-state"><span className="error-mark">!</span><h3>Example report unavailable</h3><p>The reference could not load this state safely.</p><button type="button" className="primary-button" onClick={() => setReportState("loaded")}>Retry</button></div>}</div></div></section>
      <section className="pub-section pilot-section pub-zone"><span className="pub-zone-label">PUB01-Z08 · PILOT CTA</span><div className="pub-shell pilot-layout"><div><p className="pub-kicker">PILOT PROGRAM</p><h2>Join the ROOTS-AI™ Free Beta.</h2><p>The beta explores whether a structured, non-diagnostic assessment can help people understand self-reported patterns involving weight resistance, energy, sleep, stress and appetite.</p><Link href="/pilot" className="primary-button">Check Eligibility</Link></div><ul><li>Adults aged 18 and over.</li><li>Participation is voluntary and withdrawal is permitted.</li><li>The experience is educational and does not provide medical care.</li><li>Usability feedback and research participation require separate consent.</li><li>No payment is required for the approved beta cohort.</li></ul></div></section>
      <section className="final-cta pub-zone"><span className="pub-zone-label">PUB01-Z09 · FINAL ACTION</span><div className="pub-shell"><p className="pub-kicker">A CLEARER START</p><h2>Understand your signals. Choose your next step.</h2><Link href="/assessment/start" className="primary-button">Start Your Assessment</Link></div></section>
    </main>
  );
}
