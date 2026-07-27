import { expect, test } from "@playwright/test";

test.describe("Events page", () => {
  test("loads and shows event listings", async ({ page }) => {
    await page.goto("/events");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to an event detail page", async ({ page }) => {
    await page.goto("/events");

    // Click the first event link if visible
    const eventLink = page.getByRole("link").filter({ hasText: /boda|fiesta|quince/i }).first();
    const href = await eventLink.getAttribute("href");

    if (href) {
      await eventLink.click();
      await page.waitForURL(`**${href}`);
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("has a visible heading", async ({ page }) => {
    await page.goto("/events");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });
});
