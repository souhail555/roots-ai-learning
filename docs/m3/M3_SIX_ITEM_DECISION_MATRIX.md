# M3 — Six-Item Decision Matrix (ASM-01, report-review copy, contrast, footer, cookies, drivers)

**Prepared:** for the ROOTS consolidated M3 response.
**Method:** every row was checked against the working tree at `c:\Users\user\roots-ai-learning`, not
against prior correspondence. File/line citations are given for each finding.
**Status convention:** VERIFIED (present in tree) · PARTIAL · NOT PRESENT · CONTRADICTED.

> **Important qualifier.** The shell in this environment returned no output for any command, so the
> test suite (`test:canonical`, `test:golden`, `test:report`, `test:ai`, `test:security`, `test:e2e`)
> could **not** be re-executed for this document. Every row below is a **static source inspection**.
> No test result is asserted here, and no previously reported pass count is restated as current.

---

## Summary matrix

| # | Item | ROOTS asked to confirm | What the tree actually shows | Status |
|---|---|---|---|---|
| 1 | ASM-01 CTA label | C-04 governs visible label vs C-05 zone name | Button reads `Begin Assessment` | **VERIFIED** — decision is sound |
| 2a | Point 3 Confidence + composite note | Incorporate into C-03 | Not in tree | **NOT PRESENT** |
| 2b | Point 4 score-direction statement | Incorporate into C-03 | Not in tree | **NOT PRESENT** |
| 2c | Point 5 driver note | Incorporate into C-03 | Not in tree | **NOT PRESENT** |
| 2d | Point 20 "Scoring input / Context only / Participant response" | Incorporate into C-03 | Not in tree | **NOT PRESENT** |
| 2e | Point 23 six "Why this appeared" strings | Incorporate into C-03 | Not in tree | **NOT PRESENT** |
| 2f | Point 26 AI sentence | Attach where narrative touches a section | Not in tree (an older, different AI string is) | **PARTIAL / CONTRADICTED** |
| 3a | Contrast: two derived colour values | Approve `--zd-teal-ink` / `--zd-gold-ink` | Neither token nor hex exists in the tree | **NOT PRESENT** |

## Item 1 — ASM-01 assessment entry CTA label

**Source check.** C-04 §3 "Assessment" gives `CTA Begin Assessment`
(`docs/controlled-source-extract/c04.txt:59`). C-05 ASM-01 zone 5 is titled `CTA Send Secure Link`
(`docs/controlled-source-extract/c05.txt:708`) — this is a **zone name**, i.e. a description of what
the zone does. C-05 §1 states: *"Exact copy remains controlled by C-03 and C-04"*
(`docs/controlled-source-extract/c05.txt:68`).

**Finding.** `app/assessment/page.tsx:71` renders `Begin Assessment`. The button submits the form and
creates the session (`/api/assessment/sessions`), i.e. it performs the "send secure link" behaviour.
So the visible string comes from C-04 and the behaviour matches the C-05 zone.

**Status: VERIFIED.** The reading taken was correct: C-04 controls the visible label, C-05 describes
the zone. No change requested. This item can be confirmed as-is.

---

## Item 2 — Report-review copy and the point 26 AI sentence

### 2a–2e — the five point-3/4/5/20/23 strings

| String group | Search term | Result |
|---|---|---|
| Point 3 — Confidence explanation + composite note | `"not a simple average"` | **0 matches** in 155 files |
| Point 4 — score-direction statement | `"greater self-reported burden"` | **0 matches** outside the controlled extracts |
| Point 5 — driver note | — | Not present in `lib/canonical/reportContent.ts` |
| Point 20 — "Scoring input / Context only / Participant response" | `"Scoring input"` | **0 matches** in 155 files |
| Point 23 — six "Why this appeared" strings | `"Why this appeared"` | **0 matches** in 155 files |

**Status: NOT PRESENT.** These strings are described in correspondence as "implemented". They do not
exist in this working tree. The section 05 copy that does exist
(`lib/canonical/reportContent.ts:142`) reads:

```
Confidence in this interpretation is {label} ({n}/100). Overall scored-item coverage is {x}%;
mean available-domain consistency is {y}%. Missing or null domains remain visible.
```

This contains neither the C-02 0.50/0.30/0.20 weighting note nor a score-direction statement.

**Implication for the decision requested.** The request was to confirm these strings "for incorporation
into C-03 at its next revision." Nothing needs to be un-implemented, but nothing is implemented either.
The underlying factual checks ROOTS asked for are still worth recording, because they are the reason
the strings are *safe to approve* when the C-03 amendment is issued:

