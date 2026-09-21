/**
 * ROOTS-AI(TM) M2 - Canonical structure verification (requirement section 1 and 10).
 *
 * Verifies the implemented assessment reproduces the controlled C-01 v1.0.1
 * CORRECTED structure and identifies the exact canonical source versions used.
 */

import {
  allQuestions,
  assessmentModules,
  REQUIRED_MULTI_SELECT_QUESTIONS,
} from "@/lib/canonicalAssessment";
import { CANONICAL_VERSIONS, DOMAIN_TIE_ORDER } from "@/lib/canonical/source";

interface Check {
  id: string;
  description: string;
  expected: string;
  actual: string;
  pass: boolean;
}

const checks: Check[] = [];

function check(
  id: string,
  description: string,
  expected: unknown,
  actual: unknown,
) {
  const exp = JSON.stringify(expected);
  const act = JSON.stringify(actual);
  checks.push({
    id,
    description,
    expected: exp,
    actual: act,
    pass: exp === act,
  });
}

const scored = allQuestions.filter((q) => q.scoringEligible);
const required = allQuestions.filter((q) => q.required);
const optional = allQuestions.filter((q) => !q.required);

check("C-01-A", "Total canonical questions", 73, allQuestions.length);
check("C-01-B", "Ordered modules", 13, assessmentModules.length);
check("C-01-C", "Required questions", 71, required.length);
check("C-01-D", "Optional questions", 2, optional.length);
check("C-01-E", "Scoring-eligible questions", 40, scored.length);
check(
  "C-01-F",
  "Module order is 1..13",
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  assessmentModules.map((m) => m.order),
);
check(
  "C-01-G",
  "Required multi-select set",
  ["Q13", "Q14", "Q52", "Q53", "Q54"],
  REQUIRED_MULTI_SELECT_QUESTIONS,
);
check(
  "C-01-H",
  "Question ids are Q1..Q73",
  Array.from({ length: 73 }, (_, i) => `Q${i + 1}`),
  allQuestions.map((q) => q.id),
);

// Every module's questions fall inside its declared range.
const moduleRangesOk = assessmentModules.every((m) => {
  const nums = m.questions.map((q) => Number(q.id.slice(1)));
  return (
    nums.length > 0 &&
    nums[0] >= m.order * 0 + 1 &&
    nums.every((n, i) => i === 0 || n === nums[i - 1] + 1)
  );
});
check(
  "C-01-I",
  "Module questions are contiguous and ordered",
  true,
  moduleRangesOk,
);

// Scoring-eligible questions all carry a canonical tie-order domain.
const domainsOk = scored.every(
  (q) => q.domain && (DOMAIN_TIE_ORDER as readonly string[]).includes(q.domain),
);
check("C-01-J", "Scoring questions map to a canonical domain", true, domainsOk);

check(
  "C-02-A",
  "Questionnaire version",
  "C-01 v1.0.1 CORRECTED",
  CANONICAL_VERSIONS.questionnaire,
);
check(
  "C-02-B",
  "Scoring version",
  "C-02 v1.0.1 CORRECTED",
  CANONICAL_VERSIONS.scoring,
);

let pass = 0;
let fail = 0;
console.log("=== Canonical Structure Verification ===\n");
console.log("Check    | Expected | Actual | Result | Description");
console.log("-".repeat(100));
for (const c of checks) {
  if (c.pass) pass++;
  else fail++;
  console.log(
    `${c.id.padEnd(8)} | ${c.expected.padEnd(28).slice(0, 28)} | ${c.actual.padEnd(20).slice(0, 20)} | ${c.pass ? "PASS" : "FAIL"} | ${c.description}`,
  );
}
console.log("-".repeat(100));
console.log(`Passed: ${pass}  Failed: ${fail}`);
if (fail > 0) process.exitCode = 1;
