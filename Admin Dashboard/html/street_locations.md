# street_locations.html — Page Documentation

Title: Street Locations - JourneyCraft

Purpose
- Admin form to add new street locations: collect place name and Google Maps link, submit to backend, and display geocoding results (lat/lng).

Structure
- Sidebar (site navigation)
  - Links: Dashboard, Guides, Restaurants, Street Locations (active)

- Main content
  - Page heading: "Add Street Location"
  - Form card containing:
    - `#streetLocationForm`
      - Input `#name` (text, required): Place Name
      - Input `#link` (text, required): Google Maps Link
      - Button (type="submit"): Save Location
    - Paragraph `#statusMsg`: displays success/error feedback

Scripts & Styles
- Stylesheet: `../css/style.css`
- Script: `../js/street_location.js` — handles form submission, API call, response handling, and status display.

API Endpoint
- URL: `http://127.0.0.1:9000/api/location/street-location`
- Method: POST
- Request payload: `{ name: string, link: string }`
- Response (success): `{ lat: number, lng: number }`
- Response (error): HTTP error status or error message

Selectors (for automation)
- `#streetLocationForm` — target for form submission
- `#name` — place name input
- `#link` — maps link input
- `button[type="submit"]` — submit button
- `#statusMsg` — status message display (classes: `.success`, `.error`)

Notes for test automation
- Mock the POST endpoint using `page.route()` to control success/error responses.
- Validate form reset after successful submission.
- Assert status message text, CSS class, and visibility.
- Test edge cases: long strings, special characters, empty/whitespace inputs.
- Test accessibility: keyboard navigation, label association.

Quick links
- Page: [html/street_locations.html](html/street_locations.html)
- Test plan: [specs/street_locations.testplan.md](specs/street_locations.testplan.md)
- Script: [js/street_location.js](js/street_location.js)
