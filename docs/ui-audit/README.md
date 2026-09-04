# UI Audit — Black Oak Coffee Co. (muradsprojects.co.uk)

Captured **2026-08-09** from the live deployment at [https://muradsprojects.co.uk/](https://muradsprojects.co.uk/).

## Contents

| File | Purpose |
|------|---------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colors, typography, components, contrast/UX findings |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Completed block/hero fixes and new sections (2026-08-09) |
| [BLOCKS_AND_COMPONENTS_AUDIT.md](./BLOCKS_AND_COMPONENTS_AUDIT.md) | Original gap analysis + roadmap (pre-implementation) |
| [audit-data.json](./audit-data.json) | Machine-readable tokens per page/viewport/theme |
| `screenshots/` | Full-page PNG captures (desktop 1440×900, mobile 390×844, light + dark) |

## Re-run capture

```bash
pnpm exec playwright install chromium   # first time only
pnpm exec tsx scripts/capture-ui-audit.ts https://muradsprojects.co.uk
```

## Quick summary for UI agent

**Brand:** Black Oak Coffee Co. — hybrid ecommerce + booking (Payload CMS template).

**Stack:** Next.js 15, Tailwind CSS 4, shadcn/Radix UI, Geist Sans/Mono, CMS-driven theme palettes.

**Top issues to address:**
1. Low contrast between page background and card surfaces (especially light mode hero)
2. H1 stays at 64px on mobile — no responsive scaling
3. Dual theme systems (site palette hex + oklch defaults) create inconsistent tokens
4. Dark mode border stays light gray (`#D3D9E2`) — poor contrast on dark backgrounds
5. Footer/header use hardcoded `neutral-*` instead of semantic theme tokens
6. Sparse homepage hierarchy — no primary CTA in hero, category cards lack affordance
7. Nav links at `text-xs uppercase tracking-widest` with 50% opacity — hard to scan

**UI/visual work:** Start with `DESIGN_SYSTEM.md` §13 and homepage screenshots.

**Page builder / blocks:** See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for what was built. Remaining visual polish is in `DESIGN_SYSTEM.md` §13.
