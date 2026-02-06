import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('home button has aria-label on breath page', async ({ page }) => {
    await page.goto('/breath');
    const homeBtn = page.locator('a[href="/"]');
    await expect(homeBtn).toHaveAttribute('aria-label', 'ホームへもどる');
  });

  test('home button has aria-label on grounding page', async ({ page }) => {
    await page.goto('/grounding');
    const homeBtn = page.locator('a[href="/"]');
    await expect(homeBtn).toHaveAttribute('aria-label', 'ホームへもどる');
  });

  test('grounding inputs have accessible labels', async ({ page }) => {
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Wait for hydration - ensure the start screen is fully interactive
    const startBtn = page.locator('[data-testid="grounding-start-btn"]');
    await expect(startBtn).toBeVisible();

    // Start session and wait for step screen
    await startBtn.click();
    const stepScreen = page.locator('[data-testid="grounding-screen-step"]');
    await expect(stepScreen).toBeVisible();

    const firstInput = page.locator('[data-testid="grounding-input-sight-0"]');
    await expect(firstInput).toBeVisible();

    // Check that inputs have associated labels
    const inputId = await firstInput.getAttribute('id');
    expect(inputId).toBeTruthy();

    // Label should reference the input
    const label = page.locator(`label[for="${inputId}"]`);
    await expect(label).toBeAttached();
  });

  test('grounding validation error has proper ARIA attributes', async ({ page }) => {
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Wait for hydration
    const startBtn = page.locator('[data-testid="grounding-start-btn"]');
    await expect(startBtn).toBeVisible();

    await startBtn.click();

    // Wait for step screen to fully render
    const stepScreen = page.locator('[data-testid="grounding-screen-step"]');
    await expect(stepScreen).toBeVisible();

    const nextBtn = page.locator('[data-testid="grounding-next-btn"]');
    await expect(nextBtn).toBeVisible();

    // Submit empty to trigger error
    await nextBtn.click();

    const error = page.locator('[data-testid="grounding-validation-error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute('role', 'alert');
    await expect(error).toHaveAttribute('aria-live', 'assertive');

    // Inputs should reference the error
    const firstInput = page.locator('[data-testid="grounding-input-sight-0"]');
    await expect(firstInput).toHaveAttribute('aria-invalid', 'true');
    await expect(firstInput).toHaveAttribute('aria-describedby', 'grounding-validation-error');
  });

  test('grounding step form has fieldset with legend', async ({ page }) => {
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    const startBtn = page.locator('[data-testid="grounding-start-btn"]');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Wait for step screen
    const stepScreen = page.locator('[data-testid="grounding-screen-step"]');
    await expect(stepScreen).toBeVisible();

    // Fieldset and legend should exist
    const fieldset = stepScreen.locator('fieldset');
    await expect(fieldset).toBeAttached();

    const legend = fieldset.locator('legend');
    await expect(legend).toBeAttached();
  });

  test('touch target sizes meet minimum 44x44', async ({ page }) => {
    await page.goto('/');

    // Check breath card size
    const breathCard = page.locator('a[href="/breath"]');
    const breathBox = await breathCard.boundingBox();
    expect(breathBox).toBeTruthy();
    expect(breathBox!.width).toBeGreaterThanOrEqual(44);
    expect(breathBox!.height).toBeGreaterThanOrEqual(44);

    // Check grounding card size
    const groundingCard = page.locator('a[href="/grounding"]');
    const groundingBox = await groundingCard.boundingBox();
    expect(groundingBox).toBeTruthy();
    expect(groundingBox!.width).toBeGreaterThanOrEqual(44);
    expect(groundingBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('touch target on home button meets minimum 44x44', async ({ page }) => {
    await page.goto('/breath');

    const homeBtn = page.locator('a[href="/"]');
    const box = await homeBtn.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('breath controls have sufficient touch target size', async ({ page }) => {
    await page.goto('/breath');

    // Wait for app to render
    await page.locator('[data-testid="breath-app"]').waitFor({ state: 'visible' });

    const startBtn = page.locator('[data-testid="breath-start-btn"]');
    const startBox = await startBtn.boundingBox();
    expect(startBox).toBeTruthy();
    expect(startBox!.width).toBeGreaterThanOrEqual(44);
    expect(startBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('prefers-reduced-motion is respected for grounding animations', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Wait for hydration
    const startBtn = page.locator('[data-testid="grounding-start-btn"]');
    await expect(startBtn).toBeVisible();

    await startBtn.click();

    // Wait for step screen
    const stepScreen = page.locator('[data-testid="grounding-screen-step"]');
    await expect(stepScreen).toBeVisible();

    // Verify the page is functional (no animation-related crashes)
    await expect(page.locator('[data-testid="grounding-input-sight-0"]')).toBeVisible();
  });

  test('prefers-reduced-motion is respected for breath page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/breath');

    await page.locator('[data-testid="breath-app"]').waitFor({ state: 'visible' });

    // Start breathing - should work fine with reduced motion
    await page.locator('[data-testid="breath-start-btn"]').click();

    // Verify the page is functional
    await expect(page.locator('[data-testid="breath-instruction"]')).toBeVisible();
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Wait for hydration
    await page.locator('[data-testid="grounding-app"]').waitFor({ state: 'visible' });

    // Tab to the start button
    await page.keyboard.press('Tab');

    // Check that focus is on an element (focus ring)
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('html lang attribute matches locale', async ({ page }) => {
    // Japanese
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('html')).toHaveAttribute('data-locale', 'ja');
  });
});

test.describe('Accessibility - English locale', () => {
  test.use({
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en' },
  });

  test('html lang attribute is en for English locale', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('data-locale', 'en');
  });

  test('home button aria-label in English', async ({ page }) => {
    await page.goto('/breath');
    const homeBtn = page.locator('a[href="/"]');
    await expect(homeBtn).toHaveAttribute('aria-label', 'Back to Home');
  });
});
