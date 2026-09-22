import { allQuestions } from "@/lib/canonicalAssessment";
import {
  BIO_STATE,
  BIO_STATE_LABEL,
  DOMAIN_LABELS,
  DOMAIN_MODEL,
  DOMAIN_TIE_ORDER,
  DomainId,
  canonicalVersionIdentity,
  CANONICAL_VERSIONS,
} from "@/lib/canonical/source";

/**
 * Deterministic seven-domain scoring engine.
 *
 * Controlled source: C-02 Canonical Scoring Rules & Golden Tests v1.0.1 CORRECTED.
 *
 * M2 control rule: the deterministic engine is the SOLE authority for scores,
 * classifications, Biological State, drivers, thresholds, eligibility and
 * missing-data behaviour. No AI/LLM component may calculate, modify, override
 * or select any of these values. This module is pure and deterministic: the
 * same answers always produce the same result.
 */

export const domainOrder = DOMAIN_TIE_ORDER;
export type { DomainId };
export { BIO_STATE };

export type DriverId = DomainId | `${DomainId}+${DomainId}` | `${DomainId}+${DomainId} co-primary`;

export interface ScoringResult {
  /** Version identity the result was produced under (reproducibility). */
  versions: typeof CANONICAL_VERSIONS;
  versionIdentity: string;
  domains: Record<DomainId, number | null>;
  coverage: Record<DomainId, number>;
  classifications: Record<DomainId, string | null>;
  biologicalState: number | null;
  biologicalStateLabel: string | null;
  biologicalStateAvailable: boolean;
  opportunity: number | null;
  recoveryPotential: number | null;
  /**
   * Ranked drivers. A co-primary pair is a single emitted entry (C-02 DRV-003);
   * `coPrimary` records that the top pair was merged. The participant-facing
   * "co-primary" wording is presentation and is produced by the report layer,
   * not by the deterministic engine (M2 requirement 6: no AI/narrative
   * authority over scoring, and no presentation coupling in the engine).
   */
  drivers: DriverId[];
  coPrimary: boolean;
  overallScore: number | null;
  band: string | null;
  scoredDomainCount: number;
}

/** Canonical integer rounding: half away from zero. */
export function roundHalfAwayFromZero(value: number): number {
  return value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5);
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return roundHalfAwayFromZero(value * factor) / factor;
}

/**
 * Resolve canonical burden points (0-4) for an answer, or null when the answer
 * is absent / N/A / unrecognised. N/A is excluded from numerator AND
 * denominator: it is never treated as zero.
 */
function burdenPoints(questionId: string, value: unknown): number | null {
  if (value === null || value === undefined || value === "" || value === "NA") return null;
  if (Array.isArray(value)) return null;

  const question = allQuestions.find((item) => item.id === questionId);
  const options = question?.options;

  if (typeof value === "string" && options) {
    const option = options.find((item) => item.id === value);
    if (option) {
      if (option.isNa) return null;
      if (typeof option.points === "number") {
        const max = DOMAIN_MODEL.rawBurdenMax;
        return question?.reverseScored ? max - option.points : option.points;
      }
      return null;
    }
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric) && typeof value !== "boolean") return numeric;

  return null;
}

/** Canonical domain classification bands. */
export function classification(score: number | null): string | null {
  if (score === null) return null;
  if (score <= 24) return "Optimized";
  if (score <= 49) return "Compensating";
  if (score <= 74) return "Strained";
  return "Dysregulated";
}

export function calculateScores(answers: Record<string, unknown>): ScoringResult {
  const max = DOMAIN_MODEL.rawBurdenMax;
  const totals = Object.fromEntries(
    DOMAIN_TIE_ORDER.map((domain) => [domain, { points: 0, answered: 0, eligible: 0 }]),
  ) as Record<DomainId, { points: number; answered: number; eligible: number }>;

  for (const question of allQuestions) {
    if (!question.scoringEligible || !question.domain) continue;
    const domain = question.domain as DomainId;
    const total = totals[domain];
    if (!total) continue;
    total.eligible += 1;
    const points = burdenPoints(question.id, answers[question.id]);
    if (points === null) continue;
    total.answered += 1;
    total.points += points;
  }

  const domains = {} as Record<DomainId, number | null>;
  const coverage = {} as Record<DomainId, number>;
  const classifications = {} as Record<DomainId, string | null>;

  for (const domain of DOMAIN_TIE_ORDER) {
    const total = totals[domain];
    const ratio = total.eligible ? total.answered / total.eligible : 0;
    coverage[domain] = ratio;
    if (ratio < DOMAIN_MODEL.coverageThreshold || total.answered === 0) {
      domains[domain] = null;
    } else {
      const normalised = (total.points / (total.answered * max)) * 100;
      domains[domain] = roundHalfAwayFromZero(normalised);
    }
    classifications[domain] = classification(domains[domain]);
  }

  const available = DOMAIN_TIE_ORDER.filter((domain) => domains[domain] !== null);
  const hasEnough = available.length >= DOMAIN_MODEL.biologicalStateRequiredDomains;
  const biologicalState = hasEnough
    ? roundHalfAwayFromZero(
        available.reduce((sum, domain) => sum + (domains[domain] as number), 0) / available.length,
      )
    : null;

  const eligibleDomains = DOMAIN_TIE_ORDER.filter(
    (domain) => domains[domain] !== null && (domains[domain] as number) >= DOMAIN_MODEL.driverEligibilityFloor,
  )
    .slice()
    .sort(
      (a, b) =>
        (domains[b] as number) - (domains[a] as number) ||
        DOMAIN_TIE_ORDER.indexOf(a) - DOMAIN_TIE_ORDER.indexOf(b),
    );

  const drivers: DriverId[] = [];
  let coPrimary = false;

  if (eligibleDomains.length >= 2) {
    const gap = (domains[eligibleDomains[0]] as number) - (domains[eligibleDomains[1]] as number);
    if (gap <= DOMAIN_MODEL.coPrimaryGap) {
      coPrimary = true;
      // Co-primary pair rendered as ONE entry, no duplication, no ineligible
      // fallback (DRV-003). The pair carries both domains and is never repeated.
      drivers.push(`${eligibleDomains[0]}+${eligibleDomains[1]}` as DriverId);
      if (eligibleDomains[2]) drivers.push(eligibleDomains[2]);
    } else {
      drivers.push(...eligibleDomains.slice(0, DOMAIN_MODEL.driverMaxEntries));
    }
  } else {
    drivers.push(...eligibleDomains);
  }

  const biologicalStateAvailable = biologicalState !== null;
  const decimals = DOMAIN_MODEL.secondaryScoreDecimals;
  const opportunity = biologicalStateAvailable
    ? roundTo(100 - (biologicalState as number), decimals)
    : null;
  const recoveryPotential = biologicalStateAvailable
    ? roundTo(100 - (biologicalState as number) * 0.5, decimals)
    : null;

  return {
    versions: CANONICAL_VERSIONS,
    versionIdentity: canonicalVersionIdentity(),
    domains,
    coverage,
    classifications,
    biologicalState,
    biologicalStateLabel: biologicalState === null ? null : `${BIO_STATE_LABEL}: ${classification(biologicalState)}`,
    biologicalStateAvailable,
    opportunity,
    recoveryPotential,
    drivers,
    coPrimary,
    overallScore: biologicalState,
    band: classification(biologicalState),
    scoredDomainCount: available.length,
  };
}

export { DOMAIN_LABELS, DOMAIN_MODEL };