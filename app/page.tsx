"use client";

import Link from "next/link";
import { useState } from "react";
import ReferenceHeroSvg from "@/components/layout/ReferenceHeroSvg";

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

function ReferenceHeroVisual() {
  const [biologicalState, setBiologicalState] = useState(61);
  const [stateLabel, setStateLabel] = useState("STRAINED");
  const [showControls, setShowControls] = useState(false);
  
  const nodes = [["MR", "Metabolic", "node-left node-mr"], ["HU", "Hunger", "node-top node-hu"], ["SR", "Sleep", "node-right node-sr"], ["CH", "Circadian", "node-right node-ch"], ["SL", "Stress", "node-right node-sl"], ["IN", "Inflammation", "node-bottom node-in"], ["SA", "Safety", "node-left node-sa"]];
  
  const getStateLabel = (score: number) => {
    if (score <= 24) return "OPTIMIZED";
    if (score <= 49) return "COMPENSATING";
    if (score <= 74) return "STRAINED";
    return "DYSREGULATED";
  };
  
  const handleStateChange = (newState: number) => {
    setBiologicalState(newState);
    setStateLabel(getStateLabel(newState));
  };
  
  return (
    <div className="company-hero-visual orbit-hero-visual" aria-label="Seven connected biological domains surrounding Biological State">
      <div className="orbit-plane orbit-plane-one" />
      <div className="orbit-plane orbit-plane-two" />
      <div className="orbit-plane orbit-plane-three" />
      <div className="orbit-grid" />
      <div className="company-hero-state">
        <small>BIOLOGICAL</small>
        <strong>STATE</strong>
        <em>{biologicalState} / 100</em>
        <b>{stateLabel}</b>
      </div>
      {nodes.map(([code, label, className]) => (
        <div className={`orbit-domain-node ${className}`} key={code}>
          <strong>{code}</strong>
          <span>{label}</span>
        </div>
      ))}
      <button 
        className="hero-controls-toggle" 
        onClick={() => setShowControls(!showControls)}
        aria-label="Toggle controls"
      >
        ⚙️
      </button>
      {showControls && (
        <div className="hero-controls-panel">
          <label>
            Biological State Score:
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={biologicalState} 
              onChange={(e) => handleStateChange(Number(e.target.value))}
            />
            <span>{biologicalState}</span>
          </label>
          <div className="control-buttons">
            <button onClick={() => handleStateChange(0)}>0</button>
            <button onClick={() => handleStateChange(25)}>25</button>
            <button onClick={() => handleStateChange(50)}>50</button>
            <button onClick={() => handleStateChange(75)}>75</button>
            <button onClick={() => handleStateChange(100)}>100</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [reportState, setReportState] = useState<"loaded" | "loading" | "error">("loaded");
  return <main id="main-content" className="pub-page">
    <section className="pub-hero pub-zone"><div className="pub-shell hero-layout"><div className="hero-copy"><p className="pub-kicker">BIOLOGICAL INTELLIGENCE PLATFORM</p><h1>Decode the Biology<br />Before You Fight <span>the Weight</span></h1><p className="hero-lede">ROOTS-AI™ turns a structured assessment into a governed biological intelligence report—helping you understand patterns in metabolism, hunger, sleep, circadian timing, stress, inflammation-related signals and perceived biological resistance.</p><div className="hero-actions"><Link href="/assessment/start" className="primary-button">Start Your Assessment</Link><Link href="/example-report" className="secondary-button">View Example Report</Link></div><div className="hero-proof"><span>73 QUESTIONS</span><span>7 DOMAINS</span><span>1 CONNECTED VIEW</span></div></div><ReferenceHeroVisual /></div></section>
    <section className="trust-strip"><div className="pub-shell trust-grid"><span>Educational, not diagnostic</span><span>Private by design</span><span>Deterministic scoring</span><span>AI assists with explanation, not calculation</span></div></section>
    <section className="pub-section pub-shell"><div className="section-heading"><p className="pub-kicker">WHAT CHANGES</p><h2>A connected view of the patterns behind the struggle.</h2></div><div className="feature-grid">{features.map(([title, text], index) => <article className="feature-card" key={title}><span className="card-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="pub-section domain-section"><div className="pub-shell"><div className="section-heading"><p className="pub-kicker">SEVEN CONNECTED DOMAINS</p><h2>One biological intelligence framework.</h2><p>Signals move through adaptation, compensation and resistance before becoming a readable Biological State.</p></div><div className="domain-reference-visual"><ReferenceHeroSvg /></div></div></section>
    <section className="pub-section pub-shell"><div className="section-heading"><p className="pub-kicker">HOW IT WORKS</p><h2>From structured answers to governed explanation.</h2></div><div className="steps-grid">{steps.map(([title, text], index) => <article className="step-card" key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="report-section"><div className="pub-shell report-layout"><div className="report-intro"><p className="pub-kicker">EXAMPLE REPORT</p><h2>See the state, drivers and boundaries clearly.</h2><p>The preview uses approved sample values and demonstrates the required loaded, loading and error states.</p><Link href="/example-report" className="secondary-button">View Example Report</Link></div><div className="report-shell"><div className="report-tabs">{(["loaded", "loading", "error"] as const).map((state) => <button key={state} type="button" className={reportState === state ? "active" : ""} onClick={() => setReportState(state)}>{state}</button>)}</div>{reportState === "loaded" && <div className="report-state"><div className="score-row"><div><small>Biological State</small><strong>61<em>/100</em></strong></div><span className="state-pill">Strained</span></div><div className="driver-bar" style={{ "--value": "75%" } as React.CSSProperties}><span>Stress Load</span><b>75</b></div><div className="protection-field"><span>Sleep Recovery Index™</span><b>68</b></div><div className="confidence-meter"><span>Confidence</span><b>High · 0.86</b></div><div className="opportunity-field"><span>Opportunity</span><b>Metabolic Resistance</b></div><p className="boundary-note">This is a questionnaire summary, not a medical risk probability.</p></div>}{reportState === "loading" && <div className="loading-state"><h3>Preparing example report</h3><span /><span /><span /><p>No score is shown until approved sample data is available.</p></div>}{reportState === "error" && <div className="error-state"><span className="error-mark">!</span><h3>Example report unavailable</h3><p>The reference could not load this state safely.</p><button type="button" className="primary-button" onClick={() => setReportState("loaded")}>Retry</button></div>}</div></div></section>
    <section className="pub-section pilot-section"><div className="pub-shell pilot-layout"><div><p className="pub-kicker">PILOT PROGRAM</p><h2>Join the ROOTS-AI™ Free Beta.</h2><p>The beta explores whether a structured, non-diagnostic assessment can help people understand self-reported patterns involving weight resistance, energy, sleep, stress and appetite.</p><Link href="/pilot" className="primary-button">Check Eligibility</Link></div><ul><li>Adults aged 18 and over.</li><li>Participation is voluntary and withdrawal is permitted.</li><li>The experience is educational and does not provide medical care.</li><li>Usability feedback and research participation require separate consent.</li><li>No payment is required for the approved beta cohort.</li></ul></div></section>
    <section className="final-cta"><div className="pub-shell"><p className="pub-kicker">A CLEARER START</p><h2>Understand your signals. Choose your next step.</h2><Link href="/assessment/start" className="primary-button">Start Your Assessment</Link></div></section>
  </main>;
}
