# Guide Component Test Plan

## Application Overview


The Guide component is a React-based profile management system for tour guides in the JourneyCraft application. It allows guides to create, view, and update their professional profiles including personal details, experience, languages, location coordinates, and license information. The component handles three states: no profile (creation), profile pending approval, and approved profile (with update capability). It includes form validation, API integration, authentication, and a profile viewing modal.


## Test Scenarios

### 1. Guide Profile Creation Flow

**Seed:** `tests/seed.spec.ts`

#### 1.1. Create new guide profile with all valid information

**File:** `tests/guide/create-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE role with no existing profile
  2. Click on the 'Create Profile' button
  3. Verify the form modal appears with all required fields
  4. Fill in 'Guide name' field with 'John Smith'
  5. Fill in 'Experience' field with '5'
  6. Fill in 'Language' field with 'English'
  7. Fill in 'Bio' field with 'Experienced tour guide with deep knowledge of local culture and history.'
  8. Fill in 'Latitude' field with '40.7128'
  9. Fill in 'Longitude' field with '-74.0060'
  10. Fill in 'License Number' field with 'LIC123456789'
  11. Fill in 'Phone No' field with '9876543210'
  12. Verify 'isAvailable' checkbox is checked (default state)
  13. Click the 'Add Guide' submit button
  14. Verify success toast message 'Guide Under Consideration' appears
  15. Verify form modal closes automatically
  16. Verify header text changes to 'Your Profile Is Under Consideration'

**Expected Results:**
  - Guide profile is created successfully on the backend
  - Toast notification confirms creation status
  - UI updates to show pending approval state
  - All form data is preserved in component state

#### 1.2. Validate required field validation on form submission

**File:** `tests/guide/form-validation.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no existing profile
  2. Click 'Create Profile' button to open the form
  3. Leave the 'Guide name' field empty
  4. Click the 'Add Guide' submit button without filling required fields
  5. Verify error message appears under 'Guide name' field: 'Guide name is required'
  6. Verify the form is not submitted and remains visible
  7. Leave 'Experience' field empty
  8. Verify error message appears: 'Experience is required'
  9. Leave 'Language' field empty
  10. Verify error message appears: 'Language is required'
  11. Leave 'Bio' field empty
  12. Verify error message appears: 'Bio is required'
  13. Leave 'Phone No' field empty
  14. Verify error message appears: 'Phone number is required'
  15. Leave 'License Number' field empty
  16. Verify error message appears: 'License number is required'

**Expected Results:**
  - All required field validations work correctly
  - Error messages display under their respective fields
  - Form submission is blocked when required fields are empty
  - User can identify which fields need to be filled

#### 1.3. Validate field format constraints

**File:** `tests/guide/field-constraints.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no existing profile
  2. Click 'Create Profile' button to open the form
  3. Fill 'Guide name' with 'John'
  4. Fill 'Experience' with '-5' (negative number)
  5. Click submit button
  6. Verify error message: 'Experience cannot be negative'
  7. Clear 'Experience' field and enter '10'
  8. Fill 'Bio' with 'Short' (less than 10 characters)
  9. Click submit button
  10. Verify error message: 'Bio must be at least 10 characters'
  11. Fill 'Bio' with 'I am a professional tour guide with years of experience'
  12. Fill 'Latitude' with '95' (out of range)
  13. Click submit button
  14. Verify error message: 'Latitude must be between -90 and 90'
  15. Fill 'Latitude' with '40.7128'
  16. Fill 'Longitude' with '-200' (out of range)
  17. Click submit button
  18. Verify error message: 'Longitude must be between -180 and 180'
  19. Fill 'Longitude' with '-74.0060'
  20. Fill 'Phone No' with '123' (less than 10 digits)
  21. Click submit button
  22. Verify error message: 'Phone number must be exactly 10 digits'
  23. Fill 'Phone No' with '9876543210' (valid 10 digits)

**Expected Results:**
  - Experience field rejects negative values
  - Bio field enforces minimum character length
  - Latitude field enforces range constraints
  - Longitude field enforces range constraints
  - Phone number field enforces exactly 10 digits
  - All validation messages are clear and specific

#### 1.4. Cancel form submission during creation

**File:** `tests/guide/cancel-form.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no existing profile
  2. Click 'Create Profile' button
  3. Fill in all form fields with valid data
  4. Click the 'Cancel' button
  5. Verify form modal closes
  6. Verify header shows 'Create Your Guide Profile' again
  7. Verify 'Create Profile' button is visible again

