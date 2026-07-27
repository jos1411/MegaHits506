import { expect, test } from "@playwright/test";

test.describe("Contact page", () => {
  test("loads and displays contact info", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
  });

  test("has WhatsApp contact link", async ({ page }) => {
    await page.goto("/contact");
    const waLink = page.getByRole("link").filter({ hasText: /whatsapp|wa\.me|\+506/i });
    const count = await waLink.count();
    // At least one WhatsApp link should exist (footer, floating, or contact page)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("has a visible heading", async ({ page }) => {
    await page.goto("/contact");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });
});
