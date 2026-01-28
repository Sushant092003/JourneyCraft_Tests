import { test, expect } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

test.describe("Restaurants page data loading and actions", () => {
  test("loads and renders unapproved restaurants", async ({ page }) => {
    // Set auth token in localStorage
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token-123");
    });

    // Mock unapproved restaurants endpoint
    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            {
              id: 1,
              restoName: "The Bistro",
              fssaiLicense: "LIC001",
              phoneNo: "555-1111",
              description: "Fine dining restaurant",
              locationLink: "123 Main St",
              foodType: "Continental",
            },
          ]),
        });
      },
    );

    // Mock all restaurants endpoint
    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    const unapprovedRows = page.locator("#unapprovedRestaurantTable tbody tr");
    await expect(unapprovedRows).toHaveCount(1);

    const firstRow = unapprovedRows.first();
    await expect(firstRow.locator("td").nth(0)).toHaveText("The Bistro");
    await expect(firstRow.locator("td").nth(1)).toHaveText("LIC001");
    await expect(firstRow.locator("td").nth(2)).toHaveText("555-1111");
  });

  test("loads and renders approved restaurants", async ({ page }) => {
    // Set auth token
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token-123");
    });

    // Mock unapproved endpoint (empty)
    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    // Mock all restaurants endpoint
    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            { id: 2, restoName: "Pizza Palace", phoneNo: "555-2222" },
            { id: 3, restoName: "Sushi House", phoneNo: "555-3333" },
          ]),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    const approvedRows = page.locator("#approvedRestaurantTable tbody tr");
    await expect(approvedRows).toHaveCount(2);

    const firstApprovedRow = approvedRows.nth(0);
    await expect(firstApprovedRow.locator("td").nth(0)).toHaveText(
      "Pizza Palace",
    );
    await expect(firstApprovedRow.locator("td").nth(1)).toHaveText("555-2222");

    const secondApprovedRow = approvedRows.nth(1);
    await expect(secondApprovedRow.locator("td").nth(0)).toHaveText(
      "Sushi House",
    );
  });

  test("opens dialog and displays restaurant details", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token-123");
    });

    // Mock unapproved endpoint
    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            {
              id: 1,
              restoName: "The Bistro",
              fssaiLicense: "LIC001",
              phoneNo: "555-1111",
              description: "Fine dining",
              locationLink: "123 Main St",
              foodType: "Continental",
            },
          ]),
        });
      },
    );

    // Mock all restaurants endpoint
    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    // Mock details endpoint
    await page.route(
      "http://127.0.0.1:9000/api/restaurants/restaurant/1",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 1,
            restoName: "The Bistro",
            fssaiLicense: "LIC001",
            phoneNo: "555-1111",
            description: "Fine dining restaurant",
            locationLink: "123 Main St, Downtown",
            foodType: "Continental",
          }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    // Click View Details button
    await page
      .locator("#unapprovedRestaurantTable tbody tr")
      .first()
      .locator(".view-btn")
      .click();

    // Verify dialog is open
    const dialog = page.locator("#restaurantDialog");
    await expect(dialog).toHaveClass(/active/);

    // Verify dialog content
    await expect(page.locator("#dialog-restaurant-name")).toHaveText(
      "The Bistro",
    );
    await expect(page.locator("#dialog-restaurant-license")).toHaveText(
      "LIC001",
    );
    await expect(page.locator("#dialog-restaurant-phone")).toHaveText(
      "555-1111",
    );
    await expect(page.locator("#dialog-restaurant-description")).toHaveText(
      "Fine dining restaurant",
    );
    await expect(page.locator("#dialog-restaurant-address")).toHaveText(
      "123 Main St, Downtown",
    );
    await expect(page.locator("#dialog-restaurant-cuisine")).toHaveText(
      "Continental",
    );
  });

  test("closes dialog when close button is clicked", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token-123");
    });

    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            {
              id: 1,
              restoName: "The Bistro",
              fssaiLicense: "LIC001",
              phoneNo: "555-1111",
            },
          ]),
        });
      },
    );

    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    await page.route(
      "http://127.0.0.1:9000/api/restaurants/restaurant/1",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 1,
            restoName: "The Bistro",
            fssaiLicense: "LIC001",
            phoneNo: "555-1111",
            description: "Fine dining",
            locationLink: "123 Main St",
            foodType: "Continental",
          }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    // Open dialog
    await page
      .locator("#unapprovedRestaurantTable tbody tr")
      .first()
      .locator(".view-btn")
      .click();
    await expect(page.locator("#restaurantDialog")).toHaveClass(/active/);

    // Click close button
    await page.locator(".dialog-close").click();
    await expect(page.locator("#restaurantDialog")).not.toHaveClass(/active/);
  });

  test("displays empty state for no pending restaurants", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token-123");
    });

    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    const unapprovedRows = page.locator("#unapprovedRestaurantTable tbody tr");
    await expect(unapprovedRows).toHaveCount(1);
    await expect(unapprovedRows.first()).toContainText(
      "No pending restaurants found",
    );
  });

  test("displays null field fallback values in dialog", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token-123");
    });

    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            {
              id: 1,
              restoName: "Minimal Info",
              fssaiLicense: null,
              phoneNo: null,
            },
          ]),
        });
      },
    );

    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    await page.route(
      "http://127.0.0.1:9000/api/restaurants/restaurant/1",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 1,
            restoName: "Minimal Info",
            fssaiLicense: null,
            phoneNo: null,
            description: null,
            locationLink: null,
            foodType: null,
          }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    await page
      .locator("#unapprovedRestaurantTable tbody tr")
      .first()
      .locator(".view-btn")
      .click();

    // Verify fallback text "Not specified"
    await expect(page.locator("#dialog-restaurant-license")).toHaveText(
      "Not specified",
    );
    await expect(page.locator("#dialog-restaurant-phone")).toHaveText(
      "Not specified",
    );
    await expect(page.locator("#dialog-restaurant-description")).toHaveText(
      "Not specified",
    );
  });

  test("handles 403 authentication error", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "invalid-token");
    });

    await page.route(
      "http://127.0.0.1:9000/admin/restaurant/unapproved",
      (route) => {
        route.fulfill({
          status: 403,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Unauthorized" }),
        });
      },
    );

    await page.route(
      "http://127.0.0.1:9000/api/restaurants/all-restaurants",
      (route) => {
        route.fulfill({
          status: 403,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Unauthorized" }),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "restaurants.html");
    await page.goto(pathToFileURL(file).href);

    // Check for error message in unapproved table
    const unapprovedError = page
      .locator("#unapprovedRestaurantTable tbody tr")
      .first();
    await expect(unapprovedError).toContainText("Authentication required");

    // Check for error message in approved table
    const approvedError = page
      .locator("#approvedRestaurantTable tbody tr")
      .first();
    await expect(approvedError).toContainText("Authentication required");
  });
});
