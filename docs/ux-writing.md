# UX Writing Guide - calm-tools

> 心を落ち着けるためのアプリだからこそ、テキストそのものが穏やかな体験であること。

---

## 1. ライティング原則

### トーン

| 原則 | 説明 |
|------|------|
| **静かに寄り添う** | 指示ではなく、誘いかけ。「〜してください」より「〜しましょう」「〜してみて」 |
| **短く、やわらかく** | 一文は30文字以内を目安に。句読点も余白のひとつ |
| **今に集中させる** | 過去の実績や未来の目標には触れない。「いま、ここ」だけを描く |
| **余白を大切にする** | 情報を詰め込まない。画面に余白があるように、文にも余白を |

### 禁止事項

- 命令口調（「〜しなさい」「〜すべき」 / "You must", "You should"）
- 感嘆符（！）の使用 -- 静けさを壊す
- 専門用語（「副交感神経」「マインドフルネス」など）を文言に使わない
- 達成・競争を想起させる表現（「チャレンジ」「レベルアップ」「ストリーク」）
- ネガティブな表現で始めない（「まだ記録がありません」→ 肯定的に言い換える）
- 「失敗」「エラー」という言葉を直接ユーザーに見せない

### 語彙ルール（統一用語）

画面間で同じ概念には同じ言葉を使う。

| 概念 | 日本語 | English | 不使用 |
|------|--------|---------|--------|
| 練習を始める | はじめる | Begin | Start, Launch, Go |
| 練習を終える | おわる | Finish | End, Done, Complete |
| 中断する | やめる | Stop | Cancel, Abort, Quit |
| 初期状態に戻す | もう一度 | Again | Reset, Clear, Restart |
| 履歴を見る | ふりかえり | Look Back | History, Records, Log |
| ホームへ戻る | もどる | Home | Back, Return |
| 次のステップへ | つぎへ | Next | Continue, Proceed |

---

## 2. 共通文言

### ナビゲーション

| キー | 日本語 | English |
|------|--------|---------|
| `common.home` | ホーム | Home |
| `common.backToHome` | ホームへもどる | Back to Home |
| `nav.breath` | 呼吸 | Breathe |
| `nav.grounding` | 54321 | 54321 |

### ホーム画面 (`index`)

| キー | 日本語 | English |
|------|--------|---------|
| `index.tagline` | 心をしずかに整える道具箱 | A quiet space for your mind |
| `index.breathTitle` | 呼吸 | Breathe |
| `index.breathDesc` | 呼吸にあわせて、ゆっくりと | Slow down with your breath |
| `index.breathPatterns` | 5-5-5 / 4-7-8 | 5-5-5 / 4-7-8 |
| `index.groundingTitle` | 54321 | 54321 |
| `index.groundingDesc` | 五感で「いま」に気づく | Notice the present with your senses |
| `index.groundingPatterns` | 5つの感覚をたどって | Through your 5 senses |

---

## 3. Deep Breathing 画面

### ページタイトル

| キー | 日本語 | English |
|------|--------|---------|
| `breath.title` | 呼吸 | Breathe |

### 呼吸パターン選択

| キー | 日本語 | English |
|------|--------|---------|
| `breath.patterns.555.name` | 5-5-5 | 5-5-5 |
| `breath.patterns.555.desc` | バランスのとれた呼吸\nリフレッシュしたいときに | Balanced breathing\nFor a fresh start |
| `breath.patterns.478.name` | 4-7-8 | 4-7-8 |
| `breath.patterns.478.desc` | ゆったりと深い呼吸\n眠る前のひとときに | Deep, slow breathing\nBefore rest |

### 所要時間選択

| キー | 日本語 | English |
|------|--------|---------|
| `breath.durations.60` | 1分 | 1 min |
| `breath.durations.180` | 3分 | 3 min |
| `breath.durations.300` | 5分 | 5 min |

### フェーズ表示（呼吸中の状態文言）

| キー | 状態 | 日本語 | English |
|------|------|--------|---------|
| `breath.phases.idle` | 待機中 | 準備ができたら、はじめましょう | Whenever you're ready |
| `breath.phases.inhale` | 吸う | 吸って | Breathe in |
| `breath.phases.hold` | 止める | とめて | Hold |
| `breath.phases.exhale` | 吐く | 吐いて | Breathe out |
| `breath.phases.complete` | 完了 | おつかれさまでした | Well done |

