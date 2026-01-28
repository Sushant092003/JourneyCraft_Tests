# Street Locations Page — Test Plan

## Overview
- Page: [html/street_locations.html](html/street_locations.html)
- Purpose: Form interface to add new street location entries by capturing place name and Google Maps link, then posting to the backend API.

## Scope
- Form UI functionality (inputs, submit button, validation).
- API integration and response handling (success/error messaging).
- Form reset on successful submission.
- Error handling and user feedback.

## Assumptions
- Backend API endpoint: `http://127.0.0.1:9000/api/location/street-location`
- POST payload: `{ name: string, link: string }`
- Successful response includes `lat` and `lng` coordinates.
- Status message element (`#statusMsg`) displays success/error feedback with appropriate styling.

## Test Environment
- Recommended browsers: Chromium, Firefox, WebKit.
- Resolutions: 1366x768, 1024x768, 375x812.

## Selectors referenced
- Form: `#streetLocationForm`
- Name input: `#name`
- Link input: `#link`
- Submit button: `button[type="submit"]`
- Status message: `#statusMsg`

## Test Suites & Cases

### 1) Navigation & Layout
- TC-Nav-01: Sidebar links exist; `Street Locations` has `.active` class.
- TC-Nav-02: Page title `Add Street Location` and form card render.

### 2) Form Rendering
- TC-Form-01: Form `#streetLocationForm` exists with inputs `#name` and `#link`.
- TC-Form-02: Submit button is present and clickable.
- TC-Form-03: Inputs are empty on page load.

### 3) Form Validation
- TC-Val-01: Submitting with empty `name` shows browser validation error (HTML `required`).
- TC-Val-02: Submitting with empty `link` shows browser validation error (HTML `required`).
- TC-Val-03: Both fields can accept any text (no client-side format validation visible).

### 4) Successful Submission
- TC-Success-01: Submitting valid `name` and `link` sends POST to `http://127.0.0.1:9000/api/location/street-location`.
- TC-Success-02: Success response (status 200, JSON with `lat`/`lng`) displays message with class `success`.
- TC-Success-03: Success message text contains "Location saved successfully!" plus coordinates.
- TC-Success-04: Form resets (inputs become empty) after successful submission.

### 5) Error Handling
- TC-Error-01: Failed API response (status 400/500) displays message with class `error`.
- TC-Error-02: Network error or malformed response displays "Error: Failed to save location" (or specific error message).
- TC-Error-03: Error message is visible and readable; form inputs retain values after error (no auto-reset).

### 6) User Feedback
- TC-Feedback-01: Status message (`#statusMsg`) is initially empty.
- TC-Feedback-02: Success and error messages appear in the correct location.
- TC-Feedback-03: Clearing or re-submitting the form clears previous status messages appropriately.

### 7) Data & Edge Cases
- TC-Data-01: Long `name` (100+ chars) is accepted and submitted.
- TC-Data-02: URL-like `link` (e.g., `https://maps.google.com/...`) is accepted.
- TC-Data-03: Special characters and spaces in `name` and `link` are preserved and submitted.

### 8) Accessibility
- TC-A11y-01: Form inputs have associated labels.
- TC-A11y-02: Submit button is keyboard accessible (Tab + Enter).
- TC-A11y-03: Success/error messages are programmatically associated or announced.

### 9) Responsiveness
- TC-Resp-01: Form and inputs adapt to mobile width (375px); all elements remain usable.

## Automation Notes (Playwright)
- Intercept POST requests to `http://127.0.0.1:9000/api/location/street-location` and mock responses.
- Example test:
  ```typescript
  await page.route('http://127.0.0.1:9000/api/location/street-location', (route) => {
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
    });
  });
  await page.locator('#name').fill('Times Square');
  await page.locator('#link').fill('https://maps.google.com/...');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#statusMsg')).toHaveClass('success');
  ```

## Test Data
- **Success case:** name="Central Park", link="https://maps.google.com/..."
- **Edge case:** name with 150 chars, link with special chars (`&`, `?`, `=`)

## Open Questions (for implementation)
- Should `#name` accept URLs or only place names? (No visible validation)
- Are coordinates always returned for any location string, or only valid addresses?

---
Prepared for Playwright automation.
