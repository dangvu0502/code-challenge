## Two-Day Interview Revision Plan

This plan is optimized for the challenge you’ll present (Problem1 → Problem2 → Problem3). It combines targeted study, drills, and rehearsal to maximize recall and confidence.

---

### Outcomes by the end of Day 2
- Confidently explain and demo Problem1, Problem2, Problem3 in that order.
- Answer core technical questions about precision, React hooks, data fetching, validation, and refactoring patterns.
- Run the app/tests quickly and navigate code without hesitation.

---

### Key topics to revise (high yield)
- JavaScript/TypeScript
  - IEEE-754 pitfalls; when to use BigInt or libraries
  - Type narrowing, discriminated unions, const assertions, strict null handling
- Precision & numeric libs
  - BigNumber config, rounding modes; calculation vs display precision
- React (18/19)
  - useState, useEffect, useMemo, useDeferredValue
  - Derived vs stored state, controlled inputs, keyboard events
- Data fetching/state
  - fetch patterns, error handling, deduplication by latest date
  - When to keep local state vs introduce a query library
- Forms & validation
  - Sanitization vs validation; edge cases (multiple decimals, leading zeros, huge numbers)
- Testing (Vitest)
  - Unit tests, round‑trip precision tests, mocking fetch (concepts)
- Performance & UX
  - useDeferredValue for search, stable keys, memoization boundaries
  - Loading/error/empty states, toast feedback patterns
- Refactor patterns (Problem3)
  - Strong typing, removing any, correct filter/sort, stable keys, memoizing derived lists

---

### Resources (skim + targeted read)
- BigNumber.js docs: [Rounding modes and config](https://mikemcl.github.io/bignumber.js/#constructor-properties)
- React docs: [Hooks – useEffect](https://react.dev/reference/react/useEffect), [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- Vitest: [Getting started](https://vitest.dev/guide/)
- Radix UI: [Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- Tailwind: [Utility-first basics](https://tailwindcss.com/docs/utility-first)

---

### Practice commands
- Problem1 tests:
  ```bash
  node /Users/matt/Learn/fun_stuff/code-challenge/src/problem1/tests.js
  ```
- Problem2 app:
  ```bash
  cd /Users/matt/Learn/fun_stuff/code-challenge/src/problem2
  npm run dev
  ```
- Problem2 tests:
  ```bash
  cd /Users/matt/Learn/fun_stuff/code-challenge/src/problem2
  npm test -- --run
  ```

---

### Day 1 (Deep Dive + First Rehearsal)

Morning (2.5h)
- Problem1 (30m)
  - Re‑explain O(1) vs O(n) vs recursion; note stack/range limits.
  - Run tests and add 2 more edge cases locally (n=1e5, n=0).
- Precision (50m)
  - Review BigNumber config and rounding; practice turning a float‑based calc into BigNumber.
  - Revisit `precision.ts`: calculateExchangeAmount, calculateExchangeRate, sanitize, validate.
- React + Form flow (70m)
  - Walk `useSwapForm`, `useExchangeRate`, `useSwapExecution`, `useTokenPrices` end‑to‑end.
  - Practice explaining derived vs stored state and why `toAmount` is computed, not stored.

Afternoon (2.5h)
- Data fetching & UX (60m)
  - Explain deduplication by latest date; outline how to handle a failing fetch and retries.
  - Token search with `useDeferredValue`; what it solves and when to prefer memoization.
- Testing (40m)
  - Re‑read `precision.test.ts`. Add one new test locally: invalid input handling.
  - Be ready to describe mocking fetch (conceptually).
- Performance & a11y (50m)
  - Stable keys, memoization boundaries, derived lists; Radix Dialog a11y guarantees.
  - Keyboard interactions: ArrowUp/Down increments.

Evening (1.5h)
- Rehearsal #1 (45m)
  - Follow `INTERVIEW_PLAYBOOK.md` timing; speak aloud once.
- Gaps pass (45m)
  - Revisit any topics you stumbled on; write 5 flash cards for tough Q&A.

---

### Day 2 (Targeted Drills + Final Rehearsal)

Morning (2h)
- Lightning review (45m)
  - Skim code files in this order: Problem1 → `precision.ts` → hooks → components → Problem3 solution.
  - Run both test suites and the app once.
- Deep Q&A (75m)
  - Answer out loud:
    - Why BigNumber and why ROUND_DOWN?
    - How would you add per‑token decimals from API end‑to‑end?
    - Where would you implement slippage and minimum received?
    - How does `useDeferredValue` differ from debouncing?
    - How do you avoid re‑renders in lists and forms?

Afternoon (2h)
- Focused drills (60m)
  - Write a small snippet converting a float form calc to BigNumber with rounding control.
  - Sketch pseudocode to dedupe by latest date; discuss sorting stability.
- Rehearsal #2 (60m)
  - Run the full demo once, adjusting pacing.

Evening (1.5h)
- Final polish (45m)
  - Prepare 2–3 token pairs to demo; ensure icons load.
  - Practice error path narration (what happens if fetch fails).
- Rest and reset (45m)
  - No new topics—light skim of speaker notes and sleep.

---

### High‑confidence answers you should memorize
- “The ‘To’ amount is derived, not stored—this avoids stale state and eliminates a whole class of sync bugs.”
- “We use BigNumber with round‑down to never overstate balances; display precision can differ from calculation precision.”
- “Inputs are sanitized and validated: single decimal point, per‑token decimal cap, non‑negative, reasonable upper bound.”
- “Token data is deduped by currency using the newest date; icons have a graceful fallback.”
- “Stable keys and memoized derived lists keep renders predictable; `useDeferredValue` smooths search.”
- “Refactor fixes in Problem3: strict types, correct filter/sort, stable keys, and memoized formatting.”

---

### Dry‑run checklist (use before each rehearsal)
- App boots and fetch works at least once; tests are green.
- Tabs open for the flow: Problem1 files → `precision.ts` → hooks → `SwapCard.tsx` → Problem3 solution.
- Browser zoom 100%; theme button visible.
- Two token pairs ready to demo (plus one with a known icon fallback).
- Speaker notes handy: opening, segues, and closing line. 