import { type Page, type Locator } from '@playwright/test';

export class BreathPage {
  readonly page: Page;
  readonly app: Locator;
  readonly title: Locator;
  readonly pattern555Btn: Locator;
  readonly pattern478Btn: Locator;
  readonly duration1minBtn: Locator;
  readonly duration3minBtn: Locator;
  readonly duration5minBtn: Locator;
  readonly startBtn: Locator;
  readonly resetBtn: Locator;
  readonly instruction: Locator;
  readonly phaseCountdown: Locator;
  readonly timer: Locator;
  readonly historyTitle: Locator;
  readonly noRecordsText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.app = page.locator('[data-testid="breath-app"]');
    this.title = page.getByRole('heading', { name: '深呼吸', level: 1 });
    this.pattern555Btn = page.locator('[data-testid="breath-pattern-555"]');
    this.pattern478Btn = page.locator('[data-testid="breath-pattern-478"]');
    this.duration1minBtn = page.locator('[data-testid="breath-duration-60"]');
    this.duration3minBtn = page.locator('[data-testid="breath-duration-180"]');
    this.duration5minBtn = page.locator('[data-testid="breath-duration-300"]');
    this.startBtn = page.locator('[data-testid="breath-start-btn"]');
    this.resetBtn = page.locator('[data-testid="breath-reset-btn"]');
    this.instruction = page.locator('[data-testid="breath-instruction"]');
    this.phaseCountdown = page.locator('[data-testid="breath-phase-countdown"]');
    this.timer = page.locator('[data-testid="breath-timer"]');
    this.historyTitle = page.getByRole('heading', { name: '履歴' });
    this.noRecordsText = page.getByText('まだ記録がありません');
  }

  async goto() {
    await this.page.goto('/breath');
    await this.page.waitForLoadState('networkidle');
  }

  async selectPattern555() {
    await this.pattern555Btn.click();
  }

  async selectPattern478() {
    await this.pattern478Btn.click();
  }

  async selectDuration(duration: '1分' | '3分' | '5分') {
    const map = { '1分': '60', '3分': '180', '5分': '300' };
    await this.page.locator(`[data-testid="breath-duration-${map[duration]}"]`).click();
  }

  async start() {
    await this.startBtn.click();
  }

  async reset() {
    await this.resetBtn.click();
  }

  async getInstructionText(): Promise<string> {
    return await this.instruction.innerText();
  }
}
