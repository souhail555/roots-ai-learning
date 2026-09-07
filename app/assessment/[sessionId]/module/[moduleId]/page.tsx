"use client";

import { FormEvent, use } from "react";
import questionsData from "@/data/questions.json";
import QuestionCard, { Question } from "@/components/ui/QuestionCard";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ModulePage({ params }: { params: Promise<{ sessionId: string; moduleId: string }> }) {
  const { sessionId, moduleId } = use(params);
  const selectedModule = questionsData.modules.find((item) => item.id === moduleId);

  if (!selectedModule) {
    return <main className="route-shell"><h1>Module not found</h1><p className="route-lede">This learning branch does not exist.</p></main>;
  }
  const module = selectedModule;

  function submitModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const savedAnswers = JSON.parse(sessionStorage.getItem(`roots-answers-${sessionId}`) ?? "{}");
    const answers = { ...savedAnswers };
    module.questions.forEach((question) => {
      const value = formData.get(question.id);
      if (value) answers[question.id] = Number(value);
    });
    sessionStorage.setItem(`roots-answers-${sessionId}`, JSON.stringify(answers));
    const moduleIndex = questionsData.modules.findIndex((item) => item.id === module.id);
    const nextModule = questionsData.modules[moduleIndex + 1];
    window.location.assign(nextModule ? `/assessment/${sessionId}/module/${nextModule.id}` : `/report/${sessionId}`);
  }

  return (
    <main className="route-shell route-shell-wide">
      <p className="eyebrow">MODULE / {module.category.toUpperCase()}</p>
      <h1>{module.title}</h1>
      <p className="route-lede">Answer each question in the way that feels most accurate today.</p>
      <ProgressBar current={questionsData.modules.findIndex((item) => item.id === module.id) + 1} total={questionsData.modules.length} className="route-progress" />
      <form className="question-form" onSubmit={submitModule}>
        {module.questions.map((question) => <QuestionCard key={question.id} question={question as Question} />)}
        <button className="continue-button" type="submit">{module.id === questionsData.modules.at(-1)?.id ? "View my report →" : "Continue →"}</button>
      </form>
    </main>
  );
}
