# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # 開発サーバー (localhost:4321)
npm run build   # ビルド → dist/
wrangler pages deploy dist  # Cloudflare Pagesデプロイ
```

## Architecture

Astro + Preact のウェルネスWebアプリ。

- `src/pages/` - Astroページ（/, /breath, /grounding）
- `src/components/` - Preactコンポーネント（breath/, grounding/）
- `src/lib/db.ts` - IndexedDB共通層（CalmToolsDB）
- `src/lib/schemas.ts` - Zodバリデーションスキーマ
- `src/layouts/Layout.astro` - 共通レイアウト（テーマ切替対応）

データは全てブラウザのIndexedDBに保存。サーバーサイドなし。

## Git操作

- コミット・PRを作る時は `/commit-push-pr` スキルを使う
- 手動で `git commit` や `git push` しない