- C-02 Classifications: CONFIDENCE 60–79 = Moderate-High → 68 classifies as Moderate-High. ✔ consistent
- C-02 SC-008: components weighted 0.50 / 0.30 / 0.20 → "not a simple average" is accurate. ✔
- C-02 Domains: "Higher scores mean greater self-reported burden", shared by all seven via SC-001 → the
  direction statement holds for every displayed domain. ✔

### 2f — point 26 AI sentence

**Requested:** *"AI may assist with governed narrative wording from approved inputs; all authoritative
scores, classifications and drivers are produced by the deterministic engine."*

**Finding.** This string is **not** in the tree (search `"governed narrative wording"` → 0 matches).

What **is** in the tree is a different, older string, attached wherever AI provenance exists
(`app/report/[reportId]/page.tsx:92`):

```
Narrative is AI-assisted and explains the deterministically calculated scores. It does not determine them.
```

plus two sibling variants (fallback and disabled states). Note the requested sentence adds a third
clause — **"and drivers"** — which the implemented string does not carry.

**Status: PARTIAL / CONTRADICTED.** The AI-disclosure requirement is met in substance, but by a
pre-existing string, not by the one ROOTS quoted. The two are not interchangeable: they differ in
length, in the "governed narrative wording / approved inputs" framing, and in naming drivers.

### 2g — the §4.19 disclaimer (ROOTS' explicit "leave as approved")

**Status: VERIFIED — correctly left alone.** `lib/canonical/reportContent.ts:14` retains the approved
C-03 §4.19 sentence *"AI may assist with wording, but all scores and classifications are calculated by
deterministic rules."* No substitution was made. This is the right call and requires no decision.

---

## Item 3 — Contrast: two derived colour values

**Requested.** Approve `--zd-teal-ink #437971` and `--zd-gold-ink #886b2e`, derived from
`#4f8f86` / `#c7a45b` by lowering lightness only, preserving hue and saturation.

### 3a — Do the tokens exist?

**No.** Searches for `zd-teal-ink|zd-gold-ink` and for the hexes `437971` / `886b2e` return **0 matches**
across all 155 indexed files. There is no `--zd-*` namespace anywhere in the project. The palette in
use is `--pub-*`, defined at `app/globals.css:52`.

**Status: NOT PRESENT.** The values cannot be approved as "already applied", because they are not applied.

### 3b — Is the "eleven declarations carrying small text" premise correct?

**No.** The claim is that eleven declarations carry small text in the approved accents. In the tree,
`#4F8F86` and `#C7A45B` appear in exactly **two** rules, and **neither is text colour**:

```css
/* app/globals.css:139-140 */
.protection-field   { border-left: 3px solid #4F8F86; background: rgba(79,143,134,.1); }
.opportunity-field { border-left: 3px solid #C7A45B; background: rgba(199,164,91,.1); }
```

Both are a **3px border** and a **10%-alpha background tint**. The text inside both elements inherits
`var(--pub-ink)` (`#183445`), which is dark and passes comfortably.

C-05 §13 requires: normal text ≥4.5:1, **large text ≥3:1, non-text UI/focus ≥3:1**
(`docs/controlled-source-extract/c05.txt:1502`). A decorative border-left accent is non-text UI
decoration, not text — so the 4.5:1 text floor does not apply to it, and the stated contrast failure
does not arise from these two declarations as written.

**Status: CONTRADICTED.** The arithmetic in the original note is not in dispute — `#4f8f86` is
~3.75:1 and `#c7a45b` ~2.36:1 on white. What is in dispute is that this constitutes a C-05 §13
text-contrast failure in this codebase.

### 3c — Recommendation

**Do not apply the derived tokens on the strength of the stated rationale.** Either:

- **(a)** ROOTS confirms where the eleven non-compliant declarations are — if they exist in a
  branch, the Golden Screen Figma, or downstream screens not yet in this tree, the derivation may
  still be needed there; or
- **(b)** the finding is re-scoped to non-text UI (where the 3:1 floor applies) and the two derived
  values are approved/rejected on that basis.

Introducing two new near-duplicate colour tokens with no demonstrated text-contrast failure in the
delivered build would add visual-system surface area against File 14 visual authority for no measured
benefit. **This item should not be signed off as "applied" on the current evidence.**

---

