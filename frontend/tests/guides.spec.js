import { test, expect } from "@playwright/test";

test("Guides page loads and shows tables", async ({ page }) => {
  await page.goto("/html/guides.html");

  // Wait for tables to load
  await page.waitForSelector("#unapprovedGuideTable tbody tr");

  const rows = await page.locator("#unapprovedGuideTable tbody tr").count();
  expect(rows).toBeGreaterThan(0);
});

test("View guide details opens dialog", async ({ page }) => {
  await page.goto("/html/guides.html");

  await page.waitForSelector("#unapprovedGuideTable tbody tr");

  // Click first View Details
  await page.locator(".view-btn").first().click();

  // Dialog should open
  await expect(page.locator("#guideDialog")).toHaveClass(/active/);

  // Fields should not be empty
  await expect(page.locator("#dialog-guide-name")).not.toHaveText("");
  await expect(page.locator("#dialog-guide-phone")).not.toHaveText("");
});

test("Approve guide works", async ({ page }) => {
  await page.goto("/html/guides.html");

  await page.waitForSelector(".view-btn");

  await page.locator(".view-btn").first().click();

  await page.click("button.approve");

  // Dialog should close
  await expect(page.locator("#guideDialog")).not.toHaveClass(/active/);
});
