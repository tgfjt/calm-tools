import type { Page, Locator } from '@playwright/test';

export class BreathPage {
  readonly page: Page;
  readonly app: Locator;
  readonly patternSelection: Locator;
  readonly pattern555Btn: Locator;
  readonly pattern478Btn: Locator;
  readonly durationSelection: Locator;
  readonly duration60Btn: Locator;
  readonly duration180Btn: Locator;
  readonly duration300Btn: Locator;
  readonly breathCircle: Locator;
  readonly phaseCountdown: Locator;
  readonly instruction: Locator;
  readonly timer: Locator;
  readonly startBtn: Locator;
  readonly resetBtn: Locator;
  readonly history: Locator;
  readonly stats: Locator;
  readonly historyList: Locator;
  readonly historyItems: Locator;
  readonly homeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.app = page.locator('[data-testid="breath-app"]');
    this.patternSelection = page.locator('[data-testid="breath-pattern-selection"]');
    this.pattern555Btn = page.locator('[data-testid="breath-pattern-555"]');
    this.pattern478Btn = page.locator('[data-testid="breath-pattern-478"]');
    this.durationSelection = page.locator('[data-testid="breath-duration-selection"]');
    this.duration60Btn = page.locator('[data-testid="breath-duration-60"]');
    this.duration180Btn = page.locator('[data-testid="breath-duration-180"]');
    this.duration300Btn = page.locator('[data-testid="breath-duration-300"]');
    this.breathCircle = page.locator('[data-testid="breath-circle"]');
    this.phaseCountdown = page.locator('[data-testid="breath-phase-countdown"]');
    this.instruction = page.locator('[data-testid="breath-instruction"]');
    this.timer = page.locator('[data-testid="breath-timer"]');
    this.startBtn = page.locator('[data-testid="breath-start-btn"]');
    this.resetBtn = page.locator('[data-testid="breath-reset-btn"]');
    this.history = page.locator('[data-testid="breath-history"]');
    this.stats = page.locator('[data-testid="breath-stats"]');
    this.historyList = page.locator('[data-testid="breath-history-list"]');
    this.historyItems = page.locator('[data-testid="breath-history-item"]');
    this.homeBtn = page.locator('a[href="/"]');
  }

  async goto() {
    await this.page.goto('/breath');
    await this.app.waitFor({ state: 'visible' });
    // Wait for Preact hydration to complete (client:load)
    await this.page.waitForLoadState('networkidle');
  }

  async selectPattern555() {
    await this.pattern555Btn.click();
  }

  async selectPattern478() {
    await this.pattern478Btn.click();
  }

  async selectDuration(seconds: 60 | 180 | 300) {
    await this.page.locator(`[data-testid="breath-duration-${seconds}"]`).click();
  }

  async start() {
    await this.startBtn.click();
  }

  async reset() {
    await this.resetBtn.click();
  }

  async navigateHome() {
    await this.homeBtn.click();
    await this.page.waitForURL('/');
  }
}
