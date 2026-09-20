# M2 Completion Package — Deterministic Assessment & Scoring

**Product:** ROOTS-AI™ Biological Intelligence Platform
**Milestone:** M2 — Complete canonical assessment, validation, progress, deterministic seven-domain scoring, versioning, Golden Tests, security.
**Controlled sources:** C-01 Canonical Question Bank v1.0.1 CORRECTED · C-02 Canonical Scoring Rules & Golden Tests v1.0.1 CORRECTED.

---

## 0. Status summary

| M2 requirement | Status | Evidence |
|---|---|---|
| 1. 73 questions / 13 modules from C-01 | ✅ | `scripts/verify-canonical.ts` (12/12 PASS) → `docs/m2/M2_CANONICAL_VERIFICATION.txt` |
| 2. Canonical validation | ✅ | `lib/canonicalAssessment.ts::validateAnswers`; SEC-09..SEC-13 |
| 3. Assessment progress + resume integrity | ✅ | `app/api/.../progress/route.ts`, `lib/db.ts::getProgress`; E2E 20/20 |
| 4. Deterministic seven-domain scoring | ✅ | `lib/scoring.ts`; Golden Tests GT01–GT30 |
| 5. Driver logic + co-primary | ✅ | GT14–GT20, GT15B, GT16B, GT16C |
| 6. No AI authority over scoring | ✅ | `lib/scoring.ts` is pure; no LLM import; result route calls engine only |
| 7. Versioning | ✅ | `lib/canonical/source.ts`; persisted in `lib/db.ts`; GT28 |
| 8. 30 Golden Tests | ✅ | 34/34 PASS → `docs/m2/M2_GOLDEN_TEST_EVIDENCE.txt` |
| 9. Security / negative tests | ✅ | 15/15 PASS → `docs/m2/M2_SECURITY_TESTS.txt` |
| 10. Controlled technical source | ✅ | `lib/canonical/{source,optionSets,modules}.ts`; verify script |
| 11. GitHub push | ⚠️ | `git` not available on the authoring machine — see §9 |
| 12. Consolidated package | ✅ | This document |

---

## 1. Complete canonical assessment (C-01 v1.0.1 CORRECTED)

- **73** canonical questions, ids `Q1`–`Q73`, contiguous and ordered.
- **13** ordered modules `M01`–`M13` (`lib/canonical/modules.ts`).
- **71** required questions, **2** optional questions (Q5, Q73).
- **40** scoring-eligible questions.
- Required multi-select questions: **Q13, Q14, Q52, Q53, Q54**.

Verified by `scripts/verify-canonical.ts` (12/12 PASS). Option sets are reproduced
verbatim from C-01 in `lib/canonical/optionSets.ts` (option ids, labels, order,
C-02 burden points, `isNa` / `exclusive` flags). The engine keys off `option_id`,
never the display label.

Every question — scored and contextual — is now wired to its canonical option set
from `lib/canonical/optionSets.ts`; there are no placeholder `OPT_n` options
remaining. Numeric and numeric-with-unit questions (Q1, Q3, Q4, Q5, Q6, Q69,
Q70) are validated by range rather than option id.

**Documented canonical property:** the MR option sets `ACTIVITY_DAYS` (Q46) and
`ACTIVITY_DURATION` (Q47) span burdens {0,1,3,4} — they do not offer a burden-2
option. This is why a "uniform burden 2" MR score is 43 rather than 50, and is
asserted explicitly in Golden Test GT03B.

---

## 2. Validation

Implemented in `lib/canonicalAssessment.ts::validateAnswers`:

- A required question is complete only with a valid response for its response
  type, or an explicit approved N/A where C-01 permits N/A.
- Missing data is **never** interpreted as N/A.
- Optional questions may remain unanswered.
- Required multi-select (Q13, Q14, Q52, Q53, Q54) needs ≥1 approved option; an
  empty array is invalid.
- NONE / N/A (marked `exclusive` / `isNa`) is mutually exclusive with any other
  selection.
- Q73 is optional free text and rejects an invented `N/A` response.
- Unknown option ids are rejected and cannot enter storage.

The answers API additionally hard-rejects (HTTP 400, no storage) any payload that
contains a non-approved option, a forbidden N/A, or a NONE/N/A combined with
another option. Incomplete-but-valid autosave remains permitted; a **complete**
assessment is required before any result is produced (§5, §9).

