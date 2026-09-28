# M3 — Deployment & Release Runbook (RC to staging)

**Written:** because the agent shell in the authoring environment returns no output, so `git`,
`npm` and `vercel` could not be executed. **Every command below must be run manually.**

---

## 0. Critical finding — two different deployments exist

| URL | State | Meaning |
|---|---|---|
| `https://roots-ai-learning.vercel.app/` | **Live and working** | The currently published site. Referenced by `docs/m1/M1_COMPLETION_PACKAGE_v1.4.md`. |
| `https://roots-ai-learning-git-master-roots-ai.vercel.app/` | **Vercel login wall** | Branch/preview deployment behind Deployment Protection. Not publicly reachable. |

**The live site is materially out of date compared with this repository.** Evidence gathered by
fetching the live pages and searching the source tree:

| Live page shows | Present in this repo? |
|---|---|
| `/example-report` domains: *Metabolic Wellness, Hormonal Balance, Sleep Quality, Cellular Health, Stress Resilience, Immune Function* | **No — 0 matches in source** |
| `/example-report`: *"Each report includes personalized recommendations…"* | **No — 0 matches in source** |
| Footer: *"Educational — Not a Diagnosis · **Version 1.0.0**"* | **No** (removed per D-03) |
| `/cookies`: short 2-row generic page | **No** — repo has the C-04 three-column table + OPS-03 notice |

The canonical C-03 domains in this repo are: `MR` Metabolic Resistance™, `HS` Hunger & Satiety
Signals™, `SR` Sleep Recovery Index™, `CH` Circadian Health Score™, `SL` Stress Load™,
`IB` Inflammation Burden Index™, `BS` Biological Safety Signals™.

The noncanonical live content is exactly what M3 §6 required to be removed. It is still being served.
**Publishing the current repository is what closes this.**

---

## 1. Changes made in this cycle

**Fixed — web report domain labels** (`app/report/[reportId]/page.tsx`)

The seven-domain breakdown rendered the raw internal IDs (`MR`, `HS`, …) as participant-facing text,
while the PDF rendered the approved C-03 labels. This was a real web/PDF divergence.

```diff
 import type { CanonicalReportRecord } from "@/lib/db";
+import { DOMAIN_LABELS, DOMAIN_TIE_ORDER } from "@/lib/canonical/source";

-<div className="report-domain-list">{Object.entries(scoring.domains).map(([domain, value]) =>
-  <div key={domain}><span>{domain}</span>...
+<div className="report-domain-list">{DOMAIN_TIE_ORDER.map((id) => { const value = scoring.domains[id];
+  return <div key={id}><span>{DOMAIN_LABELS[id]}</span>...
```

No score, classification, driver or canonical value is touched. Display only.

**Documentation corrected** — `docs/m3/M3_SIX_ITEM_DECISION_MATRIX.md`:
- Withdrew a **false defect** I had previously reported (claimed the PDF omitted the Key Drivers
  text equivalent; `lib/report/pdf.tsx:66` renders it correctly).
- Recorded the staging-URL reachability blocker.
- Demoted stale test claims in `docs/m3/M3_DECISION_LOG.md` to "previously observed, not re-run".

---

## 2. Verify BEFORE pushing (do not skip)

```powershell
cd c:\Users\user\roots-ai-learning
npm run lint
npx tsc --noEmit
npm run build
npm run test:canonical     # expect 30/30
npm run test:golden        # expect 30/30
npm run test:report        # expect 20/20
npm run test:ai            # expect 20/20
npm run test:rls           # controlled negative RLS cases
npm run test:e2e           # start the service first
npm run test:security
```

**Gate:** do not push if any command fails, and do not report a count you have not just seen.

---

## 3. Commit and push

```powershell
cd c:\Users\user\roots-ai-learning
git status --short
git add -A
git commit -m "M3: canonical domain labels in web report; correct decision-log evidence status"
git push origin master
git rev-parse HEAD          # RECORD THIS — it is the RC identifier
```

M3 §16 requires the submitted commit to correspond to the RC build. Record the hash printed above.

---

## 4. Publish to staging

### Option A — Git-triggered (preferred; keeps commit ↔ build tied)

Push to the branch Vercel watches. The deployment then provably matches the commit.

### Option B — CLI (if the branch deployment is not wired)

```powershell
npm i -g vercel
vercel login
vercel --prod            # publishes the production site
```

Confirm afterwards:

```powershell
Invoke-WebRequest -Uri "https://roots-ai-learning.vercel.app/example-report" -UseBasicParsing |
  Select-Object -ExpandProperty Content
```

The response must contain `Metabolic Resistance` and must **not** contain
`Cellular Health`, `Hormonal Balance`, or `personalized recommendations`.

---

## 5. Make the RC reachable for ROOTS review

`roots-ai-learning-git-master-roots-ai.vercel.app` is behind Vercel Deployment Protection. ROOTS
cannot review it. One of:

1. Add the ROOTS reviewers to the Vercel team (Settings → Members).
2. Share an authenticated preview URL.
3. Temporarily disable Deployment Protection for the review window.

Without one of these, D-01 cookie/browser-storage inventory verification against the deployed
configuration **cannot start**.

---

## 6. Post-deployment smoke checks

| Check | Expected |
|---|---|
| `/` | Seven canonical domains, no noncanonical categories |
| `/example-report` | Canonical C-03 model, 19 sections, driver wording "highest-ranked driver(s)" |
| `/assessment` | 73 questions / 13 modules, CTA "Begin Assessment" |
| `/privacy`, `/terms`, `/cookies`, `/medical-disclaimer`, `/ai-disclaimer` | `Effective date: 21 July 2026 • Version: 1.0.1` |
| Footer | **No** version label anywhere |
| Complete assessment → report | Web and PDF show identical values, classifications, drivers |
| Cross-session report access | HTTP 403 |

---

## 7. What is still open regardless of deployment

These are **content/approval** items and cannot be closed by deploying:

- **Point 21** — all 28 domain×classification cells lack interpretation; awaiting ROOTS C-03 amendment.
- **OPS-03** — no consent mechanism exists; analytics correctly disabled; gaps remain open.
- **Item 3 contrast** — `--zd-teal-ink` / `--zd-gold-ink` are not in the codebase and the stated
  rationale does not hold for the two rules that use those colours.
- **PDF footer version** — D-03 ("no version label") vs C-03 §2 ("PDF footer includes … version").
  Unresolved conflict, not changed unilaterally.
- **disclaimer_version** — code persists `1.0.1`; correspondence states `1.0.0`. Needs confirmation.

Deploying does not close any of these.

- Withdrew a **false defect** I had previously reported (claimed the PDF omitted the Key Drivers
  text equivalent; `lib/report/pdf.tsx:66` renders it correctly).
- Recorded the staging-URL reachability blocker.
- Demoted stale test claims in `docs/m3/M3_DECISION_LOG.md` to "previously observed, not re-run".
