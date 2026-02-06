# calm-tools Design System

> 心を落ち着けるための小さな道具箱 -- デザインシステム v1.0

---

## 1. デザイン原則

### 1-1. Minimal (最小限)

画面に存在するものは全て意味を持つ。装飾的な要素は排除し、ユーザーが「今やること」だけに集中できる余白を作る。

### 1-2. Low Stimulation (低刺激)

色のコントラストは必要最低限にとどめる。派手なアニメーション、鋭いエッジ、高彩度は使わない。呼吸するようなゆるやかな動きだけを許可する。

### 1-3. Duo Tone (2色基調)

各画面は **ベース色 + アクセント色** の2色を軸に構成する。色数を絞ることで視覚的ノイズを最小化し、落ち着きを生む。

### 1-4. Modern & Soft (モダンかつ柔らかい)

大きな角丸(16px-30px)、ガラスモーフィズム(backdrop-filter)、低不透明度のサーフェスで、現代的でありながら柔らかい印象を維持する。

---

## 2. カラーシステム

### 2-1. 設計思想: Duo Tone

各画面（Home / Breath / Grounding）にそれぞれ独立した2色ベースのカラースキームを持たせる。画面遷移によって色が変わることで「モード切替」を体感させる。

### 2-2. パレット定義

#### Home（ホーム画面）

| 役割 | トークン | 値 | 用途 |
|------|---------|-----|------|
| Primary | `colors.home.primary` | `#667eea` | グラデーション開始色 |
| Secondary | `colors.home.secondary` | `#764ba2` | グラデーション終了色 |
| Text | -- | `#ffffff` | 白テキスト |
| Surface | -- | `rgba(255,255,255,0.2)` | カード背景 |

背景: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

#### Breath（呼吸画面）-- ダークグリーン基調

| 役割 | トークン | 値 | 用途 |
|------|---------|-----|------|
| Base BG | `colors.breath.bg` | `#1a3d0a` | 背景ベース |
| Text | `colors.breath.text` | `#e8f5e9` | 主テキスト |
| Text Alt | `colors.breath.textAlt` | `#dcedc8` | 補助テキスト |
| Muted | `colors.breath.muted` | `#c5e1a5` | 落ち着いたテキスト |
| Accent | `colors.breath.accent` | `#8bc34a` | アクセント（進行中） |
| Accent Light | `colors.breath.accentLight` | `#aed581` | アクセント明 |

サーフェス（半透明レイヤー）:

| トークン | 値 | 用途 |
|---------|-----|------|
| `surface` | `rgba(139,195,74, 0.10)` | デフォルト面 |
| `surfaceHover` | `rgba(139,195,74, 0.15)` | ホバー面 |
| `surfaceMedium` | `rgba(139,195,74, 0.20)` | 中間面 |
| `surfaceStrong` | `rgba(139,195,74, 0.25)` | 強調面 |
| `surfaceStronger` | `rgba(139,195,74, 0.30)` | 最強調面 |

ボーダー:

| トークン | 値 | 用途 |
|---------|-----|------|
| `borderWeaker` | `rgba(165,214,167, 0.15)` | 最弱境界 |
| `borderWeak` | `rgba(165,214,167, 0.20)` | 弱い境界 |
| `border` | `rgba(165,214,167, 0.30)` | デフォルト境界 |
| `borderMedium` | `rgba(165,214,167, 0.40)` | 中間境界 |
| `borderStrong` | `rgba(165,214,167, 0.50)` | 強い境界 |
| `borderStronger` | `rgba(165,214,167, 0.60)` | 最強境界 |

背景グラデーション: `linear-gradient(135deg, #2d5016 0%, #1a3d0a 50%, #0f2805 100%)`

#### Grounding（グラウンディング画面）-- パステル基調

| 役割 | トークン | 値 | 用途 |
|------|---------|-----|------|
| BG | `colors.grounding.bg` | `#fef9f3` | カード背景 |
| Text | `colors.grounding.text` | `#5a5a5a` | 主テキスト |
| Text Light | `colors.grounding.textLight` | `#8a8a8a` | 補助テキスト |
| Pink | `colors.grounding.pink` | `#ffd6e0` | ピンクトーン |
| Blue | `colors.grounding.blue` | `#d4e4f7` | ブルートーン |
| Purple | `colors.grounding.purple` | `#e8d9f5` | パープルトーン |

