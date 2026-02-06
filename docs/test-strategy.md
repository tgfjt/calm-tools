# calm-tools テスト戦略

> "テストとは、不安を退屈に変えるプログラミング手法である" -- Kent Beck

## 1. テスト方針: 何をテストし、何をテストしないか

### テストする

| 対象 | 理由 |
|------|------|
| 状態遷移ロジック (Phase, Screen) | アプリの核心。壊れたら即ユーザー体験が崩壊する |
| タイマー制御 (開始/停止/リセット/完了) | 時間を扱うロジックはバグの温床 |
| バリデーション (Zodスキーマ) | ユーザー入力の境界。壊れても見た目では分からない |
| データ永続化 (IndexedDB CRUD) | 履歴が消えるとユーザーの信頼を失う |
| 主要フロー (E2E) | Grounding 5ステップ完走、Breath 開始→リセット |
| i18n (テキスト表示) | 既存テストあり。ロケール切替の回帰防止 |

### テストしない

| 対象 | 理由 |
|------|------|
| CSSアニメーション (呼吸円の拡縮) | 視覚的な確認でしか検証できない。自動化のコスパが悪い |
| Panda CSS のトークン解決 | ビルドツールの責務。我々が検証する必要はない |
| Astro の SSR / ルーティング | フレームワークの責務。E2E で間接的に確認 |
| Preact のレンダリング挙動 | ライブラリの責務。我々はコンポーネントの振る舞いを検証する |
| IndexedDB のブラウザ実装差異 | Chromium でのみ E2E を走らせる（PWA 対象ブラウザ） |

---

## 2. テストピラミッド

```
        /\
       /  \    E2E (Playwright)
      / 3  \   - 主要フロー 2~3本
     /------\  - i18n (既存)
    /        \
   / 統合 5   \  Integration (Vitest + happy-dom)
  /   テスト   \  - コンポーネント + 状態管理
 /--------------\
/                \
/   Unit 10+     \  Unit (Vitest)
/  ドメインロジック \  - タイマー, 状態遷移, バリデーション, DB層
------------------
```

**配分の考え方:**
- Unit を最も厚くする。速い、安定する、リファクタしやすい
- Integration は「UIと状態管理の結合」を確認する最小限
- E2E は「本当に動く」を確認するスモークテスト

---

## 3. 各レイヤーのテスト設計

### 3.1 ドメインロジック (Unit)

現在、ロジックが UI コンポーネントに直接埋まっている。テスト可能にするために**抽出**が必要。

#### 抽出対象 1: 呼吸パターン / フェーズ遷移

```typescript
// src/lib/breath-timer.ts (抽出先)
export type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';
export type Pattern = '555' | '478';

export const patternConfigs = {
  '555': { inhale: 5, hold: 5, exhale: 5 },
  '478': { inhale: 4, hold: 7, exhale: 8 },
} as const;

export function nextPhase(current: Phase): Phase {
  const order: Phase[] = ['inhale', 'hold', 'exhale'];
  const idx = order.indexOf(current);
  if (idx === -1) return 'inhale'; // idle -> inhale
  if (idx < order.length - 1) return order[idx + 1];
  return 'inhale'; // exhale -> inhale (次サイクル)
}

export function phaseDuration(pattern: Pattern, phase: Phase): number {
  if (phase === 'idle' || phase === 'complete') return 0;
  return patternConfigs[pattern][phase];
}

export function cycleDuration(pattern: Pattern): number {
  const p = patternConfigs[pattern];
  return p.inhale + p.hold + p.exhale;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
```

**テストケース:**

