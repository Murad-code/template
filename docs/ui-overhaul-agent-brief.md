# Client website UI/UX and design-system overhaul

## Objective

Perform a comprehensive UI/UX and frontend design-system overhaul of the client-facing website in this PayloadCMS repository (`/Users/mkamali/Documents/Projects/template`).

The website has been developed over time with inconsistent visual styles across pages, blocks, sections and components. Individual components may look acceptable in isolation, but together they do not feel like one coherent, professionally designed product.

Transform the client website into something **polished, cohesive, modern, professional, responsive, accessible and maintainable**, with a clearly defined visual language and reusable component system.

This is not a request to redesign the homepage or apply superficial styling. Treat it as a full design-system and frontend architecture improvement across the client-facing website. The Payload admin panel is not the focus unless shared code requires changes.

---

## 0. What this repository actually is (read before planning)

A Payload CMS 3 ecommerce + booking template. Verified facts — do not re-derive them, but do verify anything you intend to change:

**Stack**

| Thing | Reality |
|---|---|
| Package manager | `pnpm` (lockfile `pnpm-lock.yaml`, `.npmrc` present) |
| Framework | Next.js `16.2.9`, App Router, React `19.2.1` |
| CMS | Payload `3.85.1`, Postgres adapter (`@payloadcms/db-postgres`) |
| Styling | **Tailwind v4** (`tailwindcss ^4.1.18`, `@tailwindcss/postcss`) in CSS-first mode, **plus** a legacy v3-style `tailwind.config.mjs` pulled in via `@config` from `src/app/(app)/globals.css` |
| UI primitives | shadcn-style components over Radix in `src/components/ui/` (`components.json` present, `baseColor: slate`, aliases `@/components`, `@/utilities`) |
| Fonts | Geist sans/mono plus a set of optional Google fonts (`src/config/typographyFonts.ts`), selected by the editor |
| Payments | Stripe (`@payloadcms/plugin-ecommerce`, `stripe` 18.x) |
| Other deps | MUI + `@mui/x-date-pickers` (booking calendar only), embla carousel, lenis smooth scroll, sonner, lucide-react, next-themes |

**Route groups**

- `src/app/(app)/` — the client website (the target of this work)
- `src/app/(payload)/` — the Payload admin (leave alone unless shared code forces a change)

**Frontend routes to review**

```
/                              src/app/(app)/page.tsx
/[slug]                        CMS pages (page builder)
/shop                          product listing
/products/[slug]               product detail
/checkout, /checkout/confirm-order
/book, /book/[slug], /book/confirm, /bookings/cancel
/account, /account/addresses, /account/bookings
/orders, /orders/[id], /bookings/[id]
/login, /create-account, /forgot-password, /logout, /find-order
```

**Page-builder blocks** (`src/blocks/`, registered in `src/blocks/RenderBlocks.tsx` and `src/collections/Pages/index.ts`)

`ArchiveBlock, Banner, CallToAction, Carousel, Code, Content, FAQ, Features, Form, HeroCarousel, LogoCloud, Marquee, MediaBlock, Newsletter, ProductShowcase, ServiceShowcase, SplitFeature, Stats, Testimonials, ThreeItemGrid`

Heroes live separately in `src/heros/` (`HighImpact`, `MediumImpact`, `LowImpact`, `LandingPreset`, plus `shared/`).

**Feature flags** — `PROJECT_TYPE` is read through `getSiteConfig()` in `src/config/site.ts` and gates whole areas of the site (`ecommerceEnabled`, `bookingEnabled`). The local `.env` is set to `hybrid`, so shop *and* booking are both live. Do not break the `ecommerce`-only or `booking`-only code paths; components that conditionally render (e.g. `ServiceShowcase`, `ViewProductsLink`, footer/nav links from `src/config/nav.ts`) must keep working in all three modes.

---

## 1. The single most important constraint: the theme is CMS-driven

**Colour, radius and fonts are not yours to hardcode.** They are editor-controlled at runtime:

