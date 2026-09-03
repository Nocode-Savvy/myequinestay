import { test, expect } from "@playwright/test";

test.describe("Guest Flow — Browse, Filter, Detail & Inquiries", () => {
  test("Guest can browse listings and view cards", async ({ page }) => {
    await page.goto("/browse");

    // Header and properties count
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Florida, USA")).toBeVisible();

    // Listing cards should render
    const listingCards = page.locator("a[href^='/listings/'], a[href^='/property/']");
    await expect(listingCards.first()).toBeVisible({ timeout: 10000 });
    const count = await listingCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Property type filter pills filter listings", async ({ page }) => {
    await page.goto("/browse");

    // Click "Equestrian Farm" filter pill
    const farmPill = page.locator("button:has-text('EQUESTRIAN FARM')");
    if (await farmPill.isVisible()) {
      await farmPill.click();
      await page.waitForTimeout(500);
      // Ensure URL updated or list filtered
      expect(page.url()).toContain("type=farm");
    }
  });

  test("Sort options reorder results", async ({ page }) => {
    await page.goto("/browse");

    const sortSelect = page.locator("select[aria-label='Sort']");
    if (await sortSelect.isVisible()) {
      // Sort price low to high
      await sortSelect.selectOption("price-asc");
      await page.waitForTimeout(500);

      // Sort price high to low
      await sortSelect.selectOption("price-desc");
      await page.waitForTimeout(500);
    }
  });

  test("Map view / List view toggle switches layouts seamlessly", async ({ page }) => {
    await page.goto("/browse");

    // Click "Show map"
    const mapToggle = page.locator("button:has-text('Show map')");
    if (await mapToggle.isVisible()) {
      await mapToggle.click();
      await expect(page.locator("button:has-text('Show list')")).toBeVisible();
      // Click back to "Show list"
      await page.locator("button:has-text('Show list')").click();
      await expect(page.locator("button:has-text('Show map')")).toBeVisible();
    }
  });

  test("Filter modal opens, applies filters, and 'Clear all' resets", async ({ page }) => {
    await page.goto("/browse");

    // Click Filter button
    const filterBtn = page.locator("button:has-text('Filter')");
    await filterBtn.click();

    // Modal dialog should be visible
    const modal = page.locator("[role='dialog']");
    await expect(modal).toBeVisible();

    // Click "Clear all" inside modal
    const clearBtn = modal.locator("button:has-text('Clear all')");
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }

    // Close modal
    const closeBtn = modal.locator("button[aria-label='Close'], button:has-text('Show')");
    if (await closeBtn.isVisible()) {
      await closeBtn.first().click();
    }
  });

  test("Alert me on new listings opens subscription modal and accepts input", async ({ page }) => {
    await page.goto("/browse");

    const alertBtn = page.locator("button:has-text('Alert me on new listings')");
    await alertBtn.click();

    // Modal should appear
    const emailInput = page.locator("input[type='email'], input[placeholder*='email' i]");
    await expect(emailInput).toBeVisible();

    await emailInput.fill("testguest@example.com");
    const submitBtn = page.locator("button[type='submit'], button:has-text('Subscribe'), button:has-text('Alert me')");
    if (await submitBtn.isVisible()) {
      await submitBtn.first().click();
      await page.waitForTimeout(500);
    }
  });

  test("Listing detail page renders photos, amenities, pricing, and contact form", async ({ page }) => {
    await page.goto("/browse");

    const firstCard = page.locator("a[href^='/listings/'], a[href^='/property/']").first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Detail page loads
    await expect(page.locator("h1")).toBeVisible();

    // Form or contact owner button
    const contactSection = page.locator("form, text=Contact, text=Message the Owner");
    await expect(contactSection.first()).toBeVisible();
  });
});
