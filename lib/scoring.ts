import { allQuestions } from "@/lib/canonicalAssessment";

export const domainOrder = ["MR", "HS", "SR", "CH", "SL", "IB", "BS"] as const;
export type DomainId = (typeof domainOrder)[number];

export interface ScoringResult {
  domains: Record<DomainId, number | null>;
  coverage: Record<DomainId, number>;
  biologicalState: number | null;
  biologicalStateLabel: string | null;
  opportunity: number | null;
  recoveryPotential: number | null;
  protectiveCount: number;
  confidence: number;
  confidenceLabel: string;
  drivers: string[];
  categoryScores: Record<string, number>;
  overallScore: number;
  band: string;
}

const domainLabels: Record<DomainId, string> = {
  MR: "Metabolic Resistance™", HS: "Hunger & Satiety Signals™", SR: "Sleep Recovery Index™",
  CH: "Circadian Health Score™", SL: "Stress Load™", IB: "Inflammation Burden Index™", BS: "Biological Safety Signals™",
};

function roundHalfAwayFromZero(value: number): number {
  return value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5);
}

function numericAnswer(value: unknown): number | null {
  if (value === null || value === undefined || value === "" || value === "NA") return null;
  if (Array.isArray(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function answerPoints(questionId: string, value: unknown): number | null {
  if (value === "NVR") return 0;
  if (value === "RLY") return 1;
  if (value === "SMT") return 2;
  if (value === "OFT") return 3;
  if (value === "ALW") return 4;
  const numeric = numericAnswer(value);
  if (numeric !== null) return numeric;
  if (typeof value !== "string" || !value.startsWith("OPT_")) return null;
  const index = Number(value.slice(4)) - 1;
  const maps: Record<string, number[]> = {
    Q9: [0, 1, 2, 3, 4], Q12: [0, 1, 2, 3, 4],
    Q16: [4, 3, 1, 0, 2], Q46: [4, 3, 1, 0], Q47: [4, 3, 1, 0], Q48: [4, 3, 2, 1, 0],
    Q61: [0, 1, 2, 3, 0], Q65: [0, 1, 2, 3, 4],
    Q72: [25, 50, 75, 100],
  };
  return maps[questionId]?.[index] ?? null;
}

function classification(score: number | null): string | null {
  if (score === null) return null;
  if (score <= 24) return "Optimized";
  if (score <= 49) return "Compensating";
  if (score <= 74) return "Strained";
  return "Dysregulated";
}

function confidenceLabel(score: number): string {
  if (score >= 80) return "High";
  if (score >= 60) return "Moderate-High";
  if (score >= 40) return "Moderate";
  return "Low";
}

export function calculateScores(answers: Record<string, unknown>): ScoringResult {
  const totals = Object.fromEntries(domainOrder.map((domain) => [domain, { points: 0, answered: 0, eligible: 0 }])) as Record<DomainId, { points: number; answered: number; eligible: number }>;

  for (const question of allQuestions) {
    if (!question.scoringEligible || !question.domain) continue;
    const total = totals[question.domain as DomainId];
    total.eligible += 1;
    const value = answerPoints(question.id, answers[question.id]);
    if (value === null) continue;
    total.answered += 1;
    total.points += question.reverseScored ? 4 - value : value;
  }

  const domains = {} as Record<DomainId, number | null>;
  const coverage = {} as Record<DomainId, number>;
  for (const domain of domainOrder) {
    const total = totals[domain];
    coverage[domain] = total.eligible ? total.answered / total.eligible : 0;
    domains[domain] = coverage[domain] >= 0.5 && total.answered > 0 ? roundHalfAwayFromZero((total.points / (total.answered * 4)) * 100) : null;
  }

  const availableScores = domainOrder.map((domain) => domains[domain]).filter((value): value is number => value !== null);
  const biologicalState = availableScores.length >= 5 ? roundHalfAwayFromZero(availableScores.reduce((sum, value) => sum + value, 0) / availableScores.length) : null;
  const eligibleDrivers = domainOrder.filter((domain) => domains[domain] !== null && (domains[domain] as number) >= 25).sort((a, b) => ((domains[b] ?? 0) - (domains[a] ?? 0)) || domainOrder.indexOf(a) - domainOrder.indexOf(b));
  const drivers = eligibleDrivers.length >= 2 && Math.abs((domains[eligibleDrivers[0]] ?? 0) - (domains[eligibleDrivers[1]] ?? 0)) <= 3
    ? [`${eligibleDrivers[0]}+${eligibleDrivers[1]} co-primary`, ...eligibleDrivers.slice(1, 3)]
    : eligibleDrivers.slice(0, 3);

  const protectiveCount = [
    [answerPoints("Q46", answers.Q46), answerPoints("Q47", answers.Q47)],
    [answerPoints("Q64", answers.Q64)], [answerPoints("Q65", answers.Q65)], [answerPoints("Q61", answers.Q61)], [answerPoints("Q69", answers.Q69)],
  ].filter((factor, index) => index === 0 ? (factor[0] ?? 0) <= 1 && (factor[1] ?? 0) <= 1 : (factor[0] ?? 0) >= (index === 4 ? 7 : 3)).length;
  const opportunity = biologicalState === null ? null : Math.round((100 - biologicalState * 0.5) * 10) / 10;
  const age = numericAnswer(answers.Q1) ?? 40;
  const ageValue = age <= 30 ? 100 : age <= 45 ? 80 : age <= 60 ? 60 : age <= 75 ? 40 : 20;
  const conditionValue = Array.isArray(answers.Q13) ? Math.max(25, 100 - Math.min(3, answers.Q13.length) * 25) : 100;
  const medicationValue = Array.isArray(answers.Q14) ? answers.Q14.length === 0 ? 100 : answers.Q14.length === 1 ? 75 : 50 : 100;
  const recoveryPotential = biologicalState === null ? null : Math.round((0.3 * (100 - biologicalState) + 0.25 * (protectiveCount * 20) + 0.2 * ageValue + 0.15 * conditionValue + 0.1 * medicationValue) * 10) / 10;
  const overallCoverage = Math.round((Object.values(coverage).reduce((sum, value) => sum + value, 0) / domainOrder.length) * 100);
  const answerConfidence = answerPoints("Q72", answers.Q72) ?? 50;
  const consistency = availableScores.length ? 100 : 0;
  const confidence = roundHalfAwayFromZero(0.5 * overallCoverage + 0.3 * answerConfidence + 0.2 * consistency);
  const categoryScores = Object.fromEntries(domainOrder.map((domain) => [domainLabels[domain], domains[domain] ?? 0]));
  return {
    domains, coverage, biologicalState, biologicalStateLabel: classification(biologicalState), opportunity, recoveryPotential,
    protectiveCount, confidence, confidenceLabel: confidenceLabel(confidence), drivers,
    categoryScores, overallScore: biologicalState ?? 0, band: classification(biologicalState) ?? "Not enough information",
  };
}