```typescript
// src/lib/__tests__/breath-timer.test.ts
describe('nextPhase', () => {
  it('idle -> inhale', () => expect(nextPhase('idle')).toBe('inhale'));
  it('inhale -> hold', () => expect(nextPhase('inhale')).toBe('hold'));
  it('hold -> exhale', () => expect(nextPhase('hold')).toBe('exhale'));
  it('exhale -> inhale (cycle)', () => expect(nextPhase('exhale')).toBe('inhale'));
});

describe('phaseDuration', () => {
  it('555: 各フェーズ5秒', () => {
    expect(phaseDuration('555', 'inhale')).toBe(5);
    expect(phaseDuration('555', 'hold')).toBe(5);
    expect(phaseDuration('555', 'exhale')).toBe(5);
  });
  it('478: 4-7-8秒', () => {
    expect(phaseDuration('478', 'inhale')).toBe(4);
    expect(phaseDuration('478', 'hold')).toBe(7);
    expect(phaseDuration('478', 'exhale')).toBe(8);
  });
  it('idle/complete は 0', () => {
    expect(phaseDuration('555', 'idle')).toBe(0);
    expect(phaseDuration('555', 'complete')).toBe(0);
  });
});

describe('cycleDuration', () => {
  it('555 = 15秒', () => expect(cycleDuration('555')).toBe(15));
  it('478 = 19秒', () => expect(cycleDuration('478')).toBe(19));
});

describe('formatTime', () => {
  it('60秒 -> 1:00', () => expect(formatTime(60)).toBe('1:00'));
  it('0秒 -> 0:00', () => expect(formatTime(0)).toBe('0:00'));
  it('305秒 -> 5:05', () => expect(formatTime(305)).toBe('5:05'));
});
```

#### 抽出対象 2: Grounding ステップ設定

```typescript
// src/lib/grounding-steps.ts (抽出先)
export type StepCategory = 'sight' | 'touch' | 'sound' | 'smell' | 'taste';

export const stepConfigs: { count: number; category: StepCategory }[] = [
  { count: 5, category: 'sight' },
  { count: 4, category: 'touch' },
  { count: 3, category: 'sound' },
  { count: 2, category: 'smell' },
  { count: 1, category: 'taste' },
];

export function totalSteps(): number {
  return stepConfigs.length;
}

export function progress(currentStep: number): number {
  return ((currentStep + 1) / stepConfigs.length) * 100;
}

export function isLastStep(currentStep: number): boolean {
  return currentStep >= stepConfigs.length - 1;
}
```

#### 抽出対象 3: Zodバリデーション (既にある)

```typescript
// src/lib/__tests__/schemas.test.ts
describe('stepResponseSchema', () => {
  it('少なくとも1つ入力があればOK', () => {
    expect(stepResponseSchema.safeParse(['hello', '', '']).success).toBe(true);
  });
  it('全て空はNG', () => {
    expect(stepResponseSchema.safeParse(['', '', '']).success).toBe(false);
  });
  it('空白のみはNG', () => {
    expect(stepResponseSchema.safeParse(['  ', '  ']).success).toBe(false);
  });
  it('空配列はNG', () => {
    expect(stepResponseSchema.safeParse([]).success).toBe(false);
  });
  it('1つだけ有効な入力があればOK', () => {
    expect(stepResponseSchema.safeParse(['木', '', '', '', '']).success).toBe(true);
  });
});
```

### 3.2 データ層 - IndexedDB (Unit/Integration)

#### テスト方法の選択肢

| 方法 | Pros | Cons |
|------|------|------|
| **fake-indexeddb** | Node.js で完結、速い | 実装差異の可能性 |
| **Playwright の evaluate** | 実ブラウザで動く | E2E 寄りで遅い |

**推奨: fake-indexeddb を使った Unit テスト**

DB 操作はシンプルな CRUD なので、fake-indexeddb で十分。ブラウザ差異は E2E で間接的にカバー。

