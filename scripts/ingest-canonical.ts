/**
 * ROOTS-AI(TM) M2 - Controlled source ingestion (requirement section 10).
 *
 * Reads the controlled C-01 / C-02 executable XLSX files and emits the
 * machine-readable canonical configuration used by the application, with NO
 * manual reinterpretation. The generated output must reproduce the controlled
 * source, and it records the exact source version used.
 *
 * Usage:
 *   npx tsx scripts/ingest-canonical.ts <C-01.xlsx> <C-02.xlsx>
 *
 * Requires the XLSX files (the canonical executable sources). Until they are
 * supplied, the hand-maintained descriptors in lib/canonical/*.ts are the
 * working source of truth and scripts/verify-canonical.ts checks their shape.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

interface Row {
  [column: string]: string | number | undefined;
}

/** Minimal XLSX reader via the bundled sqlite-free path: uses SheetJS if present. */
async function loadWorkbook(path: string): Promise<Record<string, Row[]>> {
  type XlsxModule = {
    readFile: (p: string) => { SheetNames: string[]; Sheets: Record<string, unknown> };
    utils: { sheet_to_json: (s: unknown, o: unknown) => Row[] };
  };
  const moduleName = "xlsx";
  let XLSX: XlsxModule;
  try {
    const loaded = (await import(moduleName)) as { default?: XlsxModule } & XlsxModule;
    XLSX = loaded.default ?? loaded;
  } catch {
    throw new Error(
      "The 'xlsx' package is required to ingest the controlled XLSX sources. " +
        "Install it with: npm install --save-dev xlsx",
    );
  }
  const workbook = XLSX.readFile(path);
  const sheets: Record<string, Row[]> = {};
  for (const name of workbook.SheetNames) {
    sheets[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: undefined });
  }
  return sheets;
}

async function main() {
  const [c01Path, c02Path] = process.argv.slice(2);
  if (!c01Path || !c02Path) {
    console.error("Usage: npx tsx scripts/ingest-canonical.ts <C-01.xlsx> <C-02.xlsx>");
    process.exitCode = 1;
    return;
  }

  const c01 = await loadWorkbook(c01Path);
  const c02 = await loadWorkbook(c02Path);

  // The controlled sheets are identified by name; keep the raw sheet contents
  // verbatim in the generated output so nothing is lost or reinterpreted.
  const output = {
    generatedAt: new Date().toISOString(),
    sources: {
      questionnaire: { file: c01Path, sheets: Object.keys(c01) },
      scoring: { file: c02Path, sheets: Object.keys(c02) },
    },
    c01,
    c02,
  };

  const outPath = "lib/canonical/generated/canonical-source.json";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`Ingested controlled sources verbatim -> ${outPath}`);
  console.log(`C-01 sheets: ${Object.keys(c01).join(", ")}`);
  console.log(`C-02 sheets: ${Object.keys(c02).join(", ")}`);
  console.log(
    "Next: reconcile the generated rows against lib/canonical/*.ts and regenerate " +
      "Golden Test expectations from the C-02 sheet.",
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
