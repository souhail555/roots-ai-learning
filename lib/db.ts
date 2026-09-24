/**
 * ROOTS-AI(TM) data-access layer.
 *
 * SQLite is the durable local/self-hosted store. Process-local Maps remain a
 * cache and explicit fallback for runtimes where the native SQLite module or
 * writable filesystem is unavailable. Authorization remains the responsibility
 * of the route layer; this module never accepts a caller identity.
 */

import { CANONICAL_VERSIONS } from "@/lib/canonical/source";
import type { CanonicalReport } from "@/lib/canonical/report";
import {
  readCanonicalReport as readStoredCanonicalReport,
  readCanonicalReportById,
  readLegacyReport,
  readResult as readStoredResult,
  readSession as readStoredSession,
  writeCanonicalReport as writeStoredCanonicalReport,
  writeLegacyReport,
  writeResult as writeStoredResult,
  writeSession as writeStoredSession,
} from "@/lib/sqliteStore";

export interface CanonicalReportRecord {
  id: string;
  assessmentId: string;
  report: CanonicalReport;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  createdAt: string;
  email?: string;
  answers: Record<string, unknown>;
  completedModules: string[];
  updatedAt?: string;
  canonicalVersions: { questionnaire: string; scoring: string };
}

export interface ReportRecord {
  id: string;
  sessionId: string;
  scores: Record<string, number>;
  band: string;
  createdAt: string;
  canonicalVersions: { questionnaire: string; scoring: string };
}

export interface ResultRecord {
  sessionId: string;
  result: unknown;
  questionnaireVersion: string;
  scoringVersion: string;
  createdAt: string;
}

const sessions = new Map<string, SessionRecord>();
const reports = new Map<string, ReportRecord>();
const results = new Map<string, ResultRecord>();
const canonicalReports = new Map<string, CanonicalReportRecord>();

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function sessionFromRow(row: Awaited<ReturnType<typeof readStoredSession>>): SessionRecord | null {
  if (!row) return null;
  return {
    id: row.id,
    createdAt: row.created_at,
    email: row.email ?? undefined,
    answers: parseJson<Record<string, unknown>>(row.answers, {}),
    completedModules: parseJson<string[]>(row.completed_modules, []),
    updatedAt: row.updated_at,
    canonicalVersions: { questionnaire: row.questionnaire_version, scoring: row.scoring_version },
  };
}

function persistSession(session: SessionRecord): Promise<void> {
  return writeStoredSession({
    id: session.id,
    created_at: session.createdAt,
    email: session.email ?? null,
    answers: JSON.stringify(session.answers),
    completed_modules: JSON.stringify(session.completedModules),
    updated_at: session.updatedAt ?? new Date().toISOString(),
    questionnaire_version: session.canonicalVersions.questionnaire,
    scoring_version: session.canonicalVersions.scoring,
  });
}

async function loadSession(id: string): Promise<SessionRecord | null> {
  const cached = sessions.get(id);
  if (cached) return cached;
  const loaded = sessionFromRow(await readStoredSession(id));
  if (loaded) sessions.set(id, loaded);
  return loaded;
}

async function loadResult(sessionId: string): Promise<ResultRecord | null> {
  const cached = results.get(sessionId);
  if (cached) return cached;
  const row = await readStoredResult(sessionId);
  if (!row) return null;
  const result: ResultRecord = {
    sessionId: row.session_id,
    result: parseJson<unknown>(row.result, null),
    questionnaireVersion: row.questionnaire_version,
    scoringVersion: row.scoring_version,
    createdAt: row.created_at,
  };
  results.set(sessionId, result);
  return result;
}

function legacyReportFromRow(row: Awaited<ReturnType<typeof readLegacyReport>>): ReportRecord | null {
  if (!row) return null;
  return {
    id: row.id,
    sessionId: row.session_id,
    scores: parseJson<Record<string, number>>(row.scores, {}),
    band: row.band,
    createdAt: row.created_at,
    canonicalVersions: { questionnaire: row.questionnaire_version, scoring: row.scoring_version },
  };
}

