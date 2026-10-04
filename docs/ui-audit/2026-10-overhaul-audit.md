# UI audit — October 2026 overhaul

Captured 2026-10-04 against the local dev server (`PROJECT_TYPE=hybrid`, Black Oak Coffee demo content) on branch `feat/client-ui-design-system-overhaul`.

This supersedes the August 2026 audit in `DESIGN_SYSTEM.md` and `BLOCKS_AND_COMPONENTS_AUDIT.md` for anything they disagree on. Those remain useful for the per-block history.

---

## 1. The structural defect: the palette system is only half wired

This is the root cause of most of the visual incoherence, and everything else in this document is downstream of it.

Theme CSS is produced by two functions, concatenated in that order by `src/components/ThemeStyles/index.tsx`:

1. `getThemeCss()` (`src/config/theme.ts`) emits the **full** shadcn token set from a hardcoded, almost entirely achromatic oklch palette.
2. `getLandingThemeCss(siteTheme)` (`src/config/siteTheme.ts`) then overrides **only** `--background`, `--foreground`, `--card`, `--card-foreground`, `--border`, the `--surface-*` / `--text-*` / `--border-*` aliases, `--focus-ring` and the font stacks.

Everything the editor cannot reach stays achromatic:

| Token | Source | Consequence |
|---|---|---|
| `--primary` | `theme.ts`, `oklch(20.5% 0 0)` light / `oklch(98.5% 0 0)` dark | **Every button, link and active nav state is black or white regardless of the brand palette.** The brand colour never appears as an accent anywhere. |
| `--secondary`, `--accent`, `--muted` | `theme.ts`, achromatic greys | Sit beside palette-derived `--card`/`--background`, so greys and brand tints clash — the "dual theme system" the August audit noticed. |
| `--ring` | `theme.ts`, `oklch(70.8% 0 0)` | Low-contrast focus ring. |
| `--focus-ring` | overridden by `siteTheme.ts` to the **card border colour** | Focus ring is roughly invisible: `Button` focuses with `ring-focus-ring/50`, i.e. 50% of a hairline border colour. **WCAG 2.4.11 failure.** |
| `--radius` | `theme.ts`, constant `0.625rem` | Present in the `ThemePalette` type and so implied to be editor-controlled, but never overridden. |

The editor's five chosen colours are mapped in `mapCustomPaletteToMode()` as: `color1` → light background, `color2` → light card, `color3` → **border only**, `color4` → dark card, `color5` → dark background. So the two most saturated colours a user is likely to pick (`color3`, `color4`) surface as a hairline border and a dark-mode panel fill. There is no path from the palette to a call-to-action.

**Fix direction:** derive the whole semantic set from the palette, with contrast guaranteed rather than assumed. Keep `theme.ts` as the fallback when no palette is set.

## 2. Tailwind is configured twice

`src/app/(app)/globals.css` is Tailwind v4 CSS-first (`@theme`, `@theme inline`, `@custom-variant`, `@source inline`) **and** pulls in a v3-style `tailwind.config.mjs` via `@config`. The two overlap:

- Colours defined in both (`tailwind.config.mjs` `theme.extend.colors` vs `@theme inline --color-*`).
- Breakpoints defined in both (`theme.container.screens` vs `@theme --breakpoint-*`).
- The safelist exists twice (`safelist: [...]` vs twelve `@source inline(...)` lines) with identical contents.
- `container` is configured in `tailwind.config.mjs` **and** hand-rolled again as a `@layer utilities .container` with its own padding and max-widths. The hand-rolled one wins. The config block is dead.
- `borderRadius` is defined in both, with different scales (`sm/md/lg` in the config, `sm/md/lg/xl` in `@theme inline`).
- The typography plugin is registered twice (`plugins: [typography]` and `@plugin "@tailwindcss/typography"`).

The typography plugin override hardcodes `h1 { font-size: 4rem }` with no responsive step, which is where the unscaled mobile `h1` noted in the August audit comes from.

## 3. Token coverage gaps

No tokens exist for:

- **Type scale.** 90 uses of `text-sm`, then `text-3xl`/`text-2xl`/`text-xl` chosen ad hoc for headings. There is no display/h1/h2/h3/body/label vocabulary, so each component re-decides.
- **Content widths.** `max-w-xl`, `max-w-lg`, `max-w-3xl`, `max-w-2xl`, `max-w-md`, `max-w-sm`, `max-w-4xl`, plus `max-w-62`, `max-w-37`, `max-w-[475px]`, `max-w-[50%]`, `max-w-[36px]` — no named prose/content/wide widths.
- **Elevation.** `--elevation-soft` / `-hover` / `-pressed` exist in `theme.ts` but are used in exactly three places; everywhere else reaches for raw `shadow-sm` (28), `shadow-md` (6), `shadow-xs` (4), `shadow-lg` (2), `shadow-none` (9).

## 4. Radius is unsystematic

`rounded-md` 24 · `rounded-lg` 23 · `rounded-full` 20 · `rounded-2xl` 15 · `rounded-xl` 6 · `rounded-sm` 4 · `rounded-[0.8rem]` 3 · `rounded-[4px]` 1.

The two card primitives disagree with each other: `Card` is `rounded-xl` with a border and `shadow-sm`; `SurfaceCard` wraps `Card` and overrides it to `rounded-lg border-0`. Consumers therefore get a different shape depending on which one they happened to import.

`.booking-slot-button` in `globals.css` is a full pill (`border-radius: 9999px`) with three hand-written `rgba()` shadow stacks, including a fake inset highlight. It is the only skeuomorphic element on the site and matches nothing else.

