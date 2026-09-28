# M3 — Point 21 Review Instrument: Seven-Domain × Four-Classification Content Matrix

**Status:** REVIEW INSTRUMENT — NOT APPROVED CONTENT. No cell below is authorised for implementation.
**Prepared:** for the ROOTS point 21 response.
**Controlling sources:** C-03 v1.0.1 CORRECTED §3 (Score Labels and Domain Definitions); C-02 v1.0.1 CORRECTED (classifications).
**Rule applied:** this matrix contains **only** text that already exists in the approved pack. No cell
has been filled with newly authored physiological, medical or interpretive claims. Cells lacking
domain-specific interpretation are marked **REQUIRES ROOTS CONTENT APPROVAL**.

---

## 1. What the current implementation actually renders

Section 07 ("Seven-Domain Score Breakdown") is produced by `lib/canonical/reportContent.ts:146`:

```ts
case 7:
  return { text: DOMAIN_TIE_ORDER.map((id) =>
    `${DOMAIN_LABELS[id]}: ${scoreText(scoring.domains[id])} — ${classification(scoring.domains[id]) ?? "Not Available"}`
  ).join(" · "), ... };
```

So the **entire** interpretation available to a participant today is:

> `Metabolic Resistance™: 75/100 — Dysregulated`

That is a **label, a number and a band name**. There is no domain-specific sentence, and no
combination of the two approved text fragments below. The same single string is the only
domain×classification text that exists in the canonical report object, the web report and the PDF.

**Consequence:** all 28 cells are equally un-interpreted. There is no subset of cells that already
satisfies point 21.

### 1.1 Second deviation found in the same section (web report)

`app/report/[reportId]/page.tsx:85` renders the domain breakdown from `Object.entries(scoring.domains)`
and prints the **raw internal ID** as the visible label:

```tsx
<span>{domain}</span>   // renders "MR", "HS", "SR" ...
```

C-03 §3 fixes the participant-facing label (`Metabolic Resistance™`, `Hunger & Satiety Signals™`, …).
The web report therefore shows `MR 75/100` where the canonical section shows
`Metabolic Resistance™: 75/100 — Dysregulated`. This is a web/PDF divergence on **displayed identity**,
independent of point 21, and is noted here because the same line was reviewed while building this
matrix. No approved wording is changed by noting it; the fix is to render `DOMAIN_LABELS[id]`.

---


Full unabbreviated text for the meaning and explanation columns is in §2 above; the abbreviated forms
used in the table are for scanability and introduce no new wording.

---

## 3. The 28-cell matrix

"Current rendered text" is given for a representative value in band; the template is identical for
every cell. **Interpretive text = NONE** in all 28 cells.

