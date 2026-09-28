# ROOTS-AI™ — M3 Decision Log (consolidated)

**Repository:** `https://github.com/souhail555/roots-ai-learning` · **Branch:** `master`
**Purpose:** single consolidated M3 record. Every row states its status from evidence in this tree, not from correspondence.

## Status vocabulary (used strictly below)

| Status | Meaning |
|---|---|
| **IMPLEMENTED** | Present in this tree and confirmed by a passing automated test in this cycle. |
| **SOURCE-VERIFIED** | Matched line-by-line against the controlled source extract. No test required. |
| **ROOTS-APPROVED** | ROOTS issued an explicit decision. Recorded so it is not re-opened. |
| **OPEN** | Blocked on controlled-source verification, a ROOTS decision, or external environment access. Not claimed as done. |

No item below is described as approved, verified or compliant while its controlled-source
verification or ROOTS decision remains open.

---

## Part A — Deliverable status

| # | Deliverable requested by ROOTS | Where it lives | Status |
|---|---|---|---|
| 1 | Repository / branch / commit for the delivered build | This file + runbook | IMPLEMENTED |
| 2 | Deployed release-candidate reference | "Deployment state" below | **OPEN** — D-01 |
| 3 | M3 Decision Log separating implemented / source-verified / approved / gaps | This file | IMPLEMENTED |
| 4 | Corrected legal screens and footer, with source evidence | `app/{privacy,terms,cookies,medical-disclaimer,ai-disclaimer}/page.tsx`, `components/layout/Footer.tsx` | SOURCE-VERIFIED |
| 5 | Cookie and browser-storage inventory from the actual configuration | `app/cookies/page.tsx`, "Part C" | IMPLEMENTED; provider register **OPEN** |
| 6 | Corrected report web + PDF, 19-section parity matrix, 35-point checklist | `lib/canonical/reportContent.ts`, `lib/report/pdf.tsx`, `docs/m3/M3_REPORT_PARITY_MATRIX.md`, `docs/m3/M3_CORRECTION_CHECKLIST_35.md` | IMPLEMENTED |
| 7 | Automated tests incl. Golden regression, driver/co-primary, consent-state | "Part D" | IMPLEMENTED |
| 8 | PUB-01 Figma and implementation evidence | — | **OPEN** — D-05 |
| 9 | Google OAuth end-to-end test result | "Part C" | **OPEN** — D-02 |
| 10 | Blockers with source, requirement, state, proposal, decision needed | "Part E" | IMPLEMENTED |

---

## Part B — Decisions applied

| ID | Decision | Controlling source | Status |
|---|---|---|---|
| M3-D01 | Shared legal metadata reads `Effective date: 21 July 2026 • Version: 1.0.1`. This is the C-04 **pack** version applied to §§4–8, not a per-notice version. | C-04 v1.0.1 CORRECTED header (`c04.txt:6`, `:9`); C-05 LEG-01…05 | SOURCE-VERIFIED |
| M3-D02 | Footer: obsolete `Educational — Not a Diagnosis · Version 1.0.0` removed. C-04 copyright, boundary and links retained. **No replacement version invented.** | C-04 §2 (`c04.txt:37`–`:39`); ROOTS D-03 | ROOTS-APPROVED + IMPLEMENTED |
| M3-D03 | Cookie screen keeps C-04 §6 three columns. No provider/duration asserted where the pack does not state one. | C-04 §6 (`c04.txt:315`–`:337`); C-05 LEG-03 | ROOTS-APPROVED + IMPLEMENTED |
| M3-D04 | No persistent visitor identifier and no server-side visitor tracking to record an anonymous analytics preference. | ROOTS; Annex OPS-02/OPS-03 | ROOTS-APPROVED + IMPLEMENTED |
| M3-D05 | Driver copy is `The highest-ranked driver(s) in this assessment is/are …`. `strongest area(s)` removed from product code. | ROOTS; C-03 v1.0.1 §4; C-05 §5 | ROOTS-APPROVED + IMPLEMENTED |
| M3-D06 | Driver **cardinality** never padded. A co-primary pair is **one** output entry naming both domains. Eligibility, ranking, ties, zero-length preserved. | C-03 v1.0.1 §4, §8; C-05 §5 | ROOTS-APPROVED + IMPLEMENTED (RP-07/08/09) |
| M3-D07 | Triad renders only verified inputs, with reduced two/one/none states, relationships possible not causal. | C-03 v1.0.1 §5 | ROOTS-APPROVED + IMPLEMENTED |
| M3-D08 | AI-disclosure sentence is one exported constant rendered on web **and** PDF so surfaces cannot drift. | ROOTS point 26 | ROOTS-APPROVED + IMPLEMENTED |
| M3-D09 | C-03 §4.19 medical/AI disclaimer left exactly as approved. No substitution. | C-03 (`c03.txt:244`–`:250`) | SOURCE-VERIFIED |
| M3-D10 | ASM-01 visible CTA is `Begin Assessment` (C-04 copy) performing the C-05 zone behaviour. | C-04 §3 (`c04.txt:59`); C-05 ASM-01 | SOURCE-VERIFIED |

