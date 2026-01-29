// spec: specs/add-guide-test-plan.md
// section: 7.2 Handle profile view modal closure in multiple ways

import { test, expect } from "@playwright/test";

test.describe("Edge Cases and Error Scenarios", () => {
  test("Handle profile view modal closure in multiple ways", async ({
    page,
  }) => {
    await page.goto("/guide");

    // Step 2: Click 'View Profile' button to open modal
    await page.getByRole("button", { name: /View Profile/i }).click();

    // Step 3: Verify profile modal is displayed
    const profileModal = page.locator(
      'div:has-text("🧭 Guide Profile"):has(> button:has-text("Close Profile"))',
    );
    await expect(profileModal).toBeVisible();

    // Verify modal contains profile information
    const profileContent = page.locator(".grid.grid-cols-2");
    await expect(profileContent).toBeVisible();

    // Step 4: Click 'Close Profile' button
    await page.getByRole("button", { name: /Close Profile/i }).click();

    // Step 5: Verify modal closes
    await expect(profileModal).not.toBeVisible();

    // Step 6: Click 'View Profile' button again
    await page.getByRole("button", { name: /View Profile/i }).click();

    // Step 7: Verify modal opens with correct data
    await expect(profileModal).toBeVisible();
    await expect(profileContent).toBeVisible();
  });
});