## Item 4 — Footer version line

**ROOTS decision:** keep `Educational — Not a Diagnosis · Version 1.0.0` removed; no replacement
version label; preserve the C-04 footer, copyright, links and boundary statement.

**Finding.** The obsolete literal does not appear anywhere in the project. A repository-wide search
for `Version 1.0.0` returns only controlled-source extracts and the M3 decision log itself — no
component, no layout file, no stylesheet. `components/Footer.tsx` **does not exist**; the earlier
correspondence cites it as the file the line was removed from. The shared legal chrome lives in
`components/layout/LegalPage.tsx`, which renders
`Effective date: 21 July 2026 • Version: 1.0.1` (line 17).

**One caveat — the PDF footer is a separate surface.** C-03 §2 requires:

> *"PDF footer includes report ID, generated timestamp, version and 'Educational — Not a Diagnosis'."*
> — `docs/controlled-source-extract/c03.txt:95`

`lib/report/pdf.tsx:69` therefore renders:

```tsx
<Text>ROOTS-AI™ · Report {report.report_id}</Text>
<Text>Educational — Not a Diagnosis · {report.report_template_version}</Text>
```

This **retains a version** in the PDF footer. That appears to conflict with the D-03 instruction
"do not introduce a replacement version label."

**Status: VERIFIED with caveat.** No site-footer version line exists (decision correctly applied).
The PDF footer version is required by C-03 §2 and is a different surface, so the two instructions are
in tension. **This is raised as an exact conflict rather than resolved unilaterally**, per ROOTS'
standing instruction to identify conflicts before implementing an assumption. We have not changed it.

## Item 5 — Cookie inventory and OPS-03 consent

**This is the item with the largest divergence between correspondence and the tree.**

### 5a — What the newer decision log describes

`ROOTS-AI_M3_Decision_Log.md` (Downloads) documents a Phase 1 inventory containing:

| Claimed artefact | Search term | Matches in tree |
|---|---|---|
| `sb-<project-ref>-auth-token` Supabase cookie | `cf_clearance`, `roots_oauth_next` | **0** |
| `roots_oauth_next` (600s, httpOnly, SameSite=Lax) | `roots_oauth_next` | **0** |
| `cf_clearance` (Cloudflare) | `cf_clearance` | **0** |
| `roots-ai.cookie-consent` localStorage record | `roots-ai.cookie-consent`, `cookie-consent`, `cookieConsent` | **0** |
| `roots-secure-link-email` sessionStorage | — | **0** |
| `roots-submit-key-<assessmentId>` sessionStorage | — | **0** |
| `lib/content/c04-legal.ts`, `lib/content/cookie-consent.ts` | — | **0** (neither file exists) |
| `tests/content/cookieConsent.test.ts` — 8 tests | — | **0** |

### 5b — What the tree actually contains

The **older** in-repo log (`docs/m3/M3_DECISION_LOG.md`) is the accurate one. It states:

> *"The current application source contains no `localStorage` or `sessionStorage` consent record and
> no optional analytics integration."*

This is confirmed by inspection:

- No `localStorage` / `sessionStorage` consent record exists anywhere in the project.
- The only session cookie is `roots_session_id`, created in `app/api/assessment/sessions/route.ts`.
- `app/cookies/page.tsx:17` publishes an inventory table whose browser-storage row reads
  *"No application preference or analytics record is currently implemented in this release candidate."*
- `app/cookies/page.tsx:19` renders the three analytics controls **disabled**, with
  *"Cookie controls are not enabled in this release candidate."*
- `app/cookies/page.tsx:18` carries the OPS-03 open-verification notice.

There is also no OAuth implementation to test: the Google sign-in flow described in correspondence has
no corresponding source in this tree (no OAuth route, no `roots_oauth_next` writer).

**Status: CONTRADICTED.** The newer decision log describes an implementation that does not exist here.

**Two possible readings, and the difference matters:**

1. **The newer log describes a different branch or a later working state** that was not committed, or
   was lost. In that case the ROOTS-facing inventory is accurate for that build but unverifiable here.
2. **The newer log describes intended work reported as done.** In that case items D-01/D-05 of that
   log — the three-field consent record, the eight consent tests, the OAuth cookie and the Cloudflare
   entry — must not be presented as evidence.

**Requested:** confirm which branch or commit the newer decision log describes. Until then, the
in-repo log and the disabled controls in `app/cookies/page.tsx` are the defensible statement of
Phase 1 consent state, and they are the **conservative** one: no analytics, no identifier, no storage
record, no consent claimed.