**Expected Results:**
  - Form closes without submitting data
  - Component returns to initial state
  - No changes are made to the profile
  - Cancel button properly resets form visibility state

### 2. Guide Profile Update Flow

**Seed:** `tests/seed.spec.ts`

#### 2.1. Update approved guide profile with new information

**File:** `tests/guide/update-approved-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with an approved profile (guidename: 'John Doe', experience: '3', phoneNo: '9999999999')
  2. Verify header shows 'Update Your Guide Profile'
  3. Verify 'Update Profile' button is visible
  4. Verify 'View Profile' button is visible
  5. Click 'Update Profile' button to open the form
  6. Verify form fields are pre-populated with existing guide data
  7. Change 'Guide name' from 'John Doe' to 'John Doe Updated'
  8. Change 'Experience' from '3' to '5'
  9. Change 'Phone No' from '9999999999' to '8888888888'
  10. Click 'Update Guide' submit button
  11. Verify success toast message 'Guide Updated' appears
  12. Verify form modal closes

**Expected Results:**
  - Guide profile is updated successfully on the backend
  - Toast notification confirms update status
  - Form pre-fills with current profile data
  - Changes are persisted in component state
  - Form submission button shows 'Update Guide' text

#### 2.2. Validate that profile updates mark approval as false

**File:** `tests/guide/update-clears-approval.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with an approved profile
  2. Click 'Update Profile' button
  3. Change 'Guide name' field with new text
  4. Click 'Update Guide' submit button
  5. Verify success toast appears
  6. Verify the component state is updated with new values
  7. Verify 'approved' field is set to false in the submitted data

**Expected Results:**
  - Profile updates trigger re-submission for approval
  - Guide profile returns to pending approval state after update
  - Backend receives approved: false in the update request

#### 2.3. Cancel update without saving changes

**File:** `tests/guide/cancel-update.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with an approved profile (phoneNo: '9999999999')
  2. Click 'Update Profile' button
  3. Change 'Phone No' field to '8888888888'
  4. Click 'Cancel' button
  5. Verify form modal closes
  6. Click 'Update Profile' button again
  7. Verify 'Phone No' still shows '9999999999' (original value)

**Expected Results:**
  - Cancel discards all unsaved changes
  - Original profile data is preserved
  - Form closes without submitting
  - Component maintains original state

### 3. Guide Profile View Flow

**Seed:** `tests/seed.spec.ts`

#### 3.1. View pending profile details in modal

**File:** `tests/guide/view-pending-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with a pending approval profile
  2. Profile contains: guidename='Alice Johnson', experience='4', language='French', bio='Expert guide', latitude='48.8566', longitude='2.3522', licenseNumber='FRA987654', phoneNo='5555555555', isAvailable=true
  3. Click 'View Profile' button
  4. Verify profile modal appears with heading '🧭 Guide Profile'
  5. Verify modal displays all profile information in grid format
  6. Verify 'Name' shows 'Alice Johnson'
  7. Verify 'Experience' shows '4 years'
  8. Verify 'Language' shows 'French'
  9. Verify 'Phone No' shows '+91 5555555555'
  10. Verify 'Latitude' shows '48.8566'
  11. Verify 'Longitude' shows '2.3522'
  12. Verify 'License No' shows 'FRA987654'
  13. Verify 'Available' shows 'Yes' with green styling
  14. Click 'Close Profile' button
  15. Verify modal closes and background is no longer blurred

