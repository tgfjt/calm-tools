import { type Page, type Locator } from '@playwright/test';

export class GroundingPage {
  readonly page: Page;
  readonly app: Locator;
  readonly startBtn: Locator;
  readonly historyBtn: Locator;
  readonly stepForm: Locator;
  readonly nextBtn: Locator;
  readonly cancelBtn: Locator;
  readonly progressBar: Locator;
  readonly validationError: Locator;
  readonly completeScreen: Locator;
  readonly finishBtn: Locator;
  readonly historyScreen: Locator;
  readonly backBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.app = page.locator('[data-testid="grounding-app"]');
    this.startBtn = page.locator('[data-testid="grounding-start-btn"]');
    this.historyBtn = page.locator('[data-testid="grounding-history-btn"]');
    this.stepForm = page.locator('[data-testid="grounding-step-form"]');
    this.nextBtn = page.locator('[data-testid="grounding-next-btn"]');
    this.cancelBtn = page.locator('[data-testid="grounding-cancel-btn"]');
    this.progressBar = page.locator('[data-testid="grounding-progress-bar"]');
    this.validationError = page.locator('[data-testid="grounding-validation-error"]');
    this.completeScreen = page.locator('[data-testid="grounding-screen-complete"]');
    this.finishBtn = page.locator('[data-testid="grounding-finish-btn"]');
    this.historyScreen = page.locator('[data-testid="grounding-screen-history"]');
    this.backBtn = page.locator('[data-testid="grounding-back-btn"]');
  }

  async goto() {
    await this.page.goto('/grounding');
    await this.page.waitForLoadState('networkidle');
  }

  async startSession() {
    await this.startBtn.click();
  }

  getInput(category: string, index: number): Locator {
    return this.page.locator(`[data-testid="grounding-input-${category}-${index}"]`);
  }

  async fillStep(category: string, count: number, values?: string[]) {
    for (let i = 0; i < count; i++) {
      const input = this.getInput(category, i);
      await input.fill(values?.[i] || `テスト入力${i + 1}`);
    }
  }

  async nextStep() {
    await this.nextBtn.click();
  }

  async fillAndNextStep(category: string, count: number) {
    await this.fillStep(category, count);
    await this.nextStep();
  }

  async completeAllSteps() {
    const steps = [
      { category: 'sight', count: 5 },
      { category: 'touch', count: 4 },
      { category: 'sound', count: 3 },
      { category: 'smell', count: 2 },
      { category: 'taste', count: 1 },
    ];
    for (const step of steps) {
      await this.fillAndNextStep(step.category, step.count);
    }
  }

  async goToHistory() {
    await this.historyBtn.click();
  }

  async cancelSession() {
    this.page.on('dialog', (dialog) => dialog.accept());
    await this.cancelBtn.click();
  }
}