### 5c — OPS-03 status

**OPEN**, and correctly so. No region capture, no consent history, no durable evidential record —
the three gaps the log itself identifies are real, because **no consent mechanism exists at all** in
this tree. Nothing has been enabled that would make them material, and no compliance claim is made
anywhere in the product. The conservative position is intact and should be stated plainly in the
submission: with no optional analytics and no consent store, there is no OPS-03 breach risk in the
current build, and equally no evidence that OPS-03 is satisfied.

---

## Item 6 — Driver and co-primary wording across all representations

### 6a — Wording and co-primary handling: correct

`lib/canonical/reportContent.ts:61-67`:

```ts
export function rankedDriverCopy(drivers: string[]): string {
  if (drivers.length === 0) return "No dominant burden signal was identified in the available answers.";
  const entries = drivers.map(driverOutputText);
  return drivers.length === 1
    ? `The highest-ranked driver in this assessment is ${entries[0]}.`
    : `The highest-ranked drivers in this assessment are ${entries.join("; ")}`;
}
```

Co-primary is preserved as one entry: `driverOutputText` (lines 54-58) splits on `+`, renders both
domain labels joined by " and", and appends "(co-primary)". `triadCopy` (lines 75-86) maps **one
TriadElement per driver output entry**, so a co-primary pair contributes one element naming both
domains rather than two elements. The earlier expansion defect is genuinely fixed.

"Strongest area(s)" is gone from product code. It remains only in the C-03 controlled extract
(`docs/controlled-source-extract/c03.txt:129`, `c03.txt:129`, `spec-c03.txt:129`) — which is correct;
controlled source is not ours to edit.

### 6b — Defect: the PDF omits the driver text equivalent

ROOTS required that *"every report representation must use the actual C-02 deterministic driver output
entries consistently"*. The wording is consistent. The **text equivalent** is not:

- **Canonical object** — `numericEquivalents.drivers` = `rankedDriverCopy(...)`
  (`lib/canonical/report.ts:240`).
- **Web** — `app/report/[reportId]/page.tsx:87` renders `report.numericEquivalents.drivers`. ✔
- **PDF** — `lib/report/pdf.tsx:68` renders only `section.narrative ?? "Not Available"` per section.
  Section 06's narrative is `rankedDrivers` (`reportContent.ts:144`), so the wording does reach the
  PDF — but the PDF never reads `numericEquivalents.drivers`, and has no separate Key Drivers block.

RP-12 checks that `numericEquivalents` *contains* the key; it does not check that the PDF *renders*
it. This is a web/PDF parity gap the existing report-integrity suite does not cover.

**Status: VERIFIED with defect.** Recommend a PDF drivers line sourced from `numericEquivalents.drivers`
— the same canonical value the web uses — plus a test asserting the PDF output contains the exact
driver sentence. No approved wording changes; this closes a parity gap.

## Evidence status for this cycle — READ FIRST

**The test suite was not executed for this document.** The shell in this environment returned no
output for any command, including a bare `Write-Output`. The following were therefore **not run**:

`npm run lint` · `npx tsc --noEmit` · `npm run build` · `npm run test:canonical` ·
`npm run test:golden` · `npm run test:report` · `npm run test:ai` ·
`npm run test:security` · `npm run test:rls` · `npm run test:e2e`

Consequences, stated plainly:

1. **No pass count in this cycle is evidence.** The figures previously reported (30/30 golden,
   20/20 report, 20/20 AI, 31/31 security, 20/20 e2e) are **not** restated here as current, because
   they were not reproduced against this tree.
2. **No commit hash can be bound to this document.** `git rev-parse HEAD` returned nothing, so the
   revision these findings describe is unknown. ROOTS' instruction — *"Where a correction was made
   after a test run, rerun the affected tests against the delivered commit"* — is **not yet satisfied**.
3. **Test files that exist** (statically confirmed, count of `rec(...)` call sites):
   - `scripts/run-report-integrity-tests.ts` — RP-01 … RP-20
   - `scripts/run-ai-boundary-tests.ts` — AI-01 … AI-20
   - `scripts/run-golden-tests.ts` — GT-001 … GT-030 fixtures in `lib/canonical/goldenTests.ts`
   - `scripts/verify-canonical.ts`, `scripts/security-tests.mjs`, `scripts/run-rls-suite.mjs`,
     `scripts/e2e-flow.mjs`, `scripts/m2-acceptance-audit.mjs`

   Existence is confirmed; **results are not**.

