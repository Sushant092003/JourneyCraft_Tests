# Restaurants Page — Test Plan

## Overview

- Page: [html/restaurants.html](html/restaurants.html)
- Purpose: Admin interface to review and manage restaurant profiles with pending approval and all restaurants lists, plus a details dialog for viewing and approving/rejecting restaurants.

## Scope

- Functional UI behaviors (tables, dialogs, actions, empty states).
- API integration with authentication tokens.
- Table population from two endpoints (unapproved, all-restaurants).
- Dialog view, approve, and reject operations.
- Error handling and user feedback.
- Responsiveness and accessibility fundamentals.

## Assumptions

- API base: `http://127.0.0.1:9000`
- Authentication token stored in `localStorage.getItem("token")`
- Unapproved endpoint: `GET /admin/restaurant/unapproved`
- All restaurants endpoint: `GET /api/restaurants/all-restaurants`
- Details endpoint: `GET /api/restaurants/restaurant/{id}`
- Approve endpoint: `POST /admin/restaurant/approve/{id}`
- Reject endpoint: `POST /admin/restaurant/reject/{id}`
- Response fields: `id`, `restoName`, `fssaiLicense`, `phoneNo`, `description`, `locationLink`, `foodType`

## Test Environment

- Recommended browsers: Chromium, Firefox, WebKit.
- Resolutions: 1366x768, 1024x768, 375x812.
- Auth token: mock or mock localStorage.

## Selectors referenced

- Unapproved table: `#unapprovedRestaurantTable`
- Approved table: `#approvedRestaurantTable`
- Dialog overlay: `#restaurantDialog`
- Dialog fields: `#dialog-restaurant-name`, `#dialog-restaurant-license`, `#dialog-restaurant-phone`, `#dialog-restaurant-description`, `#dialog-restaurant-address`, `#dialog-restaurant-cuisine`
- Dialog footer: `#restaurantDialogFooter`

## Test Suites & Cases

### 1) Navigation & Layout

- TC-Nav-01: Sidebar links exist; `Restaurants` has `.active` class.
- TC-Nav-02: Page heading `Restaurant Management` and section headings `Pending Approval` and `All Restaurants` render.

### 2) Unapproved Restaurants Table

- TC-Unapp-01: Table `#unapprovedRestaurantTable` renders with columns `Name`, `License Number`, `Contact`, `Actions`.
- TC-Unapp-02: Empty state: when no pending restaurants, displays "No pending restaurants found" in a single row.
- TC-Unapp-03: Populated state: unapproved restaurants render with `restoName`, `fssaiLicense`, `phoneNo`.
- TC-Unapp-04: View Details button is clickable and opens the dialog.
- TC-Unapp-05: Null/missing fields display as "N/A" fallback.

### 3) All Restaurants Table

- TC-All-01: Table `#approvedRestaurantTable` renders with columns `Name`, `Contact`, `Actions`.
- TC-All-02: Empty state: when no approved restaurants, displays "No approved restaurants found".
- TC-All-03: Populated state: approved restaurants render with `restoName`, `phoneNo`.
- TC-All-04: View Details button is clickable and opens the dialog.

### 4) Dialog / Details

- TC-Dialog-01: Clicking View Details opens `#restaurantDialog` and populates all detail fields.
- TC-Dialog-02: Dialog fields display correct mapping: `restoName` → name, `fssaiLicense` → license, `phoneNo` → phone, `description`, `locationLink` → address, `foodType` → cuisine.
- TC-Dialog-03: Null fields show "Not specified" fallback.
- TC-Dialog-04: Close button removes dialog.active class.
- TC-Dialog-05: Clicking dialog overlay background closes dialog.

### 5) Approve/Reject Actions

- TC-Approve-01: Approve button visible only for unapproved restaurants in dialog footer.
- TC-Approve-02: Clicking Approve disables button, changes text to "Approving...".
- TC-Approve-03: Successful approval shows alert, closes dialog, and reloads tables.
- TC-Reject-01: Reject button visible only for unapproved restaurants.
- TC-Reject-02: Rejection shows confirmation dialog; cancel prevents action.
- TC-Reject-03: Confirmed rejection disables button, changes text to "Rejecting...".
- TC-Reject-04: Successful rejection shows alert, closes dialog, and reloads tables.

### 6) Authentication & Error Handling

- TC-Auth-01: Requests include `Authorization: Bearer <token>` header.
- TC-Auth-02: 403 response (unauthenticated) displays "Authentication required. Please login again." error.
- TC-Error-01: Failed API response (500) displays error message in table or alert.
- TC-Error-02: Network error handled gracefully; table shows error message row.

### 7) Data & Edge Cases

- TC-Data-01: Long restaurant names wrap and table remains readable.
- TC-Data-02: Missing fields (e.g., no description) display fallback without breaking dialog.
- TC-Data-03: Special characters in fields are escaped and not executed.

### 8) Accessibility

- TC-A11y-01: Table headers use `<th>` and are available to screen readers.
- TC-A11y-02: Dialog is focusable; Close button is keyboard accessible.
- TC-A11y-03: All buttons (Approve, Reject, View Details) are reachable via keyboard.

### 9) Responsiveness

- TC-Resp-01: Tables and dialog adapt to small screens; readable on 375px width.

## Automation Notes (Playwright)

- Mock `localStorage.getItem("token")` to return a test token.
- Intercept API endpoints using `page.route()` to control data and responses.
- Test empty and populated states.
- Validate table row counts, cell content, and button presence.
- Assert dialog content and CSS classes.
- Test approval/rejection flow with dialog confirmation.

Example test snippet:

```typescript
await page.evaluate(() => {
  localStorage.setItem('token', 'test-token-123');
});

await page.route('http://127.0.0.1:9000/admin/restaurant/unapproved', (route) => {
  route.fulfill({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([
      { id: 1, restoName: 'The Bistro', fssaiLicense: 'LIC123', phoneNo: '555-1234', ... },
    ]),
  });
});

await page.locator('#unapprovedRestaurantTable tbody tr').first().locator('button').click();
await expect(page.locator('#restaurantDialog')).toHaveClass(/active/);
await expect(page.locator('#dialog-restaurant-name')).toHaveText('The Bistro');
```

## Test Data

- **Unapproved:** id=1, restoName='The Bistro', fssaiLicense='LIC001', phoneNo='555-1111', description='Fine dining', locationLink='123 Main St', foodType='Continental'
- **Approved:** id=2, restoName='Pizza Palace', phoneNo='555-2222'
- **Edge:** missing fields, null values, long names

## Open Questions

- Should restaurants auto-move from unapproved to approved table after approval? (Confirm reload behavior)
- Are phone numbers validated server-side, or any format accepted?

---

Prepared for Playwright automation.
