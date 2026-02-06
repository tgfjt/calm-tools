import { test, expect } from '@playwright/test';

test.describe('i18n - Japanese locale', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: {
      'Accept-Language': 'ja',
    },
  });

  test('index page shows Japanese text', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByText('心をしずかに整える道具箱')).toBeVisible();
    await expect(page.getByText('呼吸', { exact: true })).toBeVisible();
    await expect(page.getByText('54321', { exact: true }).first()).toBeVisible();
  });

  test('breath page shows Japanese text', async ({ page }) => {
    await page.goto('/breath');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByText('準備ができたら、はじめましょう')).toBeVisible();
    await expect(page.locator('[data-testid="breath-start-btn"]')).toHaveText('はじめる');
  });

  test('grounding page shows Japanese text', async ({ page }) => {
    await page.goto('/grounding');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByText('グラウンディング')).toBeVisible();
    await expect(page.locator('[data-testid="grounding-start-btn"]')).toHaveText('はじめる');
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
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('A quiet space for your mind')).toBeVisible();
    await expect(page.getByText('Breathe', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('54321', { exact: true }).first()).toBeVisible();
  });

  test('breath page shows English text', async ({ page }) => {
    await page.goto('/breath');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText("Whenever you're ready")).toBeVisible();
    await expect(page.locator('[data-testid="breath-start-btn"]')).toHaveText('Begin');
  });

  test('grounding page shows English text', async ({ page }) => {
    await page.goto('/grounding');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Grounding')).toBeVisible();
    await expect(page.locator('[data-testid="grounding-start-btn"]')).toHaveText('Begin');
  });
});