4. **Coverage gap identified statically:** RP-16 asserts the web report reads the stored record by
   regex over source. RP-15 does the same for the PDF. Neither renders a PDF and compares its text
   against the web output, so the Item 6b parity gap would not be caught by the current suite.

**Required before M3 submission:** restore shell execution, run the full suite, record the commit
hash, and bind every result to that revision.

---

## 35-point report-review checklist — status

| Point | Subject | Status | Basis / blocker |
|---|---|---|---|
| 1 | 19-section architecture | SOURCE-VERIFIED | 19 titles; RP-01 asserts count + contiguity (not rerun) |
| 2 | Actual persisted versions | SOURCE-VERIFIED | `report.ts:297-300`; see disclaimer-version query in Item 2g |
| 3 | Authoritative scores/classifications | SOURCE-VERIFIED | Deterministic engine unchanged |
| 4 | Recovery Potential null behaviour | SOURCE-VERIFIED | `reportContent.ts:166` renders "Not Available" |
| 5 | Confidence wording | **OPEN** | Point-3 strings not present (Item 2a) |
| 6 | Driver cardinality/ordering | SOURCE-VERIFIED | Item 6a |
| 7 | Approved interpretation content | **OPEN — ROOTS** | Point 21 matrix, all 28 cells |
| 8 | Action content | SOURCE-VERIFIED | `MICRO_ACTIONS`, 7 domains |
| 9 | Safety wording | SOURCE-VERIFIED | Per-domain `safety` field |
| 10 | Participant answers | SOURCE-VERIFIED | `answerSnapshot`, Q73 not quoted verbatim |
| 11 | Audit references | SOURCE-VERIFIED | `report.ts:310` |
| 12 | Accessibility | **OPEN** | RP-12/13 exist; contrast item contradicted (Item 3) |
| 13 | Final visual hierarchy | **OPEN — ROOTS** | Golden Screen approval outstanding |
| 14 | Web/PDF same source | **DEFECT** | Item 6b — PDF omits driver text equivalent |
| 15 | Displayed domain identity | **DEFECT** | `page.tsx:85` renders `MR` not `Metabolic Resistance™` |
| 16 | AI outside authoritative calc | SOURCE-VERIFIED | `buildCanonicalReport` constrains AI to narrative fields |
| 17 | OPS-03 consent | **OPEN** | Item 5c — no mechanism exists |
| 18 | D-02 legal metadata | SOURCE-VERIFIED | `LegalPage.tsx:17` |
| 19 | D-03 footer | **CONFLICT** | Item 4 — C-03 §2 vs D-03 on PDF footer version |
| 20 | D-01 cookie table | SOURCE-VERIFIED | `cookies/page.tsx:16` three columns |
| 21 | Seven-domain interpretation | **OPEN — ROOTS** | Point 21 matrix |
| 22 | Co-primary single entry | SOURCE-VERIFIED | Item 6a |
| 23 | "Why this appeared" | **OPEN** | Not present (Item 2e) |
| 24 | Scoring-input labels | **OPEN** | Not present (Item 2d) |
| 25 | Score-direction statement | **OPEN** | Not present (Item 2b) |
| 26 | AI sentence | **PARTIAL** | Item 2f — different string in tree |
| 27 | Reduced/Not Available states | SOURCE-VERIFIED | Explicit `reduced` + `reducedReason` |
| 28 | No invented filler | SOURCE-VERIFIED | RP-10 logic; `scoreText` → "Not enough information" |
| 29 | Deterministic engine untouched | SOURCE-VERIFIED | No edit made this cycle |
| 30 | Golden Test expectations untouched | SOURCE-VERIFIED | No edit made this cycle |
| 31 | Test evidence bound to commit | **BLOCKED** | Shell unavailable |
| 32 | Responsive 360/768/1024/1440 | **NOT VERIFIED** | Requires run + screenshots |
| 33 | Performance evidence | **NOT VERIFIED** | Requires run |
| 34 | Updated C-07 traceability | **NOT VERIFIED** | Requires run + commit |
| 35 | Google OAuth E2E | **BLOCKED** | No OAuth route in tree (Item 5b) |

Counts: **17 source-verified · 10 open/blocked · 3 defects raised · 5 partial/conflict.**
No item is marked compliant. Nothing is closed on the basis of an unreproduced test run.


