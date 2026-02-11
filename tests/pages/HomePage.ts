import type { Page } from '@playwright/test';

export function homePage(page: Page) {
  const tagline = page.locator('p').filter({ hasText: /心を落ち着ける|Tools to calm/ });
  const breathCard = page.locator('a[href="/breath"]');
  const groundingCard = page.locator('a[href="/grounding"]');

  return {
    tagline,
    breathCard,
    groundingCard,
    goto: async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    },
    navigateToBreath: async () => {
      await breathCard.click();
      await page.waitForLoadState('networkidle');
    },
    navigateToGrounding: async () => {
      await groundingCard.click();
      await page.waitForLoadState('networkidle');
    },
  };
}
