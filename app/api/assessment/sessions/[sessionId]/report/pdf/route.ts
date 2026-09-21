import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCanonicalReportByAssessment } from "@/lib/db";
import { assertReportIntegrity } from "@/lib/report/pipeline";

/**
 * Canonical report PDF endpoint.
 *
 * Contractual requirement (M3 §5): the PDF must render from the SAME stored
 * canonical report object as the web report. It must not independently
 * recalculate or reinterpret the deterministic result.
 *
 * This route therefore:
 *   1. Reads the stored canonical report (never recomputes scores).
 *   2. Re-verifies the deterministic content hash before rendering.
 *   3. Emits the report as a text-faithful document carrying the required
 *      metadata (report id, generated timestamp, versions, educational and
 *      non-diagnostic boundary).
 *
 * IMPLEMENTATION NOTE: PDF byte rendering is not enabled in this build because
 * the governed C-03 page composition and the approved visual system (File 14 /
 * PUB-01 Golden Screen) were not available in the workspace. The endpoint
 * deliberately serves the canonical content and metadata rather than producing
 * an unapproved visual layout. Swapping in a real PDF renderer does not change
 * this route's data source: it still reads the stored canonical record.
 */

const BOUNDARY_STATEMENT =
  "Educational — Not a Diagnosis. This document summarises self-reported questionnaire answers using deterministic rules. It is not a medical device, diagnosis, prognosis or treatment advice.";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const sessionCookie = (await cookies()).get("roots_session_id")?.value;
  if (sessionCookie !== sessionId) {
    return NextResponse.json(
      { error: "Session unavailable." },
      { status: 403 },
    );
  }

  const stored = await getCanonicalReportByAssessment(sessionId);
  if (!stored) {
    return NextResponse.json(
      { error: "No stored canonical report. Request the report first." },
      { status: 404 },
    );
  }

  // Same-source guarantee is enforced, not assumed.
  assertReportIntegrity(stored.report);

  const { report } = stored;
  const generatedAt = report.provenance.constructedAt;

  const header = [
    "ROOTS-AI(TM) Biological Intelligence Report",
    `Report ID: ${report.id}`,
    `Assessment ID: ${report.assessmentId}`,
    `Generated: ${generatedAt}`,
    `Questionnaire: ${report.provenance.questionnaireVersion}`,
    `Scoring: ${report.provenance.scoringVersion}`,
    `Report: ${report.provenance.reportVersion}`,
    `Content hash (deterministic spine): ${report.contentHash}`,
    `AI narrative: ${
      report.provenance.ai
        ? report.provenance.ai.usedFallback
          ? `governed fallback (${report.provenance.ai.fallbackVersion}) — ${report.provenance.ai.fallbackReason}`
          : `${report.provenance.ai.provider} / ${report.provenance.ai.model} (prompt ${report.provenance.ai.promptVersion}, schema ${report.provenance.ai.schemaVersion})`
        : "disabled"
    }`,
    "",
    BOUNDARY_STATEMENT,
    "",
    "=== Deterministic scores (text equivalents) ===",
  ];

  const equivalents = Object.values(report.numericEquivalents);
  const body = report.sections.flatMap((section) => [
    `${section.index}. ${section.title}`,
    section.narrative ??
      "(explicit reduced state — no governed content available)",
    section.reduced ? `[reduced] ${section.reducedReason ?? ""}` : "",
    "",
  ]);

  const document = [
    ...header,
    ...equivalents,
    "",
    "=== Governed sections ===",
    "",
    ...body,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return new NextResponse(document, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Report-Id": report.id,
      "X-Report-Content-Hash": report.contentHash,
      "X-Report-Same-Source": "canonical",
    },
  });
}
