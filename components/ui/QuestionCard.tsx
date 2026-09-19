import type { CanonicalQuestion } from "@/lib/canonicalAssessment";

export interface QuestionCardProps {
  question: CanonicalQuestion;
  defaultValue?: string | number;
}

export default function QuestionCard({ question, defaultValue }: QuestionCardProps) {
  if (question.type === "free_text") {
    return <label className="canonical-question"><span>{question.text}</span><textarea name={question.id} maxLength={question.max ?? 1000} defaultValue={defaultValue?.toString()} required={question.required} placeholder="Optional context" /></label>;
  }

  if (["integer", "decimal", "decimal_with_unit", "integer_scale"].includes(question.type)) {
    return <label className="canonical-question"><span>{question.text}</span><input name={question.id} type="number" min={question.min} max={question.max} step={question.type === "integer" || question.type === "integer_scale" ? 1 : "any"} defaultValue={defaultValue?.toString()} required={question.required} />{question.helpText && <small>{question.helpText}</small>}</label>;
  }

  const options = question.options ?? [];
  const inputType = question.type === "multi_select" ? "checkbox" : "radio";
  return <fieldset className="canonical-question"><legend>{question.text}</legend>{question.helpText && <small>{question.helpText}</small>}<div className="canonical-options">{options.map((option) => <label key={option.id}><input type={inputType} name={question.id} value={option.id} required={question.required && inputType === "radio"} /><span>{option.label}</span></label>)}</div></fieldset>;
}
