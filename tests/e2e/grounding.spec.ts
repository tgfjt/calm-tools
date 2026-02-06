import { test, expect } from '@playwright/test';
import { GroundingPage } from '../pages/GroundingPage';

test.describe('Grounding - Japanese locale', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('5 steps complete flow', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    // Start screen is visible
    await expect(grounding.screenStart).toBeVisible();
    await expect(grounding.startBtn).toBeVisible();

    // Start session
    await grounding.startSession();

    // Step 1: sight (5 inputs)
    await expect(grounding.screenStep).toBeVisible();
    await expect(grounding.progressBar).toBeVisible();
    await grounding.fillInput('sight', 0, '木');
    await grounding.submitStep();

    // Step 2: touch (4 inputs)
    const touchInput = page.locator('[data-testid="grounding-input-touch-0"]');
    await expect(touchInput).toBeVisible();
    await grounding.fillInput('touch', 0, '机');
    await grounding.submitStep();

    // Step 3: sound (3 inputs)
    const soundInput = page.locator('[data-testid="grounding-input-sound-0"]');
    await expect(soundInput).toBeVisible();
    await grounding.fillInput('sound', 0, '風');
    await grounding.submitStep();

    // Step 4: smell (2 inputs)
    const smellInput = page.locator('[data-testid="grounding-input-smell-0"]');
    await expect(smellInput).toBeVisible();
    await grounding.fillInput('smell', 0, 'コーヒー');
    await grounding.submitStep();

    // Step 5: taste (1 input)
    const tasteInput = page.locator('[data-testid="grounding-input-taste-0"]');
    await expect(tasteInput).toBeVisible();
    await grounding.fillInput('taste', 0, 'お茶');
    await grounding.submitStep();

    // Complete screen
    await expect(grounding.screenComplete).toBeVisible();
    await expect(grounding.finishBtn).toBeVisible();
  });

  test('validation error on empty input', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await grounding.startSession();

    // Submit without input
    await grounding.submitStep();

    // Validation error should appear
    await expect(grounding.validationError).toBeVisible();
  });

  test('validation error auto-clears after 3 seconds', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await grounding.startSession();
    await grounding.submitStep();

    await expect(grounding.validationError).toBeVisible();

    // Wait for auto-clear (3s + buffer)
    await expect(grounding.validationError).toBeHidden({ timeout: 5000 });
  });

  test('complete session then view in history', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    // Complete a session
    await grounding.startSession();
    await grounding.completeAllSteps();

    // Finish and go back to start
    await expect(grounding.screenComplete).toBeVisible();
    await grounding.finishBtn.click();
    await expect(grounding.screenStart).toBeVisible();

    // Open history
    await grounding.openHistory();
    await expect(grounding.screenHistory).toBeVisible();

    // History list should contain at least one entry (session data visible)
    // Use the history screen's content to verify - look for the delete button
    const deleteBtn = page.locator('[data-testid^="grounding-delete-btn-"]');
    await expect(deleteBtn.first()).toBeVisible({ timeout: 5000 });
  });

  test('empty history state', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await grounding.openHistory();

    // Empty state text should be visible
    await expect(page.getByText('まだふりかえりはありません。')).toBeVisible();
    await expect(page.getByText('はじめてのセッションをやってみましょう。')).toBeVisible();
  });

  test('back button from history returns to start', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await grounding.openHistory();
    await expect(grounding.screenHistory).toBeVisible();

    await grounding.goBackFromHistory();
    await expect(grounding.screenStart).toBeVisible();
  });

  test('cancel session with confirm dialog', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await grounding.startSession();

    // Set up dialog handler to accept
    page.on('dialog', (dialog) => dialog.accept());

    await grounding.cancelBtn.click();

    // Should return to start screen
    await expect(grounding.screenStart).toBeVisible();
  });

  test('cancel session - dismiss dialog stays on step', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await grounding.startSession();

    // Set up dialog handler to dismiss
    page.on('dialog', (dialog) => dialog.dismiss());

    await grounding.cancelBtn.click();

    // Should stay on step screen
    await expect(grounding.screenStep).toBeVisible();
  });
});

test.describe('Grounding - English locale', () => {
  test.use({
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en' },
  });

  test('5 steps complete flow (English)', async ({ page }) => {
    const grounding = new GroundingPage(page);
    await grounding.goto();

    await expect(grounding.startBtn).toHaveText('Begin');

    await grounding.startSession();

    // Step 1: sight
    await grounding.fillInput('sight', 0, 'tree');
    await grounding.submitStep();

    // Step 2: touch
    await grounding.fillInput('touch', 0, 'desk');
    await grounding.submitStep();

    // Step 3: sound
    await grounding.fillInput('sound', 0, 'wind');
    await grounding.submitStep();

    // Step 4: smell
    await grounding.fillInput('smell', 0, 'coffee');
    await grounding.submitStep();

    // Step 5: taste
    await grounding.fillInput('taste', 0, 'tea');
    await grounding.submitStep();

    // Complete screen in English
    await expect(grounding.screenComplete).toBeVisible();
    await expect(page.getByText('Well done')).toBeVisible();
  });
});