```typescript
// src/lib/__tests__/db.test.ts
import 'fake-indexeddb/auto';
import { initDB, saveBreathSession, getBreathSessions,
         saveGroundingSession, getGroundingSessions, deleteGroundingSession } from '../db';

beforeEach(async () => {
  // DB をリセット（fake-indexeddb のグローバル状態をクリア）
  indexedDB = new IDBFactory();
  await initDB();
});

describe('Breath Sessions', () => {
  it('セッションを保存して取得できる', async () => {
    const id = await saveBreathSession({
      timestamp: '2025-01-01T00:00:00.000Z',
      completed: true,
      duration: 60,
      pattern: '555',
    });
    expect(id).toBeGreaterThan(0);

    const sessions = await getBreathSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].pattern).toBe('555');
    expect(sessions[0].completed).toBe(true);
  });

  it('複数セッションを保存できる', async () => {
    await saveBreathSession({ timestamp: 'T1', completed: true, duration: 60, pattern: '555' });
    await saveBreathSession({ timestamp: 'T2', completed: false, duration: 30, pattern: '478' });
    const sessions = await getBreathSessions();
    expect(sessions).toHaveLength(2);
  });
});

describe('Grounding Sessions', () => {
  it('セッションを保存・取得・削除できる', async () => {
    const id = await saveGroundingSession({
      timestamp: '2025-01-01T00:00:00.000Z',
      responses: [
        { step: 0, category: 'sight', title: '見えるもの', data: ['木', '空'] },
      ],
    });

    let sessions = await getGroundingSessions();
    expect(sessions).toHaveLength(1);

    await deleteGroundingSession(id);
    sessions = await getGroundingSessions();
    expect(sessions).toHaveLength(0);
  });
});

describe('DB未初期化エラー', () => {
  it('initDB前に操作するとエラー', async () => {
    // 新しいモジュールインスタンスをロードして未初期化状態を再現
    // (実装によってはモジュールリセットが必要)
    // この挙動は現在のシングルトン構造では検証しにくい -> リファクタ候補
  });
});
```

**注意:** 現在の `db.ts` はモジュールレベルのシングルトン (`let db: IDBDatabase | null = null`) なので、テスト間の分離が難しい。リファクタで DI か factory パターンに変更するとテスタビリティが向上する。

### 3.3 UIコンポーネント (Integration)

Preact コンポーネントのテストは **@testing-library/preact** を使い、ユーザー操作をシミュレートする。

ただし、現在のコンポーネントは「ロジックとUI が密結合」しているため、ロジック抽出後にテストを書く。

#### BreathApp のテスト粒度

**テストする:**
- パターン選択ボタンの切り替え
- 時間選択ボタンの切り替え
- 開始ボタンで isRunning が true になる
- リセットで idle に戻る
- 実行中はパターン/時間選択が disabled になる

**テストしない:**
- CSS アニメーションクラスの付替え（circleClass）
- タイマーの正確な 1 秒刻み（vi.useFakeTimers で疑似的に確認は可能だが、投資対効果が低い）

#### GroundingApp のテスト粒度

**テストする:**
- 「はじめる」で step 画面に遷移
- 入力して「次へ」でステップが進む
- 全ステップ完了で complete 画面に到達
- バリデーションエラーの表示と自動消去
- 「履歴」画面への遷移と戻り

**テストしない:**
- confirm ダイアログ（ブラウザ依存、E2E で確認）
- inputRef のフォーカス制御（E2E で確認）

### 3.4 E2E (Playwright)

既存の `tests/e2e/i18n.spec.ts` に加えて、主要フローを 2 本追加する。

#### Grounding フロー (最優先)

