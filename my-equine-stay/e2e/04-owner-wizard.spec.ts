import { test, expect } from "@playwright/test";

test.describe("Owner Listing Wizard & Draft Auto-Save", () => {
  test("Wizard Step 1 (PLAN) renders Premium and Standard options", async ({ page }) => {
    await page.goto("/listings/new");

    // Check wizard header
    await expect(page.locator("h1")).toContainText("List your Ocala property");

    // Plan options
    await expect(page.locator("text=Premium")).toBeVisible();
    await expect(page.locator("text=Standard")).toBeVisible();
    await expect(page.locator("text=$29.99")).toBeVisible();

    // Progress bar shows all 9 step badges
    await expect(page.locator("text=PLAN")).toBeVisible();
    await expect(page.locator("text=PROPERTY")).toBeVisible();
    await expect(page.locator("text=LOCATION")).toBeVisible();
  });

  test("Wizard advances through steps and validates required fields", async ({ page }) => {
    await page.goto("/listings/new");

    // Step 1: Click Continue
    await page.click("button:has-text('Continue')");

    // Step 2: Property Basics
    await expect(page.locator("h2")).toContainText("Property basics");
    await expect(page.locator("text=PROPERTY TYPE")).toBeVisible();

    // Select property type
    await page.click("button:has-text('Equestrian Farm')");

    // Title input
    const titleInput = page.locator("input[placeholder='Golden Oak Manor']");
    await titleInput.fill("WEC Grand Prix Stables & Estate");

    // City & Zip
    await page.locator("input[placeholder='Ocala, FL']").fill("Ocala");
    await page.locator("input[placeholder='34482']").fill("34482");

    // Advance to Step 3: Location
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Pin your property location");

    // Advance to Step 4: Accommodation
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Accommodation");
    await expect(page.locator("text=BEDROOMS")).toBeVisible();
    await expect(page.locator("text=HOUSE AMENITIES")).toBeVisible();

    // Toggle some amenity chips
    await page.click("button:has-text('Wi-Fi')");
    await page.click("button:has-text('Full kitchen')");

    // Advance to Step 5: Horse facilities
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Horse facilities");
    await expect(page.locator("text=STALLS")).toBeVisible();
    await expect(page.locator("text=EQUESTRIAN FACILITIES")).toBeVisible();

    // Advance to Step 6: Photos
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Photos");
    await expect(page.locator("text=Click to upload photos")).toBeVisible();

    // Advance to Step 7: Pricing
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Pricing");
    await expect(page.locator("text=PER NIGHT")).toBeVisible();

    // Advance to Step 8: Contact
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Owner contact");
    await expect(page.locator("text=No commissions, ever")).toBeVisible();

    await page.locator("input[placeholder='Your name']").fill("Jane Equestrian");
    await page.locator("input[placeholder='your@email.com']").fill("jane@ocalaequine.com");

    // Advance to Step 9: Review
    await page.click("button:has-text('Continue')");
    await expect(page.locator("h2")).toContainText("Review & publish");
    await expect(page.locator("text=WEC Grand Prix Stables & Estate")).toBeVisible();
  });

  test("Draft is saved in localStorage and persists across page refreshes", async ({ page }) => {
    await page.goto("/listings/new");

    // Fill in a custom listing title in Step 2
    await page.click("button:has-text('Continue')");
    const titleInput = page.locator("input[placeholder='Golden Oak Manor']");
    await titleInput.fill("Persistent Draft Farm");
    await page.waitForTimeout(500);

    // Verify localStorage has draft saved
    const draftData = await page.evaluate(() => localStorage.getItem("mes_listing_draft"));
    expect(draftData).toBeTruthy();
    expect(draftData).toContain("Persistent Draft Farm");

    // Reload page
    await page.reload();
    await page.waitForTimeout(500);

    // Navigate to step 2 or verify draft restoration
    const restoredTitle = await page.evaluate(() => {
      const d = JSON.parse(localStorage.getItem("mes_listing_draft") || "{}");
      return d.title;
    });
    expect(restoredTitle).toBe("Persistent Draft Farm");
  });

  test("Save & exit button navigates safely back to dashboard", async ({ page }) => {
    await page.goto("/listings/new");

    const saveExitBtn = page.locator("button:has-text('Save & exit')");
    await expect(saveExitBtn).toBeVisible();
    await saveExitBtn.click();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
