# Frontend design system

How the client-facing site is put together. The Payload admin is not covered here.

Read this before adding a block, a page or a component. Most inconsistency in this
codebase has come from a component deciding its own spacing, radius or type size
rather than reaching for one of these.

---

## 1. Principles

**The palette is not yours.** Colour, radius and the three font stacks are chosen by
an editor in the Site Theme global and injected at runtime. Never write a hex value,
a `neutral-*`/`gray-*` class, or `text-black`/`bg-white` into a client component.
Reach for the semantic tokens; they resolve per palette, per theme.

**Typography does the work.** Hierarchy comes from the type scale, the measure and
the spacing rhythm, not from boxes, badges, shadows or colour. If a section is hard
to read, the fix is almost always size, weight and space, not another container.

**A card means something.** Cards are for items that are destinations, or that need
to be separated because they are of different kinds. Six statements in a row are a
list, not six cards.

**One ornament.** The specification line (§7) is the only recurring decorative
device. Everything else is type on a surface.

**Shadows mean floating.** Static surfaces separate by a hairline and a tonal step.
A drop shadow says the thing is above the page: dialogs, sheets, menus. Nothing else.

---

## 2. Colour tokens

Defined in `src/config/theme.ts` (fallbacks) and derived per palette in
`src/config/siteTheme.ts`, injected by `src/components/ThemeStyles`, exposed to
Tailwind in `src/app/(app)/globals.css` under `@theme inline`.

| Token | Use |
|---|---|
| `background` / `foreground` | The page and its text |
| `card` / `card-foreground` | Any panel sitting on the page |
| `popover` / `popover-foreground` | Dialogs, sheets, menus |
| `primary` / `primary-foreground` | Calls to action, the brand's one strong colour |
| `secondary` / `secondary-foreground` | Quiet filled controls |
| `accent` / `accent-foreground` | The palette's mid tone, for emphasis |
| `muted` / `muted-foreground` | Recessive fills and secondary text |
| `border` · `border-subtle` · `border-strong` | Hairlines, in three weights |
| `input` | Form control edges |
| `ring` / `focus-ring` | Focus. Never override per component |
| `destructive`, `success`, `warning`, `error` | Status. Not brand colours, so not palette-derived |
| `surface-base` · `surface-raised` · `surface-soft-panel` · `surface-header` · `surface-footer` | Named surfaces where a component needs one specifically |

### How a palette becomes tokens

An editor picks five colours plus a light and a dark text colour.
`deriveTokens()` in `src/config/siteTheme.ts` maps them:

- light mode: `color1` → background, `color2` → card, `color3` → accent and the
  border family, **`color4` → primary**
- dark mode: `color5` → background, `color4` → card, **`color3` → primary**

Every derived pair is checked with `getContrastRatio` and nudged until it clears
AA (`ensureContrast` in `src/utilities/colorMix.ts`). Saved palettes are validated
on save by `assertPaletteContrast`; the one-off custom palette is not, which is why
the derivation enforces contrast rather than assuming it.

`tests/int/theme-token-derivation.int.spec.ts` holds this contract. If you change the
mapping, that spec should fail.

### Inverse bands

`data-tone="inverse"` on a `Section` remaps the whole token set for its subtree
(see `globals.css`). A block written against `bg-card` and `text-muted-foreground`
sits correctly on a dark band without knowing it is on one.

Two gotchas:

- Inside an inverse scope `primary` and `primary-foreground` **swap**. For a panel
  that must sit on the band's own colour, use `bg-background` and `text-foreground`,
  which follow the tone correctly in both directions.
- The remap happens on the inner `[data-tone-scope]` element, not the band itself,
  to avoid a variable cycle. Don't flatten the two elements.

---

## 3. Type scale

Sizes are fluid (`clamp()`), so there is one scale rather than a desktop scale plus
per-component mobile overrides. Tracking is part of the token because the heading
face is editor-chosen and a serif and a geometric sans need the same correction at
the same size.

