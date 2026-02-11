import type { Page } from '@playwright/test';

export function breathPage(page: Page) {
  const app = page.locator('[data-testid="breath-app"]');
  const title = page.getByRole('heading', { name: '深呼吸', level: 1 });
  const pattern555Btn = page.locator('[data-testid="breath-pattern-555"]');
  const pattern478Btn = page.locator('[data-testid="breath-pattern-478"]');
  const duration1minBtn = page.locator('[data-testid="breath-duration-60"]');
  const duration3minBtn = page.locator('[data-testid="breath-duration-180"]');
  const duration5minBtn = page.locator('[data-testid="breath-duration-300"]');
  const startBtn = page.locator('[data-testid="breath-start-btn"]');
  const resetBtn = page.locator('[data-testid="breath-reset-btn"]');
  const instruction = page.locator('[data-testid="breath-instruction"]');
  const phaseCountdown = page.locator('[data-testid="breath-phase-countdown"]');
  const timer = page.locator('[data-testid="breath-timer"]');
  const historyTitle = page.getByRole('heading', { name: '履歴' });
  const noRecordsText = page.getByText('まだ記録がありません');

  const durationMap = { '1分': '60', '3分': '180', '5分': '300' } as const;

  return {
    app,
    title,
    pattern555Btn,
    pattern478Btn,
    duration1minBtn,
    duration3minBtn,
    duration5minBtn,
    startBtn,
    resetBtn,
    instruction,
    phaseCountdown,
    timer,
    historyTitle,
    noRecordsText,
    goto: async () => {
      await page.goto('/breath');
      await page.waitForLoadState('networkidle');
    },
    selectPattern555: () => pattern555Btn.click(),
    selectPattern478: () => pattern478Btn.click(),
    selectDuration: (duration: '1分' | '3分' | '5分') =>
      page.locator(`[data-testid="breath-duration-${durationMap[duration]}"]`).click(),
    start: () => startBtn.click(),
    reset: () => resetBtn.click(),
    getInstructionText: () => instruction.innerText(),
  };
}
