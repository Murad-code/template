# UI audit archive

Working notes from two passes over the client site. The current rules of the design
system live in [`docs/frontend-ui-system.md`](../frontend-ui-system.md) — read that
first; these files are history, and parts of them are superseded.

| File | Date | Status |
|------|------|--------|
| [2026-10-overhaul-audit.md](./2026-10-overhaul-audit.md) | Oct 2026 | The audit that drove the design-system overhaul. Findings are fixed; the reasoning is still useful |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Aug 2026 | Superseded by `frontend-ui-system.md`. Keep for the per-page contrast measurements |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Aug 2026 | What the August block-building pass delivered |
| [BLOCKS_AND_COMPONENTS_AUDIT.md](./BLOCKS_AND_COMPONENTS_AUDIT.md) | Aug 2026 | Gap analysis that produced the current block set |
| `audit-data.json`, `screenshots/` | Aug 2026 | Captured tokens and full-page screenshots, pre-overhaul |

## Re-run the capture

```bash
pnpm exec playwright install chromium   # first time only
pnpm exec tsx scripts/capture-ui-audit.ts http://localhost:3000
```