背景グラデーション: `linear-gradient(135deg, #d4e4f7 0%, #ffd6e0 50%, #e8d9f5 100%)`

#### 共通: エラー色

| 役割 | トークン | 値 | 用途 |
|------|---------|-----|------|
| Error BG | `colors.error.bg` | `rgba(231,76,60, 0.10)` | エラー背景 |
| Error Text | `colors.error.text` | `#c0392b` | エラーテキスト |
| Error Accent | `colors.error.accent` | `#e74c3c` | エラー強調 |
| Error Hover | `colors.error.hoverBg` | `rgba(255,100,100, 0.20)` | エラーホバー |

### 2-3. ダークモード考慮

現状は Breath=ダーク / Grounding=ライト の固定。将来的にOS設定連動のダークモードを入れる場合の方針:

- **Breath**: 既にダークトーンのため、変更は最小限。サーフェス不透明度を微調整するのみ。
- **Grounding**: `bg` を `#1a1a2e` 系の暗色に、テキストを `#e0e0e0` 系に反転。パステル3色は彩度を下げ明度を落として使う。
- **Home**: グラデーションの明度を下げる。

---

## 3. タイポグラフィ

### 3-1. フォントスタック

```
token('fonts.body'):
'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif
```

日本語優先のシステムフォント。追加のWebフォント読み込みは行わない（パフォーマンスと低刺激の観点）。

### 3-2. サイズスケール

| 名前 | rem | px相当 | 用途 |
|------|-----|--------|------|
| display | 2.5rem | 40px | 画面タイトル（Home "calm"、Grounding "54321"） |
| heading-1 | 1.8rem | ~29px | セクション見出し（Breath "深呼吸"） |
| heading-2 | 1.5rem | 24px | カードタイトル、ステップタイトル |
| heading-3 | 1.2rem | ~19px | サブ見出し（History タイトル、パターン名） |
| body-lg | 1.1rem | ~18px | 導入文、説明テキスト |
| body | 1.0rem | 16px | 通常テキスト、ボタン |
| body-sm | 0.9rem | ~14px | 履歴アイテム、統計、バッジ |
| caption | 0.85rem | ~14px | パターン説明、日付、補足 |

### 3-3. フォントウェイト

| ウェイト | 値 | 用途 |
|---------|-----|------|
| Light | 200-300 | タイトル、カウントダウン数字、レター間隔広め |
| Regular | 400 | 通常テキスト、パターン名 |
| Medium | 500 | ボタン |

**方針**: Breathはfont-weight: 200-300の軽いウェイトで「息を吸い込むような軽やかさ」を表現。Groundingはfont-weight: 400-500で「地に足のついた安定感」を表現。

### 3-4. レタースペーシング

| 値 | 用途 |
|----|------|
| 0.3em | タイトル（大きな見出し） |
| 0.2em | セクション見出し |
| 0.15em | カードタイトル、パターン名 |
| 0.1em | ボタン、タグライン |
| 0.05em | キャプション |

### 3-5. 行の高さ

| 値 | 用途 |
|----|------|
| 1.0 | カウントダウン数字 |
| 1.4 | パターン説明 |
| 1.6 | 履歴サマリー |
| 1.8 | ステップ説明文 |
| 2.0 | ウェルカムテキスト、完了メッセージ |

---

## 4. スペーシング

### 4-1. ベーススケール (8px グリッド)

| トークン | 値 | 用途 |
|---------|-----|------|
| space-1 | 4px (0.25rem) | アイコンとテキストの間 |
| space-2 | 8px (0.5rem) | duration ボタン間 gap |
| space-3 | 12px (0.75rem) | input 内パディング |
| space-4 | 16px (1rem) | セクション内パディング、ボタン上下 |
| space-5 | 20px (1.25rem) | コンテナ左右パディング |
| space-6 | 24px (1.5rem) | パターンカード間 gap |
| space-8 | 32px (2rem) | コンテナ上下パディング、タイトル下マージン |
| space-10 | 40px (2.5rem) | Grounding card 内パディング |
| space-12 | 48px (3rem) | コントロールセクション下マージン |

### 4-2. 画面最大幅

全画面共通: `max-width: 600px`（モバイルファーストの1カラム設計）

### 4-3. コンテナパディング

- 外側コンテナ: `padding: 2rem` (32px)
- Grounding メインカード: `padding: 40px`

