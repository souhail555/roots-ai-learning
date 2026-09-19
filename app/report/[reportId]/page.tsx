"use client";

import { use, useEffect, useState } from "react";
import { calculateScores } from "@/lib/scoring";

const sectionCopy = [
  ["Cover Page", "ROOTS Biological Intelligence Report™", "Educational — Not a Diagnosis"],
  ["Executive Summary", "Your current pattern reflects a combination of reported biological signals. These results are educational and describe your answers; they do not diagnose a condition.", "Mention the strongest areas, one strength and any confidence limitation."],
  ["ROOTS Biological State™", "Your ROOTS Biological State™ is {score}/100 — {label}.", "This summarizes the available seven-domain questionnaire pattern; it is not a medical risk probability."],
  ["ROOTS Opportunity Score™", "Your ROOTS Opportunity Score™ is {opportunity}/100.", "This proprietary educational indicator is not a forecast or clinical outcome probability."],
  ["ROOTS Confidence™", "Confidence in this interpretation is {confidenceLabel} ({confidence}/100).", "Coverage, answer confidence and consistency remain visible."],
  ["Key Drivers", "Primary and secondary drivers are selected deterministically from available domain scores.", "AI may explain selected outputs but cannot choose or change them."],
  ["Seven-Domain Score Breakdown", "Seven horizontal score summaries in fixed order: MR, HS, SR, CH, SL, IB, BS.", "Null domains display Not enough information."],
  ["Biological Triad™", "The current triad connects the leading drivers and a protective factor.", "Relationships are presented as possible, not causal."],
  ["Future Projection", "If the current pattern continues, the same signals may remain influential. Small consistent changes may alter the pattern over time.", "This is not a prognosis."],
  ["90-Day Roadmap", "Month 1 — Stabilize signals. Month 2 — Build flexibility. Month 3 — Reinforce recovery.", "Select only eligible educational micro-actions."],
  ["Nutrition Priorities", "Focus on meal structure, adequate protein and fibre, hydration, and timing patterns that match your circumstances.", "No calorie prescription, supplement dosage or therapeutic diet."],
  ["Action Priorities", "Start with the smallest action you can repeat consistently.", "Each action includes a reason, frequency and safety note where applicable."],
  ["What Is Going Well", "Your answers also show strengths that may support change.", "Display only protective factors actually present."],
  ["Specific Concerns", "Some reported signals may deserve additional attention, especially if they are persistent, worsening or affecting daily function.", "Do not display alarming medical labels."],
  ["Suggested Laboratory Discussion", "You may wish to discuss whether any tests are appropriate with a qualified healthcare professional.", "Tests are optional discussion prompts only; ROOTS-AI does not order or interpret tests."],
  ["Participant Answers", "Your answers are shown exactly as submitted.", "Organize by 13 modules and show display labels, N/A, units and questionnaire version."],
  ["Biological Card", "Biological State {score}; Opportunity {opportunity}; Recovery Potential {recovery}; Confidence {confidenceLabel}.", "Compact summary with drivers and rule versions."],
  ["Final Word", "Your answers are a starting point, not a verdict. Choose one realistic action, observe how you respond, and seek professional support when symptoms are persistent or concerning.", ""],
  ["Medical and AI Disclaimer", "ROOTS-AI™ provides educational wellness information based on self-reported answers. It is not a medical device, diagnostic service, clinical assessment, prognosis or substitute for a qualified healthcare professional.", "Scores are proprietary questionnaire indicators; deterministic rules calculate scores and classifications."],
] as const;

export default function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  useEffect(() => {
    const saved = sessionStorage.getItem(`roots-answers-${reportId}`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [reportId]);
  const report = calculateScores(answers);
  const score = report.biologicalState ?? "Not enough information";
  const replace = (text: string) => text.replaceAll("{score}", String(score)).replaceAll("{label}", report.biologicalStateLabel ?? "Not enough information").replaceAll("{opportunity}", report.opportunity === null ? "Not enough information" : report.opportunity.toFixed(1)).replaceAll("{recovery}", report.recoveryPotential === null ? "Not enough information" : report.recoveryPotential.toFixed(1)).replaceAll("{confidence}", String(report.confidence)).replaceAll("{confidenceLabel}", report.confidenceLabel);

  return <main className="report-route route-shell route-shell-wide">
    <header className="report-route-header"><div><p className="eyebrow">ROOTS / REPORT</p><h1>Your ROOTS Biological Intelligence Report™</h1><p className="route-lede">This report summarizes your submitted answers using deterministic scoring rules and governed explanatory language.</p></div><button className="secondary-button" type="button" onClick={() => window.print()}>Download PDF</button></header>
    <div className="report-metadata"><span>Report ID {reportId}</span><span>Version 1.0.0</span><span>Educational — Not a Diagnosis</span></div>
    <section className="report-metrics"><div><small>Biological State</small><strong>{score}</strong><b>{report.biologicalStateLabel ?? "Not enough information"}</b></div><div><small>Opportunity</small><strong>{report.opportunity === null ? "N/A" : report.opportunity.toFixed(1)}</strong></div><div><small>Recovery Potential</small><strong>{report.recoveryPotential === null ? "N/A" : report.recoveryPotential.toFixed(1)}</strong></div><div><small>Confidence</small><strong>{report.confidence}</strong><b>{report.confidenceLabel}</b></div></section>
    <div className="report-sections">{sectionCopy.map(([title, body, note], index) => <article className="report-section-card" id={`report-section-${index + 1}`} key={title}><span className="report-section-number">{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{replace(body)}</p>{index === 5 && report.drivers.length > 0 && <p className="report-detail">{report.drivers.join("; ")}</p>}{index === 6 && <div className="report-domain-list">{Object.entries(report.domains).map(([domain, value]) => <div key={domain}><span>{domain}</span><strong>{value === null ? "Not enough information" : `${value}/100`}</strong></div>)}</div>}<small>{note}</small></div></article>)}</div>
  </main>;
}
