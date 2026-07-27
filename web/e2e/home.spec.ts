import { expect, test } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows the site name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("text=Mega Hits 506").first()).toBeVisible();
  });

  test("has navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /galería|gallery/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /eventos|events/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contacto|contact/i })).toBeVisible();
  });

  test("has WhatsApp floating button", async ({ page }) => {
    await page.goto("/");
    const waButton = page.getByLabel("Contactar por WhatsApp");
    await expect(waButton).toBeVisible();
  });
});
