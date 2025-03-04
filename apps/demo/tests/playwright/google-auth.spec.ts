import { chromium, expect, test } from "@playwright/test";

const userLogin = process.env.TEST_USER_EMAIL || "";
const userPass = process.env.TEST_USER_PASS || "";

test.describe("google oauth", () => {
  test("can log in", async ({}) => {
    test.setTimeout(120_000);

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      storageState: "tests/playwright/.auth/storage.json", // Load previous state if exists
    });
    const page = await context.newPage();

    await page.goto("http://127.0.0.1:3000/auth");

    if (await page.isVisible("text=Log out")) {
      console.log("Already logged in");
      return;
    }

    await page.getByTestId("google-login-button").click();

    // Wait for Google OAuth to redirect back to the app
    await page.waitForURL("**/consent", { timeout: 60000 });

    // Save storage state after login
    console.log("Saving storage state...");
    await context.storageState({ path: "tests/playwright/.auth/storage.json" });

    await browser.close();
  });
});