- `src/config/theme.ts` — base shadcn token palette (oklch), light + dark, exported as CSS via `getThemeCss()`
- `src/config/siteTheme.ts` — landing/site palette + font stacks derived from the `site-theme` global, via `getLandingThemeCss()`
- `src/components/ThemeStyles/index.tsx` — injects both as a `<style>` block in the document head
- `src/globals/SiteTheme.ts` — admin UI: palette mode, saved palette, custom 5-colour palette, body/heading/mono font pickers, with live preview
- `src/collections/ThemePalettes.ts` + `pnpm seed:theme-palettes` — saved palettes
- `src/utilities/themePaletteValidation.ts` — hex normalisation/validation, covered by `tests/int/theme-palette-validation.int.spec.ts`
- `src/app/(app)/globals.css` — maps those runtime variables into Tailwind v4 via `@theme inline` (`--color-*`, `--radius-*`, surface and text aliases)

Consequences you must respect:

1. **Never** write a raw colour into a component. Use the semantic tokens (`bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-surface-soft-panel`, `text-text-secondary`, …).
2. The design must hold up across **every seeded palette** and in **both light and dark** (`data-theme="dark"`). Test at least two very different palettes plus dark mode. A design that only works with the default warm-brown palette is a failure.
3. If you introduce a new token, plumb it all the way through: `theme.ts` / `siteTheme.ts` → `globals.css` `@theme inline` → Tailwind utility → (if editor-facing) the `SiteTheme` global fields and the palette validator. Half-plumbed tokens silently fall back to nothing.
4. `--radius` comes from the palette. A radius *scale* is fine, but derive it from `--radius` as `globals.css` already does (`--radius-sm/md/lg/xl`) rather than hardcoding pixel values.

---

## 2. Work that already exists — extend it, do not restart it

Recent commits on `main` already began this effort. Read them first (`git log -8 --stat`):

```
38d8d32 Rebuild the showcase home page around the new blocks
6551c30 Add migration for block appearance fields and new blocks
a06d628 Register the new blocks and pin a home page shortcut in the nav
a712375 Stop the carousel client component being async
961baf6 Let every block set its own background band and spacing
```

Existing foundations to build on:

- **`src/components/Section/index.tsx`** — full-width colour bands (`default | muted | soft | inverse`) with a spacing scale (`default | tight | loose | none`) and a scroll reveal. `data-tone="inverse"` remaps theme tokens for everything inside, so any block can sit on a dark band without knowing it.
- **`src/fields/sectionStyle.ts`** — the matching `background` + `spacing` admin fields, already on ~18 blocks.
- **`src/blocks/RenderBlocks.tsx`** — wraps blocks in `Section`, with `SELF_CONTAINED` (paints its own band) and `SELF_ANIMATING` (staggers its own children) escape hatches.
- **`src/app/(app)/motion.css`** — a deliberate motion system: `[data-motion='on']` set before first paint, `prefers-reduced-motion` honoured, scroll-driven animations behind `@supports`, one easing curve (`--ease-smooth`). Read its header comment; follow its rules rather than inventing a second motion vocabulary.
- **`src/components/SectionHeader/`**, `src/fields/sectionHeader.ts`, `src/fields/hero.ts`, `src/fields/link.ts`, `src/fields/icon.ts` — shared field + component patterns.
- **`src/components/ui/`** — `accordion, button, card, carousel, checkbox, dialog, icon-square-button, input, label, meta-chip, pagination, select, sheet, sonner, surface-card, textarea`.

Existing documentation (read all three; they are partly stale but they record intent and known problems):

- `docs/frontend-ui-system.md` — the short current rules of the system
- `docs/ui-audit/DESIGN_SYSTEM.md` — the detailed audit, §13 holds the remaining visual-polish list
- `docs/ui-audit/BLOCKS_AND_COMPONENTS_AUDIT.md` and `IMPLEMENTATION_STATUS.md` — what was already fixed in the August pass
- `docs/ui-audit/audit-data.json` + `screenshots/` — machine-readable tokens per page/viewport/theme, regenerable with `pnpm exec tsx scripts/capture-ui-audit.ts <url>`

Note the audit documents were captured against the deployed demo (Black Oak Coffee Co., a coffee brand built on this template). The repo is a **reusable template**, so design for "a serious small-business commerce/booking site", not for coffee specifically.

---

## 3. Avoid generic AI-generated design

The website must not look like a generic AI-generated SaaS landing page. Avoid:

