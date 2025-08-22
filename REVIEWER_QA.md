## Reviewer Q&A — Memoization (useMemo, React.memo, useCallback)

### Q: Why don’t I see `useMemo`, `React.memo`, or `useCallback` in your code?
**A:** I avoided them because nothing here is expensive enough to benefit from memoization, and I’m not passing props into memoized children that need referential stability. The computations are tiny, the component tree is shallow, and state is colocated to minimize re-renders. I did optimize the high‑churn path with `useDeferredValue` in the token search. If profiling shows hotspots (e.g., very large token lists), I’d add targeted memoization.

### Q: When would you add them?
- **useMemo**: For expensive derived data or large lists.
  - Example: memoize filtered tokens when the list is large.
  ```tsx
  // src/problem2/src/components/TokenSelector.tsx
  const filteredTokens = useMemo(() => {
    if (!deferredSearchTerm) return tokens;
    const q = deferredSearchTerm.toLowerCase();
    return tokens.filter(t => t.currency.toLowerCase().includes(q));
  }, [tokens, deferredSearchTerm]);
  ```
- **React.memo**: For child list rows or heavy UI subtrees that re-render due to parent changes but don’t need to.
- **useCallback**: When passing handlers to memoized children that rely on stable identities. If children aren’t memoized, `useCallback` won’t change behavior.

### Q: Why not “just add them” everywhere?
- Memoization adds cost (memory + comparisons) and complexity. Overusing it in simple components rarely helps and can hide real bottlenecks. I prefer to profile first (React Profiler, why-did-you-render) and then add the smallest, targeted memo that moves the needle.

### What I already optimized
- Token search uses `useDeferredValue` to keep typing responsive during filtering in `TokenSelector`.

### If load grows, concrete changes I’d make
- Memoize `filteredTokens` (as shown above).
- For very large lists:
  - Virtualize the list (`react-virtual`) and memoize rows with `React.memo`.
  - Memoize expensive formatting and ensure stable keys.
- If children are memoized and handlers churn:
  - Wrap `handleFromAmountChange` and `handleSwap` with `useCallback` to keep identities stable.

### One-liner fallback
- I didn’t add memoization because it wouldn’t change render behavior or performance in this small UI. I used `useDeferredValue` where it counts. If profiling shows a bottleneck, I’ll add targeted `useMemo`/`React.memo`/`useCallback` exactly where it pays off. 

---

## Q: When do you know to add `useMemo`, `React.memo`, or `useCallback`? How do you know it’s needed?

### Practical decision framework
- Start with symptoms, not assumptions:
  - Typing feels laggy, scroll jank, CPU spikes, or noticeably slow route transitions.
  - React Profiler shows long commits (>16ms frame budget) or many unnecessary re-renders.
- Measure, then optimize:
  - Use React Profiler to record interactions. Look for components re-rendering frequently or expensive derived computations triggered on every keystroke.
  - Optionally enable why-did-you-render in dev to surface avoidable re-renders.

### Heuristics that justify memoization
- Expensive derived data on each render
  - Example: filtering/sorting large arrays (O(n log n) or O(n) with large n) on each keystroke → `useMemo`.
- Child components re-render when props are unchanged
  - Example: list rows visually unchanged but still re-render → wrap in `React.memo` with stable keys.
- Handler identity churn breaks memoization in children
  - Example: memoized child receives a new function each render → wrap handler in `useCallback`.
- Heavy subtrees with stable inputs
  - Example: complex JSX that doesn’t change often → `React.memo` around the subtree.

### Concrete thresholds (rules of thumb)
- Frame budget: aim <16ms per commit on interaction; if commits routinely exceed ~8–12ms, investigate.
- List size: if filtering/sorting > ~1,000 items on every keystroke, memoize and/or virtualize.
- Rerender frequency: if a parent rerender causes many children to rerender with identical props, memoize children and fix prop identities.

### Repo-specific examples (what I’d optimize first)
- `TokenSelector` filtering
  - Current: inline filter with `useDeferredValue` for smoother typing.
  - If token list grows large: `useMemo` the `filteredTokens` and consider list virtualization; then wrap row items in `React.memo`.
- Event handlers
  - Only wrap with `useCallback` when a memoized child needs stable handler identities (e.g., after memoizing token row items).
- Derived values
  - Keep `toAmount` computed (not stored). Memoize only if the computation becomes heavy or the inputs are noisy.

### Step-by-step profiling recipe (fast)
1) Open React Profiler and record while typing in the token search.
2) Inspect the flame chart:
   - Are `TokenSelector` and many child rows re-rendering on each keystroke?
   - Are commits >16ms or spiking?
3) Apply targeted fixes:
   - `useMemo` for `filteredTokens`.
   - `React.memo` for row items; ensure stable keys.
   - `useCallback` for handlers passed to those memoized rows.
4) Re-profile and compare commit durations and render counts.

### How I know it worked
- Profiler shows fewer renders for unchanged children.
- Commit durations drop materially (often 30–50% in list-heavy cases).
- Subjective interactions (typing/scroll) feel responsive.

### Pitfalls to avoid
- Stale values from incorrect dependency arrays (tests should catch this).
- Over-memoization: extra complexity, memory, and comparisons with no measurable win.
- Memoizing constantly changing values (e.g., frequently changing inputs) provides little benefit. 

---

## Q: Why does `0.1 + 0.2 !== 0.3` in JavaScript?
**A:** In JavaScript, all numbers are stored as IEEE 754 double‑precision floating‑point values. This format can’t exactly represent some decimal numbers, like 0.1 or 0.2, in binary. Because of this, `0.1 + 0.2` doesn’t equal exactly `0.3` — it’s actually `0.30000000000000004` — so a strict equality check fails.

Practical mitigation in this project: we use `bignumber.js` for financial calculations (rounding down, high precision) and separate calculation precision from display precision to avoid these pitfalls.

---

## Q: Does `result.toFixed()` without parameters lose precision in BigNumber.js?
**A:** No, it does **not** lose precision. Unlike JavaScript's native `Number.prototype.toFixed()` which defaults to 0 decimal places, BigNumber's `toFixed()` without parameters preserves all significant digits and returns an "unrounded value in normal notation." It only removes trailing zeros and avoids exponential notation while maintaining full precision — exactly what's needed for cryptocurrency calculations where precision is critical.

---

## Q: Why does the `validateAmount` function have a hardcoded `1e12` limit? Won't this break for some tokens?
**A:** You're correct - this is a **critical bug**. The hardcoded limit at `precision.ts:106-108` assumes no token amount exceeds 1 trillion, but many legitimate cryptocurrencies have much larger supplies:
- **Meme coins**: SHIB (~589T), PEPE (~420T), FLOKI (quadrillions)
- **High-supply tokens**: LUNC (~6.5T), many others in quadrillions
- **Micro-value tokens**: Often have massive supplies intentionally

**Fix needed**: Remove the arbitrary `1e12` limit or make it configurable per token. The validation should respect each token's actual max supply or use a much higher limit (e.g., `1e30`) that accommodates all legitimate use cases. BigNumber.js can handle these large numbers without precision loss. 