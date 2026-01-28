# guides.html — Page Documentation

Title: JourneyCraft - Approve Guides

Purpose

- Admin interface for reviewing and managing guide profiles: a Pending Approval list, an All Guides list, and a details dialog.

Structure

- Sidebar (site navigation)
  - Links: Dashboard, Guides (active), Restaurants, Street Locations

- Main content
  - Page heading: "Guide Management"
  - Two sections in `.management-grid`:
    - Pending Approval
      - Table id: `#unapprovedGuideTable`
      - Columns: Name, Bio, Phone, Actions
    - All Guides
      - Table id: `#approvedGuideTable`
      - Columns: Name, Phone, Actions

- Dialog overlay
  - Container id: `#guideDialog`
  - Dialog fields (span ids):
    - `#dialog-guide-name`
    - `#dialog-guide-bio`
    - `#dialog-guide-phone`
    - `#dialog-guide-email`
    - `#dialog-guide-experience`
    - `#dialog-guide-languages`
  - Dialog footer id: `#guideDialogFooter`
  - Close button triggers `closeDialog('guideDialog')`

Scripts & Styles

- Stylesheet: `../css/style.css`
- Script: `../js/guide.js` — populates tables and wires actions (view/approve/reject/etc.).

Selectors (for automation)

- `#unapprovedGuideTable` — pending rows: `tbody tr`
- `#approvedGuideTable` — approved rows: `tbody tr`
- Row action buttons: locate within a row's `td` in the `Actions` column
- `#guideDialog` — overlay visibility and presence
- Dialog field checks: `#dialog-guide-name`, `#dialog-guide-bio`, `#dialog-guide-phone`, `#dialog-guide-email`, `#dialog-guide-experience`, `#dialog-guide-languages`

Notes for test automation

- Prefer mocking or intercepting data population from `guide.js` (if it fetches an API) or override its runtime data array for deterministic tests.
- Validate both empty and populated states for each table.
- Verify that approving a guide moves it from `#unapprovedGuideTable` to `#approvedGuideTable` (if implemented client-side).
- Test dialog open/close, content correctness, and footer actions.

Quick links

- Page: [html/guides.html](html/guides.html)
- Test plan: [specs/guides.testplan.md](specs/guides.testplan.md)
  npx playwright test tests/guides.spec.ts
