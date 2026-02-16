import { test, expect } from '../fixtures';

test.describe('i18n - Japanese locale', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: {
      'Accept-Language': 'ja',
    },
  });

  test('index page shows Japanese text', async ({ homePage, page }) => {
    // Arrange & Act
    await homePage.goto();

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(homePage.tagline).toBeVisible();
    await expect(homePage.breathCard).toBeVisible();
    await expect(homePage.groundingCard).toBeVisible();
  });

  test('breath page shows Japanese text', async ({ breathPage, page }) => {
    // Arrange & Act
    await breathPage.goto();

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(breathPage.instruction).toContainText('準備ができたら開始');
    await expect(breathPage.startBtn).toBeVisible();
  });

  test('grounding page shows Japanese text', async ({ groundingPage, page }) => {
    // Arrange & Act
    await groundingPage.goto();

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(groundingPage.app).toBeVisible();
    await expect(groundingPage.startBtn).toHaveText('はじめる');
  });
});

test.describe('i18n - English locale', () => {
  test.use({
    locale: 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': 'en',
    },
  });

  test('index page shows English text', async ({ page }) => {
    // Arrange & Act
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Tools to calm your mind')).toBeVisible();
    await expect(page.getByText('Deep Breathing')).toBeVisible();
    await expect(page.getByText('Grounding')).toBeVisible();
  });

  test('breath page shows English text', async ({ page }) => {
    // Arrange & Act
    await page.goto('/breath');
    await page.waitForLoadState('networkidle');

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Ready when you are')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('grounding page shows English text', async ({ page }) => {
    // Arrange & Act
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Assert
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-testid="grounding-app"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });
});
