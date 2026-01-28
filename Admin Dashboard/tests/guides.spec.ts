import { test, expect } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

test.describe("Guides page data loading", () => {
  test("fetches and renders unapproved guides", async ({ page }) => {
    await page.route(
      "http://127.0.0.1:9000/admin/guide/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            {
              id: 1,
              guidename: "Alice Guide",
              bio: "Bio A",
              phoneNo: "111-222",
            },
          ]),
        });
      },
    );

    await page.route("http://127.0.0.1:9000/api/guides/all-guides", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
    });

    const file = path.join(process.cwd(), "html", "guides.html");
    await page.goto(pathToFileURL(file).href);

    const rows = page.locator("#unapprovedGuideTable tbody tr");
    await expect(rows).toHaveCount(1);
    const firstTds = rows.first().locator("td");
    await expect(firstTds.nth(0)).toHaveText("Alice Guide");
    await expect(firstTds.nth(1)).toHaveText("Bio A");
    await expect(firstTds.nth(2)).toHaveText("111-222");
  });

  test("fetches and renders approved (all) guides", async ({ page }) => {
    await page.route("http://127.0.0.1:9000/api/guides/all-guides", (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { id: 2, guidename: "Bob Guide", phoneNo: "999-555" },
          { id: 3, guidename: "Carol Guide", phoneNo: "888-444" },
        ]),
      });
    });

    await page.route(
      "http://127.0.0.1:9000/admin/guide/unapproved",
      (route) => {
        route.fulfill({
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      },
    );

    const file = path.join(process.cwd(), "html", "guides.html");
    await page.goto(pathToFileURL(file).href);

    const rows = page.locator("#approvedGuideTable tbody tr");
    await expect(rows).toHaveCount(2);
    const firstRowTds = rows.nth(0).locator("td");
    await expect(firstRowTds.nth(0)).toHaveText("Bob Guide");
    const secondRowTds = rows.nth(1).locator("td");
    await expect(secondRowTds.nth(0)).toHaveText("Carol Guide");
  });
});