function canonicalReportFromRow(row: Awaited<ReturnType<typeof readStoredCanonicalReport>>): CanonicalReportRecord | null {
  if (!row) return null;
  const report = parseJson<CanonicalReport | null>(row.report, null);
  if (!report) return null;
  return { id: row.id, assessmentId: row.assessment_id, report, createdAt: row.created_at };
}


/**
 * Create a new assessment session with canonical version tracking
 */
export async function createSession(id: string): Promise<SessionRecord> {
  const timestamp = new Date().toISOString();
  const session: SessionRecord = {
    id,
    createdAt: timestamp,
    answers: {},
    completedModules: [],
    updatedAt: timestamp,
    canonicalVersions: { ...CANONICAL_VERSIONS },
  };
  await persistSession(session);
  sessions.set(id, session);
  return session;
}

/**
 * Retrieve a session by ID. Returns null if not found.
 */
export async function getSession(id: string): Promise<SessionRecord | null> {
  return loadSession(id);
}

/**
 * Update session email for contact/resume purposes
 */
export async function setSessionEmail(sessionId: string, email: string): Promise<void> {
  const session = await loadSession(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  const updated = { ...session, email, updatedAt: new Date().toISOString() };
  await persistSession(updated);
  sessions.set(sessionId, updated);
}

/**
 * Save module answers and track module completion
 * Merges new answers with existing ones
 */
export async function saveModuleAnswers(
  sessionId: string,
  moduleId: string,
  answers: Record<string, unknown>,
): Promise<SessionRecord> {
  const session = await loadSession(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const updatedAt = new Date().toISOString();
  const updated: SessionRecord = {
    ...session,
    answers: { ...session.answers, ...answers },
    completedModules: Array.from(new Set([...session.completedModules, moduleId])),
    updatedAt,
  };
  await persistSession(updated);
  sessions.set(sessionId, updated);
  return updated;
}

/**
 * Create a report record linking to session and canonical versions
 */
export async function createReport(
  id: string,
  sessionId: string,
  scores: Record<string, number>,
  band: string
): Promise<ReportRecord> {
  const session = await loadSession(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const report: ReportRecord = {
    id,
    sessionId,
    scores,
    band,
    createdAt: new Date().toISOString(),
    canonicalVersions: { ...session.canonicalVersions },
  };
  await writeLegacyReport({
    id: report.id,
    session_id: report.sessionId,
    scores: JSON.stringify(report.scores),
    band: report.band,
    created_at: report.createdAt,
    questionnaire_version: report.canonicalVersions.questionnaire,
    scoring_version: report.canonicalVersions.scoring,
  });
  reports.set(id, report);
  return report;
}

/**
 * Retrieve a report by ID. Returns null if not found.
 */
export async function getReport(id: string): Promise<ReportRecord | null> {
  const cached = reports.get(id);
  if (cached) return cached;
  const loaded = legacyReportFromRow(await readLegacyReport(id));
  if (loaded) reports.set(id, loaded);
  return loaded;
}

/**
 * Assessment progress interface
 * Computed deterministically from stored answers
 */
export interface AssessmentProgress {
  answeredCount: number;
  totalQuestions: number;
  answeredRequired: number;
  totalRequired: number;
  completedModules: string[];
  completedModuleCount: number;
  totalModules: number;
  currentModuleId: string;
  percentComplete: number;
  isComplete: boolean;
}

/**
 * Compute assessment progress from stored answers
 * Progress is deterministic - refresh cannot corrupt state
 */
export async function getProgress(
  id: string,
  totalQuestions: number,
  totalRequired: number,
  moduleOrder: string[],
  requiredQuestionIds: string[],
  isValidAnswer: (questionId: string, value: unknown) => boolean,
): Promise<AssessmentProgress | null> {
  const session = await loadSession(id);
  if (!session) return null;

  const answeredIds = Object.keys(session.answers);
  const answeredRequired = requiredQuestionIds.filter((qid) => isValidAnswer(qid, session.answers[qid])).length;
  const firstIncomplete = moduleOrder.find((m) => !session.completedModules.includes(m));

  return {
    answeredCount: answeredIds.filter((qid) => isValidAnswer(qid, session.answers[qid])).length,
    totalQuestions,
    answeredRequired,
    totalRequired,
    completedModules: session.completedModules,
    completedModuleCount: session.completedModules.filter((m) => moduleOrder.includes(m)).length,
    totalModules: moduleOrder.length,
    currentModuleId: firstIncomplete ?? moduleOrder[moduleOrder.length - 1],
    percentComplete: Math.round((answeredRequired / totalRequired) * 100),
    isComplete: answeredRequired === totalRequired,
  };
}

/**
 * Save scoring result with canonical version tracking
 */
export async function saveResult(
  sessionId: string,
  result: unknown,
  versions: { questionnaire: string; scoring: string },
): Promise<ResultRecord> {
  const record: ResultRecord = {
    sessionId,
    result,
    questionnaireVersion: versions.questionnaire,
    scoringVersion: versions.scoring,
    createdAt: new Date().toISOString(),
  };
  await writeStoredResult({
    session_id: record.sessionId,
    result: JSON.stringify(record.result),
    questionnaire_version: record.questionnaireVersion,
    scoring_version: record.scoringVersion,
    created_at: record.createdAt,
  });
  results.set(sessionId, record);
  return record;
}

/**
 * Retrieve scoring result by session ID. Returns null if not found.
 */
export async function getResult(sessionId: string): Promise<ResultRecord | null> {
  return loadResult(sessionId);
}

/**
 * Canonical immutable report storage (M3).
 *
 * Stores the full CanonicalReport object produced by lib/report/pipeline.ts.
 * This is the authoritative source for BOTH the web report and the PDF: neither
 * renderer recalculates anything.
 *
 * SQLite is used when the runtime provides a durable filesystem. The Maps are
 * only caches and a safe in-process fallback. On a provider such as Vercel,
 * /tmp is ephemeral; a ROOTS-owned durable Supabase/Postgres adapter is still
 * required before production persistence can be attested.
 */
export async function saveCanonicalReport(
  report: CanonicalReportRecord,
): Promise<CanonicalReportRecord> {
  const existing = canonicalReports.get(report.id) ?? canonicalReportFromRow(await readCanonicalReportById(report.id));
  if (existing) return existing;
  await writeStoredCanonicalReport({
    id: report.id,
    assessment_id: report.assessmentId,
    report: JSON.stringify(report.report),
    content_hash: report.report.contentHash,
    created_at: report.createdAt,
  });
  const stored = canonicalReportFromRow(await readCanonicalReportById(report.id));
  const value = stored ?? report;
  canonicalReports.set(value.id, value);
  return value;
}

/** Retrieve a stored canonical report by its report id. */
export async function getCanonicalReport(
  id: string,
): Promise<CanonicalReportRecord | null> {
  const cached = canonicalReports.get(id);
  if (cached) return cached;
  const loaded = canonicalReportFromRow(await readCanonicalReportById(id));
  if (loaded) canonicalReports.set(id, loaded);
  return loaded;
}

/**
 * Retrieve a stored canonical report by the assessment it was produced from.
 * Used by the report route, which is addressed by session id.
 */
export async function getCanonicalReportByAssessment(
  assessmentId: string,
): Promise<CanonicalReportRecord | null> {
  for (const report of canonicalReports.values()) {
    if (report.assessmentId === assessmentId) return report;
  }
  const loaded = canonicalReportFromRow(await readStoredCanonicalReport(assessmentId));
  if (loaded) canonicalReports.set(loaded.id, loaded);
  return loaded;
}

/**
 * Utility: Get active session count (for monitoring)
 */
export function getActiveSessionCount(): number {
  return sessions.size;
}

/**
 * Utility: Clear all sessions (for testing only)
 */
export function clearAllSessions(): void {
  sessions.clear();
  reports.clear();
  results.clear();
  canonicalReports.clear();
}
