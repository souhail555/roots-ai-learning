import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

export interface SessionRecord {
  id: string;
  createdAt: string;
  answers: Record<string, number>;
  completedModules: string[];
}

export interface ReportRecord {
  id: string;
  sessionId: string;
  scores: Record<string, number>;
  band: string;
  createdAt: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "app.db");

let dbInstance: sqlite3.Database | null = null;

function getDb(): sqlite3.Database {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new sqlite3.Database(DB_PATH);
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        answers TEXT NOT NULL DEFAULT '{}',
        completed_modules TEXT NOT NULL DEFAULT '[]'
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        scores TEXT NOT NULL,
        band TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  });

  dbInstance = db;
  return db;
}

function run(sql: string, params: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    getDb().run(sql, params, (err) => (err ? reject(err) : resolve()));
  });
}

function get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    getDb().get(sql, params, (err, row) => (err ? reject(err) : resolve(row as T)));
  });
}

export async function createSession(id: string): Promise<SessionRecord> {
  const createdAt = new Date().toISOString();
  await run(
    "INSERT INTO sessions (id, created_at, answers, completed_modules) VALUES (?, ?, ?, ?)",
    [id, createdAt, "{}", "[]"]
  );
  return { id, createdAt, answers: {}, completedModules: [] };
}

export async function getSession(id: string): Promise<SessionRecord | null> {
  const row = await get<{
    id: string;
    created_at: string;
    answers: string;
    completed_modules: string;
  }>("SELECT * FROM sessions WHERE id = ?", [id]);
  if (!row) return null;
  return {
    id: row.id,
    createdAt: row.created_at,
    answers: JSON.parse(row.answers),
    completedModules: JSON.parse(row.completed_modules),
  };
}

export async function saveModuleAnswers(
  sessionId: string,
  moduleId: string,
  answers: Record<string, number>
): Promise<SessionRecord> {
  const session = await getSession(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const mergedAnswers = { ...session.answers, ...answers };
  const completedModules = Array.from(new Set([...session.completedModules, moduleId]));

  await run("UPDATE sessions SET answers = ?, completed_modules = ? WHERE id = ?", [
    JSON.stringify(mergedAnswers),
    JSON.stringify(completedModules),
    sessionId,
  ]);

  return { ...session, answers: mergedAnswers, completedModules };
}

export async function createReport(
  id: string,
  sessionId: string,
  scores: Record<string, number>,
  band: string
): Promise<ReportRecord> {
  const createdAt = new Date().toISOString();
  await run(
    "INSERT INTO reports (id, session_id, scores, band, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, sessionId, JSON.stringify(scores), band, createdAt]
  );
  return { id, sessionId, scores, band, createdAt };
}

export async function getReport(id: string): Promise<ReportRecord | null> {
  const row = await get<{
    id: string;
    session_id: string;
    scores: string;
    band: string;
    created_at: string;
  }>("SELECT * FROM reports WHERE id = ?", [id]);
  if (!row) return null;
  return {
    id: row.id,
    sessionId: row.session_id,
    scores: JSON.parse(row.scores),
    band: row.band,
    createdAt: row.created_at,
  };
}