**Expected Results:**
  - Profile modal displays all guide information correctly
  - Data formatting is correct (e.g., phone with +91 prefix, years suffix)
  - Availability status shows with appropriate styling
  - Modal closes properly on button click
  - Modal backdrop blur effect is applied

#### 3.2. View approved profile details

**File:** `tests/guide/view-approved-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with an approved profile
  2. Profile contains: isAvailable=false
  3. Click 'View Profile' button
  4. Verify modal appears
  5. Verify 'Available' field displays 'No' with red styling (text-red-700 bg-red-100)
  6. Close the profile modal

**Expected Results:**
  - Profile modal correctly displays availability status
  - False availability shows with red background styling
  - All profile data is correctly formatted and displayed

#### 3.3. View profile from both pending and approved states

**File:** `tests/guide/view-profile-state-transitions.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with a pending profile
  2. Click 'View Profile' button
  3. Verify profile modal shows pending profile data
  4. Close the modal
  5. Simulate backend approval by updating component state to approved=true
  6. Click 'View Profile' button again
  7. Verify modal shows the same profile information
  8. Verify both 'Update Profile' and 'View Profile' buttons are now visible

**Expected Results:**
  - View Profile button works in both pending and approved states
  - Profile data displays consistently regardless of approval status
  - Modal can be opened and closed multiple times without issues

### 4. Authentication and Navigation

**Seed:** `tests/seed.spec.ts`

#### 4.1. Logout functionality from guide profile

**File:** `tests/guide/logout.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with any profile state
  2. Verify logout button is visible (red button with LogOut icon)
  3. Click the 'Logout' button
  4. Verify user is redirected to home page ('/')
  5. Verify success toast message 'Logged out successfully!' appears
  6. Verify Redux auth state is cleared (logout action dispatched)

**Expected Results:**
  - User is successfully logged out
  - User is redirected to landing page
  - Success notification is displayed
  - Auth state is cleared from Redux store
  - User cannot access guide page after logout

#### 4.2. Protected route access for guide profile

**File:** `tests/guide/protected-route.spec.ts`

**Steps:**
  1. User attempts to access /guide route without authentication
  2. Verify user is redirected to login page
  3. User attempts to access /guide with RESTAURANT role
  4. Verify user is not allowed access and redirected
  5. User logs in as GUIDE role
  6. Navigate to /guide route
  7. Verify Guide component loads successfully

**Expected Results:**
  - Unauthenticated users cannot access guide profile page
  - Users with wrong role cannot access guide profile page
  - Only authenticated GUIDE users can access the component
  - ProtectedRoute component works correctly

### 5. Profile State Management

**Seed:** `tests/seed.spec.ts`

#### 5.1. Initial load fetches guide profile from API

**File:** `tests/guide/profile-fetch.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with userId='12345'
  2. Component mounts and useEffect hook executes
  3. Verify API call is made to 'http://127.0.0.1:9000/api/guides/guide/12345'
  4. API returns guide profile with all data
  5. Verify guide state is updated with returned data
  6. Verify component displays 'Update Your Guide Profile' or 'Your Profile Is Under Consideration' based on approval

**Expected Results:**
  - Guide profile is fetched on component mount
  - API endpoint is called with correct userId
  - Component state updates with fetched profile data
  - UI reflects the current profile state

#### 5.2. Handle API error when fetching profile