### コントロール

| キー | 日本語 | English |
|------|--------|---------|
| `breath.start` | はじめる | Begin |
| `breath.reset` | もう一度 | Again |

### タイマー表示

| キー | 日本語 | English |
|------|--------|---------|
| `breath.remaining` | のこり | remaining |

フォーマット: `のこり 2:30` / `2:30 remaining`

### ふりかえり（履歴）

| キー | 日本語 | English |
|------|--------|---------|
| `breath.history` | ふりかえり | Look Back |
| `breath.noRecords` | これからの記録がここに残ります | Your sessions will appear here |
| `breath.stats` | {total}回の呼吸 うち{completed}回おわりまで | {total} sessions, {completed} completed |
| `breath.completed` | おわりまで | Completed |
| `breath.interrupted` | 途中まで | Paused |

---

## 4. 54321 Grounding 画面

### ページタイトル

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.title` | 54321 | 54321 |
| `grounding.subtitle` | グラウンディング | Grounding |

### スタート画面

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.welcomeText` | しずかに息を吸って、\nいまの自分に気づいてみましょう。 | Take a quiet breath,\nand gently notice this moment. |
| `grounding.startBtn` | はじめる | Begin |
| `grounding.historyBtn` | ふりかえりを見る | Look Back |

### ステップ画面

#### 5 - 見えるもの（Sight）

| キー | 日本語 | English |
|------|--------|---------|
| `steps.sight.title` | 見えるもの 5つ | 5 things you can see |
| `steps.sight.instruction` | まわりを見わたして、目にとまるものを5つ見つけてみて。 | Look around you and gently find 5 things you can see. |
| `steps.sight.placeholderFirst` | 例）やわらかい光、窓の向こうの空... | e.g. soft light, the sky outside... |
| `steps.sight.placeholderN` | {n}つ目 | {n} of 5 |

#### 4 - 触れるもの（Touch）

| キー | 日本語 | English |
|------|--------|---------|
| `steps.touch.title` | 触れるもの 4つ | 4 things you can touch |
| `steps.touch.instruction` | 手をのばして、触れられるものを4つ感じてみて。 | Reach out and feel 4 things you can touch. |
| `steps.touch.placeholderFirst` | 例）あたたかいカップ、やわらかい布... | e.g. a warm cup, soft fabric... |
| `steps.touch.placeholderN` | {n}つ目 | {n} of 4 |

#### 3 - 聞こえるもの（Sound）

| キー | 日本語 | English |
|------|--------|---------|
| `steps.sound.title` | 聞こえるもの 3つ | 3 things you can hear |
| `steps.sound.instruction` | 耳をすませて、いま聞こえる音を3つ見つけてみて。 | Listen quietly and find 3 sounds around you. |
| `steps.sound.placeholderFirst` | 例）とおくの車の音、風の音... | e.g. a distant hum, the breeze... |
| `steps.sound.placeholderN` | {n}つ目 | {n} of 3 |

#### 2 - 匂うもの（Smell）

| キー | 日本語 | English |
|------|--------|---------|
| `steps.smell.title` | 匂うもの 2つ | 2 things you can smell |
| `steps.smell.instruction` | 鼻からそっと息を吸って、まわりの匂いに気づいてみて。 | Breathe in gently and notice 2 scents around you. |
| `steps.smell.placeholderFirst` | 例）コーヒーの香り、木の匂い... | e.g. coffee, fresh air... |
| `steps.smell.placeholderN` | {n}つ目 | {n} of 2 |

#### 1 - 味わうもの（Taste）

| キー | 日本語 | English |
|------|--------|---------|
| `steps.taste.title` | 味わうもの 1つ | 1 thing you can taste |
| `steps.taste.instruction` | 口のなかに意識を向けて、いま感じる味を見つけてみて。 | Bring your attention to your mouth and find 1 taste. |
| `steps.taste.placeholderFirst` | 例）お茶のあとの余韻、唇の乾き... | e.g. a hint of tea, a cool breath... |
| `steps.taste.placeholderN` | {n}つ目 | {n} of 1 |

### ステップ中のコントロール

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.cancelBtn` | やめる | Stop |
| `grounding.nextBtn` | つぎへ | Next |

### 完了画面

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.completeTitle` | おつかれさまでした | Well done |
| `grounding.completeMessage` | いまこの瞬間に、\nあなたはちゃんとここにいます。 | Right here, right now,\nyou are grounded. |
| `grounding.endBtn` | おわる | Finish |