- turning every section into a grid of cards
- excessive pill-shaped UI, excessive border radius, giant rounded containers around everything
- cards floating inside cards
- arbitrary gradients everywhere, glowing elements, decorative blobs with no purpose
- oversized marketing headings on every page
- every icon inside a coloured circular background
- unnecessary badges above every heading
- excessive drop shadows, excessive glassmorphism, excessive animation
- repeating the same three-column feature-card pattern; sections that all share one layout
- **adding fake statistics, testimonials, copy or content merely to make a design work**

Use visual restraint. Typography, layout, spacing, proportion, hierarchy and composition should do most of the work. The site should feel intentionally designed for this business and its content, not generated from a UI template.

### Visual direction

Bento-grid thinking is welcome *selectively* — where content genuinely benefits from grouping, differing importance, mixed sizes or asymmetry. Do not turn the whole site into a bento grid. Keep some sections open, editorial, full-width, typography-led, image-led, split-layout or simply stacked. That variety is the point.

### Shape language

Refine and standardise the existing softly-rounded direction rather than amplifying it. Cards subtle/medium radius, buttons slightly tighter, inputs consistent with buttons, images not always identically rounded, small elements not automatically pills. Derive everything from the `--radius` scale; stop the `rounded-lg`/`xl`/`2xl`/`3xl` free-for-all.

---

## 4. Branch and local state

Start from the latest `main`:

```bash
git fetch origin && git status
```

Create `feat/client-ui-design-system-overhaul` from the latest `main`. **Do not merge it into `main`.**

The working tree is not clean. Leave this unrelated work alone — do not revert, stash away permanently, or sweep it into your commits:

- modified: `.env.example`, `scripts/docker-build-amd64.sh`
- untracked: `.agents/`, `.claude/`, `skills-lock.json` (skill installs — may be committed separately or left untracked, but they are not part of this change)

**Commit conventions for this repo:** logical self-contained commits, not one giant one. Subject line only, no body, imperative, under ~70 characters, matching the existing style (`git log` for examples). British spelling. No em dashes. No AI attribution trailers or footers of any kind in commit messages or PR descriptions.

---

## 5. Access, credentials and running the app

**Postgres is already running locally** on `localhost:5432` (database `template`), and `.env` is configured. Do not start the Docker compose stack for development; `docker-compose.yml` is for deployment.

```bash
pnpm dev          # http://localhost:3000
```

A Claude Code launch config already exists: `.claude/launch.json` → server name **`template-dev`**. Use `preview_start { name: "template-dev" }` rather than running the dev server through a shell.

**Admin login** (local dev data, use freely — you should not be blocked from any part of the site):

- URL: `http://localhost:3000/admin`
- Email: `murad.coding@gmail.com`
- Password: `password`

Log in to inspect how blocks are authored, to build test pages exercising every block, to switch theme palettes and fonts, and to verify live preview still works after your changes.

**Stripe is in test mode** (`sk_test_…` / `pk_test_…` in `.env`). To exercise checkout and booking payment:

- Card number `4242 4242 4242 4242`
- Any valid future expiry, e.g. `12/34`
- Any 3-digit CVC (4 for Amex)
- Any value for the remaining fields

Webhooks, if needed: `pnpm stripe-webhooks` (requires the Stripe CLI).

Seeding, if you need richer content: `pnpm seed` (demo content), `pnpm seed:theme-palettes` (saved palettes), `pnpm create:admin`. Seeding rewrites content — check with the user before destroying existing local content you did not create.

---

## 6. Skills

Use the available skills throughout, not as optional references.

**Already installed** in this repo (`skills-lock.json`, `.claude/skills/`): `shadcn`, `migrate-radix-to-base`. Do not reinstall shadcn. Note `migrate-radix-to-base` exists but **a Radix → Base UI migration is out of scope** — do not start one.

**Already available globally:** `/anthropic-skills:frontend-design`. Use it extensively for visual decisions.

**Install if missing:**

```bash
npx ui-ux-pro-max-cli init --ai claude
npx skills add vercel-labs/agent-skills@web-design-guidelines
npx skills add vercel-labs/agent-skills@composition-patterns
npx skills add vercel-labs/agent-skills@react-best-practices
```

Suggested use:

- **Discovery/design** — `frontend-design`, UI/UX Pro Max, `web-design-guidelines`
- **Component architecture** — `shadcn`, `composition-patterns`, `react-best-practices`
- **Implementation** — all of the above
- **Final review** — `web-design-guidelines`, `frontend-design`, `react-best-practices`

