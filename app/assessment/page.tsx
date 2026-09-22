"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AssessmentStartPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function startAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/assessment/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (!response.ok) return;
    const { sessionId } = await response.json();
    // Client-side navigation to the first module of the new session.
    router.push(`/assessment/${sessionId}/module/M01`);
  }

  return (
    <main className="route-shell">
      <p className="eyebrow">ROOTS / ASSESSMENT</p>
      <h1>Your ROOTS Biological Assessment</h1>
      <p className="route-lede">Answer 73 questions across 13 short modules. Most people finish in about 10–12 minutes. You can save, pause and resume securely.</p>
      <form className="route-form" onSubmit={startAssessment}>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        <button className="continue-button" type="submit">Begin Assessment</button>
      </form>
    </main>
  );
}
