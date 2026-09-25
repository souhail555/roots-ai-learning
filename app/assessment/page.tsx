"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ExistingSession = { sessionId: string; completedModules: string[]; updatedAt?: string };

export default function AssessmentStartPage() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingSession, setExistingSession] = useState<ExistingSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/assessment/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ session?: ExistingSession | null }>;
      })
      .then((payload) => {
        if (!cancelled && payload?.session) setExistingSession(payload.session);
      })
      .catch(() => {
        // The optional resume lookup must never block a new session.
      });
    return () => { cancelled = true; };
  }, []);

  async function startAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Enter your email address to continue.");
      return;
    }
    if (!consent) {
      setError("Please acknowledge the service terms before continuing.");
      return;
    }
    setIsStarting(true);
    try {
      const response = await fetch("/api/assessment/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, serviceConsent: true }),
      });
      const payload = await response.json().catch(() => null) as { sessionId?: string; error?: string } | null;
      if (!response.ok || !payload?.sessionId) throw new Error(payload?.error ?? "We could not create a secure assessment session. Please try again.");
      router.push(`/assessment/${payload.sessionId}/module/M01`);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "We could not create a secure assessment session. Please try again.");
      setIsStarting(false);
    }
  }

  return <main className="route-shell">
    <section className="assessment-entry-card">
      <p className="eyebrow">ROOTS / ASSESSMENT</p>
      <h1>Your ROOTS Biological Assessment™</h1>
      <p className="route-lede">Answer 73 questions across 13 short modules. Most people finish in about 10–12 minutes. Your answers autosave while this private browser session remains active.</p>
      <div className="assessment-facts" aria-label="Assessment facts"><span><strong>73</strong> questions</span><span><strong>13</strong> modules</span><span><strong>10–12</strong> minutes</span></div>
      <form className="route-form" onSubmit={startAssessment} noValidate>
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required aria-describedby="email-help" />
        <p id="email-help" className="field-help">Used with your secure session to save and resume. Service access does not enrol you in research.</p>
        <label className="consent-row" htmlFor="service-consent"><input id="service-consent" name="service-consent" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>I agree to the Terms of Service and acknowledge the Privacy Notice and Medical and AI Disclaimers. I understand that ROOTS-AI™ is educational and not a diagnosis or medical service.</span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="continue-button" type="submit" disabled={isStarting || !email.trim() || !consent}>{isStarting ? "Creating your private session…" : "Begin Assessment"}</button>
      </form>
      <aside className="assessment-entry-note"><strong>What happens next?</strong><ol><li>Your session opens directly in this browser.</li><li>You can pause and return using the Resume assessment page.</li><li>Your report is created only after review and submission.</li></ol><p>If you may be in immediate danger, contact local emergency services. This assessment is not monitored for emergencies.</p></aside>
    </section>
    {existingSession && <section className="resume-card" aria-labelledby="resume-heading"><div><p className="eyebrow">SAVED SESSION</p><h2 id="resume-heading">Continue where you left off</h2><p>{existingSession.completedModules.length} of 13 modules are complete{existingSession.updatedAt ? ` · Last saved ${new Date(existingSession.updatedAt).toLocaleString()}` : ""}.</p></div><button type="button" className="secondary-button" onClick={() => router.push(`/assessment/${existingSession.sessionId}/resume`)}>Resume assessment</button></section>}
  </main>;
}
