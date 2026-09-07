export interface QuestionOption {
  value: number;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: "scale" | "choice";
  min?: number;
  max?: number;
  options?: QuestionOption[];
}

export interface QuestionCardProps {
  question: Question;
  defaultValue?: number;
}

/** Renders a single question with its input, backed by a native radio group for form submission. */
export default function QuestionCard({ question, defaultValue }: QuestionCardProps) {
  const choices: QuestionOption[] =
    question.type === "scale"
      ? Array.from(
          { length: (question.max ?? 5) - (question.min ?? 1) + 1 },
          (_, i) => (question.min ?? 1) + i
        ).map((value) => ({ value, label: String(value) }))
      : (question.options ?? []);

  return (
    <fieldset className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <legend className="mb-3 text-base font-medium text-zinc-900 dark:text-zinc-50">
        {question.text}
      </legend>
      <div className="flex flex-wrap gap-3">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm has-checked:border-zinc-900 has-checked:bg-zinc-900 has-checked:text-white dark:border-zinc-800 dark:has-checked:border-zinc-50 dark:has-checked:bg-zinc-50 dark:has-checked:text-black"
          >
            <input
              type="radio"
              name={question.id}
              value={choice.value}
              defaultChecked={defaultValue === choice.value}
              required
              className="sr-only"
            />
            {choice.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
