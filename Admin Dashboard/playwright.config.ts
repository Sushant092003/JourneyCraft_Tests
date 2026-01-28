import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    headless: false,
    baseURL: "http://127.0.0.1:5501", // Live Server / HTML server
  },
});
