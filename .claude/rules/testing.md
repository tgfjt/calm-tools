# テストガイドライン (3A Test)

本プロジェクト固有のテスト規約。汎用的な E2E パターンは `e2e.md` を参照。

---

## 原則: AAA パターン

すべてのテストは **Arrange-Act-Assert** で構成する。コメントで明示すること。

```typescript
test('説明', async ({ page }) => {
  // Arrange — 前提条件のセットアップ
  const breathPage = new BreathPage(page);
  await breathPage.goto();

  // Act — テスト対象の操作
  await breathPage.start();

  // Assert — 期待結果の検証
  await expect(breathPage.instruction).toContainText('吸って');
});
```

---

## テスト構成

| 種別 | フレームワーク | ディレクトリ | コマンド |
|------|--------------|-------------|---------|
| Unit | Vitest | `tests/unit/` | `npm run test:unit` |
| E2E | Playwright | `tests/e2e/` | `npm run test:e2e` |
| a11y | Playwright + axe-core | `tests/e2e/a11y.spec.ts` | `npm run test:e2e` |
| POM | — | `tests/pages/` | — |

---

## POM (Page Object Model)

テストから直接ロケータを書かない。必ず POM 経由にする。

### ファイル

- `tests/pages/HomePage.ts`
- `tests/pages/BreathPage.ts`
- `tests/pages/GroundingPage.ts`

### 規約

- `goto()` で `waitForLoadState('networkidle')` を必ず呼ぶ (Preact hydration 対策)
- ロケータは `data-testid` ベースを優先。セマンティック (`getByRole`) は補助的に使う
- アクションメソッドを提供する (`start()`, `fillStep()`, `cancelSession()` 等)

---

## data-testid 命名規則

コンポーネント名をプレフィックスにする。GroundingApp と BreathApp で統一済み。

```
{component}-{element}
{component}-{element}-{variant}
```

例:
- `breath-app`, `breath-start-btn`, `breath-pattern-555`, `breath-duration-60`
- `grounding-app`, `grounding-start-btn`, `grounding-input-sight-0`

新しいコンポーネントにも同じパターンで付与すること。

---

## E2E テストの注意点

### Astro + Preact hydration
- `client:load` コンポーネントは SSR 後に hydration が走る
- `waitForLoadState('networkidle')` で hydration 完了を待つ

### タイマー系テスト
- 実時間で待つ必要があるテスト (フェーズ遷移等) は最小限に抑える
- 60秒以上かかるタイマー完走テストは書かない
- フェーズ遷移の確認は最初の1-2遷移だけで十分

### ダイアログ
- `window.confirm()` を使う操作は `page.on('dialog', dialog => dialog.accept())` でハンドル

### Panda CSS
- CSS クラス名は変換されるので `toHaveClass()` で直接比較しない
- 選択状態の判定はクラス数の比較で行う

---

## Unit テストの注意点

### IndexedDB
- `fake-indexeddb/auto` を import してモック
- `initDB()` を `beforeAll` で1回呼ぶ

### i18n
- `src/i18n/index.ts` は import 時に `detectLocale()` が走る
- `navigator`/`document` がない環境でもガード済みなのでモック不要

---

## a11y テスト

- `@axe-core/playwright` の `AxeBuilder` でスキャン
- `critical` / `serious` のみフィルタ (minor は無視)
- `color-contrast` は別途対応予定 (PLANS.md 参照)

---

## CI

`.github/workflows/e2e.yml` で `unit` と `e2e` ジョブが並行実行される。

テストを追加・変更したら:
1. `npm run test:unit` でユニットテストがパスすることを確認
2. `npm run test:e2e` で E2E テストがパスすることを確認
3. 両方通ってからコミットする
