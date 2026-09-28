# M3 Implementation Status

## Implemented in the current workspace

- Canonical 19-section report object with deterministic content hash.
- Authorized web report route and PDF route reading the same stored report.
- Governed AI boundary with schema validation, prohibited-language checks,
  hallucinated-number rejection, retry, timeout, and deterministic fallback.
- Optional server-side OpenAI transport through `OPENAI_API_KEY` and
  `AI_NARRATIVE_MODEL`; without both variables the governed fallback is used.
- Report/PDF integrity tests and AI governance tests.
- Approved driver copy (`rankedDriverCopy`) shared by the canonical object, the
  web report and the PDF, with co-primary pairs rendered as one output entry.
- Single `AI_DISCLOSURE` constant rendered on both the web report and the PDF so
  the two surfaces cannot drift.

## Verification re-executed for the delivered commit

| Command | Result |
|---|---|
| `npm run build` | PASS — 23 routes |
| `npm run lint` | PASS — no errors, no warnings |
| `npm run test:report` | 20 / 20 — acceptance MET |
| `npm run test:ai` | 20 / 20 — acceptance MET |

Canonical (30/30) and Golden (30/30) were also re-executed and passed in this cycle.

## Consolidated record

The single consolidated M3 record — separating **implemented**, **source-verified**,
**ROOTS-approved** and **open** items — is `docs/m3/M3_DECISION_LOG.md`. Read Part E of
that file for the seven open blockers (D-01 … D-07) and the exact decision each one
requires from ROOTS. No open item is described as approved, verified or compliant.

## External completion gates

- A ROOTS-owned Supabase project and applied migrations/RLS suite.
- Production magic-link/email provider integration, Google OAuth, and MFA for privileged roles.
- Approved visual-regression review and the PUB-01 Golden Screen / editable Figma.
- Real provider credentials, processor/privacy approval, and production acceptance
  evidence. Credentials are intentionally not stored in this repo.
- OPS-03 consent-record structure and its retention/cleared-storage rule, before any
  optional analytics or browser-storage consent record is introduced.

## Current boundary

The code path is server-side and keeps deterministic scoring authoritative.
This document records implementation status; it is not a formal ROOTS
acceptance certificate.
