import { calculateScores } from "@/lib/scoring";
import { validateAnswers } from "@/lib/canonicalAssessment";

// Golden Tests from C-02 Canonical Scoring Rules & Golden Tests v1.0.1 CORRECTED
interface GoldenTest {
  id: string;
  name: string;
  input: Record<string, unknown>;
  expected: Partial<ReturnType<typeof calculateScores>>;
}

const goldenTests: GoldenTest[] = [
  {
    id: "GT01",
    name: "Perfect health - all optimal responses",
    input: {
      // Add the golden test input data here
      Q1: "30",
      // This will populate all 40 scoring-eligible questions with optimal values
    },
    expected: {
      biologicalState: 10,
      // Expected outputs to be populated with canonical values from C-02
    }
  },
  // We'll add all 30 golden tests here based on C-02 v1.0.1
];

async function runGoldenTests() {
  console.log("Running C-02 Golden Tests...\n");
  let passed = 0;
  let failed = 0;
  const results: Array<{
    testId: string; name: string; passed: boolean; actual: unknown; expected: unknown; errors: string[] }> = [];

  for (const test of goldenTests) {
    console.log(`Test ${test.id}: ${test.name}`);
    
    // First run validation
    const validationErrors = validateAnswers(test.input);
    
    // Then calculate scores
    const actual = calculateScores(test.input);
    
    // Compare actual vs expected
    const testErrors: string[] = [];
    let testPassed = true;
    
    for (const [key, expectedValue] of Object.entries(test.expected)) {
      const actualValue = (actual as unknown as Record<string, unknown>)[key];
      if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
        testErrors.push(`${key}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)}`);
        testPassed = false;
      }
    }
    
    if (testPassed && validationErrors.length === 0) {
      passed++;
      console.log(`✅ PASS`);
    } else {
      failed++;
      console.log(`❌ FAIL`);
      if (validationErrors.length > 0) {
        console.log("  Validation errors:", validationErrors);
      }
      testErrors.forEach(err => console.log(`  ${err}`));
    }
    
    results.push({
      testId: test.id,
      name: test.name,
      passed: testPassed && validationErrors.length === 0,
      actual,
      expected: test.expected,
      errors: [...testErrors, ...validationErrors.map(e => e.message)]
    });
    
    console.log("---\n");
  }

  console.log("\n=== Final Results ===");
  console.log(`Total: ${goldenTests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / goldenTests.length * 100).toFixed(1))}%\n`);
  
  // Print detailed report
  console.log("=== Detailed Test Report ===");
  results.forEach(r => {
    console.log(`${r.testId} | ${r.name} | ${r.passed ? "PASS" : "FAIL"}`);
    if (!r.passed) {
      r.errors.forEach(e => console.log(`  - ${e}`));
    }
  });
}

// Run the tests
runGoldenTests().catch(console.error);