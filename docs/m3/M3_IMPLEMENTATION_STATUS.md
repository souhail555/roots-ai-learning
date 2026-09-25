# M3 Implementation Status

## Implemented in the current workspace

- Canonical 19-section report object with deterministic content hash.
- Authorized web report route and PDF route reading the same stored report.
- Governed AI boundary with schema validation, prohibited-language checks,
  hallucinated-number rejection, retry, timeout, and deterministic fallback.
- Optional server-side OpenAI transport through `OPENAI_API_KEY` and
  `AI_NARRATIVE_MODEL`; without both variables the governed fallback is used.
- Report/PDF integrity tests and AI governance tests.

## External completion gates

- A ROOTS-owned Supabase project and applied migrations/RLS suite.
- Production magic-link/email provider integration and MFA for privileged roles.
- Approved visual-regression review for the final report/PDF composition.
- Real provider credentials, processor/privacy approval, and production
  acceptance evidence. Credentials are intentionally not stored in this repo.

## Current boundary

The code path is server-side and keeps deterministic scoring authoritative.
This document records implementation status; it is not a formal ROOTS
acceptance certificate.
