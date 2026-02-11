import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly tagline: Locator;
  readonly breathCard: Locator;
  readonly groundingCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tagline = page.locator('p').filter({ hasText: /心を落ち着ける|Tools to calm/ });
    this.breathCard = page.locator('a[href="/breath"]');
    this.groundingCard = page.locator('a[href="/grounding"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToBreath() {
    await this.breathCard.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToGrounding() {
    await this.groundingCard.click();
    await this.page.waitForLoadState('networkidle');
  }
}
