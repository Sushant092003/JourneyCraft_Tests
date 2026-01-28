import { test, expect } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

test.describe("Street Locations page form submission", () => {
  test("successfully submits form with valid data and displays success message", async ({
    page,
  }) => {
    await page.route(
      "http://127.0.0.1:9000/api/location/street-location",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: 40.7128, lng: -74.006 }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "street_locations.html");
    await page.goto(pathToFileURL(file).href);

    await page.locator("#name").fill("Times Square");
    await page
      .locator("#link")
      .fill("https://maps.google.com/maps?q=times+square");
    await page.locator('button[type="submit"]').click();

    const statusMsg = page.locator("#statusMsg");
    await expect(statusMsg).toHaveClass(/success/);
    await expect(statusMsg).toContainText("Location saved successfully!");
    await expect(statusMsg).toContainText("40.7128");
    await expect(statusMsg).toContainText("-74.006");

    // Verify form is reset
    await expect(page.locator("#name")).toHaveValue("");
    await expect(page.locator("#link")).toHaveValue("");
  });

  test("displays error message on API failure", async ({ page }) => {
    await page.route(
      "http://127.0.0.1:9000/api/location/street-location",
      (route) => {
        route.abort("failed");
      },
    );

    const file = path.join(process.cwd(), "html", "street_locations.html");
    await page.goto(pathToFileURL(file).href);

    await page.locator("#name").fill("Central Park");
    await page.locator("#link").fill("https://maps.google.com/...");
    await page.locator('button[type="submit"]').click();

    const statusMsg = page.locator("#statusMsg");
    await expect(statusMsg).toHaveClass(/error/);
    await expect(statusMsg).toContainText("Error:");

    // Verify form values are retained after error
    await expect(page.locator("#name")).toHaveValue("Central Park");
    await expect(page.locator("#link")).toHaveValue(
      "https://maps.google.com/...",
    );
  });

  test("validates required fields on form submission", async ({ page }) => {
    const file = path.join(process.cwd(), "html", "street_locations.html");
    await page.goto(pathToFileURL(file).href);

    // Try submitting empty form
    await page.locator('button[type="submit"]').click();

    // Expect browser validation to prevent submission
    const nameInput = page.locator("#name");
    const isInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity(),
    );
    expect(isInvalid).toBe(true);
  });

  test("accepts long names and special characters in link", async ({
    page,
  }) => {
    const longName = "A".repeat(150);
    const specialLink =
      "https://maps.google.com/maps?q=place&param=value#anchor";

    await page.route(
      "http://127.0.0.1:9000/api/location/street-location",
      (route) => {
        const postData = route.request().postDataJSON();
        expect(postData.name).toBe(longName);
        expect(postData.link).toBe(specialLink);
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: 51.5074, lng: -0.1278 }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "street_locations.html");
    await page.goto(pathToFileURL(file).href);

    await page.locator("#name").fill(longName);
    await page.locator("#link").fill(specialLink);
    await page.locator('button[type="submit"]').click();

    const statusMsg = page.locator("#statusMsg");
    await expect(statusMsg).toHaveClass(/success/);
  });

  test("displays status message with correct formatting", async ({ page }) => {
    await page.route(
      "http://127.0.0.1:9000/api/location/street-location",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: 35.6762, lng: 139.6503 }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "street_locations.html");
    await page.goto(pathToFileURL(file).href);

    await page.locator("#name").fill("Tokyo Tower");
    await page
      .locator("#link")
      .fill("https://maps.google.com/maps?q=tokyo+tower");
    await page.locator('button[type="submit"]').click();

    const statusMsg = page.locator("#statusMsg");
    const text = await statusMsg.textContent();
    expect(text).toContain("Lat: 35.6762");
    expect(text).toContain("Lng: 139.6503");
  });
});
