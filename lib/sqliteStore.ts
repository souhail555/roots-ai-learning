import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";

type Database = sqlite3.Database;
let databasePromise: Promise<Database | null> | undefined;

export interface SqliteSessionRow {
  id: string; created_at: string; email: string | null; answers: string;
  completed_modules: string; updated_at: string; questionnaire_version: string; scoring_version: string;
}
export interface SqliteResultRow {
  session_id: string; result: string; questionnaire_version: string; scoring_version: string; created_at: string;
}
export interface SqliteReportRow {
  id: string; assessment_id: string; report: string; content_hash: string; created_at: string;
}
export interface SqliteLegacyReportRow {
  id: string; session_id: string; scores: string; band: string; created_at: string;
  questionnaire_version: string; scoring_version: string;
}

const schema = `
CREATE TABLE IF NOT EXISTS roots_sessions (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL, email TEXT, answers TEXT NOT NULL DEFAULT '{}',
 completed_modules TEXT NOT NULL DEFAULT '[]', updated_at TEXT NOT NULL,
 questionnaire_version TEXT NOT NULL, scoring_version TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS roots_results (
 session_id TEXT PRIMARY KEY, result TEXT NOT NULL, questionnaire_version TEXT NOT NULL,
 scoring_version TEXT NOT NULL, created_at TEXT NOT NULL,
 FOREIGN KEY(session_id) REFERENCES roots_sessions(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS roots_canonical_reports (
 id TEXT PRIMARY KEY, assessment_id TEXT NOT NULL UNIQUE, report TEXT NOT NULL,
 content_hash TEXT NOT NULL, created_at TEXT NOT NULL,
 FOREIGN KEY(assessment_id) REFERENCES roots_sessions(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS roots_legacy_reports (
 id TEXT PRIMARY KEY, session_id TEXT NOT NULL, scores TEXT NOT NULL, band TEXT NOT NULL,
 created_at TEXT NOT NULL, questionnaire_version TEXT NOT NULL, scoring_version TEXT NOT NULL,
 FOREIGN KEY(session_id) REFERENCES roots_sessions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_roots_reports_assessment ON roots_canonical_reports(assessment_id);
`;

function databasePath(): string {
  if (process.env.ROOTS_DB_PATH) return process.env.ROOTS_DB_PATH;
  if (process.env.VERCEL) return path.join("/tmp", "roots-ai.sqlite");
  return path.join(process.cwd(), "data", "app.db");
}

function openDatabase(): Promise<Database | null> {
  const file = databasePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return new Promise((resolve) => {
    const db = new sqlite3.Database(file, (error) => {
      if (error) {
        console.error("SQLite unavailable; using process-local fallback", error.message);
        resolve(null);
        return;
      }
      db.exec(schema, (schemaError) => {
        if (schemaError) {
          console.error("SQLite schema initialization failed", schemaError);
          db.close(() => resolve(null));
          return;
        }
        resolve(db);
      });
    });
  });
}

async function database(): Promise<Database | null> {
  databasePromise ??= openDatabase();
  return databasePromise;
}

async function withDatabase<T>(operation: (db: Database) => Promise<T>): Promise<T | null> {
  const db = await database();
  if (!db) return null;
  try { return await operation(db); }
  catch (error) { console.error("SQLite operation failed", error); return null; }
}

function run(db: Database, sql: string, params: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => db.run(sql, params, (error) => error ? reject(error) : resolve()));
}

function get<T>(db: Database, sql: string, params: unknown[] = []): Promise<T | null> {
  return new Promise((resolve, reject) => db.get<T>(sql, params, (error, row) => error ? reject(error) : resolve(row ?? null)));
}

export async function deleteSession(id: string): Promise<void> {
  await withDatabase(async (db) => {
    await run(db, "DELETE FROM roots_results WHERE session_id = ?", [id]);
    await run(db, "DELETE FROM roots_canonical_reports WHERE assessment_id = ?", [id]);
    await run(db, "DELETE FROM roots_legacy_reports WHERE session_id = ?", [id]);
    await run(db, "DELETE FROM roots_sessions WHERE id = ?", [id]);
  });
}

export async function readSession(id: string): Promise<SqliteSessionRow | null> {
  return withDatabase((db) => get<SqliteSessionRow>(db, "SELECT id, created_at, email, answers, completed_modules, updated_at, questionnaire_version, scoring_version FROM roots_sessions WHERE id = ?", [id]));
}

export async function writeSession(row: SqliteSessionRow): Promise<void> {
  await withDatabase((db) => run(db, "INSERT INTO roots_sessions (id, created_at, email, answers, completed_modules, updated_at, questionnaire_version, scoring_version) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email=excluded.email, answers=excluded.answers, completed_modules=excluded.completed_modules, updated_at=excluded.updated_at, questionnaire_version=excluded.questionnaire_version, scoring_version=excluded.scoring_version", [row.id, row.created_at, row.email, row.answers, row.completed_modules, row.updated_at, row.questionnaire_version, row.scoring_version]));
}

export async function readResult(sessionId: string): Promise<SqliteResultRow | null> {
  return withDatabase((db) => get<SqliteResultRow>(db, "SELECT session_id, result, questionnaire_version, scoring_version, created_at FROM roots_results WHERE session_id = ?", [sessionId]));
}

export async function writeResult(row: SqliteResultRow): Promise<void> {
  await withDatabase((db) => run(db, "INSERT INTO roots_results (session_id, result, questionnaire_version, scoring_version, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(session_id) DO UPDATE SET result=excluded.result, questionnaire_version=excluded.questionnaire_version, scoring_version=excluded.scoring_version, created_at=excluded.created_at", [row.session_id, row.result, row.questionnaire_version, row.scoring_version, row.created_at]));
}

export async function readCanonicalReport(assessmentId: string): Promise<SqliteReportRow | null> {
  return withDatabase((db) => get<SqliteReportRow>(db, "SELECT id, assessment_id, report, content_hash, created_at FROM roots_canonical_reports WHERE assessment_id = ?", [assessmentId]));
}

export async function readCanonicalReportById(id: string): Promise<SqliteReportRow | null> {
  return withDatabase((db) => get<SqliteReportRow>(db, "SELECT id, assessment_id, report, content_hash, created_at FROM roots_canonical_reports WHERE id = ?", [id]));
}

export async function writeCanonicalReport(row: SqliteReportRow): Promise<void> {
  await withDatabase((db) => run(db, "INSERT INTO roots_canonical_reports (id, assessment_id, report, content_hash, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(assessment_id) DO NOTHING", [row.id, row.assessment_id, row.report, row.content_hash, row.created_at]));
}

export async function readLegacyReport(id: string): Promise<SqliteLegacyReportRow | null> {
  return withDatabase((db) => get<SqliteLegacyReportRow>(db, "SELECT id, session_id, scores, band, created_at, questionnaire_version, scoring_version FROM roots_legacy_reports WHERE id = ?", [id]));
}

export async function writeLegacyReport(row: SqliteLegacyReportRow): Promise<void> {
  await withDatabase((db) => run(db, "INSERT INTO roots_legacy_reports (id, session_id, scores, band, created_at, questionnaire_version, scoring_version) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING", [row.id, row.session_id, row.scores, row.band, row.created_at, row.questionnaire_version, row.scoring_version]));
}