| Class | Role |
|---|---|
| `text-display` | Hero headline. One per page at most |
| `text-h1` | Page title |
| `text-h2` | Section title |
| `text-h3` | Subsection, or a figure that should read large |
| `text-h4` | Card and list-item title |
| `text-body-lg` | Section lede, hero subheading |
| `text-body` | Default. Set on `body`, so usually not needed explicitly |
| `text-body-sm` | Supporting copy, captions, dense UI |
| `text-caption` | Smallest readable copy |
| `text-label` | The specification voice (§7). Pair with `font-mono` |

Headings get `text-wrap: balance` from the base layer. Body copy that runs wide
should be capped with `max-w-prose`.

**Do not** use the built-in `text-sm`/`text-lg`/`text-3xl` scale in client UI. The
custom scale and the colour utilities share the `text-` prefix, which is why
`src/utilities/cn.ts` extends tailwind-merge with the scale's names — without that,
`cn('text-h2', 'text-muted-foreground')` silently drops one of them
(`tests/int/cn.int.spec.ts`).

---

## 4. Measure and layout

| Token | Width | Use |
|---|---|---|
| `max-w-prose` | 68ch | Long-form reading, section descriptions |
| `max-w-narrow` | 44rem | A single column of form or copy |
| `max-w-content` | 72rem | Standard page content |
| `max-w-wide` | 86rem | Full-width layouts. The `container` cap |

`container` centres, caps at `max-w-wide` and supplies the responsive gutter. Use it
once per band; don't nest it.

Vertical rhythm belongs to `Section` (§6), not to the block inside it.

---

## 5. Radius, elevation, motion

**Radius** is derived from the palette's `--radius`:

| Class | Use |
|---|---|
| `rounded-xs` | Focus targets on inline text |
| `rounded-sm` | Buttons, inputs, selects, small controls |
| `rounded-md` | Menus and popovers |
| `rounded-lg` | Cards, panels, media |
| `rounded-xl` | Large feature panels, hero media |

Controls sit one step tighter than the surfaces holding them. `rounded-full` is for
things that are genuinely round: avatars, dots, round icon buttons. Not for chips,
badges or labels.

**Elevation** has two steps: `shadow-raised` (something that lifts slightly on
interaction) and `shadow-overlay` (dialogs, sheets, menus). Both are tinted with the
foreground colour so they survive a dark palette. There is no third step; if you
want one, you probably want a border.

**Motion** lives in `src/app/(app)/motion.css`. One easing curve (`--ease-smooth`),
`prefers-reduced-motion` honoured, reveals that degrade to their final state without
JS. Animate `transform` and `opacity`; never `transition-all`.

---

## 6. Sections and bands

`src/components/Section` paints a full-width band and owns the vertical rhythm.
Every block gets `background` and `spacing` fields from `src/fields/sectionStyle.ts`,
so editors compose the page's tonal rhythm.

- `background`: `default` · `muted` · `soft` · `inverse`
- `spacing`: `default` · `tight` · `loose` · `none`

`RenderBlocks` wraps each block in a `Section` except those in `SELF_CONTAINED`
(they paint their own band) or `SELF_ANIMATING` (they stagger their own children, so
the parent must not also fade in as one).

Alternating bands are most of what makes a page read as designed. A page where every
section is on `default` will look like a stack of components whatever else you do.

---

## 7. The specification line

`src/components/ui/spec-list.tsx`. A run of concrete facts — origin, duration,
weight, capacity, price — set in the mono face, small, wide-tracked, separated by
hairlines.

```tsx
<SpecList>
  <Spec label="Duration">90 min</Spec>
  <Spec label="Price">£45.00 upfront</Spec>
</SpecList>
```

`label` names the fact for assistive technology; pass `showLabel` to print it too.
The hairline between items is a CSS rule, not an element, so there is nothing
spurious to read out.

Use it wherever the content already carries specifics. Use it instead of: badges,
pills, chips, icons in coloured circles, and "eyebrow" labels above headings.
`SectionHeader`'s eyebrow already speaks in this voice.

Figures elsewhere — prices, stat values — use `font-mono`, which carries
`tabular-nums` so columns line up.

