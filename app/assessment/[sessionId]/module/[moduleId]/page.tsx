"use client";

import { FormEvent, use, useEffect, useRef, useState } from "react";
import { assessmentModules } from "@/lib/canonicalAssessment";
import QuestionCard from "@/components/ui/QuestionCard";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ModulePage({ params }: { params: Promise<{ sessionId: string; moduleId: string }> }) {
  const { sessionId, moduleId } = use(params);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string | string[]>>({});
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "failed">("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedModule = assessmentModules.find((item) => item.id === moduleId);

  useEffect(() => {
    fetch(`/api/assessment/sessions/${sessionId}`).then(async (response) => {
      if (response.ok) setSavedAnswers((await response.json()).answers ?? {});
    });
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [sessionId]);

  if (!selectedModule) {
    return <main className="route-shell"><h1>Module not found</h1><p className="route-lede">This learning branch does not exist.</p></main>;
  }
  const module = selectedModule;

  function collectAnswers(form: HTMLFormElement) {
    const formData = new FormData(form);
    const answers: Record<string, string | string[]> = {};
    module.questions.forEach((question) => {
      if (question.type === "decimal_with_unit") {
        // Package the numeric value and the canonical unit into one answer.
        const value = String(formData.get(`${question.id}__value`) ?? "").trim();
        const unit = String(formData.get(`${question.id}__unit`) ?? "").trim();
        if (value !== "" && unit !== "") {
          answers[question.id] = JSON.stringify({ value: Number(value), unit });
        }
        return;
      }
      const values = formData.getAll(question.id).map(String);
      if (values.length === 1) answers[question.id] = values[0];
      if (values.length > 1) answers[question.id] = values;
    });
    return answers;
  }

  async function persistAnswers(answers: Record<string, string | string[]>): Promise<boolean> {
    setSaveStatus("saving");
    const response = await fetch(`/api/assessment/sessions/${sessionId}/answers`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: module.id, answers }) });
    const payload = await response.json().catch(() => null) as { validationErrors?: unknown[] } | null;
    const hasErrors = Array.isArray(payload?.validationErrors) && payload.validationErrors.length > 0;
    const ok = response.ok && !hasErrors;
    setSaveStatus(ok ? "saved" : "failed");
    if (ok) setSavedAnswers((current) => ({ ...current, ...answers }));
    return ok;
  }

  function queueAutosave(form: HTMLFormElement) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(() => { void persistAnswers(collectAnswers(form)); }, 700);
  }

  /** Enforce NONE / N/A mutual exclusivity at the point of interaction. */
  function onChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement;
    if (target.type === "checkbox" && target.name.startsWith("Q")) {
      const boxes = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>(`input[type=checkbox][name="${target.name}"]`));
      if (target.checked && target.dataset.exclusive === "true") {
        boxes.filter((box) => box !== target).forEach((box) => (box.checked = false));
      } else if (target.checked) {
        boxes.filter((box) => box.dataset.exclusive === "true").forEach((box) => (box.checked = false));
      }
    }
    queueAutosave(event.currentTarget);
  }

  async function submitModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answers = collectAnswers(event.currentTarget);
    const saved = await persistAnswers(answers);
    // The server validates every required response against C-01. Do not advance
    // past a module whose required responses are incomplete or invalid.
    if (!saved) {
      setSaveStatus("failed");
      return;
    }
    const moduleIndex = assessmentModules.findIndex((item) => item.id === module.id);
    const nextModule = assessmentModules[moduleIndex + 1];
    if (nextModule) {
      window.location.assign(`/assessment/${sessionId}/module/${nextModule.id}`);
      return;
    }
    // Final module: ask the server to produce the deterministic result.
    const result = await fetch(`/api/assessment/sessions/${sessionId}/result`, { method: "POST" });
    if (!result.ok) {
      setSaveStatus("failed");
      return;
    }
    window.location.assign(`/report/${sessionId}`);
  }

  return (
    <main className="route-shell route-shell-wide">
      <p className="eyebrow">MODULE {module.order} OF 13</p>
      <h1>{module.title}</h1>
      <p className="route-lede">{module.purpose}. Use your usual experience during the last four weeks unless a question says otherwise.</p>
      <ProgressBar current={module.order} total={assessmentModules.length} className="route-progress" />
      <form className="question-form" onSubmit={submitModule} onChange={onChange}>
        <div className={`save-status save-status-${saveStatus}`} role="status" aria-live="polite">{saveStatus === "saving" ? "Saving…" : saveStatus === "failed" ? "Save failed. Try again." : "Saved"}</div>
        {module.questions.map((question) => <QuestionCard key={question.id} question={question} defaultValue={savedAnswers[question.id] as string | undefined} />)}
        <button className="continue-button" type="submit">{module.order === assessmentModules.length ? "Review and Submit" : "Save and Continue"}</button>
      </form>
    </main>
  );
}
