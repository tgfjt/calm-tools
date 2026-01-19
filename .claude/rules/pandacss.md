# Panda CSS ルール

## 基本方針

**宣言的な定義 → 利用** の形を守る。

```ts
// panda.config.ts でトークン定義
tokens: {
  colors: {
    breath: { text: { value: "#e8f5e9" } }
  }
}

// コンポーネントで token() で参照
import { token } from '../../styled-system/tokens';
color: token('colors.breath.text')
```

## Astro での設定

### 1. global.css に @layer ディレクティブ

```css
@layer reset, base, tokens, recipes, utilities;
```

これだけ。他のスタイルは書かない。

### 2. Layout.astro で global.css をインポート

```astro
---
import '../styles/global.css';
import { css } from '../../styled-system/css';
import { token } from '../../styled-system/tokens';
---
```

### 3. PostCSS 設定は配列形式

```js
// postcss.config.cjs
module.exports = {
  plugins: [require('@pandacss/dev/postcss')()],
}
```

オブジェクト形式 `{ '@pandacss/dev/postcss': {} }` は動かない。

## トークン参照

### 間違い

```ts
css({
  color: 'colors.breath.text',  // 文字列としてそのまま出力される
  fontFamily: 'fonts.body',     // 同上
})
```

### 正しい

```ts
import { token } from '../../styled-system/tokens';

css({
  color: token('colors.breath.text'),
  fontFamily: token('fonts.body'),
})
```

## Astro コンポーネントでの css() 利用

Astro の frontmatter で `css()` と `token()` は普通に使える。

```astro
---
import { css } from '../../styled-system/css';
import { token } from '../../styled-system/tokens';

const styles = {
  container: css({
    padding: '2rem',
    color: token('colors.breath.text'),
  }),
};
---

<div class={styles.container}>...</div>
```

## keyframes は別 CSS ファイル

Panda CSS は keyframes を定義できない。アニメーション用の keyframes は別 CSS ファイルに残す。

```css
/* src/styles/breath.css */
@keyframes breatheIn {
  0% { transform: scale(1); }
  100% { transform: scale(1.4); }
}

.circle.breathing-in {
  animation: breatheIn 5s ease-in-out forwards;
}
```

## globalCss の使い方

### OK: 要素のデフォルトスタイル

```ts
// panda.config.ts
const globalCss = defineGlobalStyles({
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  button: {
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  'input, textarea': {
    fontFamily: 'inherit',
  },
});
```

これらは全ページ共通のベーススタイル。

### ダメ: テーマ切り替えを globalCss でやる

```ts
// ダメ
const globalCss = defineGlobalStyles({
  'body[data-theme="home"]': {
    background: 'linear-gradient(...)',  // 生の値
  },
});
```

テーマ切り替えは各コンポーネントで css() + token() を使う。

```astro
---
const bodyStyles = {
  home: css({ background: token('gradients.home') }),
  breath: css({ background: token('gradients.breath') }),
};
---
<body class={bodyStyles[theme]}>
```

## コマンド

```bash
npx panda codegen  # styled-system 再生成
```

panda.config.ts を変更したら必ず実行。
