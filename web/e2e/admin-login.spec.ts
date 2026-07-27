import { expect, test } from "@playwright/test";

test.describe("Admin login", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    // The auth middleware should redirect /admin/* to /admin/login
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("login page has email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel(/correo|email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible();
  });

  test("login page has a submit button", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("button", { name: /ingresar|entrar|iniciar/i })).toBeVisible();
  });
});
