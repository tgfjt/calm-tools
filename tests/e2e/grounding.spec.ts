import { test, expect } from '@playwright/test';
import { GroundingPage } from '../pages/GroundingPage';

test.describe('Grounding App', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('スタート画面にはじめるボタンと履歴ボタンが表示される', async ({ page }) => {
    // Arrange
    const grounding = new GroundingPage(page);

    // Act
    await grounding.goto();

    // Assert
    await expect(grounding.startBtn).toBeVisible();
    await expect(grounding.startBtn).toHaveText('はじめる');
    await expect(grounding.historyBtn).toBeVisible();
    await expect(grounding.historyBtn).toHaveText('履歴を見る');
  });

  test('5ステップ完走で完了画面が表示される', async ({ page }) => {
    // Arrange
    const grounding = new GroundingPage(page);
    await grounding.goto();

    // Act
    await grounding.startSession();
    await grounding.completeAllSteps();

    // Assert
    await expect(grounding.completeScreen).toBeVisible();
    await expect(page.getByText('おつかれさまでした')).toBeVisible();
    await expect(grounding.finishBtn).toBeVisible();
  });

  test('空入力で次へを押すとバリデーションエラーが表示される', async ({ page }) => {
    // Arrange
    const grounding = new GroundingPage(page);
    await grounding.goto();
    await grounding.startSession();

    // Act
    await grounding.nextStep();

    // Assert
    await expect(grounding.validationError).toBeVisible();
    await expect(grounding.validationError).toHaveAttribute('role', 'alert');
  });

  test('途中でやめるを押すとスタート画面に戻る', async ({ page }) => {
    // Arrange
    const grounding = new GroundingPage(page);
    await grounding.goto();
    await grounding.startSession();
    await grounding.fillStep('sight', 5);

    // Act
    await grounding.cancelSession();

    // Assert
    await expect(grounding.startBtn).toBeVisible();
    await expect(grounding.stepForm).not.toBeVisible();
  });

  test('履歴ボタンで履歴画面を表示し戻るボタンでスタート画面に戻る', async ({ page }) => {
    // Arrange
    const grounding = new GroundingPage(page);
    await grounding.goto();

    // Act - 履歴画面へ
    await grounding.goToHistory();

    // Assert - 履歴画面が表示される
    await expect(grounding.historyScreen).toBeVisible();
    await expect(grounding.backBtn).toBeVisible();

    // Act - 戻る
    await grounding.backBtn.click();

    // Assert - スタート画面に戻る
    await expect(grounding.startBtn).toBeVisible();
    await expect(grounding.historyScreen).not.toBeVisible();
  });

  test('完了後おわるボタンでスタート画面に戻る', async ({ page }) => {
    // Arrange
    const grounding = new GroundingPage(page);
    await grounding.goto();
    await grounding.startSession();
    await grounding.completeAllSteps();

    // Act
    await grounding.finishBtn.click();

    // Assert
    await expect(grounding.startBtn).toBeVisible();
    await expect(grounding.completeScreen).not.toBeVisible();
  });
});
