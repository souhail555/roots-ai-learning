import { allQuestions } from "@/lib/canonicalAssessment";

// Count scoring-eligible questions
const scoringEligibleCount = allQuestions.filter(q => q.scoringEligible).length;
const requiredQuestionsCount = allQuestions.filter(q => q.required).length;
const optionalQuestionsCount = allQuestions.filter(q => !q.required).length;

console.log("=== Question Count Verification ===");
console.log(`Total questions: ${allQuestions.length}`);
console.log(`Scoring-eligible questions: ${scoringEligibleCount} (expected: 40)`);
console.log(`Required questions: ${requiredQuestionsCount} (expected: 71)`);
console.log(`Optional questions: ${optionalQuestionsCount} (expected: 2)`);
console.log(`Module count: 13`);
console.log("\n=== Verification Result ===");
console.log(scoringEligibleCount === 40 ? "✅ 40 scoring-eligible questions - PASS" : "❌ Incorrect number of scoring-eligible questions");
console.log(requiredQuestionsCount === 71 ? "✅ 71 required questions - PASS" : "❌ Incorrect number of required questions");
console.log(optionalQuestionsCount === 2 ? "✅ 2 optional questions - PASS" : "❌ Incorrect number of optional questions");
console.log(allQuestions.length === 73 ? "✅ 73 total questions - PASS" : "❌ Incorrect number of total questions");