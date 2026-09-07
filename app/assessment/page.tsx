"use client";

import { FormEvent, useState } from "react";

export default function AssessmentStartPage() {
  const [email, setEmail] = useState("");

  function startAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sessionId = crypto.randomUUID();
    window.location.assign(`/assessment/${sessionId}/module/identity`);
  }

  return (
    <main className="route-shell">
      <p className="eyebrow">ROOTS / ASSESSMENT</p>
      <h1>Begin your growth map.</h1>
      <p className="route-lede">Enter your email to save your progress and return to your assessment.</p>
      <form className="route-form" onSubmit={startAssessment}>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        <button className="continue-button" type="submit">Start assessment →</button>
      </form>
    </main>
  );
}
