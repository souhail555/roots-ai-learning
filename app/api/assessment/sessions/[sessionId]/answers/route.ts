import { NextResponse } from "next/server";
import { getSession, saveModuleAnswers } from "@/lib/db";
import { cookies } from "next/headers";
import { assessmentModules, validateAnswers } from "@/lib/canonicalAssessment";

export async function PATCH(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const sessionCookie = (await cookies()).get("roots_session_id")?.value;
  if (sessionCookie !== sessionId) return NextResponse.json({ error: "Session unavailable." }, { status: 403 });
  const body = await request.json().catch(() => null) as { moduleId?: string; answers?: Record<string, string | string[]> } | null;

  if (!body?.moduleId || !body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "moduleId and answers are required." }, { status: 400 });
  }

  const module = assessmentModules.find((m) => m.id === body.moduleId);
  if (!module) return NextResponse.json({ error: "Unknown module." }, { status: 400 });

  // Only accept answers for questions that belong to this module (no cross-module injection).
  const allowed = new Set(module.questions.map((q) => q.id));
  const submitted = Object.keys(body.answers);
  const foreign = submitted.filter((id) => !allowed.has(id));
  if (foreign.length > 0) {
    return NextResponse.json({ error: "Answers contain questions outside this module.", foreign }, { status: 400 });
  }

  // Validate the full merged answer set so a module save cannot bypass the
  // canonical controls for that module's required questions.
  const existing = await getSession(sessionId);
  if (!existing) return NextResponse.json({ error: "Session not found." }, { status: 404 });
  const merged = { ...existing.answers, ...body.answers };

  // Reject payloads that violate the canonical option controls outright. These
  // are hard failures (no storage): a value that is not an approved C-01 option
  // cannot enter the system, and an N/A value cannot be used where C-01 forbids
  // it. Incomplete-but-valid autosave is still allowed below.
  const submitErrors = validateAnswers(merged).filter((error) => {
    // Only consider errors for questions in the module being saved. Missing
    // required questions in other modules are expected during progressive entry.
    if (!allowed.has(error.questionId)) return false;
    return (
      error.message.includes("not approved by C-01") ||
      error.message.includes("must use an approved C-01 option") ||
      error.message.includes("does not permit an N/A") ||
      error.message.includes("must be mutually exclusive") ||
      error.message.includes("must have at least one approved option")
    );
  });
  if (submitErrors.length > 0) {
    return NextResponse.json({ error: "Invalid canonical response.", validationErrors: submitErrors }, { status: 400 });
  }

  // Required questions of this module must be complete when the module is submitted.
  const moduleRequiredIds = module.questions.filter((q) => q.required).map((q) => q.id);
  const validationErrors = module.questions.length > 0
    ? validateAnswers(merged).filter((e) => moduleRequiredIds.includes(e.questionId))
    : [];

  try {
    const session = await saveModuleAnswers(sessionId, body.moduleId, body.answers);
    return NextResponse.json({
      saved: true,
      completedModules: session.completedModules,
      updatedAt: session.updatedAt,
      ...(validationErrors.length > 0 ? { validationErrors } : {}),
    });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: "We could not save this answer. The session may have expired. Please refresh and start a new assessment." }, { status: 400 });
  }
}