```typescript
// tests/e2e/grounding.spec.ts
test('5ステップを完走してセッションが保存される', async ({ page }) => {
  await page.goto('/grounding');

  // 開始
  await page.locator('[data-testid="grounding-start-btn"]').click();
  await expect(page.locator('[data-testid="grounding-screen-step"]')).toBeVisible();

  // Step 1: 見えるもの (5つ)
  const sightInput = page.locator('[data-testid="grounding-input-sight-0"]');
  await expect(sightInput).toBeVisible();
  await sightInput.fill('木');
  await page.locator('[data-testid="grounding-next-btn"]').click();

  // Step 2: 触れるもの (4つ)
  await expect(page.locator('[data-testid="grounding-input-touch-0"]')).toBeVisible();
  await page.locator('[data-testid="grounding-input-touch-0"]').fill('机');
  await page.locator('[data-testid="grounding-next-btn"]').click();

  // Step 3: 聞こえるもの (3つ)
  await expect(page.locator('[data-testid="grounding-input-sound-0"]')).toBeVisible();
  await page.locator('[data-testid="grounding-input-sound-0"]').fill('風');
  await page.locator('[data-testid="grounding-next-btn"]').click();

  // Step 4: 匂い (2つ)
  await expect(page.locator('[data-testid="grounding-input-smell-0"]')).toBeVisible();
  await page.locator('[data-testid="grounding-input-smell-0"]').fill('コーヒー');
  await page.locator('[data-testid="grounding-next-btn"]').click();

  // Step 5: 味 (1つ)
  await expect(page.locator('[data-testid="grounding-input-taste-0"]')).toBeVisible();
  await page.locator('[data-testid="grounding-input-taste-0"]').fill('お茶');
  await page.locator('[data-testid="grounding-next-btn"]').click();

  // 完了画面
  await expect(page.locator('[data-testid="grounding-screen-complete"]')).toBeVisible();
});

test('未入力で次へ進めない（バリデーション）', async ({ page }) => {
  await page.goto('/grounding');
  await page.locator('[data-testid="grounding-start-btn"]').click();

  // 何も入力せずに次へ
  await page.locator('[data-testid="grounding-next-btn"]').click();

  // エラーが表示される
  await expect(page.locator('[data-testid="grounding-validation-error"]')).toBeVisible();
});
```

#### Breath フロー

```typescript
// tests/e2e/breath.spec.ts
test('呼吸エクササイズの開始とリセット', async ({ page }) => {
  await page.goto('/breath');

  // パターンボタンが表示される
  await expect(page.getByText('5-5-5')).toBeVisible();
  await expect(page.getByText('4-7-8')).toBeVisible();

  // 開始ボタンをクリック
  const startBtn = page.getByRole('button', { name: /開始|Start/ });
  await startBtn.click();

  // フェーズ表示が変わる（idle以外になる）
  // リセットが有効になる
  const resetBtn = page.getByRole('button', { name: /リセット|Reset/ });
  await expect(resetBtn).toBeEnabled();

  // リセット
  await resetBtn.click();

  // idle 状態に戻る
  await expect(startBtn).toBeEnabled();
});
```

---

## 4. リファクタ戦略: テストを武器にした安全な改修手順

### フェーズ 1: 外堀を埋める (E2E + スキーマテスト)

**まず E2E テストと Zod スキーマのテストを先に書く。** これにより、リファクタ中に「何も壊していない」ことを保証する安全ネットを張る。

```
[E2E: Grounding完走] → 安全ネット
[E2E: Breath開始→リセット] → 安全ネット
[Unit: stepResponseSchema] → 既存ロジックの仕様化テスト
```

### フェーズ 2: ドメインロジックの抽出 (Unit テスト駆動)

UIコンポーネントからロジックを抽出する。**テストを先に書いてからコードを動かす。**

```
1. src/lib/breath-timer.ts を作成
   - テストを先に書く
   - BreathApp.tsx から関数を移動
   - E2E が通ることを確認

2. src/lib/grounding-steps.ts を作成
   - テストを先に書く
   - GroundingApp.tsx から定数・関数を移動
   - E2E が通ることを確認
```

### フェーズ 3: データ層のテスタビリティ改善

```
1. fake-indexeddb を devDependencies に追加
2. db.ts のテストを書く (現状の API で)
3. 必要に応じて DB 初期化を DI 可能にする
```

### フェーズ 4: UIコンポーネントのテスト (Integration)

ロジック抽出後のコンポーネントは「表示と操作」に集中しているので、テストがシンプルになる。

```
1. @testing-library/preact を導入
2. BreathApp: パターン/時間選択、開始/停止の操作テスト
3. GroundingApp: 画面遷移、入力、バリデーション表示のテスト
```

