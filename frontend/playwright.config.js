import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // This tells Playwright to run auth setup first
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        baseURL: "http://localhost:5173",
        storageState: "playwright/.auth/user.json", // ✅ THIS IS THE KEY
      },
      dependencies: ["setup"],
    },
  ],
});
