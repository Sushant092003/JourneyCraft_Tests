import { test } from "@playwright/test";

/**
 * Mock backend seed helper (no actual backend needed)
 */
export async function setBackendState(state: "CLEAN" | "PENDING" | "APPROVED") {
  console.log(`Mock backend state set to: ${state}`);
  // Simulated delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Standalone test block - completely mocked, no backend needed
test("Manual Seed: Reset to Approved State", async ({ page }) => {
  // Mock the actual backend seed endpoint
  await page.route(
    "http://127.0.0.1:9000/api/test/seed-guide",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Guide state set to APPROVED",
          state: "APPROVED",
        }),
      });
    },
  );

  await setBackendState("APPROVED");
});
