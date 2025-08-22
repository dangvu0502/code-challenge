## Interview Walkthrough — Token Swap Challenge

**Opening**
“Hi, thanks for having me. I’d like to walk you through the challenge I worked on. I split it into three parts:

1. Problem 1 — a quick algorithm warm-up.
2. Problem 2 — the main piece, a token swap interface in React and TypeScript.
3. Problem 3 — a refactor/code-review exercise.

One of my priorities was precision and reliability. In the swap UI, I didn’t hand-roll decimal arithmetic — I used a proven library, configured it carefully, and built the app around that for predictable behavior.

I also used AI as a collaborator to speed up scaffolding and design exploration, while I focused on architecture, core logic, and reviewing changes before they landed.”

---

**Submission & Access**
- All solutions are included in this repository under `src/problem1`, `src/problem2`, and `src/problem3`.
- I will provide a public GitHub link in the application so you can view without downloading or unzipping.
- If you’re viewing this locally, see “How to Run/View” below.

---

**How to Run/View**
- Problem 1 (Node):
  - Run `node src/problem1/tests.js` to execute the tests.
- Problem 2 (React + Vite):
  - Prereq: Node 22+
  - `cd src/problem2`
  - `npm install`
  - `npm run dev` to start the dev server
  - `npm run test` to run unit tests
  - `npm run build` for a production build
- Problem 3 (Code review):
  - See `src/problem3/solution.md` for the refactor details.

---

**Problem 1 — sum_to_n**
“For the warm-up, I implemented three ways to sum from 1 to n, mostly to compare trade-offs.

1. A constant-time formula `(n * (n + 1)) / 2` — O(1) time and space.
2. An array with `reduce` — O(n) time, O(n) space; readable but less efficient.
3. A recursive approach — O(n) time; risks stack limits when n is large.

In a real app I’d favor the formula for speed and simplicity. I added small tests to cover normal and edge cases.”

---

**Problem 2 — Token Swap UI**
“I aimed for a clean, maintainable structure: lean components, logic in focused hooks.

- `useTokenPrices` fetches and enriches token data (keeps the latest price per currency, adds icon URL and default decimals, sorts alphabetically). Icons gracefully fall back to the token initials on error.
- `useSwapForm` manages form state and validation.
- `useExchangeRate` computes a derived rate whenever tokens change.
- `useSwapExecution` simulates an async swap with loading and toasts.
- Precision helpers live in `lib/precision.ts` with dedicated tests.

Data source: `https://interview.switcheo.com/prices.json`. Default decimals are `18` (until an API provides per-token decimals).”

---

**Precision & Validation**
“This is a financial UI, so floating-point math isn’t acceptable. I used BigNumber.js and configured it for:

- 30 decimal places
- Round down only (never overstate amounts)
- No scientific notation for typical values

Inputs are sanitized as you type: digits only, single decimal point, decimals capped per token, no negatives, and a reasonable upper bound. Arrow keys increment by 0.1, 1, or 10 based on current value for fast, controlled adjustments.”

---

**UX Flow**
“‘To’ amount is computed and read-only. Rates update immediately when tokens change. Clicking Swap shows a loading state and a toast on success or failure; on success the form resets.”

---

**Tests**
“I covered arithmetic helpers and input handling with unit tests. There’s also a precision check that converts A→B and back B→A with very small difference, to catch regressions.”

---

**Problem 3 — Refactor/Code Review**
“I improved the snippet by:

- Adding missing types and removing `any`
- Fixing correctness bugs (e.g., inverted filter, undefined reference)
- Using stable composite keys instead of index keys
- Memoizing formatted balances to avoid unnecessary recomputation

Result: safer types, more predictable rendering, and less wasted work.”

---

**Assumptions & Uncertainties**
- Default token decimals are set to `18` due to lack of per-token decimals in the feed; would source true decimals from an API in production.
- No slippage, fees, or liquidity modeling — this is a UI/precision exercise.
- No wallet/balance integration; amounts are user-entered.
- Icons use the Switcheo token-icons repo with a small `SPECIAL_CASES` map; unknown icons fall back to initials.
- Rounding mode is “round down” to avoid overstating returns.

---

**Scope & Attempts**
- Attempted fully: Problems 1–3.
- Not covered due to time: Problems 4–5. If continuing, I’d:
  - Problem 4: clarify requirements, scaffold tests first, then implement minimal vertical slice.
  - Problem 5: spike a design doc, define interfaces and invariants, add property-based tests where applicable, then iterate.

---

**Closing**
“If I had more time, I’d pull real per-token decimals from the API, add slippage protection, and connect to a real swap endpoint.

My focus here was to design for precision, structure the app to be testable, and make choices that avoid hidden errors — leaning on proven tools for the tricky parts and keeping UX smooth and predictable.”

---

## Live Walkthrough — Files to Show (Order)

- **Problem 1 (warm-up)**
  - `src/problem1/index.js` — three implementations
  - `src/problem1/tests.js` — quick tests

- **Problem 2 (demo first, then layers)**
  1. `src/problem2/src/pages/Index.tsx` — entry point: loading/error, renders `SwapCard`
  2. `src/problem2/src/components/SwapCard.tsx` — orchestrator: state, rate, computed “To”, swap execution
  3. `src/problem2/src/components/TokenInputSection.tsx` — editable “From”, read-only “To”, key handlers
  4. `src/problem2/src/components/ExchangeRateDisplay.tsx` — 1-from = X-to
  5. `src/problem2/src/components/TokenSelector.tsx` — picker with icon fallback

- **Problem 2 (logic & precision)**
  6. `src/problem2/src/hooks/useTokenPrices.ts` — latest-per-currency, icon URL, default decimals, sort
  7. `src/problem2/src/hooks/useSwapForm.ts` — validation, sanitization, arrow-key increments, swap/reset
  8. `src/problem2/src/hooks/useExchangeRate.ts` — recompute on token change
  9. `src/problem2/src/hooks/useSwapExecution.ts` — async simulation, toasts, reset on success
  10. `src/problem2/src/lib/precision.ts` — BigNumber config, math helpers, input helpers
  11. `src/problem2/src/lib/precision.test.ts` — unit tests incl. A→B→A precision check

- **Problem 2 (optional UX polish)**
  - `src/problem2/src/hooks/useTokenAutoSelect.ts` — auto-select first two tokens

- **Problem 3 (refactor/code review)**
  - `src/problem3/solution.md` — types, filter fix, stable keys, memoization

### Pacing tips
- Start with a live demo via `Index.tsx` → `SwapCard.tsx`.
- Justify correctness with `lib/precision.ts` and `precision.test.ts`.
- Fast 3–5 min path: `Index.tsx` → `SwapCard.tsx` → `lib/precision.ts` → `lib/precision.test.ts`. 

