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
      const values = formData.getAll(question.id).map(String);
      if (values.length === 1) answers[question.id] = values[0];
      if (values.length > 1) answers[question.id] = values;
    });
    return answers;
  }

  async function persistAnswers(answers: Record<string, string | string[]>) {
    setSaveStatus("saving");
    const response = await fetch(`/api/assessment/sessions/${sessionId}/answers`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: module.id, answers }) });
    setSaveStatus(response.ok ? "saved" : "failed");
    if (response.ok) setSavedAnswers((current) => ({ ...current, ...answers }));
  }

  function queueAutosave(form: HTMLFormElement) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(() => { void persistAnswers(collectAnswers(form)); }, 700);
  }

  async function submitModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answers = collectAnswers(event.currentTarget);
    for (const question of module.questions.filter((item) => item.required && item.type === "multi_select")) {
      const values = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : answers[question.id] ? [answers[question.id] as string] : [];
      if (!values.length || (values.includes("OPT_1") && values.length > 1)) {
        setSaveStatus("failed");
        return;
      }
    }
    await persistAnswers(answers);
    const moduleIndex = assessmentModules.findIndex((item) => item.id === module.id);
    const nextModule = assessmentModules[moduleIndex + 1];
    window.location.assign(nextModule ? `/assessment/${sessionId}/module/${nextModule.id}` : `/report/${sessionId}`);
  }

  return (
    <main className="route-shell route-shell-wide">
      <p className="eyebrow">MODULE {module.order} OF 13</p>
      <h1>{module.title}</h1>
      <p className="route-lede">{module.purpose}. Use your usual experience during the last four weeks unless a question says otherwise.</p>
      <ProgressBar current={module.order} total={assessmentModules.length} className="route-progress" />
      <form className="question-form" onSubmit={submitModule} onChange={(event) => queueAutosave(event.currentTarget)}>
        <div className={`save-status save-status-${saveStatus}`} role="status" aria-live="polite">{saveStatus === "saving" ? "Saving…" : saveStatus === "failed" ? "Save failed. Try again." : "Saved"}</div>
        {module.questions.map((question) => <QuestionCard key={question.id} question={question} defaultValue={savedAnswers[question.id] as string | undefined} />)}
        <button className="continue-button" type="submit">{module.order === assessmentModules.length ? "Review and Submit" : "Save and Continue"}</button>
      </form>
    </main>
  );
}
