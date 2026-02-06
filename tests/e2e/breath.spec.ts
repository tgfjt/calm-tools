import { test, expect } from '@playwright/test';
import { BreathPage } from '../pages/BreathPage';

test.describe('Breath - Japanese locale', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('default state shows idle instruction and pattern selection', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    // Pattern buttons visible
    await expect(breath.pattern555Btn).toBeVisible();
    await expect(breath.pattern478Btn).toBeVisible();

    // Duration buttons visible
    await expect(breath.duration60Btn).toBeVisible();
    await expect(breath.duration180Btn).toBeVisible();
    await expect(breath.duration300Btn).toBeVisible();

    // Idle instruction
    await expect(breath.instruction).toHaveText('準備ができたら、はじめましょう');

    // Start button enabled, reset disabled
    await expect(breath.startBtn).toBeEnabled();
    await expect(breath.resetBtn).toBeDisabled();

    // Timer shows default 1 min
    await expect(breath.timer).toContainText('1:00');
  });

  test('start and reset breathing exercise', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    // Start
    await breath.start();

    // Wait for the phase to change to 'inhale' (confirms breathing started)
    await expect(breath.instruction).toHaveText('吸って', { timeout: 10000 });

    // Now verify running state
    await expect(breath.startBtn).toBeDisabled();
    await expect(breath.resetBtn).toBeEnabled();
    await expect(breath.pattern555Btn).toBeDisabled();
    await expect(breath.pattern478Btn).toBeDisabled();
    await expect(breath.duration60Btn).toBeDisabled();

    // Reset
    await breath.reset();

    // Back to idle
    await expect(breath.instruction).toHaveText('準備ができたら、はじめましょう');
    await expect(breath.startBtn).toBeEnabled();
    await expect(breath.resetBtn).toBeDisabled();
  });

  test('pattern switching (555 to 478)', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    // Default is 555
    await expect(breath.pattern555Btn).toBeVisible();

    // Switch to 478
    await breath.selectPattern478();

    // Start with 478
    await breath.start();

    // Should be running
    await expect(breath.startBtn).toBeDisabled();

    // Reset
    await breath.reset();
    await expect(breath.startBtn).toBeEnabled();
  });

  test('duration switching (1min, 3min, 5min)', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    // Default 1 min
    await expect(breath.timer).toContainText('1:00');

    // Switch to 3 min
    await breath.selectDuration(180);
    await expect(breath.timer).toContainText('3:00');

    // Switch to 5 min
    await breath.selectDuration(300);
    await expect(breath.timer).toContainText('5:00');

    // Switch back to 1 min
    await breath.selectDuration(60);
    await expect(breath.timer).toContainText('1:00');
  });

  test('cannot change pattern or duration while running', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    await breath.start();

    // All selection buttons should be disabled
    await expect(breath.pattern555Btn).toBeDisabled();
    await expect(breath.pattern478Btn).toBeDisabled();
    await expect(breath.duration60Btn).toBeDisabled();
    await expect(breath.duration180Btn).toBeDisabled();
    await expect(breath.duration300Btn).toBeDisabled();

    await breath.reset();
  });

  test('history section shows empty state', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    // History section visible
    await expect(breath.history).toBeVisible();

    // Empty state text
    await expect(breath.stats).toContainText('これからの記録がここに残ります');
  });

  test('reset during exercise saves interrupted session to history', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    await breath.start();

    // Wait for phase to become inhale (confirms timer is running)
    await expect(breath.instruction).toHaveText('吸って', { timeout: 10000 });

    await breath.reset();

    // History should update - wait for the interrupted session to appear
    await expect(breath.historyItems.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Breath - English locale', () => {
  test.use({
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en' },
  });

  test('shows English text', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    await expect(breath.instruction).toHaveText("Whenever you're ready");
    await expect(breath.startBtn).toHaveText('Begin');
    await expect(breath.resetBtn).toHaveText('Again');
  });

  test('start and reset with English locale', async ({ page }) => {
    const breath = new BreathPage(page);
    await breath.goto();

    await breath.start();

    // Wait for phase change
    await expect(breath.instruction).toHaveText('Breathe in', { timeout: 10000 });

    // Reset
    await breath.reset();
    await expect(breath.instruction).toHaveText("Whenever you're ready");
  });
});