On shadcn: use it as a foundation for accessible primitives, then customise and extend them to match this design system and compose them into higher-level site components. Do not blindly replace existing primitives with stock shadcn, and do not let the site end up looking like the shadcn docs. One gotcha: `components.json` points `tailwind.config` at `tailwind.config.js`, which does not exist (the real file is `tailwind.config.mjs`) — fix that pointer if you use the CLI.

---

## 7. Phase 1 — audit

Before implementing, audit the existing client website: every route listed in §0, every block, the heroes, header, footer, nav, mobile nav, forms, cart, checkout and booking flows. Run the site and look at it; do not audit from source alone.

Identify: inconsistent border radii, shadows, spacing, container widths, heading scales, body typography, one-off font sizes, duplicate button styles, multiple card implementations, inconsistent image treatment, colour usage, borders, section padding, icon sizes, duplicate components, repeated Tailwind class stacks, one-off patterns, inconsistent responsive behaviour, unnecessary client components, boolean-prop explosion, poor composition, accessibility problems, weak content hierarchy.

Also identify what is already good and should be kept or evolved. Do not redesign for the sake of redesigning.

Specific things worth checking early, because they are known or suspected:

- The **dual styling setup** — Tailwind v4 `@theme` in `globals.css` *and* the v3-style `tailwind.config.mjs` loaded via `@config`, with duplicated `safelist`/`@source inline`, duplicated colour definitions, duplicated breakpoints and a hand-rolled `.container` utility. Decide whether to consolidate onto the v4 CSS-first setup, and if so do it carefully and verify every utility still resolves.
- The **two theme systems** called out in the existing audit (site palette hex vs oklch shadcn defaults) producing inconsistent tokens.
- Dark-mode border contrast.
- Responsive heading scale (`h1` is set to `4rem` in the typography plugin config).
- MUI is pulled in for the booking date pickers — check how much MUI styling leaks into the client site and whether it can be made to match the design system.

Write the audit down (see §14) before you start changing things.

---

## 8. Phase 2 — design-system foundations

Define the foundation before touching every page.

**Colour** — semantic tokens only: background, foreground, muted, muted-foreground, primary, primary-foreground, secondary, accent, border, destructive, ring, plus the existing surface/text aliases. Evolve the existing brand tokens; do not replace them arbitrarily. Remember §1: these are runtime, editor-controlled values.

**Typography** — a deliberate hierarchy: display, h1–h4, body large/body/small, labels, captions. Attend to family, weight, size, line height, tracking, readable line length and responsive scaling. "Make everything bigger" is not a design technique. Respect the editor-selected heading/body/mono font stacks — the scale must work with both a serif and a geometric sans heading font.

**Spacing** — one rhythm: section spacing, component spacing, card padding, content gaps, container gutters, vertical rhythm. The `Section` spacing scale already exists; extend rather than bypass it.

**Layout** — max content width, standard container, narrow reading width, wide layouts, section padding, responsive gutters, grid gaps, breakpoint behaviour. Pages should feel related because they share a layout system.

**Radius** — a small scale derived from `--radius`. Soft, not bubble-like.

**Borders and elevation** — consistent rules for flat, bordered, elevated, hover-elevated and overlay surfaces. Prefer subtlety; not every card needs a visible shadow.

**Motion** — follow `motion.css`: one easing curve, subtle, `prefers-reduced-motion` respected, motion that communicates interaction or hierarchy rather than spectacle.

---

## 9. Phase 3 — primitives and component architecture

Audit what exists in `src/components/ui/` before adding anything. Standardise where it genuinely helps: Button, Link, IconButton, Card/Surface, Badge, Input, Textarea, Select, Checkbox, Dialog, Dropdown, Tabs, Accordion, Breadcrumbs, Section, Container, typography patterns, Media/Image wrapper.

A component should exist because it provides meaningful reuse, behaviour or consistency — not because every `<div>` wants a wrapper.

Follow `composition-patterns`. Prefer composition over components that accumulate `compact` / `dark` / `featured` / `centered` / `bordered` / `rounded` / `showIcon` / `horizontal` flags when those represent structurally different components. Use explicit variants (`class-variance-authority` is already a dependency) where that gives a clearer API. Keep primitives flexible and higher-level components opinionated.

Avoid giant components, deeply nested conditionals, duplicated markup, styling copied between files, boolean-prop explosion, unnecessary wrappers, unnecessary state or context, and overly clever abstractions. Another engineer opening this project should understand the system.

