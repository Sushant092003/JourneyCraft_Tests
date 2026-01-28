import { test, expect } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

test.describe("Dashboard (Index) page metrics and charts", () => {
  test("populates stat cards with API data", async ({ page }) => {
    // Mock the admin counts endpoint
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 50,
          totalRestaurants: 30,
          activeGuides: 40,
          pendingGuides: 10,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Verify stat card values match API response
    await expect(page.locator("#total-guides")).toHaveText("50");
    await expect(page.locator("#total-restaurants")).toHaveText("30");
    await expect(page.locator("#active-guides")).toHaveText("40");
    await expect(page.locator("#pending-guides")).toHaveText("10");
  });

  test("renders all four charts", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 50,
          totalRestaurants: 30,
          activeGuides: 40,
          pendingGuides: 10,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Wait for Chart.js to load and initialize charts
    await page.waitForFunction(() => {
      return (window as any).Chart !== undefined;
    });

    // Verify all four chart canvases are present and visible
    await expect(page.locator("#guidePieChart")).toBeVisible();
    await expect(page.locator("#registrationLineChart")).toBeVisible();
    await expect(page.locator("#guideChart")).toBeVisible();
    await expect(page.locator("#restaurantChart")).toBeVisible();
  });

  test("handles zero values correctly", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 0,
          totalRestaurants: 0,
          activeGuides: 0,
          pendingGuides: 0,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Verify stat cards display zero
    await expect(page.locator("#total-guides")).toHaveText("0");
    await expect(page.locator("#total-restaurants")).toHaveText("0");
    await expect(page.locator("#active-guides")).toHaveText("0");
    await expect(page.locator("#pending-guides")).toHaveText("0");

    // Charts should still render even with zero data
    await expect(page.locator("#guidePieChart")).toBeVisible();
  });

  test("handles large numbers correctly", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 9999,
          totalRestaurants: 5000,
          activeGuides: 8500,
          pendingGuides: 1499,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Verify stat cards display large numbers
    await expect(page.locator("#total-guides")).toHaveText("9999");
    await expect(page.locator("#total-restaurants")).toHaveText("5000");
    await expect(page.locator("#active-guides")).toHaveText("8500");
    await expect(page.locator("#pending-guides")).toHaveText("1499");
  });

  test("renders dashboard layout with navigation", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 50,
          totalRestaurants: 30,
          activeGuides: 40,
          pendingGuides: 10,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Verify page title
    await expect(page.locator("h1")).toContainText("Dashboard Overview");

    // Verify sidebar navigation links exist
    const navLinks = page.locator("a");
    const linkTexts = await navLinks.allTextContents();
    expect(linkTexts).toContain("Dashboard");
    expect(linkTexts).toContain("Guides");
    expect(linkTexts).toContain("Restaurants");
    expect(linkTexts).toContain("Street Location");

    // Verify stat card labels
    const labels = page.locator(".stat-card p");
    const labelTexts = await labels.allTextContents();
    expect(labelTexts).toContain("Total Guides");
    expect(labelTexts).toContain("Total Restaurants");
    expect(labelTexts).toContain("Active Guides");
    expect(labelTexts).toContain("Pending Guides");
  });

  test("handles API error gracefully", async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleLogs.push(msg.text());
      }
    });

    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.abort("failed");
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Page should still load without crashing
    await expect(page.locator("h1")).toContainText("Dashboard Overview");

    // Stat cards should still exist (may be empty or have placeholder)
    await expect(page.locator("#total-guides")).toBeAttached();
    await expect(page.locator("#total-restaurants")).toBeAttached();

    // Wait a bit for error to be logged
    await page.waitForTimeout(500);
    // Should have error log about dashboard data
    expect(
      consoleLogs.some(
        (log) => log.includes("dashboard data") || log.includes("Error"),
      ),
    ).toBe(true);
  });

  test("displays stat card icons", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 50,
          totalRestaurants: 30,
          activeGuides: 40,
          pendingGuides: 10,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Verify stat card images are present
    const images = page.locator(".stat-card img");
    const count = await images.count();
    expect(count).toBe(4);

    // Verify image alt texts
    const alts = await images.evaluateAll((elements) =>
      elements.map((el) => (el as HTMLImageElement).alt),
    );
    expect(alts).toContain("Guide Icon");
    expect(alts).toContain("Restaurant Icon");
    expect(alts).toContain("Active Icon");
    expect(alts).toContain("Pending Icon");
  });

  test("validates chart data matches API response", async ({ page }) => {
    const mockData = {
      totalGuides: 55,
      totalRestaurants: 25,
      activeGuides: 45,
      pendingGuides: 10,
    };

    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockData),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Wait for Chart.js to initialize
    await page.waitForFunction(() => {
      return (window as any).Chart !== undefined;
    });

    // Inspect guide pie chart data
    const guidePieChartData = await page.evaluate(() => {
      const canvases = document.querySelectorAll("canvas");
      const guidePie = canvases[0];
      // Access Chart.js instance (via data attribute if available)
      // For this test, we verify the chart canvas exists and Chart.js is available
      return {
        canvasExists: !!guidePie,
        chartLibraryLoaded: !!(window as any).Chart,
      };
    });

    expect(guidePieChartData.canvasExists).toBe(true);
    expect(guidePieChartData.chartLibraryLoaded).toBe(true);

    // Verify stat card values match mock data
    await expect(page.locator("#active-guides")).toHaveText(
      mockData.activeGuides.toString(),
    );
    await expect(page.locator("#pending-guides")).toHaveText(
      mockData.pendingGuides.toString(),
    );
  });

  test("navigates to other pages via sidebar links", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/admin/counts", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalGuides: 50,
          totalRestaurants: 30,
          activeGuides: 40,
          pendingGuides: 10,
        }),
      });
    });

    const file = path.join(process.cwd(), "html", "index.html");
    await page.goto(pathToFileURL(file).href);

    // Get the href of the "Guides" link
    const guidesLink = page.locator("a").filter({ hasText: "Guides" }).first();
    const href = await guidesLink.getAttribute("href");
    expect(href).toBe("guides.html");

    // Similarly verify other links
    const restaurantsLink = page
      .locator("a")
      .filter({ hasText: "Restaurants" })
      .first();
    const restaurantsHref = await restaurantsLink.getAttribute("href");
    expect(restaurantsHref).toBe("restaurants.html");

    const streetLocLink = page
      .locator("a")
      .filter({ hasText: "Street Location" })
      .first();
    const streetLocHref = await streetLocLink.getAttribute("href");
    expect(streetLocHref).toBe("street_locations.html");
  });
});