---

## 5. コンポーネント一覧と仕様

### 5-1. Button

#### Primary Button (Grounding)

```
padding: 16px 32px
font-size: 1.1rem
font-weight: 500
border: none
border-radius: 50px (完全丸み帯)
background: linear-gradient(135deg, #ffd6e0, #e8d9f5)
color: #5a5a5a
box-shadow: 0 4px 15px rgba(0,0,0,0.08)
transition: all 0.3s ease
hover: translateY(-2px), shadow強化
```

#### Control Button (Breath)

```
padding: 1rem 2.5rem
font-size: 1rem
border: 1px solid rgba(165,214,167,0.4)
border-radius: 30px
background: rgba(139,195,74, 0.20)
color: #c5e1a5
backdrop-filter: blur(10px)
letter-spacing: 0.1em
transition: all 0.3s ease
hover: background強化 + glow shadow + translateY(-2px)
disabled: opacity 0.4, cursor not-allowed
```

#### Secondary Button (Grounding)

```
padding: 16px 32px
font-size: 1.1rem
font-weight: 500
border: none
border-radius: 50px
background: white
color: #5a5a5a
hover: background #f8f9fa
```

### 5-2. Card (ホーム画面)

```
padding: 2rem
border-radius: 24px
backdrop-filter: blur(10px)
transition: all 0.3s ease
hover: translateY(-4px)
```

- **Breath Card**: `background: rgba(139,195,74,0.2)`, `border: 2px solid rgba(165,214,167,0.4)`
- **Grounding Card**: `background: rgba(255,255,255,0.2)`, `border: 2px solid rgba(255,255,255,0.4)`

### 5-3. SegmentedControl (パターン選択 / Duration 選択)

#### パターン選択

```
layout: flex, gap 1rem, center, wrap
item:
  padding: 1.2rem 1.5rem
  border-radius: 16px
  border: 2px solid rgba(165,214,167,0.3)
  background: rgba(139,195,74, 0.15)
  min-width: 160px
  backdrop-filter: blur(10px)
selected:
  background: rgba(139,195,74, 0.30)
  border-color: rgba(165,214,167, 0.60)
  box-shadow: 0 0 20px rgba(139,195,74,0.3)
disabled: opacity 0.6
```

#### Duration 選択 (ピルボタン群)

```
layout: flex, gap 0.5rem, center
item:
  padding: 0.5rem 1rem
  border-radius: 20px
  border: 1px solid rgba(165,214,167, 0.2)
  font-size: 0.9rem
  opacity: 0.7
selected:
  opacity: 1
  background: rgba(139,195,74, 0.25)
  border-color: rgba(165,214,167, 0.5)
```

### 5-4. Timer (呼吸サークル)

```
circle:
  width: 280px, height: 280px
  border-radius: 50%
  background: radial-gradient(circle, rgba(139,195,74,0.15) 0%, rgba(76,175,80,0.05) 100%)
  border: 2px solid rgba(165,214,167, 0.3)
  box-shadow: 0 0 40px rgba(139,195,74,0.2), inset 0 0 60px rgba(139,195,74,0.1)

countdown (中央数字):
  font-size: 4rem
  font-weight: 200
  color: #c5e1a5

instruction (中央テキスト):
  font-size: 1.5rem
  font-weight: 300
  color: #aed581
  letter-spacing: 0.2em
```

呼吸中のアニメーション: scale(1) -> scale(1.4)、glow の box-shadow 強化

### 5-5. Progress (グラウンディング進行バー)

```
track:
  width: 100%
  height: 8px
  background: rgba(255,255,255, 0.6)
  border-radius: 10px

fill:
  background: linear-gradient(90deg, #ffd6e0, #e8d9f5)
  border-radius: 10px
  transition: width 0.5s ease
```

### 5-6. Input (グラウンディング入力欄)

```
padding: 12px 20px
border: 2px solid rgba(255,255,255, 0.8)
border-radius: 20px
font-size: 1rem
background: white
color: #5a5a5a
transition: all 0.3s ease
focus:
  border-color: #e8d9f5
  box-shadow: 0 0 0 3px rgba(232,217,245, 0.3)
placeholder: color #8a8a8a
```

### 5-7. EmptyState (履歴が空の場合)

