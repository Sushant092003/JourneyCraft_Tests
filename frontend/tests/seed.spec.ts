import { test, request } from "@playwright/test";

/**
 * Helper to reset backend data.
 * You can call this from inside other tests too!
 */
export async function setBackendState(state: "CLEAN" | "PENDING" | "APPROVED") {
  const apiContext = await request.newContext();
  const userId = "amit.guide@gmail.com"; // Or your internal DB ID

  console.log(`Setting backend state to: ${state}`);

  // Use your backend's test/seed endpoint
  await apiContext.post(`http://127.0.0.1:9000/api/test/seed-guide`, {
    data: { userId, state },
  });
}

// standalone test block so you can run: npx playwright test tests/seed.spec.ts
test("Manual Seed: Reset to Approved State", async () => {
  await setBackendState("APPROVED");
});
