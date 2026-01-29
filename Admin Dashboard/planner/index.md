# index.html — Page Documentation

Title: JourneyCraft Admin Dashboard

Purpose

- Main dashboard landing page providing system overview with key metrics (stat cards) and visual analytics (Chart.js charts).

Structure

- Sidebar (site navigation)
  - Links: Dashboard (current), Guides, Restaurants, Street Location

- Main content
  - Page heading: "Dashboard Overview"
  - Stats grid (4 stat cards):
    - Total Guides: `#total-guides`
    - Total Restaurants: `#total-restaurants`
    - Active Guides: `#active-guides`
    - Pending Guides: `#pending-guides`
  - Charts section (4 graph cards):
    - Guide Status pie chart: `#guidePieChart`
    - New Registrations line chart: `#registrationLineChart`
    - Guide Activity bar chart: `#guideChart`
    - Restaurant Activity bar chart: `#restaurantChart`

Scripts & Styles

- External: Chart.js CDN (`https://cdn.jsdelivr.net/npm/chart.js`)
- Stylesheet: `../css/style.css`
- Script: `../js/dashboard.js` — fetches metrics, populates cards, initializes charts

API Endpoint

- URL: `http://127.0.0.1:9000/admin/counts`
- Method: GET
- Response: `{ totalGuides: number, totalRestaurants: number, activeGuides: number, pendingGuides: number }`

Response Fields Mapping

- `totalGuides` → `#total-guides` text content
- `totalRestaurants` → `#total-restaurants` text content
- `activeGuides` → `#active-guides` text content and pie/bar chart data
- `pendingGuides` → `#pending-guides` text content and pie/bar chart data

Charts

1. **Guide Status (Pie)**: activeGuides vs. pendingGuides
   - Colors: green (#28a745), yellow (#ffc107)
   - Labels: ["Active Guides", "Pending Guides"]

2. **New Registrations (Line)**: Hardcoded 6-month trend
   - Data: [5, 10, 8, 15, 12, 18]
   - Not derived from API; static for demonstration

3. **Guide Activity (Bar)**: Active vs. Pending guides
   - Bars: active (green), pending (yellow)

4. **Restaurant Activity (Bar)**: Total restaurants
   - Bar: total (teal #17a2b8)

Selectors (for automation)

- Stat cards: `#total-guides`, `#total-restaurants`, `#active-guides`, `#pending-guides`
- Chart canvases: `#guidePieChart`, `#registrationLineChart`, `#guideChart`, `#restaurantChart`
- Nav links: sidebar `<a>` tags

Notes for test automation

- Mock the `/admin/counts` endpoint to control metric values.
- Verify stat card text content matches API response.
- Validate all four chart canvases are rendered (Chart.js instances created).
- Test with various data ranges (0, small, large, edge values).
- Check error handling if API fails (graceful degradation).
- Registration line chart data is static and will not change with API response variations.

Quick links

- Page: [html/index.html](html/index.html)
- Test plan: [specs/index.testplan.md](specs/index.testplan.md)
- Script: [js/dashboard.js](js/dashboard.js)
