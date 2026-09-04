# Blocks & Components Audit — Payload Page Builder

> **Audience:** UI/UX + Payload implementation agent  
> **Companion docs:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [README.md](./README.md)  
> **Live site:** [https://muradsprojects.co.uk/](https://muradsprojects.co.uk/)

This document audits every **hero** and **layout block** used to compose marketing pages (homepage, about, contact, etc.), identifies **gaps and broken renderers**, and recommends **new blocks/layout variants** admins need to build high-converting sites — informed by current codebase analysis and industry homepage patterns.

---

## 1. How pages are built

```mermaid
flowchart TB
  Admin[Payload Admin → Pages collection]
  HeroTab[Hero tab — single hero group]
  LayoutTab[Content tab — layout blocks array]
  Admin --> HeroTab
  Admin --> LayoutTab
  HeroTab --> RenderHero[src/heros/RenderHero.tsx]
  LayoutTab --> RenderBlocks[src/blocks/RenderBlocks.tsx]
  RenderHero --> Page[src/app/(app)/[slug]/page.tsx]
  RenderBlocks --> Page
  Page --> HTML[Frontend page]
```

**Registration:** `src/collections/Pages/index.ts`  
**Rendering:** `src/app/(app)/[slug]/page.tsx` wraps content in `<article className="pt-16 pb-24">`  
**Block spacing:** Every block gets an extra `my-16` wrapper in `RenderBlocks.tsx` (double margin with blocks that also use `my-16` internally).

**Also uses blocks (subset):** `Products` collection layout tab — `CallToAction`, `Content`, `MediaBlock` only.

**Not page-builder driven:** Shop (`/shop`), Book (`/book`), checkout, account — hardcoded route templates.

---

## 2. Hero components inventory

Hero is a **separate tab** on Pages (not a block). Config: `src/fields/hero.ts` · Options: `src/heros/options.ts`

| Admin label | Slug | Media required | Links (max 2) | Component | Best for |
|-------------|------|----------------|---------------|-----------|----------|
| None | `none` | — | — | — | Inner pages, content-first |
| High Impact | `highImpact` | Yes | Yes | `heros/HighImpact` | Full-bleed image, dark overlay, inverted header |
| Medium Impact | `mediumImpact` | Yes | Yes | `heros/MediumImpact` | Text above, wide image below |
| Low Impact | `lowImpact` | No | **Configured but not rendered** | `heros/LowImpact` | Text-only intro |
| Landing Split | `landingSplit` | Yes | Yes | `heros/LandingPreset` | 2-col text card + image |
| Landing Spotlight | `landingSpotlight` | Optional | Yes | `heros/LandingPreset` | Centered card on page bg (+ optional image) |

### Hero field schema (all types)

| Field | Type | Notes |
|-------|------|-------|
| `type` | select | Required |
| `richText` | Lexical | h1–h4, inline links |
| `links` | array (link group) | Max 2 rows; appearances: default, outline |
| `media` | upload → media | Required for high/medium/landing types |

### Hero gaps & bugs

| Issue | Severity | Detail |
|-------|----------|--------|
| **Low Impact ignores `links`** | P0 | Seed sets "Shop Coffee" + "Book a Workshop" CTAs but `LowImpactHero` only renders `richText`. Admins configure buttons that never appear. |
| No trust strip in hero | P1 | Industry pattern: stars, review count, or "Free shipping" under headline ([WebMedic](https://webmedic.com/ecommerce-homepage-design), [CommerceV3](https://commercev3.com/resources/blog/homepage-design-ecommerce-conversion-optimization-guide)) |
| No product-in-hero variant | P1 | Common ecommerce pattern: hero with featured product card ([shadcnblocks landing-page14](https://www.shadcnblocks.com/page/landing-page14)) |
| No video / background media options | P2 | Only static image upload |
| No layout controls per hero | P2 | Alignment (left/center), overlay opacity, min-height not exposed to admins |
| Landing presets share one component | P2 | Hard to extend independently; both use `--landing-*` tokens only |
| Responsive typography | P0 | All heroes inherit 64px prose h1 — see DESIGN_SYSTEM.md |

### Recommended new hero variants

| Proposed hero | Admin controls | Conversion purpose |
|---------------|----------------|-------------------|
| **Hero + dual CTA** | Headline, subcopy, 2 buttons, optional bg image | Pass the "grunt test" in 5 seconds |
| **Hero + trust row** | Headline, subcopy, CTA, star rating / stat chips | Immediate social proof ([Rootstack](https://rootstack.com/en/blog/best-ecommerce-homepage)) |
| **Hero + product spotlight** | Product relationship, badge text, CTA | Showcase hero SKU or subscription |
| **Hero full-bleed split** | Image left/right toggle, text panel, gradient overlay | Brand storytelling |
| **Hero video** | Media upload or embed URL, poster, autoplay toggle | Workshop/roastery atmosphere |

---

## 3. Layout blocks inventory (Pages collection)

Registered in `src/collections/Pages/index.ts` · Mapped in `src/blocks/RenderBlocks.tsx`

| Block | Slug | Used on home seed? | Layout variants | Key fields | Status |
|-------|------|-------------------|-----------------|------------|--------|
| Call to Action | `cta` | Yes | `inlineCard`, `splitPanel` | richText, links (2) | ✅ Works |
| Content | `content` | Yes | Column widths: full, half, 1/3, 2/3 | columns[], optional link per column | ✅ Works |
| Media Block | `mediaBlock` | Yes | — | media upload, caption from media | ✅ Works |
| Archive | `archive` | No | Collection or manual selection | introContent, categories, limit, products | ⚠️ **Broken renderer** |
| Carousel | `carousel` | No | Collection or selection | categories, limit, products | ✅ Works (not in seed) |
| Three Item Grid | `threeItemGrid` | No | Fixed 3 products | products[3] required | ✅ Works (not in seed) |
| Banner | `banner` | No | info, warning, error, success | richText, style | ✅ Works |
| Form Block | `formBlock` | Contact page | Intro optional | form relationship | ✅ Works |
| FAQ | `faq` | Yes | Accordion | title, Q&A items | ✅ Works |
| Features | `features` | Yes | `cards`, `minimal` | title, items[] title+description | ⚠️ No links/icons |
| Code | `code` | **Not registered on Pages** | — | exists in `blocks/Code/` | ❌ Orphan block |

### Per-block detail

#### Call to Action (`cta`)
- **File:** `blocks/CallToAction/`
- **Layouts:** Inline card (flex row on md+) · Split panel (gradient bg)
- **Gap:** No full-width band, no background image, no centered stack variant

#### Content (`content`)
- **File:** `blocks/Content/`
- **Purpose:** Multi-column editorial text
- **Gap:** No image column type, no icon columns, no "alternating rows" pattern

#### Media Block (`mediaBlock`)
- **File:** `blocks/MediaBlock/`
- **Purpose:** Single image with optional caption
- **Gap:** No aspect ratio control, no full-bleed/breakout toggle in admin, no video

#### Features (`features`)
- **File:** `blocks/Features/`
- **Layouts:** Cards (bordered grid) · Minimal (left border only)
- **Gaps:** Items have **no link**, **no icon**, **no image** — category cards on homepage are non-clickable static text
- **Homepage uses:** `minimal` layout (weakest affordance)

#### FAQ (`faq`)
- **File:** `blocks/FAQ/`
- **UI:** Radix accordion, single collapsible
- **Gap:** No two-column layout, no category grouping, no schema.org markup

#### Archive (`archive`)
- **File:** `blocks/ArchiveBlock/`
- **Purpose:** Product grid with intro
- **Bug:** `CollectionArchive` renders an **empty grid** — product `Card` component is commented out:

```23:24:src/components/CollectionArchive/index.tsx
                  {/* <Card className="h-full" doc={result} relationTo="posts" showCategories /> */}
```

Admins can add this block but **nothing visible renders**.

#### Carousel (`carousel`)
- **File:** `blocks/Carousel/`
- **Purpose:** Auto-scrolling product marquee (embla + auto-scroll)
- **Gap:** No title field, no "View all" link, products-only (no services for booking mode)

#### Three Item Grid (`threeItemGrid`)
- **File:** `blocks/ThreeItemGrid/`
- **Purpose:** Asymmetric 3-product mosaic (1 large + 2 small)
- **Gap:** Requires exactly 3 products; no heading; not used in any seed page

#### Banner (`banner`)
- **File:** `blocks/Banner/`
- **Purpose:** Alert/info strip (info/success/warning/error)
- **Gap:** Not a marketing promo banner (sale, shipping offer) — styled like system alerts

#### Form Block (`formBlock`)
- **File:** `blocks/Form/`
- **Purpose:** Embeds Form Builder forms
- **Used on:** Contact page seed
- **Gap:** No split layout (form + map/image side by side)

---

## 4. Current homepage composition

### Seed definition (`src/endpoints/seed/home.ts`)

| Order | Section | Type | Notes |
|-------|---------|------|-------|
| — | Hero | `lowImpact` + 2 CTAs | **CTAs not rendered** (LowImpact bug) |
| 1 | Intro copy | `content` full width | Redundant with hero copy |
| 2 | Featured Categories | `features` minimal | 5 items, no links |
| 3 | Storefront photo | `mediaBlock` | Strong asset, disconnected from hero |
| 4 | Workshop promo | `cta` inlineCard | Only working CTA on page |
| 5 | FAQ | `faq` | 3 questions |

### Live site (muradsprojects.co.uk)

Screenshots suggest hero may use **`landingSpotlight`** (card-in-card) — manually changed in CMS vs seed. Same block stack otherwise.

### vs. high-converting ecommerce homepage formula

Industry consensus ([WebMedic](https://webmedic.com/ecommerce-homepage-design), [CommerceV3](https://commercev3.com/resources/blog/homepage-design-ecommerce-conversion-optimization-guide), [Rootstack](https://rootstack.com/en/blog/best-ecommerce-homepage)):

| Expected section | Present? | Block/hero available? |
|------------------|----------|------------------------|
| Value-driven hero + primary CTA | Partial | Hero yes, CTA broken on lowImpact |
| Utility navigation | Header only | Not a block |
| Curated collections / categories | Partial | Features (no links) |
| Bestsellers / featured products | **Missing** | Carousel, ThreeItemGrid, Archive (broken) exist but unused |
| Social proof (reviews, logos, stats) | **Missing** | No block |
| Brand story / values | Partial | Content block (manual) |
| Secondary CTA (repeat every 2–3 scrolls) | Partial | One CTA block |
| Newsletter / email capture | **Missing** | No block |
| FAQ | Yes | FAQ block |
| Trust badges / guarantees | **Missing** | No block |

**Recommended homepage stack (6–8 sections):**

1. Hero + dual CTA + trust row  
2. Logo cloud ("As seen in" / partner logos)  
3. Category grid **with links** → `/shop?category=…`  
4. Bestsellers — `carousel` or fixed `threeItemGrid`  
5. Brand story — split content + image block  
6. Testimonials — 3–6 quotes with photos  
7. Workshop CTA — existing `cta` splitPanel  
8. FAQ + optional newsletter  

---

## 5. Broken & incomplete components (fix first)

| Component | Problem | Fix |
|-----------|---------|-----|
| `LowImpactHero` | Ignores `links` prop | Render link group like other heroes |
| `CollectionArchive` | Card commented out | Wire to `ProductGridItem` or restore Card |
| `FeaturesBlock` | No per-item link/icon/image | Extend schema + component |
| `RenderBlocks` | Double `my-16` spacing | Remove wrapper margin or block-internal margin |
| `Archive` / `Carousel` | products-only | Add `services` relation for booking project type |
| `Code` block | Not in Pages config | Register or delete |
| Hero seed vs live | Inconsistent hero type | Align seed with recommended `landingSplit` or new hero |

---

## 6. Missing blocks — prioritized backlog

### P0 — Essential for credible marketing/ecommerce UX

These are the minimum set admins need to match modern storefront and landing page quality.

| Block | Purpose | Reference patterns | Suggested fields |
|-------|---------|-------------------|------------------|
| **Testimonials** | Social proof | [LayoutBlocks testimonials](https://www.layoutblocks.dev/) · [payload-components testimonials-grid](https://github.com/ducksss/payload-components) | layout (grid/carousel/spotlight), items: quote, author, role, photo, rating |
| **Logo cloud** | Press/partner trust | logo-cloud-marquee, logo-cloud-grid | title, logos[] (media or SVG), variant (grid/marquee/inline) |
| **Stats / trust bar** | Quantified proof | stats-proof, content-stats | items: value, label, optional icon |
| **Product showcase** | Bestsellers / new arrivals | Existing carousel + archive — fix + add title/CTA | title, source (collection/manual), limit, layout (grid/carousel/mosaic), "View all" link |
| **Category cards** | Clickable collection entry | Features block upgrade OR dedicated block | items: title, description, image, link, badge |
| **Newsletter** | Email capture | LayoutBlocks newsletter | heading, description, placeholder, success message, layout |

### P1 — Strong differentiation & hybrid (shop + booking)

| Block | Purpose | Suggested fields |
|-------|---------|------------------|
| **Split feature** | Image + text alternating rows | image position, richText, link, background variant |
| **Brand story** | About section on homepage | eyebrow, heading, body, image, stats inline |
| **Service showcase** | Workshop cards on homepage | services relationship, layout, CTA |
| **Promo banner** | Sale / shipping / offer strip | text, link, dismissible, theme (brand/sale/neutral) |
| **Icon features** | "Why choose us" bullets | items: icon (lucide name or media), title, body, columns |
| **Process steps** | How it works (subscribe, book, etc.) | numbered steps, optional connector line |

### P2 — Polish & vertical-specific (coffee/booking)

| Block | Purpose |
|-------|---------|
| **Team / roasters** | Faces behind the brand |
| **Pricing table** | Subscriptions or workshop tiers |
| **Video embed** | Roasting process, workshop preview |
| **Marquee text** | Brand tagline ticker |
| **Location / map** | Café hours + map embed |
| **Instagram / UGC grid** | Customer photos |
| **Comparison table** | Subscription tiers, course levels |
| **Tabs feature** | Multi-story section without long scroll ([shadcnblocks](https://www.shadcnblocks.com/page/landing-page14)) |

### P3 — Globals (not blocks, but admin needs)

| Global / component | Why |
|--------------------|-----|
| **Announcement bar** | Site-wide promo above header |
| **Configurable footer sections** | Currently hardcoded layout |
| **Page templates / presets** | One-click "Homepage — Coffee shop" block stack |

---

## 7. Enhancements to existing blocks (no new slug)

Cheaper wins before building new blocks:

| Block | Enhancement |
|-------|-------------|
| **Features** | Add `link` per item, optional `icon`/`media`, layouts: `cards`, `minimal`, `linkedCards`, `bento` |
| **CTA** | Add layouts: `centeredBand`, `fullWidthImage`, `stickyMobileBar` |
| **Content** | Add column type: `media` + `richText` paired columns |
| **MediaBlock** | Admin: aspect ratio, fullBleed toggle, rounded toggle |
| **FAQ** | Two-column on desktop; optional `id` for anchor links |
| **Banner** | Add `promo` style distinct from alert styles |
| **Carousel** | Section title, subtitle, link; pause auto-scroll on mobile |
| **Hero (all)** | Shared sub-component: `HeroLinks`, responsive type scale, optional `eyebrow` text field |

---

## 8. External block libraries (research summary)

Use these as **implementation references** — not dependencies — to speed up building missing sections.

### [payload-components](https://www.payload-components.xyz/) (CLI install)

- **Best for:** This repo's shape (`RenderBlocks.tsx` + `Pages/index.ts` registration)
- **Install:** `npx payload-components add <block-name>`
- **Relevant catalog entries:** `hero-basic`, `feature-grid-basic`, `feature-split`, `feature-bento`, `feature-steps`, `logo-cloud-*`, `testimonials-*`, `stats-proof`, `content-stats`, `content-image-lead`, `content-rows`
- **Advantage:** Wires config, renderer, types, import map automatically

### [LayoutBlocks](https://www.layoutblocks.dev/)

- **Best for:** Copy-paste blocks with AI prompts for Cursor
- **25 blocks / 14 categories:** hero, feature, content, cta, faq, testimonial, pricing, logo, stats, team, newsletter, contact
- **Advantage:** No npm lock-in; each block includes Payload config + React component + prompt

### Industry layout references (design intent)

| Pattern | Source | Maps to |
|---------|--------|---------|
| 5-section homepage formula | [WebMedic ecommerce homepage](https://webmedic.com/ecommerce-homepage-design) | Hero → categories → products → social proof → CTA |
| 6–10 section depth | [CommerceV3 guide](https://commercev3.com/resources/blog/homepage-design-ecommerce-conversion-optimization-guide) | Avoid over-stacking; repeat CTA every 2–3 scrolls |
| Trust distributed on page | CommerceV3, Rootstack | Logo cloud + testimonials + guarantee strip |
| Storefront hero with product | [shadcnstore storefront hero](https://shadcnstore.com/blocks/e-commerce/storefront-hero) | Hero + product spotlight block |
| Classic SaaS/commerce arc | [shadcnblocks landing-page14](https://www.shadcnblocks.com/page/landing-page14) | Navbar → hero → logos → tabs → testimonials → pricing → footer |

---

## 9. Suggested block architecture for implementers

### File structure convention (match existing)

```
src/blocks/<BlockName>/
  config.ts      # Payload Block config (slug, fields, labels)
  Component.tsx  # Server component (default)
  Component.client.tsx  # Only if interactivity needed
```

### Registration checklist (every new block)

1. Add to `src/collections/Pages/index.ts` → `layout.blocks[]`
2. Map slug in `src/blocks/RenderBlocks.tsx` → `blockComponents`
3. Run `pnpm generate:types`
4. Add seed usage in `src/endpoints/seed/home.ts` (optional)
5. Add to `RenderBlocks` spacing strategy (avoid double margins)
6. Document admin labels and layout variants

### Shared field factories to extract

| Factory | Used by |
|---------|---------|
| `sectionHeader` (eyebrow, title, description, align) | Most marketing blocks |
| `linkGroup` | Already exists — extend appearances (ghost, link) |
| `mediaWithCaption` | Media, split features, heroes |
| `populateFromCollection` | Archive, Carousel, Product showcase |

### Project-type awareness

`getSiteConfig().ecommerceEnabled` / `bookingEnabled` — blocks should support:

- Products (`products` collection)
- Services (`services` or book routes) for hybrid/booking modes
- Conditional block availability in admin (hide Carousel when ecommerce off)

---

## 10. Admin UX recommendations

| Recommendation | Why |
|----------------|-----|
| **Page layout presets** | "Coffee homepage", "About", "Contact" pre-fill block stacks |
| **Block preview labels** | Show layout variant in admin list ("Features — minimal") |
| **Live preview** | Already on Pages — ensure new blocks support `generatePreviewPath` |
| **Block categories in admin** | Group: Hero, Commerce, Social proof, Content, Conversion, Forms |
| **Required blocks guardrail** | Warn if homepage has no CTA or product section |
| **Link field on Features** | Highest-impact admin win for category navigation |

---

## 11. Implementation roadmap for next agent

### Phase 1 — Fix broken (1–2 days)

- [ ] `LowImpactHero` — render `links`
- [ ] `CollectionArchive` — render products with `ProductGridItem`
- [ ] `Features` — add optional `link` + `icon` per item; add `linkedCards` layout
- [ ] Update `home.ts` seed to recommended stack
- [ ] Fix double margin in `RenderBlocks`

### Phase 2 — P0 missing blocks (3–5 days)

- [ ] Testimonials (grid + carousel layouts)
- [ ] Logo cloud (grid + marquee)
- [ ] Stats / trust bar
- [ ] Product showcase (title + carousel OR grid + view all)
- [ ] Newsletter signup

Use [payload-components](https://www.payload-components.xyz/) CLI where compatible, or [LayoutBlocks](https://www.layoutblocks.dev/docs/blocks) copy-paste + adapt to theme tokens.

### Phase 3 — Hero upgrades (2–3 days)

- [ ] Responsive hero typography
- [ ] Hero + trust row variant
- [ ] Fix/enhance Landing Split as default homepage hero

### Phase 4 — P1 blocks + globals (ongoing)

- [ ] Split feature / brand story
- [ ] Service showcase (booking)
- [ ] Promo banner vs alert banner
- [ ] Page presets in admin

---

## 12. Quick reference — files to touch

| Task | Files |
|------|-------|
| Register block | `src/collections/Pages/index.ts`, `src/blocks/RenderBlocks.tsx` |
| New hero | `src/heros/options.ts`, `src/heros/RenderHero.tsx`, `src/fields/hero.ts` |
| Fix archive | `src/components/CollectionArchive/index.tsx` |
| Fix low impact hero | `src/heros/LowImpact/index.tsx` |
| Extend features | `src/blocks/Features/config.ts`, `Component.tsx` |
| Homepage content | `src/endpoints/seed/home.ts` |
| Product-only blocks | `src/blocks/Carousel/`, `ArchiveBlock/`, `ThreeItemGrid/` |
| Theme-aware styling | Use tokens from `DESIGN_SYSTEM.md`, not hardcoded `neutral-*` |

---

## 13. Cross-reference: UI audit findings

Visual issues from [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) directly relate to block limitations:

- **No hero CTA on live site** → LowImpact hero bug + landingSpotlight de-emphasizes buttons
- **Category cards not clickable** → Features block schema gap
- **No social proof** → Missing testimonials/logo blocks
- **Sparse product merchandising** → Carousel/Archive/ThreeItemGrid unused or broken
- **Weak section hierarchy** → Blocks lack shared section header pattern (eyebrow, subtitle, align)

---

*Generated from codebase audit + industry homepage/conversion research. Re-run visual audit after block changes: `pnpm exec tsx scripts/capture-ui-audit.ts`.*
