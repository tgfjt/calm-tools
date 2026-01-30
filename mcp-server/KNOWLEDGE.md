# MCP Apps デバッグナレッジ

## basic-host でローカルテスト

Claude Desktop を介さずに MCP Apps サーバーをテストできる。

```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git /tmp/ext-apps
cd /tmp/ext-apps
npm install --ignore-scripts
cd examples/basic-host
npm install

SERVERS='["http://localhost:3002/mcp"]' npm run start
# http://localhost:8080 を開く
```

**ポート 8080/8081 必須**: sandbox URL が `localhost:8081` でハードコードされている。

---

## 解決に必要だったこと

### 1. inputSchema は Zod スキーマ

SDK は `inputSchema` を Zod スキーマとして処理する。

```ts
// NG: JSON Schema 形式
inputSchema: {
  type: "object",
  properties: {
    pattern: { type: "string", enum: ["555", "478"] },
  },
}

// OK
inputSchema: {}
```

JSON Schema を渡すと `v3Schema.safeParseAsync is not a function` エラー。

### 2. HTTP メソッドは all

MCP Streamable HTTP は GET/POST 両方を使う。

```ts
// NG
app.post("/mcp", ...)

// OK
app.all("/mcp", ...)
```

### 3. Accept ヘッダー必須

curl でテストする時、Accept ヘッダーがないとエラー。

```bash
# NG
curl -X POST 'http://localhost:3002/mcp' \
  -H 'Content-Type: application/json' \
  -d '...'
# → Not Acceptable: Client must accept both application/json and text/event-stream

# OK
curl -X POST 'http://localhost:3002/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '...'
```

---

## Zod バージョン

```json
{
  "@modelcontextprotocol/ext-apps": "^1.0.1",
  "@modelcontextprotocol/sdk": "^1.25.3",
  "zod": "^3.25 || ^4.0"
}
```

- SDK の peerDependency: `zod: "^3.25 || ^4.0"`
- Zod は明示的にインストールが必要
- v3 でも v4 でも動く

---

## 試したけど効果なかったこと

`v3Schema.safeParseAsync` エラーに対して：

- Zod v3 → v4 に変更
- Zod v4 → v3 に変更
- node_modules 削除して再インストール

**原因は Zod バージョンではなく inputSchema の形式だった。**

---

## Claude Desktop で UI が blank になる

basic-host では UI が表示されるのに、Claude Desktop では blank になる場合がある。

**原因**: Claude Desktop の CSP (Content Security Policy) が厳しく、`unsafe-eval` を禁止している。JavaScript の一部がブロックされて UI が表示されない。

**関連 issue**:
- [#374](https://github.com/modelcontextprotocol/ext-apps/issues/374) - CSP を正しく実装するクライアントで動作しない
- [#199](https://github.com/modelcontextprotocol/ext-apps/issues/199) - `unsafe-eval` による問題

**現状**: ext-apps 側で対応待ち。[PR #378](https://github.com/modelcontextprotocol/ext-apps/pull/378) で Trusted Types の対応が進行中。

---

## curl デバッグ用コマンド

```bash
# initialize
curl -s -X POST 'http://localhost:3002/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'

# tools/list
curl -s -X POST 'http://localhost:3002/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# tools/call
curl -s -X POST 'http://localhost:3002/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"open_breath","arguments":{}}}'
```
