import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // REMOVE storageState from here (the global 'use' block)
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      // The setup project should NOT try to use the auth file
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // ADD storageState here ONLY for the main testing project
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