```
text-align: center
padding: 40px
color: #8a8a8a (grounding.textLight)

icon: emoji 🐑 (Grounding) / なし (Breath)
  font-size: 4rem
  opacity: 0.5
message: body テキスト
hint: body-sm テキスト
```

### 5-8. HistoryList

#### Breath 履歴

```
layout: flex column, gap 0.8rem
max-height: 200px
overflow-y: auto

item:
  background: rgba(139,195,74, 0.1)
  padding: 0.8rem 1.2rem
  border-radius: 12px
  border: 1px solid rgba(165,214,167, 0.15)
  font-size: 0.9rem
  display: flex, space-between, align-center
  color: #dcedc8
```

#### Grounding 履歴

```
max-height: 400px
overflow-y: auto

item:
  background: white
  border-radius: 20px
  padding: 20px
  margin-bottom: 15px
  box-shadow: 0 2px 10px rgba(0,0,0,0.08)
  hover:
    box-shadow: 0 4px 15px rgba(0,0,0,0.08)
    border-left: 3px solid #e8d9f5
```

### 5-9. HomeButton (各画面左上)

```
position: fixed
top: 1rem, left: 1rem
width: 44px, height: 44px (タッチターゲット最小サイズ)
border-radius: 50%
backdrop-filter: blur(10px)
z-index: 100
transition: all 0.3s ease
hover: scale(1.05)
```

### 5-10. ValidationError

```
background: rgba(231,76,60, 0.1)
color: #c0392b
padding: 12px 16px
border-radius: 12px
font-size: 0.9rem
text-align: center
animation: shake 0.4s ease-in-out
```

---

## 6. レイアウト規約

### 6-1. 共通レイアウト構造

```
+--------------------------------------------------+
| body: min-height 100vh, flex center               |
|                                                    |
|   [HomeButton]  (画面左上 fixed, Home以外)         |
|                                                    |
|   +------------------------------------------+    |
|   | container: max-width 600px, padding 2rem  |    |
|   |                                          |    |
|   |   [Title]         heading, letter-spaced |    |
|   |   [Subtitle/Tagline]   (optional)        |    |
|   |                                          |    |
|   |   [Main Content]                         |    |
|   |     設定選択 / アクティブエリア            |    |
|   |     操作ボタン群                          |    |
|   |                                          |    |
|   |   [History / Sub Content]                |    |
|   |     境界線で区切り                        |    |
|   |     スクロール可能リスト                   |    |
|   +------------------------------------------+    |
+--------------------------------------------------+
```

### 6-2. Home 画面レイアウト

```
+------------------------------------------+
|          calm                             |
|   心をしずかに整える道具箱                  |
|                                          |
|   +----------------+ +----------------+  |
|   |   🌿            | |   🐑            |  |
|   |   呼吸           | |   54321         |  |
|   |   呼吸にあわ...  | |   五感で「い... |  |
|   |   5-5-5 / 4-7-8 | |   5つの感覚    |  |
|   +----------------+ +----------------+  |
|                                          |
+------------------------------------------+
```

- モバイル: カードは縦並び (flex-direction: column)
- sm (640px~): カードは横並び (flex-direction: row)

### 6-3. Breath 画面レイアウト

```
+------------------------------------------+
|   呼吸                                     |
|                                          |
|   [5-5-5]  [4-7-8]     パターン選択      |
|                                          |
|   [1分] [3分] [5分]     時間選択          |
|                                          |
|        +----------+                      |
|       /            \                     |
|      |   4          |   呼吸サークル     |
|      |  吸って       |                    |
|       \            /                     |
|        +----------+                      |
|                                          |
|      のこり 0:45                          |
|                                          |
|   [はじめる]   [もう一度]  コントロール   |
|                                          |
|   ─────────────────                      |
|   ふりかえり                              |
|   X回の呼吸 うちY回おわりまで             |
|   [✓ おわりまで (555)   1/5 14:30]       |
|   [  途中まで (478)     1/4 10:15]       |
+------------------------------------------+
```

### 6-4. Grounding 画面レイアウト

4つの画面状態を持つ:

#### Start 画面

```
+------------------------------------------+
|          54321                             |
|        グラウンディング                     |
|                                          |
|   +------------------------------------+ |
|   |                                    | |
|   |         🐑 (float animation)       | |
|   |                                    | |
|   |   しずかに息を吸って、               | |
|   |   いまの自分に気づいてみましょう。   | |
|   |                                    | |
|   |   [はじめる]        Primary CTA     | |
|   |   [ふりかえりを見る]  Secondary     | |
|   +------------------------------------+ |
+------------------------------------------+
```