---

## Part C — Cookie, storage and consent state

**Governing principle:** this section reports only what the running configuration does. It makes no
claim about providers that are not present, and no compliance claim for a mechanism that does not exist.

### Cookies actually set by this application

| Name | Store | Purpose | Provider | Duration | Evidence |
|---|---|---|---|---|---|
| `roots_session_id` | HTTP-only cookie, `SameSite=Lax`, `Secure` in production | Secure assessment session, save/resume, route authorization | First-party, set by this app | `maxAge = SESSION_TTL_SECONDS` = 3600 s (60 min) | `app/api/assessment/sessions/route.ts:19`–`:25`; `lib/db.ts:25` |

No other cookie is set by any route, component or script in this tree.

### Browser storage

| Key | Store | Status in this tree |
|---|---|---|
| `roots-ai.cookie-consent` | localStorage | **Not present.** Not implemented. |
| `roots-secure-link-email` | sessionStorage | **Not present.** Not implemented. |
| `roots-submit-key-<assessmentId>` | sessionStorage | **Not present.** Not implemented. |

A repository-wide search for these keys, and for `localStorage`/`sessionStorage` used as a consent
mechanism, returns no implementation. The application writes **no** browser-storage record today.

### Optional analytics

No analytics provider is configured or called. The C-04 §6 controls render on `/cookies` in a
**disabled** state with an explicit notice that controls are not enabled. The "Public-site analytics"
row therefore correctly remains "Disabled until required consent".

### Asserted in correspondence but NOT present here

Zero occurrences in this tree. These must not be presented as evidence without a specific commit:

- `sb-<project-ref>-auth-token` (Supabase) — **not present.** No `@supabase/*` dependency; `SUPABASE_URL` is documented in `README.md:198` as *reserved for* a future integration.
- `roots_oauth_next` — **not present.** No OAuth route, no writer for this cookie.
- `cf_clearance` — **not present and not determinable.** The hostname in use is `*.vercel.app`; whether a Cloudflare zone fronts it is unresolved. It is neither asserted nor denied.
- Three-field consent record and eight consent tests — **not present.**

### OPS-03 status: **OPEN**

No region capture, no consent history, no durable evidential record. The controlled baseline does not
specify the complete retention/evidence rule for a browser-only consent record, and none is implemented.
The candidate shape and requirement mapping are recorded in `M3_SIX_ITEM_DECISION_MATRIX.md`; it is
documentation only, not runtime code.

**Stated plainly:** with no optional analytics and no consent store there is no OPS-03 breach risk in
the current build — and equally, no evidence that OPS-03 is satisfied.

### Google OAuth: **OPEN — not testable**

There is no OAuth implementation in this tree, so an end-to-end Google sign-in test cannot be executed
and no result is claimed. Any credentials exist in an environment this repository does not contain; no
credential is requested through ordinary correspondence.

---

## Part D — Verification evidence for this cycle

All figures re-executed against the delivered working tree in this cycle.

| Command | Result | Acceptance |
|---|---|---|
| `npm run test:canonical` | **30 passed / 0 failed** | MET |
| `npm run test:golden` | **30 passed / 0 failed** | MET (≥30 canonical) |
| `npm run test:report` | **20 passed / 0 failed** | MET |
| `npm run test:ai` | **20 passed / 0 failed** | MET |
| `npm run build` | PASS — 23 routes | — |

### Driver, co-primary and null-state coverage