## 5. Hardcoded colour outside the token system

~40 occurrences, concentrated in the older imported UI:

- `src/components/layout/search/**` — `text-black dark:text-white`, `text-neutral-500 dark:text-neutral-400`, `bg-white … dark:bg-black`, and the pair `bg-neutral-800 dark:bg-neutral-300` / `bg-neutral-400 dark:bg-neutral-700` duplicated verbatim in `Categories.tsx` and `CategoryTabs/index.tsx`.
- `src/components/CategoryTabs/Item.tsx` — `hover:bg-white/5`, `bg-white/5`, and `text-primary/50` used as a *muted* colour, which is a different thing from `--muted-foreground`.
- `src/components/AccountNav/index.tsx` — `border-white/5`, invisible in light mode.
- `src/components/product/StockIndicator.tsx` — `text-gray-500`.
- `src/blocks/Form/Error/index.tsx` — `text-red-500` instead of `text-destructive`.
- Success states as `text-green-600 dark:text-green-400` in `bookings/cancel` and `BookingForm`, while a `--success` token exists.
- `src/heros/HighImpact/index.tsx` — `text-white` plus a magic `-mt-[10.4rem]` to tuck under the header.

## 6. Primitives

**`Button`** carries eight variants, two of which are not buttons:
- `nav` bakes in layout (`pt-2 pb-6`), a font (`font-mono`), and `text-xs uppercase tracking-widest` — a page-level nav-link style living inside a primitive.
- `link` zeroes the padding and height the size variants then re-add.
- Focus state is `focus-visible:ring-focus-ring/50`, i.e. the broken token from §1.
- Each `size` re-declares `rounded-md`, duplicating the base.

**`Card` / `SurfaceCard`** — see §4. Padding is a fixed `py-6` / `px-6` rather than a scale, so dense contexts (cart lines, account panels) override it at every call site.

## 7. Layout and page composition

- **`/shop` has no `h1`.** The page goes header → search input → grid. Same on several account routes. Heading order is broken before any styling question.
- `/shop`'s filter rail is a ~130px column of 12–13px links with a large dead gutter beside it, while the search input above spans the full container — two different grids on one page.
- Product cards are borderless pale panels on a near-white background, with title and price at the same size and weight. No hierarchy, no hover affordance, edges invisible.
- 48 separate `container` usages with locally varied inner `max-w-*`, so section content does not align vertically down a page.
- `Section` (`background` × `spacing`) is good and already on ~18 blocks via `src/fields/sectionStyle.ts` — this is the part of the system to build on, not replace.

## 8. React and performance

- **86 of 211 `.tsx` files are client components** (41%).
- `src/components/Media/Image/index.tsx` is `'use client'` solely for an `isLoading` state that is **set but never read**. Removing it un-clients the image path used by nearly every block.
- The same file's default `sizes` is built as `(max-width: ${bp}px) ${bp}px` for each breakpoint with **no final fallback**, so above the largest breakpoint the browser assumes `100vw`. Observed on `/shop`: every product thumbnail requests `w=3840&q=90` for a ~300px slot.
- No call site passes `size`, so the default is always what is used.
- MUI (`@mui/material` + `@mui/x-date-pickers`) is a full second component library pulled in for the booking date picker alone, with its own theming that does not follow these tokens.

## 9. Accessibility

- Focus ring effectively invisible site-wide (§1).
- Missing `h1` and broken heading order on `/shop` and account routes (§7).
- Nav links at `text-xs uppercase tracking-widest` in `--text-secondary`: small, wide-tracked, low contrast.
- `html { opacity: 0 }` until `data-theme` is set — the whole document is blank until the theme script runs, and stays blank entirely if it fails.
- `border-white/5` and `bg-white/5` used as borders/surfaces in light mode: invisible.
- Success colour `text-green-600` on `--card` has not been contrast-checked against editor-chosen palettes.

## 10. What is already good — keep and extend

- `src/components/Section/index.tsx` and the `data-tone="inverse"` token remap in `globals.css`. Genuinely well-designed: a block written against semantic tokens sits correctly on a dark band without knowing it. This is the model for the rest of the system.
- `src/fields/sectionStyle.ts` — per-block appearance controls, collapsed by default, already on nearly every block.
- `src/app/(app)/motion.css` — one easing curve, `prefers-reduced-motion` honoured, scroll-driven animations behind `@supports`, reveals that degrade to the final state without JS.
- `RenderBlocks`' `SELF_CONTAINED` / `SELF_ANIMATING` escape hatches.
- `SectionHeader`, `src/fields/hero.ts`, `src/fields/link.ts`, `resolveLinkHref`, the block data-fetch helpers.

---

## Work order

1. **Tokens.** Derive the full semantic set from the editor palette with enforced contrast; add type scale, content widths, radius scale, elevation scale. Fix the focus ring.
2. **Config.** Collapse the Tailwind v3/v4 duplication onto the v4 CSS-first setup.
3. **Primitives.** Split layout concerns out of `Button`; reconcile `Card`/`SurfaceCard`; introduce the typography and container primitives the scale implies.
4. **Layout.** Header, nav, mobile nav, footer onto the new primitives.
5. **Blocks and pages.** Propagate; fix heading order; replace hardcoded colours.
6. **Performance.** Un-client `Media`, fix `sizes`, audit the remaining 86 client components.
7. **Review.** Responsive, accessibility, `web-design-guidelines`, build.