---

## 10. CMS architecture must stay flexible

The frontend is driven by Payload content. Hard-coding page content to achieve a design is not acceptable. Existing blocks must keep rendering existing content correctly.

Where a block needs a visual variant, model it as a field (follow the `sectionStyle.ts` pattern) rather than inventing ad-hoc styling logic.

**Schema changes carry real cost here — the DB is Postgres, so new or changed fields need a migration.** Precedent: `src/migrations/20260809_173733_ui_audit_blocks.ts` and `src/migrations/20261004_105148_port_smartmove_blocks.ts`. If a schema change is genuinely valuable:

1. explain why
2. check existing content compatibility (new selects need sensible `defaultValue`s so existing rows render)
3. create the migration (`pnpm payload migrate:create`) and verify it applies
4. run `pnpm generate:types`
5. confirm existing content still renders

Avoid renaming or removing existing block fields unless you have a migration that preserves content.

After adding or moving any component referenced by a Payload component path, run `pnpm generate:importmap`.

---

## 11. Higher-level components and page composition

Once primitives are solid, refactor the higher-level pieces onto them: `Header`, nav and mobile nav, `Footer`, heroes, CTA sections, feature grids, bento compositions, content sections, split image/text sections, testimonials, stats, forms, product and service cards, `CollectionArchive`, `ProductGridItem`/`ProductItem`, `LineItemRow`, cart, checkout, booking calendar and the account area.

Do not introduce content categories that do not already exist just because marketing sites usually have them.

Pages should share a design language without looking identical: editorial layouts, asymmetric grids, selective bento sections, split image/text, simple text sections, restrained cards, larger visual moments, narrow long-form content, full-width media. Consistency from the system, personality from the composition.

---

## 12. Responsive, accessibility, React quality

**Responsive** — mobile, tablet and desktop are all first-class. Review typography scaling, navigation behaviour, grid transformations, image cropping, touch targets, spacing, content order, bento behaviour on small screens, long text, CTAs, form controls and overflow. No horizontal scrolling, no compressed layouts. The booking calendar and checkout are the hardest cases — check them explicitly.

**Accessibility** — semantic HTML, heading order, keyboard navigation, visible focus states, colour contrast (across palettes and both themes), accessible labels, correct button vs link semantics, form error association, touch target sizes, image alt behaviour, reduced-motion, dialogs and dropdowns, interactive states. `eslint-plugin-jsx-a11y` is configured — keep it clean. Prefer the existing Radix-based primitives over rebuilding interaction behaviour.

**React/Next** — follow `react-best-practices`. Watch for unnecessary `"use client"`, misplaced client/server boundaries, unnecessary re-renders, waterfall data fetching, bundle size (MUI and lenis are the heavy ones), duplicated fetching, loading behaviour, image performance (`next/image` through `src/components/Media`), unnecessary effects, derivable state and code splitting. Payload data fetching is cached via `getCachedGlobal` / cache tags — do not break revalidation.

---

## 13. Preserve functionality

This is a frontend/design overhaul. Preserve Payload content, CMS editing behaviour and live preview, links, forms, navigation, dynamic routes, SEO metadata (`@payloadcms/plugin-seo`), image behaviour, API routes under `src/app/(app)/api/`, Stripe checkout and booking flows, invoice generation, refunds and all server-side business logic.

Do not change application behaviour unless it is necessary to fix a real UX problem — and say so when you do.

---

## 14. Visual validation

Do not rely on reading code. Run the app and look at it.

Use `preview_start { name: "template-dev" }`, then the browser tools to navigate, read the page and screenshot. Review representative pages at roughly mobile (375), tablet (768), standard desktop (1440) and large desktop (1920), in **light and dark**, and under **at least two different theme palettes** set from `/admin`.

Build at least one CMS page that exercises every block so you can see them together rather than only in isolation.

Look for inconsistent spacing, awkward wrapping, over-empty or cramped areas, accidental alignment differences, broken grids, oversized typography, inappropriate card usage, inconsistent image treatment, hover/focus problems and layout shift.

`scripts/capture-ui-audit.ts` already exists for bulk screenshot + token capture — reuse it if it helps, and refresh `docs/ui-audit/` if you regenerate.

Iterate on what you actually see.

---

