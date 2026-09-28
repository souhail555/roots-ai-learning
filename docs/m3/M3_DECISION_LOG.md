## M3 controlled-copy decisions

The following decisions are applied to the integrated release candidate. Items marked **OPEN** require controlled-source or production verification and are not represented as complete compliance.

| ID | Decision | Controlling source / evidence | Status |
|---|---|---|---|
| M3-D01 | Use `Effective date: 21 July 2026 • Version: 1.0.1` as shared legal-screen metadata. This is not a separate version assigned to each notice. | C-04 v1.0.1 CORRECTED header, lines 6–9; the Privacy and Terms sections repeat the metadata at lines 259 and 313. C-05 LEG-01–LEG-05 requires title/meta. | Applied |
| M3-D02 | Remove the obsolete footer `Educational — Not a Diagnosis · Version 1.0.0` line. Retain the approved boundary and copyright statements without inventing a replacement product version. | C-04 §2, lines 37–39; user decision. | Applied |
| M3-D03 | Cookie screen retains the C-04 three-column treatment: Category / Phase 1 treatment / Consent-control. The implementation inventory is factual and marks provider/duration verification as open where the controlled pack does not specify it. | C-04 §6, lines 315–337; C-05 LEG-03, lines 604–626. | Applied; provider register open |
| M3-D04 | No persistent visitor identifier or server-side visitor tracking is added solely for analytics consent. Browser storage is not treated as approved evidence. | C-04 §6; Annex OPS-02/OPS-03; user decision. | **OPEN — OPS-03** |
| M3-D05 | Driver language uses “highest-ranked driver(s)” and preserves exact deterministic entries, including one co-primary output entry. No “strongest area(s)” wording is used. | C-03 controlled correction §4; C-05 §5; user decision. | Applied; controlled-copy verification open |
| M3-D06 | Biological Triad reduced states use the approved two/one/none structures and state that relationships are possible, not causes. Only verified driver/protective elements are rendered. | C-03 controlled correction §5; C-05 RPT-03; user decision. | Applied; controlled-copy verification open |

## Current Phase 1 cookie/browser-storage inventory

- `roots_session_id` is an HTTP-only first-party session cookie created by `app/api/assessment/sessions/route.ts`. It supports secure assessment session, save/resume and route authorization. Its configured maximum age is `SESSION_TTL_SECONDS` in `lib/db.ts` (currently 60 minutes); the browser may end the session earlier.
- The current application source contains no `localStorage` or `sessionStorage` consent record and no optional analytics integration. This is an implementation inventory observation, not a claim that no third-party provider or retention rule exists.
- Before enabling optional analytics, OPS-03 still requires an approved record mapping for consent version, categories, timestamp, region/configuration, withdrawal, changes to consent, cleared browser storage, retention and evidence. The controlled baseline does not specify the complete retention/evidence rule, so browser-only storage remains **OPEN**.

### OPS-03 candidate record structure (documentation only; not implemented)

The following shape is a review candidate, not runtime code and not a claim that the record is approved:

```ts
type PendingAnalyticsConsent = {
  consentVersion: string;       // controlled notice/consent version
  categories: {
    necessary: true;
    publicSiteAnalytics: boolean;
  };
  decision: "accepted" | "rejected";
  decidedAt: string;             // ISO-8601 UTC timestamp
  region: string;                // approved launch region/configuration
  configurationId: string;       // controlled consent configuration
  updatedAt: string;             // timestamp for the latest change
  withdrawnAt: string | null;    // set when optional consent is withdrawn
};
```

Requirement mapping: `consentVersion` → OPS-03 consent version; `categories.publicSiteAnalytics` → category; `decidedAt` → timestamp; `region` and `configurationId` → region/config; `updatedAt` and `withdrawnAt` → changes/withdrawal. A browser-only mutable record could provide the current choice, but it cannot by itself prove a prior change, satisfy a retention/audit obligation, or distinguish first visit from cleared storage. Those exact evidence, retention and cleared-storage requirements are not fully specified by the approved baseline and remain **OPEN**. The application currently creates none of this record and uses no optional analytics.

## Verification evidence captured for this release candidate

**These results were recorded on a previous cycle and are NOT reproduced for the current
delivered commit.** The shell was unavailable during the most recent verification pass, so no
command in this list was re-executed. Per the controlled instruction that a correction made after a
test run requires the affected tests to be re-run against the delivered commit, **none of the
figures below is currently valid evidence.** They are retained only as a record of what was
previously observed.

- `npm run lint` — previously PASS. Not re-run.
- `npx tsc --noEmit` — previously PASS. Not re-run.
- `npm run build` — previously PASS (Next.js 16.3.4). Not re-run.
- `npm run test:canonical` — previously PASS, 30/30 checks. Not re-run.
- `npm run test:golden` — previously PASS, 30/30 golden tests. Not re-run.
- `npm run test:report` — previously PASS, 20/20 report-integrity tests. Not re-run.
- `npm run test:ai` — previously PASS, 20/20 AI-governance tests. Not re-run.
- `npm run test:security` — previously PASS, 31/31 negative/security tests. Not re-run.
- `npm run test:e2e` — previously PASS, 20/20 end-to-end tests. Not re-run.
- Production deployment inspection and HTTP smoke checks — still required before release
  acceptance. The Git-triggered deployment previously inspected built stale commit `7da256d`.
- `OPS-03` candidate record mapping and cleared-storage/retention gap — documented above;
  implementation and approval remain **OPEN**.

See `M3_SIX_ITEM_DECISION_MATRIX.md` for the current-cycle findings, including three defects
(PDF driver parity, web domain label, disclaimer version) and items whose evidence cannot be
reproduced without a working shell.

## Current boundary

The deterministic engine and approved scientific behavior are unchanged. This log records implementation status and open controlled-copy/operations verification; it is not a legal opinion, certification, or claim of regulatory compliance.

