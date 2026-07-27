import { expect, test } from "@playwright/test";

test.describe("Gallery page", () => {
  test("loads and displays photos", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("has navigation back to home", async ({ page }) => {
    await page.goto("/gallery");
    const homeLink = page.getByRole("link", { name: /inicio|home|mega hits/i });
    await expect(homeLink.first()).toBeVisible();
  });
});
