import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, saveResult, getResult } from "@/lib/db";
import { validateAnswers } from "@/lib/canonicalAssessment";
import { calculateScores } from "@/lib/scoring";
import { CANONICAL_VERSIONS } from "@/lib/canonical/source";

/**
 * Server-controlled deterministic result.
 *
 * The deterministic engine is the sole authority for scores, classifications,
 * Biological State, drivers, thresholds and eligibility. No AI/LLM has any
 * calculation authority here.
 *
 * A result can only be produced from a complete, valid assessment. Incomplete
 * or invalid required responses cannot be submitted as a completed assessment.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const sessionCookie = (await cookies()).get("roots_session_id")?.value;
  if (sessionCookie !== sessionId)
    return NextResponse.json(
      { error: "Session unavailable." },
      { status: 403 },
    );

  const session = await getSession(sessionId);
  if (!session)
    return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const validationErrors = validateAnswers(session.answers);
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: "Assessment is not complete.", validationErrors },
      { status: 400 },
    );
  }

  const result = calculateScores(session.answers);
  await saveResult(sessionId, result, CANONICAL_VERSIONS);
  return NextResponse.json(
    {
      result,
      questionnaireVersion: CANONICAL_VERSIONS.questionnaire,
      scoringVersion: CANONICAL_VERSIONS.scoring,
    },
    { status: 201 },
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const sessionCookie = (await cookies()).get("roots_session_id")?.value;
  if (sessionCookie !== sessionId)
    return NextResponse.json(
      { error: "Session unavailable." },
      { status: 403 },
    );

  const record = await getResult(sessionId);
  if (!record)
    return NextResponse.json({ error: "No result yet." }, { status: 404 });
  return NextResponse.json(record);
}