### 各フェーズの判断基準

| フェーズ | 完了条件 | 中止条件 |
|---------|---------|---------|
| 1. E2E | 主要フロー 2 本が green | - |
| 2. ロジック抽出 | 抽出した関数の Unit テストが green + E2E が green | ロジック分離が困難な箇所はスキップ |
| 3. DB テスト | CRUD の Unit テストが green | fake-indexeddb の制約に当たったら E2E に委ねる |
| 4. UI テスト | 操作テストが green + E2E が green | タイマー系は不安定なら捨てる |

---

## 5. テストで捨てる領域と理由

| 捨てる領域 | 理由 |
|-----------|------|
| **CSSアニメーションの正確さ** | 呼吸円の拡縮アニメーションは keyframes で制御されており、ブラウザの描画パイプラインに依存する。テストしても意味のある assertion が書けない。目視確認で十分。 |
| **タイマーの精度 (1ms単位)** | `setInterval` はブラウザのイベントループに依存し、正確な1秒を保証しない。テストでは `vi.useFakeTimers()` で論理的な動作のみ確認する。 |
| **レスポンシブデザイン** | ビューポートごとのレイアウト崩れは、テスト自動化のコストに対して検出率が低い。デバイス確認は手動で行う。 |
| **IndexedDB のブラウザ間差異** | PWA のターゲットは主に Chrome/Safari。Chromium での E2E で最低限カバーし、Safari 固有の問題は手動確認。 |
| **テーマ切替の視覚的正しさ** | `home` / `breath` / `grounding` のテーマ色がトークン通りに適用されているかは、ビルドツール (Panda CSS) を信頼する。 |
| **Astro の SSR 挙動** | `detectLocaleFromHeader` は i18n E2E で間接カバー。SSR 自体のテストはフレームワークの責務。 |
| **Navigation コンポーネント** | リンク 3 本の静的コンポーネント。壊れても E2E で気づく。独立テストの価値がない。 |

---

## 6. ツールチェイン

### 必要な追加パッケージ

```bash
# Unit / Integration テスト
npm i -D vitest happy-dom @testing-library/preact @testing-library/user-event fake-indexeddb

# Playwright は導入済み
```

### Vitest 設定

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
    coverage: {
      include: ['src/lib/**'],
      // UIコンポーネントのカバレッジは追わない
    },
  },
});
```

### package.json scripts 追加

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### ディレクトリ構成

```
src/
  lib/
    __tests__/
      breath-timer.test.ts    # Phase遷移、時間計算
      grounding-steps.test.ts # ステップ管理
      schemas.test.ts         # Zodバリデーション
      db.test.ts              # IndexedDB CRUD
    breath-timer.ts           # 抽出したドメインロジック
    grounding-steps.ts        # 抽出したドメインロジック
    db.ts                     # 既存
    schemas.ts                # 既存
  components/
    breath/
      __tests__/
        BreathApp.test.tsx    # Integration (フェーズ4)
    grounding/
      __tests__/
        GroundingApp.test.tsx # Integration (フェーズ4)
tests/
  e2e/
    i18n.spec.ts              # 既存
    grounding.spec.ts         # 新規
    breath.spec.ts            # 新規
```

---

## 7. 実行順序のまとめ

```
Phase 1: 安全ネット
  ├── [x] E2E: i18n (既存)
  ├── [ ] E2E: grounding.spec.ts
  ├── [ ] E2E: breath.spec.ts
  └── [ ] Unit: schemas.test.ts

Phase 2: ドメインロジック抽出 (TDD)
  ├── [ ] breath-timer.ts + テスト
  └── [ ] grounding-steps.ts + テスト

Phase 3: データ層
  └── [ ] db.test.ts (fake-indexeddb)

Phase 4: UIコンポーネント
  ├── [ ] BreathApp.test.tsx
  └── [ ] GroundingApp.test.tsx
```

**原則: 各フェーズの完了後に必ず E2E を回して回帰がないことを確認する。**
