// tests/auth.setup.ts
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:5173/loginsignup");
  await page.getByPlaceholder(/email/i).fill("amit.guide@gmail.com");
  await page.getByPlaceholder(/password/i).fill("Test@1234");
  await page.getByRole("button", { name: /Sign In/i }).click();

  await page.waitForURL("http://localhost:5173/");
  await page.getByRole("button", { name: /Get Started/i }).click();
  await page.waitForURL("**/guide");

  // Save the logged-in state to a file
  await page.context().storageState({ path: authFile });
});
