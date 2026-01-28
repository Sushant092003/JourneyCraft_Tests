# restaurants.html — Page Documentation

Title: JourneyCraft - Approve Restaurants

Purpose

- Admin interface for reviewing and managing restaurant profiles: pending approval list, approved list, and a details dialog with approve/reject actions.

Structure

- Sidebar (site navigation)
  - Links: Dashboard, Guides, Restaurants (active), Street Locations

- Main content
  - Page heading: "Restaurant Management"
  - Two sections in `.management-grid`:
    - Pending Approval
      - Table id: `#unapprovedRestaurantTable`
      - Columns: Name, License Number, Contact, Actions
      - Empty state: "No pending restaurants found"
    - All Restaurants
      - Table id: `#approvedRestaurantTable`
      - Columns: Name, Contact, Actions
      - Empty state: "No approved restaurants found"

- Dialog overlay
  - Container id: `#restaurantDialog`
  - Dialog fields (span ids):
    - `#dialog-restaurant-name`
    - `#dialog-restaurant-description`
    - `#dialog-restaurant-license`
    - `#dialog-restaurant-phone`
    - `#dialog-restaurant-address`
    - `#dialog-restaurant-cuisine`
  - Dialog footer id: `#restaurantDialogFooter`
  - Close button triggers `closeDialog('restaurantDialog')`

Scripts & Styles

- Stylesheet: `../css/style.css`
- Script: `../js/restaurants.js` — loads tables via API, handles view/approve/reject actions.

API Endpoints

- GET `http://127.0.0.1:9000/admin/restaurant/unapproved` — unapproved restaurants
- GET `http://127.0.0.1:9000/api/restaurants/all-restaurants` — approved restaurants
- GET `http://127.0.0.1:9000/api/restaurants/restaurant/{id}` — restaurant details
- POST `http://127.0.0.1:9000/admin/restaurant/approve/{id}` — approve restaurant
- POST `http://127.0.0.1:9000/admin/restaurant/reject/{id}` — reject restaurant
- All requests include `Authorization: Bearer <token>` header from `localStorage`.

Response Fields

- `id`, `restoName`, `fssaiLicense`, `phoneNo`, `description`, `locationLink`, `foodType`
- Fallback for missing fields: "N/A" (table), "Not specified" (dialog)

Selectors (for automation)

- `#unapprovedRestaurantTable` — pending rows: `tbody tr`
- `#approvedRestaurantTable` — approved rows: `tbody tr`
- Row action button: `.view-btn` within a row's `td` in Actions column
- `#restaurantDialog` — overlay visibility
- Dialog detail spans: `#dialog-restaurant-name`, `#dialog-restaurant-license`, etc.
- Dialog footer buttons: `.approve`, `.reject`, `.close-btn`

Notes for test automation

- Mock `localStorage` to set auth token before page load.
- Intercept API endpoints with `page.route()` for deterministic test data.
- Validate table row counts for empty vs. populated states.
- Verify dialog content accuracy against mocked response.
- Test approve/reject flows with confirmation dialogs.
- Assert button state changes during loading (disabled, text "Approving...").

Quick links

- Page: [html/restaurants.html](html/restaurants.html)
- Test plan: [specs/restaurants.testplan.md](specs/restaurants.testplan.md)
- Script: [js/restaurants.js](js/restaurants.js)
