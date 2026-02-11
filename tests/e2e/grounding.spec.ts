import { test, expect } from '../fixtures';

test.describe('Grounding App', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('スタート画面にはじめるボタンと履歴ボタンが表示される', async ({ groundingPage }) => {
    // Arrange & Act
    await groundingPage.goto();

    // Assert
    await expect(groundingPage.startBtn).toBeVisible();
    await expect(groundingPage.startBtn).toHaveText('はじめる');
    await expect(groundingPage.historyBtn).toBeVisible();
    await expect(groundingPage.historyBtn).toHaveText('履歴を見る');
  });

  test('5ステップ完走で完了画面が表示される', async ({ groundingPage, page }) => {
    // Arrange
    await groundingPage.goto();

    // Act
    await groundingPage.startSession();
    await groundingPage.completeAllSteps();

    // Assert
    await expect(groundingPage.completeScreen).toBeVisible();
    await expect(page.getByText('おつかれさまでした')).toBeVisible();
    await expect(groundingPage.finishBtn).toBeVisible();
  });

  test('空入力で次へを押すとバリデーションエラーが表示される', async ({ groundingPage }) => {
    // Arrange
    await groundingPage.goto();
    await groundingPage.startSession();

    // Act
    await groundingPage.nextStep();

    // Assert
    await expect(groundingPage.validationError).toBeVisible();
    await expect(groundingPage.validationError).toHaveAttribute('role', 'alert');
  });

  test('途中でやめるを押すとスタート画面に戻る', async ({ groundingPage }) => {
    // Arrange
    await groundingPage.goto();
    await groundingPage.startSession();
    await groundingPage.fillStep('sight', 5);

    // Act
    await groundingPage.cancelSession();

    // Assert
    await expect(groundingPage.startBtn).toBeVisible();
    await expect(groundingPage.stepForm).not.toBeVisible();
  });

  test('履歴ボタンで履歴画面を表示し戻るボタンでスタート画面に戻る', async ({ groundingPage }) => {
    // Arrange
    await groundingPage.goto();

    // Act - 履歴画面へ
    await groundingPage.goToHistory();

    // Assert - 履歴画面が表示される
    await expect(groundingPage.historyScreen).toBeVisible();
    await expect(groundingPage.backBtn).toBeVisible();

    // Act - 戻る
    await groundingPage.backBtn.click();

    // Assert - スタート画面に戻る
    await expect(groundingPage.startBtn).toBeVisible();
    await expect(groundingPage.historyScreen).not.toBeVisible();
  });

  test('完了後おわるボタンでスタート画面に戻る', async ({ groundingPage }) => {
    // Arrange
    await groundingPage.goto();
    await groundingPage.startSession();
    await groundingPage.completeAllSteps();

    // Act
    await groundingPage.finishBtn.click();

    // Assert
    await expect(groundingPage.startBtn).toBeVisible();
    await expect(groundingPage.completeScreen).not.toBeVisible();
  });
});
