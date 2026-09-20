import { calculateScores, domainOrder } from "@/lib/scoring";

// Test the co-primary driver logic
console.log("Testing driver logic...");

// Test case 1: Two top scores within 3 points (should be co-primary)
const testAnswers1 = {
  // Create minimal answers that would produce top two scores within 3 points
  Q9: "OPT_1", // MR domain
  Q10: "NVR", // MR domain (low points)
  Q16: "OPT_4", // SR domain - high score
  Q41: "OPT_4", // CH domain - slightly lower
  // Add minimal required answers
  Q1: "30",
  Q2: "OPT_1",
  Q3: "170",
  Q4: "70",
  Q6: "80",
  Q7: "OPT_1",
  Q8: "OPT_1",
  Q67: "OPT_1",
  Q68: "OPT_1",
  Q69: "5",
  Q70: "5",
  Q71: "OPT_1",
  Q72: "OPT_3",
};

const result1 = calculateScores(testAnswers1);
console.log("Test 1 - Co-primary scenario:");
console.log("Drivers:", result1.drivers);
console.log("Domain scores:", result1.domains);

// Test case 2: Scores differ by more than 3 points (regular ordering)
console.log("\nTest 2 - Regular ordering scenario:");
const testAnswers2 = {
  ...testAnswers1,
  Q16: "OPT_1", // SR domain very low
};

const result2 = calculateScores(testAnswers2);
console.log("Drivers:", result2.drivers);
console.log("Domain scores:", result2.domains);