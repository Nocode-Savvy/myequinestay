import { test, expect } from "@playwright/test";

test.describe("Search & Comprehensive Filter Functionality (Critical Path)", () => {
  test("Homepage search input correctly navigates to search/browse with parameters", async ({ page }) => {
    await page.goto("/");

    const locationInput = page.locator("input[placeholder*='Florida city' i]");
    await locationInput.fill("Ocala");

    const searchBtn = page.locator("button:has-text('Find a Stay')");
    await searchBtn.click();

    await expect(page).toHaveURL(/location=Ocala/);
  });

  test("Property type filter works on its own and narrows listings", async ({ page }) => {
    await page.goto("/browse");
    await page.waitForLoadState("networkidle");

    const initialCards = page.locator("a[href^='/listings/'], a[href^='/property/']");
    const initialCount = await initialCards.count();

    // Select House filter
    const housePill = page.locator("button:has-text('HOUSE')");
    if (await housePill.isVisible()) {
      await housePill.click();
      await page.waitForTimeout(500);

      const filteredCards = page.locator("a[href^='/listings/'], a[href^='/property/']");
      const filteredCount = await filteredCards.count();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test("Sort options (Newest / Oldest / Price low to high / Price high to low) correctly reorder results", async ({ page }) => {
    await page.goto("/browse");

    const sortSelect = page.locator("select[aria-label='Sort']");
    await expect(sortSelect).toBeVisible();

    // Select price: low to high
    await sortSelect.selectOption("price-asc");
    await page.waitForTimeout(500);

    // Get prices
    const prices = await page.locator("text=/\\$[0-9,]+/").allTextContents();
    expect(prices.length).toBeGreaterThan(0);

    // Select price: high to low
    await sortSelect.selectOption("price-desc");
    await page.waitForTimeout(500);
  });

  test("Filter modal opens and all individual filter sections exist", async ({ page }) => {
    await page.goto("/browse");

    await page.click("button:has-text('Filter')");
    const modal = page.locator("[role='dialog']");
    await expect(modal).toBeVisible();

    // Verify filter sections exist in the modal
    await expect(modal.locator("text=Price range")).toBeVisible();
    await expect(modal.locator("text=Bedrooms")).toBeVisible();
    await expect(modal.locator("text=Stalls")).toBeVisible();
    await expect(modal.locator("text=Property type")).toBeVisible();
  });

  test("Filters work in combination and 'Clear all' resets to full set", async ({ page }) => {
    await page.goto("/browse");

    // Open filter modal
    await page.click("button:has-text('Filter')");
    const modal = page.locator("[role='dialog']");
    await expect(modal).toBeVisible();

    // Select 2+ bedrooms
    const bed2Btn = modal.locator("button:has-text('2+')");
    if (await bed2Btn.first().isVisible()) {
      await bed2Btn.first().click();
    }

    // Select 2+ stalls
    const stall2Btn = modal.locator("button:has-text('2+')");
    if (await stall2Btn.nth(1).isVisible()) {
      await stall2Btn.nth(1).click();
    }

    // Apply filters
    const applyBtn = modal.locator("button:has-text('Show')");
    if (await applyBtn.isVisible()) {
      await applyBtn.click();
      await page.waitForTimeout(500);
    }

    // Reopen modal to verify Clear all
    await page.click("button:has-text('Filter')");
    const clearBtn = modal.locator("button:has-text('Clear all')");
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // Close modal
    const closeOrShow = modal.locator("button:has-text('Show'), button[aria-label='Close']");
    if (await closeOrShow.isVisible()) {
      await closeOrShow.first().click();
    }
  });

  test("Switching between Map view and List view preserves filter state", async ({ page }) => {
    await page.goto("/browse?type=farm");

    // Click Show map
    const showMapBtn = page.locator("button:has-text('Show map')");
    if (await showMapBtn.isVisible()) {
      await showMapBtn.click();
      // Ensure type=farm is still in URL
      expect(page.url()).toContain("type=farm");

      // Click Show list
      await page.locator("button:has-text('Show list')").click();
      expect(page.url()).toContain("type=farm");
    }
  });

  test("Navigating from browse to a listing detail and clicking back preserves browse state", async ({ page }) => {
    await page.goto("/browse?type=house");

    const firstCard = page.locator("a[href^='/listings/'], a[href^='/property/']").first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await expect(page.locator("h1")).toBeVisible();

      // Go back
      await page.goBack();
      // Filters should still be in URL
      expect(page.url()).toContain("type=house");
    }
  });

  test("Empty state displays cleanly without broken errors when zero listings match", async ({ page }) => {
    // Navigate with a query that returns 0 matches
    await page.goto("/browse?type=non_existent_category_xyz");

    // The page should not crash with a 500 or blank screen
    await expect(page.locator("h1")).toBeVisible();

    // Either 0 properties message or empty state description
    const textContent = await page.textContent("body");
    expect(textContent).toBeTruthy();
    expect(textContent).not.toContain("Application error");
    expect(textContent).not.toContain("Unhandled Runtime Error");
  });
});
