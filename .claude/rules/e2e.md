# E2E テスト

> **出典:** [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

---

## 1. エージェント設計: 専門化されたE2Eランナー

```yaml
name: e2e-runner
description: End-to-end testing specialist using Playwright
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus  # 複雑な判断が必要なのでOpus
```

**ポイント:** E2Eはクリティカルなので最高モデル(Opus)を使用。テスト生成・保守・実行・アーティファクト管理まで一貫して担当。

---

## 2. Page Object Model (POM) の徹底

```typescript
// pages/MarketsPage.ts
export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp =>
      resp.url().includes('/api/markets/search')
    )
  }
}
```

**なぜPOM？**
- UIが変わってもPage Objectだけ修正すれば良い
- テストコードは「何をテストするか」に集中できる
- 同じ操作を複数テストで再利用

---

## 3. data-testid の徹底使用

```typescript
// ❌ 脆いセレクタ（CSSクラスは変わる）
page.locator('.btn-primary')
page.locator('button:nth-child(2)')

// ✅ 安定したセレクタ
page.locator('[data-testid="search-input"]')
page.locator('[data-testid="market-card"]')
```

**教訓:** CSSクラスはデザイン変更で壊れる。`data-testid`は明示的にテスト用なので安定。

---

## 4. Flaky Test（不安定テスト）管理

### 不安定テストの検出

```bash
# 同じテストを10回実行して安定性を確認
npx playwright test tests/markets/search.spec.ts --repeat-each=10
```

### 隔離パターン

```typescript
// 修正するまで隔離
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')
  // ...
})

// CIでのみスキップ
test('market search', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')
  // ...
})
```

### よくある原因と対策

| 原因 | ❌ 不安定 | ✅ 安定 |
|------|----------|---------|
| レース | `page.click('.btn')` | `page.locator('.btn').click()` (自動wait) |
| 通信 | `waitForTimeout(5000)` | `waitForResponse(...)` |
| アニメ | すぐクリック | `waitFor({ state: 'visible' })` |

---

## 5. アーティファクト戦略

### 設定

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry',        // リトライ時のみtrace
  screenshot: 'only-on-failure',  // 失敗時のみスクショ
  video: 'retain-on-failure',     // 失敗時のみ動画保持
}
```

**なぜ「失敗時のみ」？**
- 全テストで常に記録すると容量爆発
- 成功したテストのアーティファクトは基本不要
- 失敗時こそデバッグ材料が必要

### キーポイントでの手動スクショ

```typescript
// 重要なステップでは明示的に撮る
await page.screenshot({ path: 'artifacts/after-login.png' })
await page.screenshot({ path: 'artifacts/search-results.png' })
```

---

## 6. リスクベースのテスト優先度

```markdown
**🔴 CRITICAL（絶対に落としてはいけない）:**
1. ウォレット接続
2. マーケット閲覧
3. 検索機能
4. 取引（実際のお金が動く）
5. 出金機能

**🟡 IMPORTANT:**
1. マーケット作成
2. プロフィール更新
3. リアルタイム価格更新
```

**考え方:** 金融系は100%テストが必要。UIの見た目はE2Eでなく目視確認で十分。

---

## 7. 本番環境での実行禁止

```typescript
test('user can place trade', async ({ page }) => {
  // 本番では絶対に実行しない
  test.skip(process.env.NODE_ENV === 'production', 'Skip on production')

  // テストネット/ステージングのみ
  // ...
})
```

**理由:** 取引テストは実際にトランザクションを発行する。本番で動かすと実際のお金が動いてしまう。

---

## 8. CI/CD統合

```yaml
# .github/workflows/e2e.yml
- name: Run E2E tests
  run: npx playwright test
  env:
    BASE_URL: https://staging.example.com  # ステージング環境

- name: Upload artifacts
  if: always()  # 失敗してもアップロード
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

**ポイント:** `if: always()` で失敗時もアーティファクトを残す。

---

## 9. 待機戦略

```typescript
// ❌ 任意の時間待つ（不安定）
await page.waitForTimeout(5000)

// ✅ 特定のAPIレスポンスを待つ
await page.waitForResponse(resp =>
  resp.url().includes('/api/markets/search') && resp.status() === 200
)

// ✅ ネットワークが落ち着くまで待つ
await page.waitForLoadState('networkidle')

// ✅ 要素が見えるまで待つ
await page.locator('[data-testid="results"]').waitFor({ state: 'visible' })
```

---

## 10. テストレポートの構造

```markdown
# E2E Test Report

**Status:** ✅ PASSING / ❌ FAILING
**Total Tests:** X
**Passed:** Y (Z%)
**Failed:** A
**Flaky:** B

## Failed Tests

### 1. search with special characters
**File:** `tests/e2e/markets/search.spec.ts:45`
**Error:** Expected element to be visible
**Screenshot:** artifacts/search-failed.png
**Trace:** artifacts/trace-123.zip

**Recommended Fix:** Escape special characters
```

**設計意図:** 失敗時に「何が壊れて」「どう直すか」がすぐ分かるフォーマット。

---

## まとめ: E2E設定の要点

| 観点 | 実践 |
|------|------|
| **POM** | UIロジックをPage Objectに隔離 |
| **セレクタ** | `data-testid`で安定化 |
| **Flaky管理** | 検出→隔離→修正のサイクル |
| **アーティファクト** | 失敗時のみ詳細記録 |
| **優先度** | 金融＞認証＞検索＞UI |
| **本番禁止** | 金融テストはステージングのみ |
| **待機** | 時間ではなく条件で待つ |

---

## 参照リンク

- **リポジトリ:** https://github.com/affaan-m/everything-claude-code
- **Playwright公式:** https://playwright.dev/
- **POM解説:** https://playwright.dev/docs/pom