#### Step 画面

```
+------------------------------------------+
|          54321                             |
|        グラウンディング                     |
|                                          |
|   +------------------------------------+ |
|   |   [===========----------]  progress | |
|   |                                    | |
|   |         🐑                          | |
|   |   見えるもの 5つ                     | |
|   |   まわりを見わたして、...             | |
|   |                                    | |
|   |   [________________________]  x5   | |
|   |   [________________________]       | |
|   |   [________________________]       | |
|   |   [________________________]       | |
|   |   [________________________]       | |
|   |                                    | |
|   |   [やめる]  [つぎへ]                  | |
|   +------------------------------------+ |
+------------------------------------------+
```

#### Complete 画面

```
+------------------------------------+
|                                    |
|      🐑 (celebrate animation)     |
|                                    |
|   おつかれさまでした                 |
|   いまこの瞬間に、                   |
|   あなたはちゃんとここにいます。      |
|                                    |
|   [おわる]                          |
+------------------------------------+
```

#### History 画面

```
+------------------------------------+
|   ふりかえり                         |
|                                    |
|   +------------------------------+ |
|   | 🌙 2024年1月5日 14:30     ×  | |
|   | [見えるもの] [触れるもの] ... | |
|   +------------------------------+ |
|   | 🌙 2024年1月4日 10:15     ×  | |
|   | [聞こえるもの] [味わうもの]   | |
|   +------------------------------+ |
|                                    |
|   [もどる]                           |
+------------------------------------+
```

---

## 7. アニメーション・トランジション指針

### 7-1. 原則

- **呼吸のリズムに合わせる**: 急な動きは禁止。最短でも 0.3s ease。
- **トランスフォーム優先**: layout shift を起こす `width`/`height` アニメーションではなく、`transform` と `opacity` を使う（GPU合成レイヤー活用）。
- **ユーザーアクション応答**: hover/click は translateY(-2px) + shadow 強化で「浮き上がり」フィードバック。

### 7-2. 共通トランジション

| プロパティ | 値 | 用途 |
|-----------|-----|------|
| `transition` | `all 0.3s ease` | ボタン、カード、全汎用 |
| `transition` | `width 0.5s ease` | プログレスバーの幅変化 |

### 7-3. 呼吸アニメーション (breath.css)

| アニメーション | duration | 動き |
|---------------|----------|------|
| `breatheIn` | 5s (555) / 4s (478) | scale(1) -> scale(1.4), glow 強化 |
| `hold` | 5s (555) / 7s (478) | scale(1.4) 維持 + glow 維持 |
| `breatheOut` | 5s (555) / 8s (478) | scale(1.4) -> scale(1), glow 消失 |

全て `ease-in-out forwards`。

### 7-4. グラウンディングアニメーション (grounding.css)

| アニメーション | duration | 動き | 用途 |
|---------------|----------|------|------|
| `fadeIn` | 0.5s ease | opacity 0->1, translateY(10px->0) | 画面遷移 |
| `float` | 3s ease-in-out infinite | translateY(0 -> -10px -> 0) | 🐑 浮遊 |
| `celebrate` | 1s ease infinite | scale + rotate 揺れ | 完了時 🐑 |
| `shake` | 0.4s ease-in-out | translateX 左右揺れ | バリデーションエラー |

### 7-5. `prefers-reduced-motion` 対応

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

ユーザーが「視覚効果を減らす」を設定している場合、全アニメーションを無効化する。ウェルネスアプリとして、この配慮は必須。

---

## 8. シャドウシステム

| トークン | 値 | 用途 |
|---------|-----|------|
| `shadows.soft` | `0 2px 8px rgba(0,0,0,0.08)` | 軽い浮き |
| `shadows.softMedium` | `0 2px 10px rgba(0,0,0,0.08)` | 履歴アイテム |
| `shadows.softStrong` | `0 4px 15px rgba(0,0,0,0.08)` | ホバー時 |
| `shadows.card` | `0 10px 40px rgba(0,0,0,0.08)` | Grounding メインカード |
| `shadows.cardHover` | `0 6px 20px rgba(0,0,0,0.08)` | カードホバー |
| `shadows.btn` | `0 4px 15px rgba(0,0,0,0.08)` | ボタン |

