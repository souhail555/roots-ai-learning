/** Temporary: prints C-02 Option_Points for the MR activity items + a set summary. */
import XLSX from "xlsx";
import { homedir } from "node:os";
import { join } from "node:path";

const file = join(
  homedir(),
  "Desktop",
  "03_ROOTS_AI_C02_Canonical_Scoring_Rules_and_Golden_Tests_v1.0.1_CORRECTED.xlsx",
);
const wb = XLSX.readFile(file);
const rows = XLSX.utils.sheet_to_json(wb.Sheets["Option_Points"], {
  defval: null,
});
const keys = Object.keys(rows[0]);
console.log("COLUMNS:", JSON.stringify(keys));
for (const r of rows) {
  const q = String(r[keys[0]]);
  if (["Q46", "Q47", "Q48", "Q26", "Q28", "Q9"].includes(q)) {
    console.log(
      `  ${q} | ${r[keys[1]]} | ${r[keys[2]]} | ${r[keys[3]]} | '${r[keys[4]]}' | pts=${r[keys[5]]} | na=${r[keys[6]]}`,
    );
  }
}
const sets = new Map<string, string[]>();
for (const r of rows) {
  const set = String(r[keys[2]]);
  if (!sets.has(set)) sets.set(set, []);
  const pts = r[keys[5]];
  sets.get(set)!.push(`${r[keys[3]]}:${pts === null ? "n/a" : pts}`);
}
console.log("\nSETS with points:");
for (const [s, opts] of sets) {
  const hasPoints = opts.some((o) => !o.endsWith("n/a"));
  console.log(
    `  ${s} ${hasPoints ? "SCORED" : "contextual"}: ${opts.join(" ")}`,
  );
}
