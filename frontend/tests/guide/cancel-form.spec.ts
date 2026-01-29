// spec: specs/add-guide-test-plan.md
// section: 1.4 Cancel form submission during creation
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Cancel Form Submission", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API - no existing profile
    await page.route(
      "http://127.0.0.1:9000/api/guides/guide/**",
      async (route) => {
        await route.abort();
      },
    );

    // Mock register endpoint (should not be called)
    await page.route(
      "http://127.0.0.1:9000/api/guides/register/**",
      async (route) => {
        throw new Error("API should not be called when canceling");
      },
    );
  });

  test("1.4: Cancel form submission during creation", async ({ page }) => {
    // Step 1: User is logged in as a GUIDE with no existing profile
    await page.goto("/guide");
    await page.waitForLoadState("networkidle");

    // Step 2: Click 'Create Profile' button
    const createButton = page.getByRole("button", { name: /Create Profile/i });
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Step 3: Fill in all form fields with valid data
    const formModal = page.locator("form");
    await expect(formModal).toBeVisible();

    await page.locator("input[id='guidename']").fill("John Smith");
    await page.locator("input[id='experience']").fill("5");
    await page.locator("input[id='language']").fill("English");
    await page
      .locator("input[id='bio']")
      .fill("Experienced tour guide with deep knowledge");
    await page.locator("input[id='latitude']").fill("40.7128");
    await page.locator("input[id='longitude']").fill("-74.0060");
    await page.locator("input[id='licenseNumber']").fill("LIC123456789");
    await page.locator("input[id='phoneNo']").fill("9876543210");

    // Step 4: Click the 'Cancel' button
    const cancelButton = page.getByRole("button", { name: /Cancel/i });
    await cancelButton.click();

    // Step 5: Verify form modal closes
    await expect(formModal).not.toBeVisible({ timeout: 2000 });

    // Step 6: Verify header shows 'Create Your Guide Profile'
    const headerText = page.locator("h2");
    await expect(headerText).toContainText(/Create Your Guide Profile/i);

    // Step 7: Verify 'Create Profile' button is visible again
    await expect(createButton).toBeVisible();

    // Additional verification: Re-open form to ensure no data was saved
    await createButton.click();
    await expect(formModal).toBeVisible();

    // Check that fields are empty (data not persisted)
    const guideNameInput = page.locator("input[id='guidename']");
    const inputValue = await guideNameInput.inputValue();
    expect(inputValue).toBe("");
  });
});
