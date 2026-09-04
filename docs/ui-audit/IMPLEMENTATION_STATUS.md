# Implementation Status — Blocks & UI Fixes

Completed **2026-08-09** against the audit roadmap in `BLOCKS_AND_COMPONENTS_AUDIT.md`.

## Phase 1 — Fixes (done)

| Item | Change |
|------|--------|
| Low Impact hero links | `src/heros/LowImpact/index.tsx` renders `HeroLinks` + trust row |
| Archive block | `CollectionArchive` uses `ProductGridItem` |
| Features block | Added `linkedCards` layout, per-item `enableLink` + `link`, optional `icon` |
| Block spacing | `RenderBlocks` uses `gap-16` wrapper; removed duplicate `my-16` from Content/FAQ/Archive/Features |

## Phase 2 — New blocks (done)

| Block | Slug | Files |
|-------|------|-------|
| Testimonials | `testimonials` | `src/blocks/Testimonials/` (grid + carousel) |
| Logo cloud | `logoCloud` | `src/blocks/LogoCloud/` (grid + marquee) |
| Stats / trust bar | `stats` | `src/blocks/Stats/` |
| Product showcase | `productShowcase` | `src/blocks/ProductShowcase/` |
| Newsletter | `newsletter` | `src/blocks/Newsletter/` + `src/app/(app)/api/newsletter/route.ts` |

## Phase 3 — Hero upgrades (done)

| Item | Change |
|------|--------|
| Trust row | Optional `enableTrustRow` + `trustItems[]` on hero group (`src/fields/hero.ts`) |
| Shared hero UI | `HeroLinks`, `HeroTrustRow`, responsive `heroRichTextClassName` |
| All hero variants | High/Medium/Landing/Low updated to use shared components |

## Phase 4 — Additional blocks (done)

| Block | Slug | Files |
|-------|------|-------|
| Split feature / brand story | `splitFeature` | `src/blocks/SplitFeature/` |
| Service showcase | `serviceShowcase` | `src/blocks/ServiceShowcase/` (hidden when booking disabled) |
| Promo banner style | — | `promo` style added to `Banner` block |

## Seed & registration (done)

- All blocks registered in `src/collections/Pages/index.ts` and `src/blocks/RenderBlocks.tsx`
- Homepage seed updated: `src/endpoints/seed/home.ts` (landing split hero, full section stack)
- Types regenerated: `pnpm generate:types` — `tsc --noEmit` passes

## Shared utilities added

- `src/components/SectionHeader/`
- `src/fields/sectionHeader.ts`
- `src/utilities/fetchProductsForBlock.ts`
- `src/utilities/fetchServicesForBlock.ts`
- `src/utilities/resolveLinkHref.ts`

## To apply on deployed site

1. Deploy code
2. Re-seed or manually rebuild homepage in Payload admin using new blocks
3. Optional: set `NEWSLETTER_WEBHOOK_URL` env for newsletter POST forwarding

## Remaining (future polish)

- Page layout **presets** in admin (one-click homepage templates)
- Announcement bar global
- Configurable footer sections

## Visual polish pass (2026-08-09)

| Area | Change |
|------|--------|
| **Site theme tokens** | Stronger card/border contrast; dark borders derived from palette (not light accent); `--muted`, `--input`, `--muted-foreground` synced |
| **Shadcn defaults** | Warm coffee-brown primary palette in `theme.ts` |
| **Navigation** | Nav/ghost buttons use `text-muted-foreground`; active nav link uses primary color + underline |
| **Header** | Site name shown beside logo |
| **Footer** | Semantic `border-border`, `text-muted-foreground`, `text-foreground` |
| **Product cards** | Stronger title/price typography, card shadow, hover states |
| **Shop UI** | Search, category filters, tabs, grid tiles use theme tokens |
| **Cart / checkout** | Replaced hardcoded neutrals; `.meta-label` utility for account labels |
| **Typography** | Responsive `clamp()` for prose h1–h3; hero responsive type |
| **Focus rings** | Unified to `--ring` / `ring-offset-background` in `globals.css` |
| **Errors** | Error pages use `bg-card`, `border-border`, `bg-primary` CTA |
