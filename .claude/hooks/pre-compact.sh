#!/bin/bash
# PreCompact hook: claude -p で transcript を分析して PLANS.md に状態を書き出す

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd')
TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path')
PLANS="$CWD/PLANS.md"

# transcript が読めなければ何もせず approve
if [ ! -f "$TRANSCRIPT" ]; then
  echo '{"decision": "approve"}'
  exit 0
fi

# transcript からテキスト内容を抽出（user のみ、直近20件）
USER_MESSAGES=$(jq -rs '
  [.[] | select(.type == "user")
    | {
        text: (
          if (.message.content | type) == "string" then
            .message.content
          elif (.message.content | type) == "array" then
            [.message.content[] | select(.type == "text") | .text] | join("\n")
          else ""
          end
        )
      }
    | select(.text != "" and .text != null)
  ]
  | .[-20:][]
  | .text
' "$TRANSCRIPT" 2>/dev/null)

# XML/HTMLタグを除去
USER_MESSAGES=$(echo "$USER_MESSAGES" | perl -0777 -pe '
  s/<system-reminder>.*?<\/system-reminder>//gs;
  s/<local-command[^>]*>.*?<\/local-command[^>]*>//gs;
  s/<command-[^>]*>.*?<\/command-[^>]*>//gs;
  s/<[^>]+>//g;
')

# summary があれば追加
SUMMARIES=$(jq -rs '
  [.[] | select(.type == "summary") | .summary] | join("\n")
' "$TRANSCRIPT" 2>/dev/null)

# 既存の PLANS.md があれば読み込む（正規セクションがある場合のみ）
EXISTING_PLANS=""
if [ -f "$PLANS" ] && grep -qE "^## (わかったこと|わかっていないこと|次のステップ|判断理由|備忘録)" "$PLANS" 2>/dev/null; then
  EXISTING_PLANS=$(head -c 3000 "$PLANS")
fi

# stdin 用データを組み立て
PROMPT_INPUT=""

if [ -n "$EXISTING_PLANS" ]; then
  PROMPT_INPUT+="<previous-state>
${EXISTING_PLANS}
</previous-state>

"
fi

if [ -n "$SUMMARIES" ]; then
  PROMPT_INPUT+="<session-summary>
${SUMMARIES}
</session-summary>

"
fi

PROMPT_INPUT+="<user-messages>
${USER_MESSAGES}
</user-messages>"

# 10KB超えたら末尾を切る
PROMPT_INPUT=$(echo "$PROMPT_INPUT" | head -c 10000)

# 一時ファイルに保存
PROMPT_FILE=$(mktemp "${TMPDIR:-/tmp}/plans-prompt.XXXXXX")
printf '%s' "$PROMPT_INPUT" > "$PROMPT_FILE"

# system prompt（指示）を分離 — データはユーザーメッセージとして stdin で渡す
SYSTEM_PROMPT='You are a data extraction tool. You receive raw log data from a coding session. Extract facts and output EXACTLY these 5 markdown sections. No preamble, no explanation, no conversation.

## わかったこと・完了したこと
## わかっていないこと・未完了のこと
## 次のステップ
## 判断理由
## 備忘録

Rules:
- Merge <previous-state> with new data from <user-messages> and <session-summary>
- Preserve user requirements and specs exactly
- Record file paths and branch names if mentioned
- Be concise but complete
- Write in Japanese
- First line of output MUST be: ## わかったこと・完了したこと'

# バックグラウンド実行 → disown で完全デタッチ
DEBUG_LOG="${TMPDIR:-/tmp}/plans-debug.log"
(
  exec 2>"$DEBUG_LOG"

  TEMP_PLANS="${PLANS}.tmp"
  echo "=== $(date) ===" >&2
  echo "PROMPT_FILE size=$(wc -c < "$PROMPT_FILE")" >&2

  claude -p --model haiku \
    --system-prompt "$SYSTEM_PROMPT" \
    < "$PROMPT_FILE" > "$TEMP_PLANS"

  echo "claude exit=$?" >&2
  echo "output size=$(wc -c < "$TEMP_PLANS" 2>/dev/null)" >&2
  echo "first 300 chars:" >&2
  head -c 300 "$TEMP_PLANS" >&2

  if [ -s "$TEMP_PLANS" ]; then
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
    { echo "# PLANS (updated: ${TIMESTAMP})"; echo ""; cat "$TEMP_PLANS"; } > "$PLANS"
    echo "Wrote PLANS.md ($(wc -c < "$PLANS") bytes)" >&2
  fi
  rm -f "$TEMP_PLANS" "$PROMPT_FILE"
  echo "Done at $(date)" >&2
) </dev/null &
disown

echo '{"decision": "approve"}'
