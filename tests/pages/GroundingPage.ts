import type { Page, Locator } from '@playwright/test';

export class GroundingPage {
  readonly page: Page;
  readonly app: Locator;
  readonly main: Locator;
  readonly screenStart: Locator;
  readonly screenStep: Locator;
  readonly screenComplete: Locator;
  readonly screenHistory: Locator;
  readonly startBtn: Locator;
  readonly historyBtn: Locator;
  readonly nextBtn: Locator;
  readonly cancelBtn: Locator;
  readonly finishBtn: Locator;
  readonly backBtn: Locator;
  readonly progressBar: Locator;
  readonly stepForm: Locator;
  readonly validationError: Locator;
  readonly homeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.app = page.locator('[data-testid="grounding-app"]');
    this.main = page.locator('[data-testid="grounding-main"]');
    this.screenStart = page.locator('[data-testid="grounding-screen-start"]');
    this.screenStep = page.locator('[data-testid="grounding-screen-step"]');
    this.screenComplete = page.locator('[data-testid="grounding-screen-complete"]');
    this.screenHistory = page.locator('[data-testid="grounding-screen-history"]');
    this.startBtn = page.locator('[data-testid="grounding-start-btn"]');
    this.historyBtn = page.locator('[data-testid="grounding-history-btn"]');
    this.nextBtn = page.locator('[data-testid="grounding-next-btn"]');
    this.cancelBtn = page.locator('[data-testid="grounding-cancel-btn"]');
    this.finishBtn = page.locator('[data-testid="grounding-finish-btn"]');
    this.backBtn = page.locator('[data-testid="grounding-back-btn"]');
    this.progressBar = page.locator('[data-testid="grounding-progress-bar"]');
    this.stepForm = page.locator('[data-testid="grounding-step-form"]');
    this.validationError = page.locator('[data-testid="grounding-validation-error"]');
    this.homeBtn = page.locator('a[href="/"]');
  }

  async goto() {
    await this.page.goto('/grounding');
    await this.app.waitFor({ state: 'visible' });
    // Wait for Preact hydration to complete (client:load)
    await this.page.waitForLoadState('networkidle');
  }

  async startSession() {
    await this.startBtn.click();
    await this.screenStep.waitFor({ state: 'visible' });
  }

  async fillInput(category: string, index: number, value: string) {
    const input = this.page.locator(`[data-testid="grounding-input-${category}-${index}"]`);
    await input.waitFor({ state: 'visible' });
    await input.fill(value);
  }

  async submitStep() {
    await this.nextBtn.click();
  }

  async completeAllSteps() {
    const steps = [
      { category: 'sight', count: 5, values: ['木', '空', '光', '花', '鳥'] },
      { category: 'touch', count: 4, values: ['机', '本', 'カップ', 'キーボード'] },
      { category: 'sound', count: 3, values: ['風', '鳥の声', '時計'] },
      { category: 'smell', count: 2, values: ['コーヒー', '花'] },
      { category: 'taste', count: 1, values: ['お茶'] },
    ];

    for (const step of steps) {
      await this.fillInput(step.category, 0, step.values[0]);
      await this.submitStep();
    }
  }

  async openHistory() {
    await this.historyBtn.click();
    await this.screenHistory.waitFor({ state: 'visible' });
  }

  async goBackFromHistory() {
    await this.backBtn.click();
    await this.screenStart.waitFor({ state: 'visible' });
  }

  async navigateHome() {
    await this.homeBtn.click();
    await this.page.waitForURL('/');
  }
}
