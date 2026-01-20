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
    await expect(page.getByText('心を落ち着けるためのツール')).toBeVisible();
    await expect(page.getByText('深呼吸')).toBeVisible();
    await expect(page.getByText('グラウンディング')).toBeVisible();
  });

  test('breath page shows Japanese text', async ({ page }) => {
    await page.goto('/breath');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByText('準備ができたら開始')).toBeVisible();
    await expect(page.getByRole('button', { name: '開始' })).toBeVisible();
  });

  test('grounding page shows Japanese text', async ({ page }) => {
    await page.goto('/grounding');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByText('グラウンディング')).toBeVisible();
    await expect(page.getByRole('button', { name: 'はじめる' })).toBeVisible();
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
    await expect(page.getByText('Tools to calm your mind')).toBeVisible();
    await expect(page.getByText('Deep Breathing')).toBeVisible();
    await expect(page.getByText('Grounding')).toBeVisible();
  });

  test('breath page shows English text', async ({ page }) => {
    await page.goto('/breath');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Ready when you are')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('grounding page shows English text', async ({ page }) => {
    await page.goto('/grounding');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Grounding')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });
});
