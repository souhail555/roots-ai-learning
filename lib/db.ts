/**
 * ROOTS-AI™ - In-Memory Database Layer
 * 
 * NOTE: This uses in-memory Map storage. Sessions are lost on server restart/deploy.
 * For production persistence, consider migrating to Supabase or similar in M3/M4.
 * 
 * Current behavior:
 * - Sessions persist during server uptime
 * - Sessions are lost on redeploy or server restart
 * - This is acceptable for M2 development phase
 */

import { CANONICAL_VERSIONS } from "@/lib/canonical/source";

export interface SessionRecord {
  id: string;
  createdAt: string;
  email?: string;
  answers: Record<string, string | string[]>;
  completedModules: string[];
  updatedAt?: string;
  canonicalVersions: {
    questionnaire: string;
    scoring: string;
  };
}

export interface ReportRecord {
  id: string;
  sessionId: string;
  scores: Record<string, number>;
  band: string;
  createdAt: string;
  canonicalVersions: {
    questionnaire: string;
    scoring: string;
  };
}

export interface ResultRecord {
  sessionId: string;
  result: unknown;
  questionnaireVersion: string;
  scoringVersion: string;
  createdAt: string;
}

// In-memory storage
const sessions = new Map<string, SessionRecord>();
const reports = new Map<string, ReportRecord>();
const results = new Map<string, ResultRecord>();

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
  sessions.set(id, session);
  return session;
}

/**
 * Retrieve a session by ID. Returns null if not found.
 */
export async function getSession(id: string): Promise<SessionRecord | null> {
  return sessions.get(id) ?? null;
}

/**
 * Update session email for contact/resume purposes
 */
export async function setSessionEmail(sessionId: string, email: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  session.email = email;
  session.updatedAt = new Date().toISOString();
}

/**
 * Save module answers and track module completion
 * Merges new answers with existing ones
 */
export async function saveModuleAnswers(
  sessionId: string,
  moduleId: string,
  answers: Record<string, string | string[]>
): Promise<SessionRecord> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const updatedAt = new Date().toISOString();
  const updated: SessionRecord = {
    ...session,
    answers: { ...session.answers, ...answers },
    completedModules: Array.from(new Set([...session.completedModules, moduleId])),
    updatedAt,
  };
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
  const session = sessions.get(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  
  const report = { 
    id, 
    sessionId, 
    scores, 
    band, 
    createdAt: new Date().toISOString(),
    canonicalVersions: { ...session.canonicalVersions }
  };
  reports.set(id, report);
  return report;
}

/**
 * Retrieve a report by ID. Returns null if not found.
 */
export async function getReport(id: string): Promise<ReportRecord | null> {
  return reports.get(id) ?? null;
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
  const session = sessions.get(id);
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
  results.set(sessionId, record);
  return record;
}

/**
 * Retrieve scoring result by session ID. Returns null if not found.
 */
export async function getResult(sessionId: string): Promise<ResultRecord | null> {
  return results.get(sessionId) ?? null;
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
}
