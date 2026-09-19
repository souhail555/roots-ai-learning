import { NextResponse } from "next/server";
import { saveModuleAnswers } from "@/lib/db";
import { cookies } from "next/headers";

export async function PATCH(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const sessionCookie = (await cookies()).get("roots_session_id")?.value;
  if (sessionCookie !== sessionId) return NextResponse.json({ error: "Session unavailable." }, { status: 403 });
  const body = await request.json().catch(() => null) as { moduleId?: string; answers?: Record<string, string | string[]> } | null;

  if (!body?.moduleId || !body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "moduleId and answers are required." }, { status: 400 });
  }

  try {
    const session = await saveModuleAnswers(sessionId, body.moduleId, body.answers);
    return NextResponse.json({ saved: true, completedModules: session.completedModules, updatedAt: session.updatedAt });
  } catch {
    return NextResponse.json({ error: "We could not save this answer. Try again." }, { status: 404 });
  }
}