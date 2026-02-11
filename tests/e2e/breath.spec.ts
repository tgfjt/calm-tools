import { test, expect } from '../fixtures';

test.describe('Breath App', () => {
  test.use({
    locale: 'ja-JP',
    extraHTTPHeaders: { 'Accept-Language': 'ja' },
  });

  test('初期表示: タイトル、パターン選択、開始ボタンが表示される', async ({ breathPage }) => {
    // Arrange & Act
    await breathPage.goto();

    // Assert
    await expect(breathPage.title).toBeVisible();
    await expect(breathPage.pattern555Btn).toBeVisible();
    await expect(breathPage.pattern478Btn).toBeVisible();
    await expect(breathPage.duration1minBtn).toBeVisible();
    await expect(breathPage.duration3minBtn).toBeVisible();
    await expect(breathPage.duration5minBtn).toBeVisible();
    await expect(breathPage.startBtn).toBeVisible();
    await expect(breathPage.resetBtn).toBeVisible();
  });

  test('初期状態: idle フェーズで「準備ができたら開始」が表示される', async ({ breathPage }) => {
    // Arrange & Act
    await breathPage.goto();

    // Assert
    await expect(breathPage.instruction).toContainText('準備ができたら開始');
    await expect(breathPage.timer).toContainText('残り 1:00');
  });

  test('初期状態: 履歴セクションが表示される', async ({ breathPage }) => {
    // Arrange & Act
    await breathPage.goto();

    // Assert
    await expect(breathPage.historyTitle).toBeVisible();
    await expect(breathPage.noRecordsText).toBeVisible();
  });

  test('パターン切り替え: 555 → 478 でボタンの選択状態が変わる', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();
    const classes555Before = await breathPage.pattern555Btn.getAttribute('class') ?? '';
    const classes478Before = await breathPage.pattern478Btn.getAttribute('class') ?? '';
    expect(classes555Before.split(' ').length).toBeGreaterThan(classes478Before.split(' ').length);

    // Act
    await breathPage.selectPattern478();

    // Assert
    const classes555After = await breathPage.pattern555Btn.getAttribute('class') ?? '';
    const classes478After = await breathPage.pattern478Btn.getAttribute('class') ?? '';
    expect(classes478After.split(' ').length).toBeGreaterThan(classes555After.split(' ').length);
  });

  test('Duration選択: 1分 → 3分でタイマー表示が変わる', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();

    // Act
    await breathPage.selectDuration('3分');

    // Assert
    await expect(breathPage.timer).toContainText('残り 3:00');
  });

  test('Duration選択: 5分でタイマー表示が 5:00 になる', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();

    // Act
    await breathPage.selectDuration('5分');

    // Assert
    await expect(breathPage.timer).toContainText('残り 5:00');
  });

  test('開始 → フェーズ遷移: idle から inhale に変わる', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();

    // Act
    await breathPage.start();

    // Assert
    await expect(breathPage.instruction).toContainText('吸って', { timeout: 3000 });
  });

  test('リセット: 実行中にリセットで idle に戻る', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();
    await breathPage.start();
    await expect(breathPage.instruction).toContainText('吸って', { timeout: 3000 });

    // Act
    await breathPage.reset();

    // Assert
    await expect(breathPage.instruction).toContainText('準備ができたら開始');
    await expect(breathPage.timer).toContainText('残り 1:00');
  });

  test('実行中はパターン・Durationボタンが disabled', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();

    // Act
    await breathPage.start();
    await expect(breathPage.instruction).toContainText('吸って', { timeout: 3000 });

    // Assert
    await expect(breathPage.pattern555Btn).toBeDisabled();
    await expect(breathPage.pattern478Btn).toBeDisabled();
    await expect(breathPage.duration1minBtn).toBeDisabled();
    await expect(breathPage.duration3minBtn).toBeDisabled();
    await expect(breathPage.duration5minBtn).toBeDisabled();
  });

  test('実行中は開始ボタンが disabled、リセットが有効', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();

    // Act
    await breathPage.start();
    await expect(breathPage.instruction).toContainText('吸って', { timeout: 3000 });

    // Assert
    await expect(breathPage.startBtn).toBeDisabled();
    await expect(breathPage.resetBtn).toBeEnabled();
  });

  test('idle 状態ではリセットボタンが disabled', async ({ breathPage }) => {
    // Arrange & Act
    await breathPage.goto();

    // Assert
    await expect(breathPage.resetBtn).toBeDisabled();
  });

  test('フェーズ遷移: inhale → hold に変わる (555パターン)', async ({ breathPage }) => {
    // Arrange
    await breathPage.goto();

    // Act
    await breathPage.start();

    // Assert
    await expect(breathPage.instruction).toContainText('吸って', { timeout: 3000 });
    await expect(breathPage.instruction).toContainText('止めて', { timeout: 8000 });
  });
});