---

## 8. Primitives

In `src/components/ui/`:

| Component | Notes |
|---|---|
| `Button` | Variants `default` · `destructive` · `outline` · `subtle` · `secondary` · `ghost` · `link`. Sizes `sm` · `default` · `lg` · `icon` · `clear`. Focus comes from `interactive-focus` |
| `Card` | `elevation` is the only axis: `flat` (default) · `raised` · `overlay`. `CardPlain` drops the border. Padding lives on `CardHeader`/`CardContent`/`CardFooter` |
| `SpecList` / `Spec` | §7 |
| `Input` · `Textarea` · `Select` · `Checkbox` · `Label` | Radix-backed, on the control radius |
| `Dialog` · `Sheet` | `popover` surface, `shadow-overlay`, `overscroll-contain` |
| `Accordion` · `Carousel` · `Pagination` · `IconSquareButton` · `Sonner` | |

The header's link style is `navLinkClassName` in `src/components/Header/`. It is not
a `Button` variant: it carries header-specific vertical padding that the underline
rule depends on, and that layout concern should not reach every other control.

Shared utilities in `globals.css`: `interactive-focus` (the one definition of what
focus looks like), `spec-list`, `booking-slot-button`.

---

## 9. Composition

Vary the structure, not just the contents:

- editorial two-column ruled lists (`Features` `minimal`)
- cards, where items are destinations (`Features` `linkedCards`, product and service grids)
- split image/text, alternating sides down the page (`SplitFeature`)
- full-bleed media with a caption bar (`ThreeItemGrid`, `Carousel`)
- a single inverse band of figures (`Stats`)
- narrow long-form copy (`Content`)

Bento-style asymmetric grids suit content with genuinely different weights. They are
a tool for a particular section, not the page's default layout. Avoid: every section
as a three-column card grid, cards inside cards, a badge above every heading, an icon
in a coloured circle on every item, and decoration with no informational job.

Never invent statistics, testimonials or copy to make a layout work. If the content
isn't there, the layout is wrong.

---

## 10. Adding a block

1. `src/blocks/<Name>/config.ts` — fields, spreading `...sectionStyleFields` and
   `sectionHeaderFields` where they fit.
2. `src/blocks/<Name>/Component.tsx` — server by default. Open with `container`,
   then `SectionHeader`. Don't set your own band or outer vertical padding;
   `Section` does that.
3. Register in `src/blocks/RenderBlocks.tsx` and `src/collections/Pages/index.ts`.
4. `pnpm generate:types`, then create a migration (`pnpm payload migrate:create`) —
   this is Postgres, so new fields need one. Give new selects a `defaultValue` so
   existing content keeps rendering.
5. `pnpm generate:importmap` if you added a component Payload resolves by path.

Checklist before you call it done: semantic tokens only; type scale only; one radius
from the scale; no shadow unless it floats; heading level correct for its place in
the page outline; images pass a real `size`; works on `inverse` as well as `default`.

---

## 11. Responsive and accessible

Mobile, tablet and desktop are all first-class. Stacking a desktop layout is not a
mobile design: on a phone, a filter rail becomes a swipeable row, a hero scrim runs
down the page instead of across it, and a primary action goes full width.

Non-negotiables:

- Every page has exactly one `h1`, and heading levels never skip.
- Interactive targets are at least 24px in both dimensions.
- Focus is visible everywhere — always via `interactive-focus`, never a bespoke ring.
- Links say where they go; icon-only controls carry an `aria-label` or `sr-only` text.
- Form fields have a label, a semantic `type`, and `autocomplete`.
- Decorative images use `alt=""`; decorative icons use `aria-hidden`.

---

## 12. Performance

- `Media` renders images on the server. Pass `size` with the slot's real width — the
  default is a full-bleed fallback, and relying on it fetches far larger renditions
  than the slot needs.
- Prefer server components. Reach for `'use client'` only for state, effects, event
  handlers or browser APIs — and push it to the smallest component that needs it.
- Don't break Payload's cache tags (`getCachedGlobal`, `revalidateTag`).