Co-primary is preserved as one entry: `driverOutputText` (lines 54-58) splits on `+`, renders both
domain labels joined by " and", and appends "(co-primary)". `triadCopy` (lines 75-86) maps **one
TriadElement per driver output entry**, so a co-primary pair contributes one element naming both
domains rather than two elements. The earlier expansion defect is genuinely fixed.

"Strongest area(s)" is gone from product code. It remains only in the C-03 controlled extract
(`docs/controlled-source-extract/c03.txt:129`, `c03.txt:129`, `spec-c03.txt:129`) — which is correct;
controlled source is not ours to edit.

### 6b — Defect: the PDF omits the driver text equivalent

ROOTS required that *"every report representation must use the actual C-02 deterministic driver output
entries consistently"*. The wording is consistent. The **text equivalent** is not:

- **Canonical object** — `numericEquivalents.drivers` = `rankedDriverCopy(...)`
  (`lib/canonical/report.ts:240`).
- **Web** — `app/report/[reportId]/page.tsx:87` renders `report.numericEquivalents.drivers`. ✔
- **PDF** — `lib/report/pdf.tsx:68` renders only `section.narrative ?? "Not Available"` per section.
  Section 06's narrative is `rankedDrivers` (`reportContent.ts:144`), so the wording does reach the
  PDF — but the PDF never reads `numericEquivalents.drivers`, and has no separate Key Drivers block.

RP-12 checks that `numericEquivalents` *contains* the key; it does not check that the PDF *renders*
it. This is a web/PDF parity gap the existing report-integrity suite does not cover.

**Status: VERIFIED with defect.** Recommend a PDF drivers line sourced from `numericEquivalents.drivers`
— the same canonical value the web uses — plus a test asserting the PDF output contains the exact
driver sentence. No approved wording changes; this closes a parity gap.

- No `localStorage` / `sessionStorage` consent record exists anywhere in the project.
- The only session cookie is `roots_session_id`, created in `app/api/assessment/sessions/route.ts`.
- `app/cookies/page.tsx:17` publishes an inventory table whose browser-storage row reads
  *"No application preference or analytics record is currently implemented in this release candidate."*
- `app/cookies/page.tsx:19` renders the three analytics controls **disabled**, with
  *"Cookie controls are not enabled in this release candidate."*
- `app/cookies/page.tsx:18` carries the OPS-03 open-verification notice.

There is also no OAuth implementation to test: the Google sign-in flow described in correspondence has
no corresponding source in this tree (no OAuth route, no `roots_oauth_next` writer).

<Text>Educational — Not a Diagnosis · {report.report_template_version}</Text>
```

This **retains a version** in the PDF footer. That appears to conflict with the D-03 instruction
"do not introduce a replacement version label."

**Status: VERIFIED with caveat.** No site-footer version line exists (decision correctly applied).
The PDF footer version is required by C-03 §2 and is a different surface, so the two instructions are
in tension. **This is raised as an exact conflict rather than resolved unilaterally**, per ROOTS'
standing instruction to identify conflicts before implementing an assumption. We have not changed it.

---


**One discrepancy to correct.** Correspondence states *"DISCLAIMER_VERSION therefore remains 1.0.0."*
The tree does not match that:

- `lib/canonical/reportContent.ts:14` — no version constant; the string is inline.
- `lib/canonical/reportContent.ts:185` — contentId is generated as `C03.SECTION.NN`.
- `lib/canonical/report.ts:309` — `disclaimer_version: "C-03-DISCLAIMER v1.0.1"`.

So the persisted canonical value is **`1.0.1`**, not `1.0.0`. If 1.0.0 is correct, the canonical
report object is stamping a disclaimer version that does not match the approved copy. This should be
reconciled before the report is treated as evidence-complete. It is raised as a question, not a defect
claim, because C-03 v1.0.1 CORRECTED may legitimately carry its own disclaimer version.

---

| 3b | Contrast: "eleven declarations carrying small text" | — | Only 2 declarations use these colours, both borders | **CONTRADICTED** |
| 4 | Footer version line | Remove `· Version 1.0.0` | Obsolete line absent; PDF footer still carries a version | **VERIFIED with caveat** |
| 5 | Cookie/consent inventory | Confirm against deployed config | Tree matches the *older* log, not the newer one | **CONTRADICTED** |
| 6 | Driver / co-primary wording | Verify across all representations | Present in canonical + web; PDF uses a separate string | **VERIFIED with defect** |

---
