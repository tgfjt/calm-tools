import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('ホームページに重大なa11y違反がない', async ({ page }) => {
    // Arrange
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    // Assert
    expect(
      results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
    ).toEqual([]);
  });

  test('呼吸ページに重大なa11y違反がない', async ({ page }) => {
    // Arrange
    await page.goto('/breath');
    await page.waitForLoadState('networkidle');

    // Act
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    // Assert
    expect(
      results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
    ).toEqual([]);
  });

  test('グラウンディングページに重大なa11y違反がない', async ({ page }) => {
    // Arrange
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Act
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    // Assert
    expect(
      results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
    ).toEqual([]);
  });

  test('グラウンディングのフォームステップにa11y違反がない', async ({ page }) => {
    // Arrange
    await page.goto('/grounding');
    await page.waitForLoadState('networkidle');

    // Act
    await page.locator('[data-testid="grounding-start-btn"]').click();

    // Assert
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    expect(
      results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
    ).toEqual([]);

    // fieldset/legend の存在確認
    await expect(page.locator('fieldset')).toBeVisible();
    await expect(page.locator('legend')).toBeAttached();
  });
});
