import scoringConfig from "@/data/scoring-config.json";
import questionsData from "@/data/questions.json";

type QuestionsData = typeof questionsData;
type ScoringConfig = typeof scoringConfig;

export interface ScoringResult {
  categoryScores: Record<string, number>;
  overallScore: number;
  band: string;
}

/** Computes 0-100 scores per category and an overall band from raw question answers. */
export function calculateScores(answers: Record<string, number>): ScoringResult {
  const modules = (questionsData as QuestionsData).modules;
  const categories = (scoringConfig as ScoringConfig).categories;

  const totals: Record<string, { sum: number; max: number }> = {};

  for (const category of Object.keys(categories)) {
    totals[category] = { sum: 0, max: 0 };
  }

  for (const module of modules) {
    const category = module.category;
    const maxPerQuestion = categories[category as keyof typeof categories]?.maxPerQuestion ?? 5;

    for (const question of module.questions) {
      const answer = answers[question.id] ?? 0;
      totals[category].sum += answer;
      totals[category].max += maxPerQuestion;
    }
  }

  const categoryScores: Record<string, number> = {};
  for (const [category, { sum, max }] of Object.entries(totals)) {
    categoryScores[category] = max > 0 ? Math.round((sum / max) * 100) : 0;
  }

  const scores = Object.values(categoryScores);
  const overallScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const band =
    (scoringConfig as ScoringConfig).bands.find(
      (b) => overallScore >= b.min && overallScore <= b.max
    )?.label ?? "Unknown";

  return { categoryScores, overallScore, band };
}
