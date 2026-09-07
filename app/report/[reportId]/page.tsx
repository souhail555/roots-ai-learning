"use client";

import { use, useEffect, useState } from "react";
import questionsData from "@/data/questions.json";
import { calculateScores } from "@/lib/scoring";
import { buildReport } from "@/lib/reportGenerator";

export default function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  useEffect(() => {
    const saved = sessionStorage.getItem(`roots-answers-${reportId}`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [reportId]);
  const scores = calculateScores(answers);
  const report = buildReport(reportId, scores);

  return (
    <main className="route-shell route-shell-wide">
      <p className="eyebrow">ROOTS / REPORT</p>
      <h1>Your growth map is ready.</h1>
      <p className="route-lede">A starting point for understanding how your roots, learning style, and motivation connect.</p>
      <section className="report-summary"><div><span className="report-score">{report.overallScore}</span><span className="report-denom">/ 100</span><h2>{report.band}</h2></div><div className="category-list">{Object.entries(report.categoryScores).map(([category, score]) => <div key={category}><span>{category}</span><strong>{score}%</strong></div>)}</div></section>
      <p className="report-note">This reflection is educational and does not provide medical or professional advice.</p>
    </main>
  );
}