**File:** `tests/guide/profile-fetch-error.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE
  2. Mock API to return error (500, network error, etc.)
  3. Component mounts and attempts to fetch profile
  4. Verify error is logged to console
  5. Verify component remains functional with guide state as null
  6. Verify 'Create Profile' button is shown
  7. User can still use the form to create a profile

**Expected Results:**
  - Error is handled gracefully without crashing the app
  - Error is logged for debugging
  - Component shows default state (create profile)
  - User can still proceed with profile creation

#### 5.3. Form submission with API call

**File:** `tests/guide/form-submission-api.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with userId='12345' and no profile
  2. Click 'Create Profile' button
  3. Fill all form fields with valid data
  4. Click 'Add Guide' button
  5. Verify API POST call is made to 'http://127.0.0.1:9000/api/guides/register/guide/12345'
  6. Verify all form values are included in the request body
  7. Verify 'approved: false' is set in the request
  8. API returns 201 status
  9. Verify success toast shows 'Guide Under Consideration'
  10. Verify form closes and guide state is updated

**Expected Results:**
  - Form data is submitted to correct API endpoint
  - Request includes all form fields and approved: false
  - Success response triggers appropriate UI updates
  - Toast notification confirms submission

#### 5.4. Form update with API call for approved profile

**File:** `tests/guide/form-update-api.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with userId='12345' and an approved profile
  2. Click 'Update Profile' button
  3. Modify the form data
  4. Click 'Update Guide' button
  5. Verify API PUT call is made to 'http://127.0.0.1:9000/api/guides/update/12345'
  6. Verify form values are included in request body
  7. Verify 'approved: false' is set (resets approval on update)
  8. API returns 200 status
  9. Verify success toast shows 'Guide Updated'
  10. Verify form closes

**Expected Results:**
  - Update uses PUT method to correct endpoint
  - Update includes userId in URL path
  - approved field is set to false for revalidation
  - Success response updates component state

#### 5.5. Handle API error during form submission

**File:** `tests/guide/form-submission-error.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE
  2. Click 'Create Profile' button
  3. Fill all form fields with valid data
  4. Mock API to return error (500, network error, etc.)
  5. Click 'Add Guide' button
  6. Verify error toast 'Failed to submit guide profile' appears
  7. Verify form remains open for user to retry
  8. Verify guide state is not updated with invalid data

**Expected Results:**
  - API errors are caught and handled
  - User receives error notification
  - Form remains open to allow retry
  - Component state is not corrupted on error

### 6. UI and UX Flow

**Seed:** `tests/seed.spec.ts`

#### 6.1. UI displays correct buttons for user with no profile

**File:** `tests/guide/ui-no-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no profile
  2. Verify page displays background gradient (blue-100 to white)
  3. Verify header text shows 'Create Your Guide Profile'
  4. Verify 'Create Profile' button is visible and clickable
  5. Verify 'Logout' button is visible and clickable
  6. Verify 'Update Profile' button is NOT visible
  7. Verify 'View Profile' button is NOT visible

**Expected Results:**
  - UI correctly displays create mode
  - Only relevant buttons are shown
  - Header text matches user state
  - Layout is properly styled

#### 6.2. UI displays correct buttons for pending profile

**File:** `tests/guide/ui-pending-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with a pending profile (approved=false)
  2. Verify header text shows 'Your Profile Is Under Consideration'
  3. Verify 'Create Profile' button is NOT visible
  4. Verify 'Update Profile' button is NOT visible
  5. Verify 'View Profile' button is visible
  6. Verify 'Logout' button is visible

**Expected Results:**
  - UI correctly displays pending approval state
  - Update functionality is hidden until approval
  - User can only view their profile in pending state
  - Logout is always available

#### 6.3. UI displays correct buttons for approved profile

**File:** `tests/guide/ui-approved-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with an approved profile (approved=true)
  2. Verify header text shows 'Update Your Guide Profile'
  3. Verify 'Create Profile' button is NOT visible
  4. Verify 'Update Profile' button is visible and clickable
  5. Verify 'View Profile' button is visible and clickable
  6. Verify 'Logout' button is visible and clickable
  7. Verify all buttons have proper styling and hover effects

**Expected Results:**
  - UI correctly displays approved state
  - Full functionality available to approved guides
  - User can update and view profile
  - Buttons have appropriate visual feedback

#### 6.4. Form loading state during submission

**File:** `tests/guide/form-loading-state.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE without profile
  2. Click 'Create Profile' button
  3. Fill all form fields with valid data
  4. Click 'Add Guide' button
  5. Verify submit button shows 'Submitting...' while request is in progress
  6. Verify submit button is disabled during submission
  7. API completes successfully
  8. Verify button text returns to 'Add Guide'
  9. Verify button is enabled again (form closed)

