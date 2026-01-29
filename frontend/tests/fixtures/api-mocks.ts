import { Page } from "@playwright/test";

/**
 * API Mock Fixtures
 * Provides reusable route interception for common API endpoints
 */

export const apiMocks = {
  /**
   * Mock authentication endpoints
   */
  mockAuthEndpoints: async (page: Page) => {
    // Mock login endpoint
    await page.route("**/api/auth/signin", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          token: "mock-jwt-token",
          user: {
            id: "user-123",
            email: "amit.guide@gmail.com",
            name: "Amit Guide",
          },
        }),
      });
    });

    // Mock logout endpoint
    await page.route("**/api/auth/logout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock me/profile endpoint
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "user-123",
          email: "amit.guide@gmail.com",
          name: "Amit Guide",
          role: "guide",
        }),
      });
    });
  },

  /**
   * Mock guide data endpoints
   */
  mockGuideEndpoints: async (page: Page) => {
    // Mock get all guides
    await page.route("**/api/guides", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          guides: [
            {
              id: "guide-1",
              name: "Amit Guide",
              email: "amit.guide@gmail.com",
              bio: "Experienced travel guide",
              profilePicture: "/avatar.jpg",
              status: "APPROVED",
            },
          ],
        }),
      });
    });

    // Mock get guide profile
    await page.route("**/api/guides/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "guide-1",
          name: "Amit Guide",
          email: "amit.guide@gmail.com",
          bio: "Experienced travel guide",
          profilePicture: "/avatar.jpg",
          status: "APPROVED",
          experience: "5+ years",
          languages: ["English", "Hindi"],
        }),
      });
    });
  },

  /**
   * Mock seed/test endpoints
   */
  mockSeedEndpoints: async (page: Page) => {
    await page.route("**/api/test/seed-guide", async (route) => {
      const body = route.request().postDataJSON() as any;
      const state = body.data?.state || "APPROVED";

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: `Guide state set to ${state}`,
          userId: body.data?.userId,
          state: state,
        }),
      });
    });
  },

  /**
   * Mock all common endpoints at once
   */
  mockAllEndpoints: async (page: Page) => {
    await apiMocks.mockAuthEndpoints(page);
    await apiMocks.mockGuideEndpoints(page);
    await apiMocks.mockSeedEndpoints(page);
  },
};
