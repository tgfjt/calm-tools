import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BreathPage } from '../pages/BreathPage';
import { GroundingPage } from '../pages/GroundingPage';

test.describe('Navigation', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('Home -> Breath -> Home', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Navigate to Breath
    await home.navigateToBreath();
    await expect(page).toHaveURL('/breath');

    // Navigate back Home
    const breath = new BreathPage(page);
    await breath.navigateHome();
    await expect(page).toHaveURL('/');
  });

  test('Home -> Grounding -> Home', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Navigate to Grounding
    await home.navigateToGrounding();
    await expect(page).toHaveURL('/grounding');

    // Navigate back Home
    const grounding = new GroundingPage(page);
    await grounding.navigateHome();
    await expect(page).toHaveURL('/');
  });

  test('home button is visible on sub-pages but not on home', async ({ page }) => {
    // Home page should not have a home button
    await page.goto('/');
    const homeBtn = page.locator('a[href="/"]');
    await expect(homeBtn).toBeHidden();

    // Breath page should have home button
    await page.goto('/breath');
    await expect(page.locator('a[href="/"]')).toBeVisible();

    // Grounding page should have home button
    await page.goto('/grounding');
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });
});
