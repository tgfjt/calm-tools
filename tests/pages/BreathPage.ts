import { type Page, type Locator } from '@playwright/test';

export class BreathPage {
  readonly page: Page;
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
    // Japanese locale text (default)
    this.title = page.getByRole('heading', { name: '深呼吸', level: 1 });
    this.pattern555Btn = page.getByRole('button', { name: /5-5-5/ });
    this.pattern478Btn = page.getByRole('button', { name: /4-7-8/ });
    this.duration1minBtn = page.getByRole('button', { name: '1分' });
    this.duration3minBtn = page.getByRole('button', { name: '3分' });
    this.duration5minBtn = page.getByRole('button', { name: '5分' });
    this.startBtn = page.getByRole('button', { name: '開始' });
    this.resetBtn = page.getByRole('button', { name: 'リセット' });
    this.instruction = page.getByText(/^(準備ができたら開始|吸って|止めて|吐いて|完了しました)$/);
    this.phaseCountdown = page.locator('div').filter({ hasText: /^\d$/ }).first();
    this.timer = page.getByText(/残り \d+:\d+/);
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
    await this.page.getByRole('button', { name: duration }).click();
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