**Expected Results:**
  - Loading state provides user feedback
  - Submit button is disabled during processing
  - Button text changes to indicate pending action
  - UI returns to normal state after completion

### 7. Edge Cases and Error Scenarios

**Seed:** `tests/seed.spec.ts`

#### 7.1. Handle rapidly opening and closing form modal

**File:** `tests/guide/rapid-form-toggle.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no profile
  2. Click 'Create Profile' button
  3. Immediately click 'Cancel' button
  4. Verify form closes
  5. Click 'Create Profile' button again immediately
  6. Verify form opens with clean state (all fields empty)
  7. Repeat process 5 times

**Expected Results:**
  - Form state is properly reset on each open
  - No stale data appears in form fields
  - Component handles rapid toggling without errors

#### 7.2. Handle profile view modal closure in multiple ways

**File:** `tests/guide/profile-modal-closure.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with a profile
  2. Click 'View Profile' button to open modal
  3. Verify profile modal is displayed
  4. Click 'Close Profile' button
  5. Verify modal closes
  6. Click 'View Profile' button again
  7. Verify modal opens with correct data
  8. Click outside the modal (on backdrop)
  9. Verify modal closes (if backdrop click is enabled)

**Expected Results:**
  - Profile modal can be closed via button
  - Modal state is properly managed
  - Modal can be reopened multiple times
  - All closure methods work correctly

#### 7.3. Handle form submission while API is slow

**File:** `tests/guide/slow-api-submission.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no profile
  2. Click 'Create Profile' button
  3. Fill all form fields
  4. Mock API to be slow (5 second delay)
  5. Click 'Add Guide' button
  6. Verify button shows 'Submitting...' and is disabled
  7. Try to click submit button again (should not trigger multiple requests)
  8. Wait for API response
  9. Verify only one request was made
  10. Verify form closes on success

**Expected Results:**
  - Disabled submit button prevents duplicate submissions
  - Loading state is visible during slow requests
  - Only one API request is made per submission

#### 7.4. Handle profile with all optional fields empty

**File:** `tests/guide/minimal-profile.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no profile
  2. Click 'Create Profile' button
  3. Fill only required fields: guidename, experience, language, bio, licenseNumber, phoneNo
  4. Leave optional coordinate fields (latitude, longitude) empty
  5. Click 'Add Guide' button
  6. Verify form submission succeeds
  7. Verify success toast appears
  8. Verify form closes

**Expected Results:**
  - Form accepts submission with only required fields
  - Optional latitude/longitude fields can be left empty
  - Profile is created successfully with minimal data

#### 7.5. Phone number edge cases

**File:** `tests/guide/phone-validation-edge-cases.spec.ts`

**Steps:**
  1. User is logged in as a GUIDE with no profile
  2. Click 'Create Profile' button
  3. Try phone number '1234567890' (10 digits, valid format)
  4. Verify no validation error
  5. Try phone number '12345678901' (11 digits)
  6. Verify error: 'Phone number must be exactly 10 digits'
  7. Try phone number 'abcdefghij' (10 characters but not digits)
  8. Verify error: 'Phone number must be exactly 10 digits'
  9. Try phone number '123456789' (9 digits)
  10. Verify error: 'Phone number must be exactly 10 digits'
  11. Try phone number '1234 567890' (10 digits with space)
  12. Verify error: 'Phone number must be exactly 10 digits'

**Expected Results:**
  - Phone validation strictly enforces 10 digits
  - Non-numeric characters are rejected
  - Spaces break the validation
  - Error messages are clear about the requirement
