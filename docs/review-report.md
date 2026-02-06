# Review Report - calm-tools Renewal

> Reviewed: 2026-02-06
> Reviewer: Critical Reviewer (Task #6)
> Branch: renewal

---

## 1. Summary

Overall the renewal is **well-structured**. Domain logic has been properly extracted (`breath-timer.ts`, `grounding-steps.ts`), Panda CSS tokens are used consistently across components, and the i18n files faithfully reflect `docs/ux-writing.md`. The architecture is clean: Astro pages delegate to Preact islands, IndexedDB is isolated in `db.ts`, and Zod validation guards user input.

However, there are **critical issues** that must be fixed before release, primarily around the E2E test suite (which is now broken by the renewal's text changes) and a Zod validation message that is hardcoded in Japanese. There are also several medium-priority items around state management, accessibility, and recipe/token usage.

---

## 2. Critical Issues (must fix)

### 2.1 E2E tests are broken -- assertions use pre-renewal text

**File:** `tests/e2e/i18n.spec.ts`

The existing E2E tests assert the **old** (pre-renewal) text that no longer exists in the codebase:

| Line | Old assertion | Actual current text |
|------|--------------|---------------------|
| 15 | `'心を落ち着けるためのツール'` | `'心をしずかに整える道具箱'` |
| 16 | `'深呼吸'` | `'呼吸'` |
| 24 | `'準備ができたら開始'` | `'準備ができたら、はじめましょう'` |
| 25 | `{ name: '開始' }` | `{ name: 'はじめる' }` |
| 49 | `'Tools to calm your mind'` | `'A quiet space for your mind'` |
| 50 | `'Deep Breathing'` | `'Breathe'` |
| 58 | `'Ready when you are'` | `"Whenever you're ready"` |
| 59 | `{ name: 'Start' }` | `{ name: 'Begin' }` |
| 65 | `{ name: 'Start' }` (grounding) | `{ name: 'Begin' }` |

**Impact:** All 6 E2E tests will fail. This is the project's only automated regression safety net.

**Fix:** Update all assertions to match the new i18n text from `ja.ts` and `en.ts`.

---

### 2.2 Zod validation error message is hardcoded in Japanese

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/lib/schemas.ts:6`

```ts
{ message: '少なくとも1つ入力してください' }
```

This message is always in Japanese regardless of locale. The `docs/ux-writing.md` defines locale-specific validation messages:

| Locale | Expected |
|--------|----------|
| ja | `ひとつでも書いてみてください` |
| en | `Try writing at least one thing` |

**Impact:** English users see a Japanese error message. Additionally, even for Japanese users, the current text does not match the UX writing guide's gentler tone.

**Fix:** Either pass the locale into the validation layer, or move validation messages to the i18n system and apply the appropriate message in the component when `result.error` occurs.

---

### 2.3 Breath timer remaining display format is locale-inverted

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/breath/BreathApp.tsx:391-393`

```ts
const displayTime = (seconds: number) => {
  const formatted = formatTime(seconds);
  return `${i18n.breath.remaining} ${formatted}`;
};
```

Per `docs/ux-writing.md`, the format should be:
- Japanese: `のこり 2:30`
- English: `2:30 remaining`

The current code always puts the label **before** the time, which is correct for Japanese but **wrong for English**. English should be `2:30 remaining`.

**Fix:** Use a format string in i18n, e.g. `'{time} remaining'` / `'のこり {time}'`, and replace `{time}` in the component.

---

## 3. Improvement Recommendations (priority order)

### 3.1 [HIGH] Grounding: input refs not cleared between steps

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/grounding/GroundingApp.tsx:312-313`

```ts
const inputs = inputRefs.current.slice(0, stepConfig.count);
const values = inputs.map((input) => input?.value?.trim() || '');
```

When moving from Step 1 (5 inputs) to Step 2 (4 inputs), `inputRefs.current` still holds references to the 5 input elements from Step 1. Although `.slice(0, stepConfig.count)` limits reading, the **stale refs from the previous step are never cleared**. If Preact reuses DOM nodes (which it may do), input values from a prior step could leak into the next step's validation.

**Fix:** Clear `inputRefs.current` at the start of each step transition:

```ts
// In the step rendering or at the start of nextStep
inputRefs.current = [];
```

---

### 3.2 [HIGH] Breath: complete() auto-resets after 3 seconds with no user agency

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/breath/BreathApp.tsx:358`

```ts
setTimeout(() => reset(), 3000);
```

After completing a breathing session, the "complete" phase message (`おつかれさまでした` / `Well done`) is shown for only 3 seconds before automatically resetting to idle. This:

1. Violates the UX writing principle of "not rushing the user"
2. Saves a completed session then immediately calls `reset()`, which checks `isRunning` (already false at that point) and skips saving an interrupted session -- this is fine logically, but the auto-reset removes the user's moment to reflect

**Recommendation:** Let the user dismiss the complete state manually via the "もう一度" / "Again" button, rather than auto-resetting. This respects the "今に集中させる" principle.

---

### 3.3 [HIGH] Grounding: cancelSession uses native confirm()

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/grounding/GroundingApp.tsx:355-359`

```ts
const cancelSession = () => {
  if (confirm(i18n.grounding.confirmCancel)) {
    screen.value = 'start';
  }
};
```

`window.confirm()` is a blocking browser dialog that:
1. Looks jarring and inconsistent with the calm, low-stimulation design
2. Is not styleable
3. Breaks the visual tone of the app

**Recommendation:** Replace with a custom modal/dialog component styled to match the grounding design system (soft background, rounded corners, gentle buttons). The same applies to `handleDeleteSession` at line 362.

---

### 3.4 [MEDIUM] panda.config.ts: Recipes define raw color values instead of using tokens

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/panda.config.ts`

Multiple recipes contain hardcoded color values instead of referencing tokens:

| Recipe | Line(s) | Raw value | Should be token |
|--------|---------|-----------|----------------|
| `buttonRecipe` primary | 44 | `'linear-gradient(135deg, #ffd6e0, #e8d9f5)'` | `token('gradients.groundingBtn')` |
| `buttonRecipe` primary | 45 | `'#5a5a5a'` | `token('colors.grounding.text')` |
| `buttonRecipe` secondary | 57 | `'#5a5a5a'` | `token('colors.grounding.text')` |
| `buttonRecipe` secondary | 59 | `'#f8f9fa'` | `token('colors.grounding.hoverBg')` |
| `buttonRecipe` ghost | 68 | `'rgba(139,195,74, 0.20)'` | `token('colors.breath.surfaceMedium')` |
| `buttonRecipe` ghost | 69 | `'#c5e1a5'` | `token('colors.breath.muted')` |
| `timerRecipe` countdown | 193 | `'#c5e1a5'` | `token('colors.breath.muted')` |
| `timerRecipe` instruction | 200 | `'#aed581'` | `token('colors.breath.accentLight')` |
| `historyListRecipe` items | 341 | `'#dcedc8'` | `token('colors.breath.textAlt')` |
| `emptyStateRecipe` | 288-306 | `'#dcedc8'`, `'#c5e1a5'`, `'#8a8a8a'` | corresponding tokens |

Note: Recipes in `panda.config.ts` cannot use `token()` because they are config-time definitions, not runtime code. However, the `.claude/rules/pandacss.md` rule says "token() で参照". The recipes should ideally reference token paths using Panda CSS's built-in `{colors.breath.muted}` syntax within recipes if supported, or this should be documented as an accepted exception.

**Fix:** Either:
1. Use Panda CSS's recipe-compatible token reference syntax (e.g., `{colors.breath.muted}`) if available
2. Document this as a known exception in the project rules
3. Move these inline styles to components where `token()` can be used (the current components already define their own styles and don't use these recipes)

---

### 3.5 [MEDIUM] Recipes defined in panda.config.ts are not used by any component

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/panda.config.ts`

The config defines 4 recipes and 5 slot recipes:
- `buttonRecipe`, `cardRecipe`, `inputRecipe`, `validationErrorRecipe`
- `segmentedControlRecipe`, `timerRecipe`, `progressRecipe`, `emptyStateRecipe`, `historyListRecipe`

However, **none of these are imported or used in any component**. Both `BreathApp.tsx` and `GroundingApp.tsx` define their own inline `css()` styles. This means:

1. The recipes are dead code that will be included in the Panda CSS codegen output
2. There's a risk of design drift between the recipe definitions and the actual inline styles
3. Maintenance burden increases -- changes must be made in two places

**Recommendation:** Either:
1. Refactor components to actually use the recipes (preferred for consistency)
2. Remove the recipes from `panda.config.ts` to reduce dead code

---

### 3.6 [MEDIUM] Grounding: progress bar starts at 20% instead of 0%

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/lib/grounding-steps.ts:15-17`

```ts
export function progress(currentStep: number): number {
  return ((currentStep + 1) / stepConfigs.length) * 100;
}
```

When `currentStep = 0` (first step), progress = `(0+1)/5 * 100 = 20%`. The progress bar is already 20% filled before the user has completed any step.

**Recommendation:** Progress should represent **completed** steps: `currentStep / stepConfigs.length * 100`. At step 0, progress = 0%. After completing step 0 and moving to step 1, progress = 20%.

---

### 3.7 [MEDIUM] Grounding: placeholder index is 1-based but first placeholder logic is wrong

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/grounding/GroundingApp.tsx:400-403`

```ts
const getPlaceholder = (i: number) => {
  if (i === 1) return stepI18n.placeholderFirst;
  return stepI18n.placeholderN.replace('{n}', String(i));
};
```

Called with `getPlaceholder(i + 1)` where `i` is the 0-based loop index. This means:
- Input 0: `getPlaceholder(1)` -> `placeholderFirst` (correct)
- Input 1: `getPlaceholder(2)` -> `'{n}つ目'.replace('{n}', '2')` = `'2つ目'` (correct)

This works, but the logic is fragile. If someone refactors to 0-based indexing, it breaks silently.

---

### 3.8 [MEDIUM] Breath: date formatting ignores docs/ux-writing.md locale format

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/breath/BreathApp.tsx:462-463`

```ts
const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
```

This always uses `M/D HH:MM` format regardless of locale. Per `docs/ux-writing.md`:

| Locale | Expected format | Example |
|--------|----------------|---------|
| ja | `YYYY年M月D日 HH:MM` | `2026年2月6日 14:30` |
| en | `M/D/YYYY HH:MM` | `2/6/2026 14:30` |

Neither format is implemented correctly -- the year is missing in both, and the Japanese format with `年月日` suffixes is not used at all.

**Fix:** Use the same `dateFormat` approach that `GroundingApp.tsx` already implements via `i18n.grounding.dateFormat`, but add it to the breath i18n keys as well.

---

### 3.9 [LOW] Navigation component uses `t()` (client-side signal) instead of prop-based locale

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/common/Navigation.tsx:8`

```ts
const i18n = t();
```

All other components receive `locale` as a prop from the Astro page and use `getTranslations(locale)`. `Navigation.tsx` instead uses the client-side `t()` function which reads from a signal. This is inconsistent and could cause a flash of incorrect locale on hydration.

**Note:** `Navigation.tsx` doesn't appear to be used anywhere currently (neither Astro pages nor components import it), so this is dead code. Consider removing it.

---

### 3.10 [LOW] Grounding: delete button has opacity: 0 but no hover parent trigger

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/components/grounding/GroundingApp.tsx:227`

```ts
deleteBtn: css({
  // ...
  opacity: 0,
  // ...
}),
```

The delete button is invisible (`opacity: 0`) with no CSS rule to make it visible on the parent `historyItem` hover. The `_hover` on `deleteBtn` only styles the button itself when hovered, but since it's invisible, users can't discover it. This likely needs a parent hover rule like:

```css
.historyItem:hover .deleteBtn { opacity: 1; }
```

This is not achievable with the current Panda CSS inline approach without a parent selector.

**Recommendation:** Either always show the button (with a subtle style), or implement a parent-hover reveal using the grouped selectors pattern available in Panda CSS (`_groupHover`).

---

### 3.11 [LOW] Missing `prefers-reduced-motion` in breath.astro page-level styles

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/src/pages/breath.astro:16-31`

The `<style>` block defines `body::before` with radial gradients. While this is static (no animation), the `breath.css` and `grounding.css` both have `prefers-reduced-motion` overrides, and the design system spec at section 7-5 says to disable "all animations". The `body::before` is purely decorative and should remain static, so this is fine -- but worth noting for completeness.

---

### 3.12 [LOW] PWA manifest description uses old text

**File:** `/Users/tgfjt/ghq/github.com/tgfjt/calm-tools/public/manifest.webmanifest:4`

```json
"description": "心を落ち着けるためのウェルネスツール"
```

The UX writing guide changed the tagline to `心をしずかに整える道具箱`. The manifest description should match the brand voice, though it's not user-visible in the same way.

---

## 4. Good Points (maintain)

### 4.1 Clean domain logic extraction
`breath-timer.ts` and `grounding-steps.ts` are pure functions with no side effects, exactly as the test strategy document specified. This makes them trivially testable.

### 4.2 Consistent token usage in components
Both `BreathApp.tsx` and `GroundingApp.tsx` use `token()` for all color, spacing, font, and radius values. No raw hex codes were found in component styles -- the Panda CSS rule is well-followed at the component level.

### 4.3 Excellent i18n coverage
All user-facing strings (including placeholders, accessibility labels, validation messages in the UI, and date formats) are in the i18n system. The `Translations` type interface ensures type safety across locales.

### 4.4 Accessibility implementation
- `fieldset` + `legend` (visually-hidden) for grounding form groups
- `aria-describedby` linking validation errors to inputs
- `aria-invalid` on inputs when errors exist
- `role="alert"` + `aria-live="assertive"` on validation error messages
- `aria-label` on home button and delete buttons
- IME composing check (`e.isComposing || e.keyCode === 229`) on Enter key handler
- `prefers-reduced-motion` respected in both CSS files

### 4.5 i18n text matches UX writing guide
All strings in `ja.ts` and `en.ts` match `docs/ux-writing.md` exactly. The vocabulary rules (はじめる/Begin, もう一度/Again, ふりかえり/Look Back, etc.) are correctly applied.

### 4.6 Grounding app data-testid coverage
Every interactive element and screen state in `GroundingApp.tsx` has a `data-testid` attribute, following the E2E test strategy's recommendation for stable selectors.

### 4.7 CSS architecture
`global.css` contains only the `@layer` directive. Keyframes are in separate CSS files. No style leakage between pages.

---

*End of review report.*
