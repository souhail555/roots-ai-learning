"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { CanonicalReportRecord } from "@/lib/db";

/**
 * Authorized interactive web report.
 *
 * M3 requirement 5: this page renders from the SAME stored canonical report
 * object as the PDF. It does NOT recalculate scores. The previous implementation
 * read answers from client-side storage and re-ran calculateScores in the browser,
 * which meant the displayed values were not the authoritative stored result and
 * could be altered by editing browser state. That path is removed.
 */

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "unauthorized" }
  | { status: "ready"; record: CanonicalReportRecord };

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
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/assessment/sessions/${reportId}/report`, { credentials: "same-origin" })
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 403) {
          setState({ status: "unauthorized" });
          return;
        }
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          setState({ status: "error", message: detail.error ?? "The report could not be loaded." });
          return;
        }
        setState({ status: "ready", record: (await response.json()) as CanonicalReportRecord });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", message: "The report could not be loaded." });
      });
    return () => { cancelled = true; };
  }, [reportId]);

  if (state.status === "loading") {
    return <main className="report-route route-shell route-shell-wide">
      <p className="eyebrow">ROOTS / REPORT</p>
      <h1>Preparing your report</h1>
      <div role="status" aria-live="polite"><p>Loading the report from the stored record. No score is shown until it is available.</p></div>
    </main>;
  }

  if (state.status === "unauthorized") {
    return <main className="report-route route-shell route-shell-wide">
      <p className="eyebrow">ROOTS / REPORT</p>
      <h1>This report is not available</h1>
      <p className="route-lede">This report belongs to a different session. Reports are only visible to the session that created them.</p>
      <Link href="/assessment" className="primary-button">Start your assessment</Link>
    </main>;
  }

  if (state.status === "error") {
    return <main className="report-route route-shell route-shell-wide">
      <p className="eyebrow">ROOTS / REPORT</p>
      <h1>Report unavailable</h1>
      <div className="error-state" role="alert"><span className="error-mark" aria-hidden="true">!</span><p>{state.message}</p></div>
      <Link href="/assessment" className="primary-button">Start your assessment</Link>
    </main>;
  }

  const { report } = state.record;
  const { scoring, provenance } = report;

  return <main className="report-route route-shell route-shell-wide">
    <header className="report-route-header"><div><p className="eyebrow">ROOTS / REPORT</p><h1>Your ROOTS Biological Intelligence Report™</h1><p className="route-lede">This report summarizes your submitted answers using deterministic scoring rules and governed explanatory language.</p></div><a className="secondary-button" href={`/api/assessment/sessions/${report.assessmentId}/report/pdf`}>Download report document</a></header>
    <div className="report-metadata"><span>Report ID {report.id}</span><span>{provenance.reportVersion}</span><span>Educational — Not a Diagnosis</span></div>
    <section className="report-metrics" aria-label="Deterministic report summary"><div><small>Biological State</small><strong>{scoring.biologicalState ?? "Not available"}</strong><b>{scoring.biologicalStateLabel ?? "Not available"}</b></div><div><small>Opportunity</small><strong>{scoring.opportunity === null ? "N/A" : scoring.opportunity.toFixed(1)}</strong></div><div><small>Recovery Potential</small><strong>{scoring.recoveryPotential === null ? "N/A" : scoring.recoveryPotential.toFixed(1)}</strong></div><div><small>Scored domains</small><strong>{scoring.scoredDomainCount} / 7</strong></div></section>

    <section aria-label="Text equivalents for the report values"><h2>Report values in text</h2><ul>{Object.entries(report.numericEquivalents).map(([key, text]) => <li key={key}>{text}</li>)}</ul></section>

    <section aria-label="Seven-domain breakdown"><h2>Seven-domain breakdown</h2><div className="report-domain-list">{Object.entries(scoring.domains).map(([domain, value]) => <div key={domain}><span>{domain}</span><strong>{value === null ? "Not enough information" : `${value}/100`}</strong></div>)}</div></section>

    <section aria-label="Drivers"><h2>Key Drivers</h2>{scoring.drivers.length === 0 ? <p>No eligible drivers were produced by the deterministic rules.</p> : <p className="report-detail">{scoring.drivers.join("; ")}{scoring.coPrimary ? " (co-primary pair shown as a single entry)" : ""}</p>}</section>

    <div className="report-sections">{report.sections.map((section) => <article className="report-section-card" id={`report-section-${section.index}`} key={section.index}><span className="report-section-number">{String(section.index).padStart(2, "0")}</span><div><h2>{section.title}</h2>{section.narrative ? <p>{section.narrative}</p> : <p className="report-reduced">{section.reduced ? "This section is in an explicit reduced state. No substitute content has been inserted." : "No narrative is available for this section."}</p>}{section.reduced && section.reducedReason ? <small>{section.reducedReason}</small> : null}</div></article>)}</div>

    <footer className="report-boundary">
      <p>{provenance.ai ? (provenance.ai.usedFallback ? "The narrative in this report was not AI-generated. Your calculated scores are complete and unaffected. Educational — Not a Diagnosis." : "Narrative is AI-assisted and explains the deterministically calculated scores. It does not determine them. Educational — Not a Diagnosis.") : "Narrative generation is disabled. Your calculated scores are produced by deterministic rules. Educational — Not a Diagnosis."}</p>
      <p>Content hash (deterministic spine): <code>{report.contentHash}</code></p>
    </footer>
 </main>;
}
