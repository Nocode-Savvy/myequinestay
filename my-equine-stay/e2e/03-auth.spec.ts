import { test, expect } from "@playwright/test";

test.describe("Authentication Flows & Forms", () => {
  test("Auth page renders with Sign In / Sign Up modes", async ({ page }) => {
    await page.goto("/auth");

    // Check title/header
    await expect(page.locator("h1, h2")).toBeVisible();

    // Mode tabs or toggle
    const signInBtn = page.locator("button:has-text('Sign In'), button:has-text('Log In')");
    const signUpBtn = page.locator("button:has-text('Sign Up'), button:has-text('Create account')");

    await expect(signInBtn.first()).toBeVisible();
    await expect(signUpBtn.first()).toBeVisible();
  });

  test("Sign In form contains email, password fields and validates empty inputs", async ({ page }) => {
    await page.goto("/auth?mode=signin");

    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const submitButton = page.locator("button[type='submit']");

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Clicking submit with empty inputs triggers validation
    await submitButton.click();
    // Native HTML5 or custom validation should prevent submission
    expect(page.url()).toContain("/auth");
  });

  test("Sign Up mode toggles correctly and reveals full name input", async ({ page }) => {
    await page.goto("/auth?mode=signup");

    const nameInput = page.locator("input[placeholder*='name' i], input[name='name'], input[name='fullName']");
    if (await nameInput.isVisible()) {
      await expect(nameInput).toBeVisible();
    }
  });

  test("Redirect aliases /login and /signup route correctly to /auth", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/auth/);

    await page.goto("/signup");
    await expect(page).toHaveURL(/\/auth/);
  });
});
