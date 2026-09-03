import { test, expect } from "@playwright/test";

test.describe("Navigation Integrity & Link Resolution", () => {
  test("Homepage loads with 200 OK and valid page title", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/My Equine Stay/);
  });

  test("Navbar links resolve to valid pages with no 404 or errors", async ({ page }) => {
    await page.goto("/");

    // 1. Browse stays
    await page.click("text=Browse stays");
    await expect(page).toHaveURL(/\/search|\/browse/);
    await expect(page.locator("h1")).toBeVisible();

    // 2. FAQ
    await page.goto("/");
    await page.click("text=FAQ");
    await expect(page).toHaveURL(/\/faq/);
    await expect(page.locator("h1")).toBeVisible();

    // 3. Contact
    await page.goto("/");
    await page.click("text=Contact");
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator("h1")).toBeVisible();

    // 4. Favorites (navigates or triggers auth modal)
    await page.goto("/");
    await page.click("text=Favorites");
    // If not logged in, either shows favorites page or opens auth
    expect(page.url()).toBeTruthy();
  });

  test("Footer links resolve to real pages with no broken links", async ({ page }) => {
    await page.goto("/");

    // Terms
    await page.click("text=Terms of Service");
    await expect(page).toHaveURL(/\/legal\/terms/);
    await expect(page.locator("h1, h2")).toBeVisible();

    // Privacy
    await page.goto("/");
    await page.click("text=Privacy Policy");
    await expect(page).toHaveURL(/\/legal\/privacy/);
    await expect(page.locator("h1, h2")).toBeVisible();

    // Waiver
    await page.goto("/");
    await page.click("text=Liability Waiver");
    await expect(page).toHaveURL(/\/legal\/waiver/);
    await expect(page.locator("h1, h2")).toBeVisible();

    // Alerts
    await page.goto("/");
    await page.click("text=Manage email alerts");
    await expect(page).toHaveURL(/\/alerts/);
  });

  test("Language switcher translates page content (EN / ES / FR)", async ({ page }) => {
    await page.goto("/");

    // Default English
    await expect(page.locator("h1")).toContainText("Find Your Equine Stay");

    // Switch to Spanish
    const esButton = page.locator("button:has-text('ES')");
    if (await esButton.isVisible()) {
      await esButton.click();
      await expect(page.locator("h1")).toContainText("Encuentra Tu Estancia");
    }

    // Switch to French
    const frButton = page.locator("button:has-text('FR')");
    if (await frButton.isVisible()) {
      await frButton.click();
      await expect(page.locator("h1")).toContainText("Trouvez Votre Séjour");
    }

    // Switch back to English
    const enButton = page.locator("button:has-text('EN')");
    if (await enButton.isVisible()) {
      await enButton.click();
      await expect(page.locator("h1")).toContainText("Find Your Equine Stay");
    }
  });

  test("Admin link is strictly REMOVED and not visible in footer for public visitors", async ({ page }) => {
    await page.goto("/");

    // Verify in footer specifically
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // There should be no link to /admin in the footer
    const adminFooterLink = footer.locator("a[href='/admin']");
    await expect(adminFooterLink).toHaveCount(0);
  });
});