## 15. Verification

Run, in roughly this order, and fix properly rather than silencing:

```bash
pnpm exec tsc --noEmit          # type check
pnpm lint                        # eslint via next lint
pnpm exec prettier --check .     # formatting (prettier + prettier-plugin-tailwindcss)
pnpm test:int                    # vitest integration tests
pnpm build                       # production build (needs DATABASE_URL reachable)
```

End-to-end tests are expensive (they boot a dev server via `playwright.config.ts`). Run the targeted specs that cover what you changed:

```bash
pnpm exec playwright test tests/e2e/frontend.e2e.spec.ts   # PROJECT_TYPE=ecommerce
pnpm test:e2e:booking                                      # PROJECT_TYPE=booking
pnpm test:e2e:hybrid                                       # PROJECT_TYPE=hybrid
```

**Ask before running the full `pnpm test` suite** — it is slow and memory-hungry. The same applies to any long full-suite run.

If you changed Payload schema: `pnpm generate:types`, create and apply the migration, and re-run the type check. If you changed components referenced by Payload component paths: `pnpm generate:importmap`.

---

## 16. Documentation

Documentation already exists and is scattered. **Consolidate rather than adding a fourth file.** Make `docs/frontend-ui-system.md` the single authoritative design-system document (or create `docs/design-system.md` and leave a one-line pointer in the old file — pick one and be consistent), and update `docs/ui-audit/` to reflect what this pass changed rather than leaving stale claims in place.

Document: design principles, colour tokens and how the CMS theme system feeds them, typography scale, spacing, radii, surfaces and elevation, layout/container rules, the key primitives and their variants, when bento layouts are and are not appropriate, motion rules, responsive principles, and how to add a new block without reintroducing one-off styling.

Write it for a developer or an AI agent who opens this repo in six months, not as a changelog. Follow the repo's comment philosophy: explain *why*, not *what*.

---

## 17. Working style

Work iteratively; do not attempt one enormous rewrite. A sensible sequence:

1. Inspect the repo and run the app (admin + frontend, both themes)
2. Audit current pages, blocks and components
3. Install/load the skills
4. Decide the visual direction
5. Consolidate and define global design tokens
6. Create/refactor core primitives
7. Refactor layout, header, footer, nav
8. Refactor the highest-impact blocks and pages
9. Propagate across the remaining blocks and routes
10. Responsive pass
11. Accessibility pass
12. `web-design-guidelines` review
13. React/component architecture review
14. Lint, typecheck, tests, build
15. Fix regressions
16. Final visual review
17. Documentation

Commit as you go, in logical commits, following §4's conventions.

Make reasonable decisions autonomously. Do not stop after every minor decision. Stop only for something genuinely blocking, or a decision that would significantly alter business behaviour or content architecture — in particular: destructive reseeding, breaking Payload schema changes, removing a block, dropping a dependency like MUI, or anything that changes what the site *does* rather than how it looks.

---

## 18. Final self-review

Before declaring this finished, evaluate your own work.

**Visual** — Does it look intentionally designed, or still like a template? Is bento overused? Too many cards? Corners too round? Is typography doing enough of the work? Are page compositions varied but related? Is there a clear personality? Does every component feel like part of one website? Does it still hold together under a completely different theme palette and in dark mode?

**Architecture** — Are common visual values tokenised? Is styling duplicated? Are primitives genuinely reusable? Did you create unnecessary abstraction? Are the component APIs clear? Are Payload blocks still flexible for editors? Did the redesign add unnecessary client-side JavaScript?

**Quality** — Is it responsive? Accessible? Does it build cleanly? Do checkout, booking, account and auth still work end to end? Would another engineer understand how to extend this in six months?

If the answer to any of these is no, keep refining.

---

## 19. Expected final output

A concise summary covering:

1. the visual/design direction chosen and why
2. the design-system foundations introduced (and what happened to the Tailwind v3/v4 dual setup)
3. major components created or refactored
4. how shadcn was used and customised
5. major code-quality improvements
6. responsive and accessibility improvements
7. files/areas significantly changed
8. checks, tests and builds actually run, with their results
9. anything deliberately left unchanged, and why
10. remaining recommendations

The goal is not "a nicer looking site". It is to leave this repository with a coherent, professional client website and a maintainable design system that future blocks and components build on naturally, instead of drifting back into one-off styling.
