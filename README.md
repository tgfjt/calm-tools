# calm

[![Tests](https://github.com/tgfjt/calm-tools/actions/workflows/e2e.yml/badge.svg)](https://github.com/tgfjt/calm-tools/actions/workflows/e2e.yml)
[![Fuzz](https://github.com/tgfjt/calm-tools/actions/workflows/fuzz.yml/badge.svg)](https://github.com/tgfjt/calm-tools/actions/workflows/fuzz.yml)

心を落ち着けるためのウェルネスツール集

## Features

### /breath - 深呼吸
1分間の呼吸エクササイズ
- **5-5-5**: バランス型（吸う5秒・止める5秒・吐く5秒）
- **4-7-8**: 鎮静型（吸う4秒・止める7秒・吐く8秒）

### /grounding - 54321
グラウンディング法で今この瞬間に意識を向ける
- 5つの見えるもの
- 4つの触れるもの
- 3つの聞こえるもの
- 2つの匂うもの
- 1つの味わうもの

## Tech Stack

- Astro + Preact
- IndexedDB（セッション履歴）
- Zod（バリデーション）
- Cloudflare Pages

## Development

```bash
npm install
npm run dev     # localhost:4321
npm run build   # dist/
```

## Deploy

```bash
wrangler pages deploy dist
```