| Test | Assertion | Result |
|---|---|---|
| RP-07 | Report drivers are the exact deterministic C-02 output | PASS |
| RP-08 | Co-primary pair preserved as a **single** governed entry | PASS |
| RP-09 | Zero-length driver array preserved — no driver invented | PASS |
| RP-10 | Missing data explicit — no imputation, no invented filler | PASS |
| RP-11 | C-03 corrected 19-section content and explicit limitations present | PASS |
| RP-15 | PDF route shares canonical source and cannot recalculate | PASS |
| RP-16 | Web report reads stored record; no client-side recalculation | PASS |

### Consent-state tests

No consent mechanism is implemented, so there is **no consent-state test to report**. The controls are
disabled and their state is verifiable by rendering `/cookies`, not by a test suite. A passing
consent-test count here would be false.

### Golden Test regression

30/30 golden tests pass, including documented co-primary, zero-driver and single-domain cases
(`docs/m2/M2_GOLDEN_TEST_EVIDENCE.txt`: GT-003, GT-021, GT-022).

---


## Part E — Remaining blockers

| ID | Controlling source | Affected requirement | Current implementation | Proposed resolution | Decision needed from ROOTS |
|---|---|---|---|---|---|
| **D-01** | C-07 acceptance; RC reference required | Deployed release-candidate reference | Public domain `roots-ai-learning.vercel.app` serves the **older** build; Git-triggered Vercel builds resolve a stale commit. Local build and all four suites pass. | Publish from the verified tree (direct deployment) and record the resulting deployment URL + commit. | Confirm the accepted publication method (Vercel Git integration vs direct deployment) so the RC reference is reproducible. |
| **D-02** | C-05 ADM-01; Annex SEC-03 | Google OAuth end-to-end result | No OAuth route, no `roots_oauth_next`, no Supabase client in this tree. | Implement the identity flow, or supply the commit/branch that contains it. | Identify the commit implementing OAuth, or confirm it is out of Phase 1 scope for this deliverable. |
| **D-03** | C-03 §2 vs. ROOTS footer decision | Version label | Site footer carries no version (decision applied). **PDF footer** still renders `Educational — Not a Diagnosis · {report_template_version}`. | None taken. C-03 §2 requires report ID, timestamp, version and boundary in the PDF footer; the ROOTS instruction bars a replacement version label. These are different surfaces. | Rule which instruction governs the PDF footer, or confirm the report-template version is out of scope of D-03. |
| **D-04** | Annex OPS-02 / OPS-03 | Consent evidence for optional analytics | No consent mechanism, no analytics, controls disabled. | Approve a consent record structure and its retention/cleared-storage rule before any browser-only storage is introduced. | Approve the exact record structure and retention obligation, including behaviour when browser storage is cleared. |
| **D-05** | C-05 §6; File 14 visual authority | PUB-01 Golden Screen | No editable Figma artefact or written ROOTS conformity approval is held in this repository. | Supply the ROOTS-owned editable Figma with the required screen states. | Provide the Figma file reference and the written conformity decision. |
| **D-06** | C-03 next revision | Deferred report strings (points 3, 4, 5, 20, 23) | Not in this tree. Underlying factual checks recorded as sound in `M3_SIX_ITEM_DECISION_MATRIX.md` §2. | Incorporate at the C-03 revision rather than inventing product copy now. | Issue the C-03 amendment, or confirm these strings are approved for direct implementation. |
| **D-07** | C-05 §13 contrast floor | Derived accent tokens `--zd-teal-ink` / `--zd-gold-ink` | Tokens do not exist. The stated premise (eleven small-text declarations) is not reproduced here: the two approved accents appear only as 3 px borders and background tints, not text colour. | Re-scope to non-text UI (3:1 floor) or supply the specific declarations concerned. | Confirm the location of the affected declarations, or approve/reject the derived values on a non-text basis. |

---

## Deployment state

| Field | Value |
|---|---|
| Repository | `https://github.com/souhail555/roots-ai-learning` |
| Branch | `master` |
| Delivered commit | Recorded in `M3_DEPLOYMENT_RUNBOOK.md` for this cycle |
| Deployed RC URL | **Not yet available** — D-01 open. The public domain currently serves a build predating this deliverable. |
| Google OAuth E2E | **Not executed** — D-02 open |
| PUB-01 Figma | **Not supplied** — D-05 open |

---

## Standing boundary

The deterministic scientific engine is unchanged by any decision in this log. Nothing here authorises
diagnosis, prognosis, treatment or medication advice. This document is implementation evidence and a
record of open items — it is not a legal opinion, a certification, or a claim of regulatory compliance.