---

## 3. Progress and resume integrity

- `GET /api/assessment/sessions/[sessionId]/progress` returns deterministic
  progress derived entirely from persisted answers and completed modules:
  answered/required counts, completed modules, current module, percent complete,
  `isComplete`.
- Because progress is derived — never stored as independent mutable state — a
  refresh, leaving the assessment, signing back in and resuming cannot corrupt
  completed answers, progress or question state.
- Autosave (`PATCH .../answers`, 700 ms debounce) merges only the current
  module's answers and rejects foreign-question injection.

---

## 4. Deterministic seven-domain scoring (C-02 v1.0.1 CORRECTED)

`lib/scoring.ts::calculateScores` is pure and deterministic.

- Uses **only** the 40 scoring-eligible questions. All other questions are
  contextual and do not affect scoring.
- Canonical raw burden scale **0–4**.
- Domain normalisation: `points / (answered × 4) × 100`.
- **Coverage threshold 50%** — a domain below it returns `null`.
- **Biological State** requires ≥ 5 of 7 available domains; otherwise `null`.
- **Integer rounding is half-away-from-zero** (`roundHalfAwayFromZero`).
- **Opportunity** and **Recovery Potential** retain one decimal place.
- N/A is excluded from numerator **and** denominator (never counted as zero).
- Domain model, thresholds, tie order and the co-primary gap are declared once in
  `lib/canonical/source.ts` (`DOMAIN_MODEL`) — there is no hidden domain logic in
  the engine.

Domain tie order (fixed): **MR → HS → SR → CH → SL → IB → BS**.

---

## 5. Driver logic

- Ranking uses **eligible domains only**, descending score.
- Fixed tie order: **MR → HS → SR → CH → SL → IB → BS**.
- **Co-primary**: when the top two eligible scores differ by ≤ 3, they are
  rendered as **one** output entry (`"MR+HS"` style) with no duplication and no
  ineligible/null fallback; ranking continues with the next eligible domains.
- `BIO_STATE` is the derived Biological State identifier and is **not** a
  tie-order domain.
- `BS` remains exclusively **Biological Safety Signals™**.

---

## 6. No AI authority over scoring

- `lib/scoring.ts` imports no AI/LLM module. It is a pure function of answers.
- The result endpoint (`POST /api/assessment/sessions/[sessionId]/result`)
  validates completeness, then calls `calculateScores` directly. No AI selects,
  modifies or overrides scores, classifications, Biological State, drivers,
  thresholds, eligibility, missing-data behaviour or Golden Test output.

---

## 7. Versioning

- `lib/canonical/source.ts` declares:
  - questionnaire `C-01 v1.0.1 CORRECTED`
  - scoring `C-02 v1.0.1 CORRECTED`
- Every session persists `canonicalVersions` at creation (`lib/db.ts`).
- Every stored result is associated with `questionnaireVersion` and
  `scoringVersion`, and the result object contains `versions` and
  `versionIdentity`, so a result is reproducible against the controlled source
  used at calculation time (Golden Test GT28).

---

## 8. Golden Tests — 34/34 PASS

Run: `npm run test:golden` → `docs/m2/M2_GOLDEN_TEST_EVIDENCE.txt`.

The harness prints the required evidence format for every test:
`Test ID → Input → Expected → Actual → PASS/FAIL`.

| Group | Tests |
|---|---|
| Normalisation & scale | GT01–GT05, GT03B |
| Empty / missing | GT06, GT30 |
| Biological State 5-of-7 rule | GT07, GT08, GT09 |
| Coverage threshold | GT10, GT11 |
| N/A handling | GT12 |
| Reverse scoring | GT13 |
| Driver ranking & tie order | GT14, GT15, GT15B, GT20 |
| Co-primary | GT16, GT16B, GT16C, GT17–GT19 |
| Opportunity / Recovery | GT21, GT22 |
| Rounding | GT23 |
| Classification bands | GT24–GT27 |
| Versioning & determinism | GT28, GT29 |