全てのシャドウは `rgba(0,0,0,0.08)` で統一。「影がある」ことを感じさせつつ、目立ちすぎない。

---

## 9. アクセシビリティ要件

### 9-1. タッチターゲット

全てのインタラクティブ要素は最小 44x44px。HomeButton はこれを満たしている。

### 9-2. キーボードナビゲーション

- Grounding フォーム: Enter で次の入力欄へ、最後の入力欄で Enter は次のステップへ。
- IME composing 中の Enter は無視（`e.isComposing` チェック済み）。

### 9-3. ARIA

- `fieldset` + `legend`（visually-hidden）でフォームグループを明示。
- `aria-describedby` でエラーメッセージと入力欄を関連付け。
- `aria-invalid` でエラー状態を通知。
- `role="alert"` + `aria-live="assertive"` でエラー出現を即座にスクリーンリーダーに通知。

### 9-4. カラーコントラスト

- Breath: `#c5e1a5` on `#1a3d0a` -> コントラスト比 約 7.5:1 (WCAG AAA)
- Grounding: `#5a5a5a` on `#fef9f3` -> コントラスト比 約 5.5:1 (WCAG AA)

---

## Appendix A. Panda CSS トークンマッピング

上記デザインシステムは全て `panda.config.ts` の `tokens` に落とし込まれている。参照方法:

```ts
import { css } from '../../styled-system/css';
import { token } from '../../styled-system/tokens';

// 色
color: token('colors.breath.text')

// グラデーション
background: token('gradients.home')

// シャドウ
boxShadow: token('shadows.card')

// フォント
fontFamily: token('fonts.body')
```

トークン変更時は必ず `npx panda codegen` を実行。

---

## Appendix B. UX ライティングとの整合

> 参照: `docs/ux-writing.md`

### 10-1. 語彙の統一（デザインへの影響）

UXライターの定義した語彙をコンポーネントに反映する。以下の変更はボタンラベル・見出しに直接影響する。

| コンポーネント | 現行ラベル | リニューアル後 | 変更理由 |
|---------------|-----------|--------------|---------|
| Breath Start Button | 開始 / Start | はじめる / Begin | 柔らかい印象 |
| Breath Reset Button | リセット / Reset | もう一度 / Again | 機械的表現を回避 |
| History Section Title | 履歴 / History | ふりかえり / Look Back | 体験としての言葉 |
| Grounding Start Button | はじめる / Start | はじめる / Begin | 統一 |
| Grounding Cancel Button | やめる / Cancel | やめる / Stop | 統一 |
| Grounding History Button | 履歴を見る / View History | ふりかえりを見る / Look Back | 統一 |
| Home Breath Card Title | 深呼吸 / Deep Breathing | 呼吸 / Breathe | シンプルに |
| Home Tagline | 心を落ち着けるためのツール | 心をしずかに整える道具箱 | トーンの統一 |

### 10-2. トーンとデザインの関係

UXライティングガイドの原則「静かに寄り添う」「短く、やわらかく」は、デザインの低刺激・ミニマル原則と同一線上にある。

- **ひらがな多用** -> フォントのレタースペーシングはやや広め（0.1em-0.2em）で、ひらがなの可読性を確保
- **短い文言** -> ボタンの `min-width` は控えめに。文字数が少ないためコンパクトでよい
- **「〜してみて」の語尾** -> instructionテキストの `line-height: 1.8` を維持し、読みやすさを担保

### 10-3. 空状態のデザイン

UXライターの方針「欠乏ではなく未来への期待」に従い、EmptyStateコンポーネントは:

- 「まだ記録がありません」のような否定表現を使わない
- 代わりに「これからの記録がここに残ります」（ポジティブな未来形）
- Groundingの🐑アイコンは opacity: 0.5 で控えめに表示し、寂しさではなく穏やかさを演出

### 10-4. バリデーションメッセージのデザイン

UXライターの方針「間違いではなくもう少し」に従い:

- `error` という色名ではあるが、視覚的には `rgba(231,76,60,0.10)` の低彩度背景
- テキストは `#c0392b`（暗い赤）で刺激を抑制
- shake アニメーション（0.4s）は注意喚起だが、攻撃的にならない短い振動

---

*Last updated: 2026-02-06*
*UX Writing integration: based on docs/ux-writing.md*