### ふりかえり画面

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.historyTitle` | ふりかえり | Look Back |
| `grounding.backBtn` | もどる | Back |
| `grounding.deleteTitle` | この記録をけす | Remove this entry |

### 確認ダイアログ

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.confirmCancel` | 途中ですが、やめますか？ | Would you like to stop here? |
| `grounding.confirmDelete` | この記録をけしますか？ | Remove this entry? |

### アクセシビリティ

| キー | 日本語 | English |
|------|--------|---------|
| `grounding.accessibilityLabels.inputLabel` | {n}つ目の入力 | Entry {n} |

---

## 5. 空状態・エラー文言

### 空状態（Empty State）

空の状態は「寂しさ」ではなく「これから始まる穏やかな予感」として表現する。

| 画面 | 日本語 | English |
|------|--------|---------|
| 呼吸の履歴なし | これからの記録がここに残ります | Your sessions will appear here |
| グラウンディング履歴なし（1行目） | まだふりかえりはありません。 | Nothing here yet. |
| グラウンディング履歴なし（2行目） | はじめてのセッションをやってみましょう。 | Try your first session whenever you're ready. |

### バリデーション文言

入力のバリデーションはやわらかく促す。「間違い」ではなく「もう少し」の感覚で。

| 状況 | 日本語 | English |
|------|--------|---------|
| 入力欄が空のまま進もうとした | ひとつでも書いてみてください | Try writing at least one thing |
| 入力が短すぎる | もうすこしだけ、書いてみて | Just a little more |

### システムエラー（IndexedDB障害など）

ユーザーに技術的な詳細を見せず、安心感を伝える。

| 状況 | 日本語 | English |
|------|--------|---------|
| データの保存に失敗 | 記録の保存がうまくいきませんでした。もう一度やってみてください。 | We couldn't save your session. Please try again. |
| データの読み込みに失敗 | ふりかえりの読み込みがうまくいきませんでした。 | We couldn't load your history right now. |
| データの削除に失敗 | 記録のけしょくがうまくいきませんでした。 | We couldn't remove this entry. |

---

## 6. 日時フォーマット

| ロケール | フォーマット | 例 |
|----------|-------------|-----|
| ja | YYYY年M月D日 HH:MM | 2026年2月6日 14:30 |
| en | M/D/YYYY HH:MM | 2/6/2026 14:30 |

---

## 7. 現行文言との差分まとめ

リニューアルで変更する文言の一覧。

### 語彙統一の変更

| 現行 | リニューアル後（日本語） | リニューアル後（English） | 理由 |
|------|------------------------|-------------------------|------|
| 開始 | はじめる | Begin | 「開始」は堅い。ひらがなで柔らかく |
| リセット | もう一度 | Again | 「リセット」はカタカナ外来語。やさしい日本語に |
| 履歴 | ふりかえり | Look Back | 「履歴」はシステム用語。体験としての言葉に |
| Start | Begin | -- | "Start"は急かす印象。"Begin"は穏やかに始まる感覚 |
| Reset | Again | -- | "Reset"は機械的。"Again"は自然に繰り返せる |
| History | Look Back | -- | "History"はデータベース的。"Look Back"はふりかえりの体験 |
| Cancel | Stop | -- | "Cancel"は否定的。"Stop"は自然な中断 |
| 完了しました | おつかれさまでした | Well done | 報告ではなく、労い |
| まだ記録がありません | これからの記録がここに残ります | Your sessions will appear here | 欠乏ではなく、未来への期待 |

### トーンの変更

| 現行 | リニューアル後 | 理由 |
|------|--------------|------|
| 準備ができたら開始 | 準備ができたら、はじめましょう | 読点と「ましょう」で柔らかさを |
| Ready when you are | Whenever you're ready | より自然な英語表現 |
| 深呼吸をして、今この瞬間に意識を向けましょう。 | しずかに息を吸って、いまの自分に気づいてみましょう。 | 「深呼吸」は指示的。「しずかに息を吸って」は誘いかけ |
| いま、目に見えるものを5つ、ゆっくり見つけてください。 | まわりを見わたして、目にとまるものを5つ見つけてみて。 | 「ください」を避け、「みて」で柔らかく |
