# Frontend UI System

This repository uses a panel-style design system for the frontend website client.

## Core rules

- Use semantic tokens only (`bg-card`, `text-foreground`, `border-border`, `ring-ring`, etc.).
- Avoid hardcoded palette classes in customer-facing UI (`text-neutral-*`, `bg-blue-*`, `text-black`, `bg-white`).
- Keep focus styles inside primitives (`Button`, `Input`, `Select`, `Checkbox`) instead of broad global selectors.
- Prefer reusable primitives over one-off class stacks.

## Surface hierarchy

- Base page: `bg-background`
- Panel surface: `bg-card border border-border shadow-sm`
- Overlay/popup surface: `bg-card border border-border shadow-md`

## Reusable primitives

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/surface-card.tsx`
- `src/components/ui/icon-square-button.tsx`
- `src/components/LineItemRow/index.tsx`
- `src/components/addresses/AddressList.tsx`
- `src/components/account/AccountDetailPanel.tsx`

## Migration guidance

- Replace repeated product/checkout/cart line item markup with `LineItemRow` or `ProductItem`.
- Replace repeated address list markup with `AddressList`.
- Replace repeated account detail wrappers with `AccountDetailPanel`.
- Keep any new component variants semantic (e.g. `subtle`, `outline`, `ghost`) and avoid naming drift.
