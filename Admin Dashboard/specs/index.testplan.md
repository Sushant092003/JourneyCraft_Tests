# Dashboard (Index) Page — Test Plan

## Overview

- Page: [html/index.html](html/index.html)
- Purpose: Admin dashboard providing an overview of JourneyCraft system metrics with stat cards and charts (pie, line, bar).

## Scope

- Dashboard layout and stat card rendering.
- API data fetching and population into cards and charts.
- Chart.js library integration and chart rendering.
- Error handling for API failures.
- Navigation links from sidebar.
- Data accuracy and chart data binding.

## Assumptions

- API endpoint: `http://127.0.0.1:9000/admin/counts`
- Response structure: `{ totalGuides, totalRestaurants, activeGuides, pendingGuides }`
- Chart.js CDN is available and loads successfully.
- Chart data is derived from API response for guide-related metrics; registration data is hardcoded.

## Test Environment

- Recommended browsers: Chromium, Firefox, WebKit.
- Resolutions: 1366x768, 1024x768, 375x812.

## Selectors referenced

- Stat cards:
  - `#total-guides`
  - `#total-restaurants`
  - `#active-guides`
  - `#pending-guides`
- Chart canvases:
  - `#guidePieChart` — Guide Status pie chart
  - `#registrationLineChart` — New Registrations line chart
  - `#guideChart` — Guide Activity bar chart
  - `#restaurantChart` — Restaurant Activity bar chart

## Test Suites & Cases

### 1) Navigation & Layout

- TC-Nav-01: Sidebar links exist: `Dashboard` (current), `Guides`, `Restaurants`, `Street Location`.
- TC-Nav-02: Dashboard link has `.active` class or current state indicator.
- TC-Nav-03: Page title "Dashboard Overview" and `stats-grid` with 4 stat cards render.
- TC-Nav-04: `graphs` section with 4 chart cards render.

### 2) Stat Cards

- TC-Stat-01: Four stat cards render with icons and labels: "Total Guides", "Total Restaurants", "Active Guides", "Pending Guides".
- TC-Stat-02: Card icons load correctly from `../assets/icons/`.
- TC-Stat-03: Stat values (`#total-guides`, `#total-restaurants`, `#active-guides`, `#pending-guides`) are populated from API response.
- TC-Stat-04: Stat values are numeric and match API data exactly.

### 3) API Data Fetching

- TC-API-01: Page fetches data from `http://127.0.0.1:9000/admin/counts` on load.
- TC-API-02: Successful response (200) populates all stat cards.
- TC-API-03: API response fields map correctly:
  - `totalGuides` → `#total-guides`
  - `totalRestaurants` → `#total-restaurants`
  - `activeGuides` → `#active-guides`
  - `pendingGuides` → `#pending-guides`

### 4) Charts (Chart.js)

- TC-Chart-01: Guide Status pie chart (`#guidePieChart`) renders with two slices: "Active Guides" and "Pending Guides".
- TC-Chart-02: Pie chart data matches API `activeGuides` and `pendingGuides` values.
- TC-Chart-03: Pie chart colors are correct: green (#28a745) for active, yellow (#ffc107) for pending.
- TC-Chart-04: New Registrations line chart (`#registrationLineChart`) renders with 6-month data.
- TC-Chart-05: Line chart data is hardcoded as [5, 10, 8, 15, 12, 18] (expected behavior per code).
- TC-Chart-06: Guide Activity bar chart (`#guideChart`) renders with active and pending bars.
- TC-Chart-07: Bar chart data matches API `activeGuides` and `pendingGuides`.
- TC-Chart-08: Restaurant Activity bar chart (`#restaurantChart`) renders with total restaurants.
- TC-Chart-09: Restaurant bar chart data matches API `totalRestaurants`.

### 5) Error Handling

- TC-Error-01: API failure (500 or network error) is logged to console; page does not crash.
- TC-Error-02: Stat cards may show empty or fallback value on error.
- TC-Error-03: Charts may not render or render with undefined data on API error (graceful degradation).

### 6) Data Accuracy

- TC-Data-01: With API response `{ totalGuides: 50, totalRestaurants: 30, activeGuides: 40, pendingGuides: 10 }`, stat cards display these exact values.
- TC-Data-02: Pie chart data equals activeGuides + pendingGuides (40 + 10 = 50 total slices/data points).
- TC-Data-03: Bar chart guide bars sum to activeGuides + pendingGuides.

### 7) Chart Library

- TC-ChartLib-01: Chart.js library loads from CDN without errors.
- TC-ChartLib-02: All four charts initialize and render successfully.
- TC-ChartLib-03: Charts are responsive and adapt to card container width.

### 8) Accessibility

- TC-A11y-01: Stat card headings and paragraphs are semantic (`<h2>`, `<p>`).
- TC-A11y-02: Chart canvases have fallback content or ARIA labels for screen readers.
- TC-A11y-03: Nav links are keyboard navigable (Tab + Enter).

### 9) Responsiveness

- TC-Resp-01: Stat cards stack vertically on mobile (375px).
- TC-Resp-02: Chart cards stack vertically on mobile; charts resize to fit container.
- TC-Resp-03: Navigation sidebar collapses or adapts on small screens.

## Automation Notes (Playwright)

- Mock API endpoint using `page.route()` to return controlled data.
- Wait for stat card values to populate using `expect(locator).toHaveText()`.
- Validate chart canvases are present; check Chart.js instance properties if needed.
- Use `page.evaluate()` to inspect Chart.js objects and validate chart data.

Example test snippet:

```typescript
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

await expect(page.locator("#total-guides")).toHaveText("50");
await expect(page.locator("#total-restaurants")).toHaveText("30");
await expect(page.locator("#active-guides")).toHaveText("40");
await expect(page.locator("#pending-guides")).toHaveText("10");

// Verify chart canvases exist
await expect(page.locator("#guidePieChart")).toBeVisible();
await expect(page.locator("#registrationLineChart")).toBeVisible();
await expect(page.locator("#guideChart")).toBeVisible();
await expect(page.locator("#restaurantChart")).toBeVisible();
```

## Test Data

- **Default:** totalGuides=50, totalRestaurants=30, activeGuides=40, pendingGuides=10
- **Edge:** Zero values (0 guides, 0 restaurants), large numbers (999+), negative (invalid, server should prevent)
- **Registration data:** Hardcoded [5, 10, 8, 15, 12, 18] — no API call for this chart

## Open Questions

- Should registration data be fetched from API, or is hardcoding intentional?
- Are there any real-time updates, or is data loaded once on page load?
- What error state/fallback should be displayed if API fails?

---

Prepared for Playwright automation.
