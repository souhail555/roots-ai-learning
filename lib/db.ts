export interface SessionRecord {
  id: string;
  createdAt: string;
  email?: string;
  answers: Record<string, string | string[]>;
  completedModules: string[];
  updatedAt?: string;
}

export interface ReportRecord {
  id: string;
  sessionId: string;
  scores: Record<string, number>;
  band: string;
  createdAt: string;
}

const sessions = new Map<string, SessionRecord>();
const reports = new Map<string, ReportRecord>();

export async function createSession(id: string): Promise<SessionRecord> {
  const timestamp = new Date().toISOString();
  const session: SessionRecord = { id, createdAt: timestamp, answers: {}, completedModules: [], updatedAt: timestamp };
  sessions.set(id, session);
  return session;
}

export async function getSession(id: string): Promise<SessionRecord | null> {
  return sessions.get(id) ?? null;
}

export async function setSessionEmail(sessionId: string, email: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  session.email = email;
  session.updatedAt = new Date().toISOString();
}

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

export async function createReport(
  id: string,
  sessionId: string,
  scores: Record<string, number>,
  band: string
): Promise<ReportRecord> {
  const report = { id, sessionId, scores, band, createdAt: new Date().toISOString() };
  reports.set(id, report);
  return report;
}

export async function getReport(id: string): Promise<ReportRecord | null> {
  return reports.get(id) ?? null;
}
