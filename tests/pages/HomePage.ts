import type { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly tagline: Locator;
  readonly breathCard: Locator;
  readonly groundingCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.tagline = page.locator('p').first();
    this.breathCard = page.locator('a[href="/breath"]');
    this.groundingCard = page.locator('a[href="/grounding"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToBreath() {
    await this.breathCard.click();
    await this.page.waitForURL('/breath');
  }

  async navigateToGrounding() {
    await this.groundingCard.click();
    await this.page.waitForURL('/grounding');
  }
}
