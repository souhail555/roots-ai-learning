/**
 * ROOTS-AI(TM) M2 - Security and negative tests.
 *
 * Demonstrates, against the running application:
 *   - unauthorized access to protected assessment/scoring data is rejected
 *   - cross-user access is rejected
 *   - invalid inputs cannot bypass the canonical assessment/scoring controls
 *
 * Usage: start the app (npm run dev or npm start), then
 *   node scripts/security-tests.mjs [baseUrl]
 *
 * The script uses only built-in fetch and asserts on HTTP status codes and
 * response bodies, so it can run in CI against a deployment.
 */

const baseUrl =
  process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000";

let pass = 0;
let fail = 0;

function record(id, description, ok, detail) {
  if (ok) pass++;
  else fail++;
  console.log(
    `${id.padEnd(10)} | ${ok ? "PASS" : "FAIL"} | ${description}${detail ? ` -> ${detail}` : ""}`,
  );
}

async function json(response) {
  return response.json().catch(() => null);
}

async function main() {
  console.log(`ROOTS-AI(TM) M2 Security / Negative Tests against ${baseUrl}\n`);

  // Create two independent sessions (two users).
  const create = async () => {
    const r = await fetch(`${baseUrl}/api/assessment/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `user-${crypto.randomUUID()}@example.com`,
      }),
    });
    const cookie = r.headers.get("set-cookie") ?? "";
    const body = await json(r);
    return { sessionId: body?.sessionId, cookie };
  };

  const userA = await create();
  const userB = await create();

  record(
    "SEC-01",
    "User A session created",
    !!userA.sessionId,
    userA.sessionId,
  );
  record(
    "SEC-02",
    "User B session created",
    !!userB.sessionId,
    userB.sessionId,
  );

  // 1. Unauthenticated access (no cookie) to a session.
  const noCookie = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}`,
  );
  record(
    "SEC-03",
    "No cookie cannot read a session",
    noCookie.status === 403 || noCookie.status === 404,
    `status ${noCookie.status}`,
  );

  // 2. Cross-user access: B's cookie tries to read A's session.
  const sessionCookieB = userB.cookie.split(";")[0];
  const cross = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}`,
    {
      headers: { cookie: sessionCookieB },
    },
  );
  record(
    "SEC-04",
    "Cross-user session read is rejected",
    cross.status === 403,
    `status ${cross.status}`,
  );

  // 3. Cross-user answers write is rejected.
  const crossWrite = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}/answers`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", cookie: sessionCookieB },
      body: JSON.stringify({ moduleId: "M01", answers: { Q1: 40 } }),
    },
  );
  record(
    "SEC-05",
    "Cross-user answer write is rejected",
    crossWrite.status === 403,
    `status ${crossWrite.status}`,
  );

  // 4. Cross-user progress read is rejected.
  const crossProgress = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}/progress`,
    {
      headers: { cookie: sessionCookieB },
    },
  );
  record(
    "SEC-06",
    "Cross-user progress read is rejected",
    crossProgress.status === 403,
    `status ${crossProgress.status}`,
  );

  // 5. Cross-user result read is rejected.
  const crossResult = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}/result`,
    {
      headers: { cookie: sessionCookieB },
    },
  );
  record(
    "SEC-07",
    "Cross-user result read is rejected",
    crossResult.status === 403,
    `status ${crossResult.status}`,
  );

  // --- Invalid input / bypass attempts, using A's own valid session cookie. ---
  const sessionCookieA = userA.cookie.split(";")[0];
  const patch = (body) =>
    fetch(`${baseUrl}/api/assessment/sessions/${userA.sessionId}/answers`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", cookie: sessionCookieA },
      body: JSON.stringify(body),
    });

  // 6. Unknown module rejected.
  const badModule = await patch({ moduleId: "M99", answers: {} });
  record(
    "SEC-08",
    "Unknown module rejected",
    badModule.status === 400,
    `status ${badModule.status}`,
  );

  // 7. Cross-module answer injection rejected (Q1 is not in M02).
  const foreignQ = await patch({ moduleId: "M02", answers: { Q1: 40 } });
  record(
    "SEC-09",
    "Cross-module question injection rejected",
    foreignQ.status === 400,
    `status ${foreignQ.status}`,
  );

  // 8. Invalid option value rejected for a single-select question.
  const badOption = await patch({
    moduleId: "M01",
    answers: { Q2: "NOT_AN_OPTION" },
  });
  record(
    "SEC-10",
    "Unknown option value rejected",
    badOption.status === 400,
    `status ${badOption.status}`,
  );

  // 9. Required multi-select empty array rejected/flagged.
  const emptyMulti = await patch({ moduleId: "M02", answers: { Q13: [] } });
  const emptyBody = await json(emptyMulti);
  const emptyFlagged =
    emptyMulti.status === 400 || (emptyBody?.validationErrors?.length ?? 0) > 0;
  record(
    "SEC-11",
    "Empty required multi-select is flagged",
    emptyFlagged,
    `status ${emptyMulti.status}`,
  );

  // 10. NONE / N/A mutual exclusivity enforced for a multi-select.
  const exclusive = await patch({
    moduleId: "M02",
    answers: { Q13: ["NONE", "T2D"] },
  });
  const exclusiveBody = await json(exclusive);
  const exclusiveFlagged =
    exclusive.status === 400 ||
    (exclusiveBody?.validationErrors?.length ?? 0) > 0;
  record(
    "SEC-12",
    "NONE combined with another option is flagged",
    exclusiveFlagged,
    `status ${exclusive.status}`,
  );

  // 11. Incomplete assessment cannot produce a result.
  const result = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}/result`,
    {
      method: "POST",
      headers: { cookie: sessionCookieA },
    },
  );
  const resultBody = await json(result);
  record(
    "SEC-13",
    "Incomplete assessment cannot produce a result",
    result.status === 400 && (resultBody?.validationErrors?.length ?? 0) > 0,
    `status ${result.status}`,
  );

  // 12. Unauthenticated result creation rejected.
  const anonResult = await fetch(
    `${baseUrl}/api/assessment/sessions/${userA.sessionId}/result`,
    { method: "POST" },
  );
  record(
    "SEC-14",
    "Unauthenticated result creation rejected",
    anonResult.status === 403,
    `status ${anonResult.status}`,
  );

  // 13. Invalid email cannot create a session.
  const badEmail = await fetch(`${baseUrl}/api/assessment/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "not-an-email" }),
  });
  record(
    "SEC-15",
    "Invalid email rejected at session creation",
    badEmail.status === 400,
    `status ${badEmail.status}`,
  );

  console.log(`\n=== Summary ===\nPassed: ${pass}  Failed: ${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Security test run failed:", error.message);
  process.exitCode = 1;
});