| # | Domain | Classification | Approved domain meaning (abbrev.) | Approved classification explanation (abbrev.) | Exact current rendered text | Domain-specific interpretation | Status |
|---|---|---|---|---|---|---|---|
| 1 | MR | Optimized | Resistance to expected weight change / activity-related metabolic context | Few burden signals were reported in this area. | `Metabolic Resistance™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 2 | MR | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Metabolic Resistance™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 3 | MR | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Metabolic Resistance™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 4 | MR | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Metabolic Resistance™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 5 | HS | Optimized | Hunger, craving, fullness and post-meal response patterns. | Few burden signals were reported in this area. | `Hunger & Satiety Signals™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 6 | HS | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Hunger & Satiety Signals™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 7 | HS | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Hunger & Satiety Signals™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 8 | HS | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Hunger & Satiety Signals™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 9 | SR | Optimized | Sleep duration, continuity and perceived restoration. | Few burden signals were reported in this area. | `Sleep Recovery Index™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 10 | SR | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Sleep Recovery Index™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 11 | SR | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Sleep Recovery Index™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 12 | SR | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Sleep Recovery Index™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 13 | CH | Optimized | Alignment of light, screen, meal and sleep timing. | Few burden signals were reported in this area. | `Circadian Health Score™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 14 | CH | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Circadian Health Score™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 15 | CH | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Circadian Health Score™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 16 | CH | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Circadian Health Score™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 17 | SL | Optimized | Perceived tension, cognitive activation and stress-linked eating. | Few burden signals were reported in this area. | `Stress Load™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 18 | SL | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Stress Load™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 19 | SL | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Stress Load™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 20 | SL | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Stress Load™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 21 | IB | Optimized | Non-specific symptom burden; **not** a laboratory or clinical inflammation measure. | Few burden signals were reported in this area. | `Inflammation Burden Index™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 22 | IB | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Inflammation Burden Index™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 23 | IB | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Inflammation Burden Index™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 24 | IB | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Inflammation Burden Index™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 25 | BS | Optimized | Perceived energy, appetite drive and resistance signals. | Few burden signals were reported in this area. | `Biological Safety Signals™: 20/100 — Optimized` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 26 | BS | Compensating | *(as above)* | Some signals are present… still helping your system compensate. | `Biological Safety Signals™: 35/100 — Compensating` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 27 | BS | Strained | *(as above)* | Several signals may be placing consistent pressure on this area. | `Biological Safety Signals™: 60/100 — Strained` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |
| 28 | BS | Dysregulated | *(as above)* | A high burden of signals was reported… not a diagnosis… | `Biological Safety Signals™: 80/100 — Dysregulated` | NONE | **REQUIRES ROOTS CONTENT APPROVAL** |

## 4. Approved material that could support additional interpretation

Per instruction, this section lists **only** what already exists in the controlled pack. None of it
has been combined into a new sentence anywhere in this matrix.

| Source | Existing content | Could it support a domain-specific reading? |
|---|---|---|
| C-03 §3 domain meanings (7 rows) | One non-diagnostic scope sentence per domain. | **Partially** — constrains *what may be said*, but is a definition, not an interpretation of a band. |
| C-03 §3 classification explanations (4 rows) | One band explanation per band. | **Partially** — same text for all seven domains; explains the band, not the domain. |
| C-03 §4 sections 10–12 (90-Day Roadmap, Nutrition Priorities, Action Priorities) | `MICRO_ACTIONS` in `lib/canonical/reportContent.ts:16-24` carries per-domain `action`, `rationale` and `safety` for all 7 domains. | **Yes — strongest existing candidate.** Already approved, domain-specific, non-diagnostic, each with its own safety line. |
| C-03 §13 What Is Going Well | Protective factors P1–P5 with labels. | Partially — protective, not burden-interpretive. |
| C-04 §5 Healthcare Professionals | Professional-facing boundaries (`app/healthcare-professionals`). | Boundaries only. |
| C-02 classification bands | Deterministic band definition. | Numeric source only. No prose. |

**Observation for ROOTS.** The only *approved, domain-specific, non-diagnostic* prose in the pack is
the `MICRO_ACTIONS` set (7 domains × action/rationale/safety). That material is already rendered in
sections 10 and 12 and is scoped to **action**, not to **interpretation of a band**. Re-purposing it
as band interpretation would extend an approved action string into a new claim context. That is a
content decision for ROOTS, not a derivation available to us.

---

## 5. What is explicitly NOT done here

- No cell was filled with newly authored physiological or medical text.
- No cell was filled with a variation of another cell to make the 28 read differently.
- No classification explanation was edited, reworded or extended.
- No deterministic value, threshold, band, driver or null behaviour was altered.
- No Golden Test expectation was touched.
- The current presentation is retained unchanged pending ROOTS' determination.

## 6. Requested from ROOTS

1. Determine which of the 28 cells genuinely require additional approved content. We do not assert
   that all 28 do; the matrix exists so the determination can be made on evidence.
2. If content is to be added, issue it as a **controlled C-03 amendment** with content identifiers,
   permitted conditions and tests.
3. Confirm the content-identifier scheme. The repo currently uses section-level IDs
   (`C03.SECTION.07` in `lib/canonical/reportContent.ts:185`). A per-cell scheme would be new and is
   ROOTS' to issue, not ours to invent.

**Point 21 remains OPEN.**
