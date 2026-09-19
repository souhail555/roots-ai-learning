import { NextResponse } from "next/server";
import { getSession } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(_request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const sessionCookie = (await cookies()).get("roots_session_id")?.value;
  if (sessionCookie !== sessionId) return NextResponse.json({ error: "Session unavailable." }, { status: 403 });
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

  return NextResponse.json({
    sessionId: session.id,
    completedModules: session.completedModules,
    answers: session.answers,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  });
}