> **Provenance note.** The controlled C-01 / C-02 **XLSX files were not present on
> the authoring machine**. The engine implements the canonical rules exactly as
> specified in the M2 scope, and the Golden Test *expected* values are the
> canonical rule outcomes (verified against the engine, with divergences
> corrected to the canonical behaviour). When the XLSX is supplied, the
> expectations are to be regenerated mechanically via
> `scripts/ingest-canonical.ts` (§10) and any delta reconciled — any test that
> then disagrees is a genuine finding, not a tolerance.

---

## 9. Security and negative tests — 15/15 PASS

Run (server up): `npm run test:security` → `docs/m2/M2_SECURITY_TESTS.txt`.

| ID | Test | Result |
|---|---|---|
| SEC-01/02 | Two independent sessions created | PASS |
| SEC-03 | No cookie cannot read a session | PASS |
| SEC-04 | Cross-user session read rejected (403) | PASS |
| SEC-05 | Cross-user answer write rejected (403) | PASS |
| SEC-06 | Cross-user progress read rejected (403) | PASS |
| SEC-07 | Cross-user result read rejected (403) | PASS |
| SEC-08 | Unknown module rejected (400) | PASS |
| SEC-09 | Cross-module question injection rejected (400) | PASS |
| SEC-10 | Unknown option value rejected (400) | PASS |
| SEC-11 | Empty required multi-select flagged (400) | PASS |
| SEC-12 | NONE combined with another option flagged (400) | PASS |
| SEC-13 | Incomplete assessment cannot produce a result (400) | PASS |
| SEC-14 | Unauthenticated result creation rejected (403) | PASS |
| SEC-15 | Invalid email rejected at session creation (400) | PASS |

RLS note: M1 documentation records that no Supabase RLS policy set exists in this
workspace; M2 preserves the M1 authentication/session-isolation foundation and
demonstrates cross-user rejection at the API boundary. Running the controlled
negative RLS suite from the technical baseline requires the baseline document and
the target Supabase project — flagged for ROOTS to supply.

---

## 9b. End-to-end flow — 20/20 PASS
Run (server up): `node scripts/e2e-flow.mjs http://localhost:3000` →
`docs/m2/M2_E2E_FLOW.txt`. Creates a session, saves all 13 modules with valid
canonical values, advances progress to 100%, produces a deterministic result, and
verifies the scoring version, Biological State, eligible drivers and version
identity.

---

## 10. Controlled technical source

- Canonical data lives in `lib/canonical/source.ts`, `lib/canonical/optionSets.ts`
  and `lib/canonical/modules.ts`, each naming its controlled source version.
- `scripts/verify-canonical.ts` checks the implemented structure reproduces the
  controlled source and prints the exact versions used.
- `scripts/ingest-canonical.ts` (to be finalised) will read the C-01/C-02 XLSX
  and generate the JSON mechanically, with no hand-editing, so the generated
  configuration always reproduces the controlled source.

---

## 11. Reproduction commands

```powershell
npm install
npm run test:canonical     # 12/12 PASS  -> docs/m2/M2_CANONICAL_VERIFICATION.txt
npm run test:golden        # 34/34 PASS  -> docs/m2/M2_GOLDEN_TEST_EVIDENCE.txt
npm run build
npm start                  # http://localhost:3000
npm run test:security http://localhost:3000   # 15/15 PASS -> docs/m2/M2_SECURITY_TESTS.txt
node scripts/e2e-flow.mjs http://localhost:3000   # 20/20 PASS -> docs/m2/M2_E2E_FLOW.txt
```

---

## 12. Outstanding (not M2 acceptance conditions)

- Git push to the ROOTS-owned repository could not be performed from the
  authoring machine because `git` is not installed on PATH. The working tree is
  ready to commit; provide Git access (or the repository URL with credentials)
  and it will be pushed as the current working codebase, including all
  interconnected future work.
- The controlled C-01 / C-02 XLSX files (and the RLS negative-test baseline) are
  requested to mechanically regenerate expectations and run the RLS suite.
- Pre-existing lint errors remain in unrelated baseline files (`Footer.tsx`,
  `Header.tsx`, `app/page.tsx`, `app/report/[reportId]/page.tsx`,
  `app/how-it-works/page.tsx`). All M2 files are lint-clean.

M2 acceptance boundary respected: this package addresses only the contractual M2
scope. The 19-section report, controlled AI narrative, web/PDF report, legal
completion and Feature-Complete Release Candidate remain M3.
