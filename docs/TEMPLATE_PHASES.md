# Template phases roadmap and backlog

This document is a **working copy** of the phased plan for turning the Payload ecommerce template into a reusable SaaS-style project (`PROJECT_TYPE`: `ecommerce` | `booking` | `hybrid`). Use it after clone to remember scope, what is done, and what you might implement next.

The original living plan may also exist in your repo as `.cursor/plans/reusable_saas_template_phases_*.plan.md` — keep this file in `docs/` as the **team-facing** summary.

---

## Phase summary (condensed)

| Phase | Focus | Status (high level) |
| ----- | ----- | ------------------- |
| **1** | Site config (`getSiteConfig`), `PROJECT_TYPE`, metadata, `.env.example` | Largely done |
| **2** | Theming (`theme.ts`, CSS variables, fonts from config) | Done / iterate |
| **3** | Email adapters, invoices (PDF, `ENABLE_INVOICES`) | Partial — invoices exist for orders |
| **4** | Admin refunds + Stripe, optional restock | Done |
| **5** | Stock (low threshold, alerts, cart consistency) | Partial |
| **6** | Blocked dates global + helpers + booking slot exclusion | Done |
| **7** | Booking: services, slots, bookings, payment, nav by `PROJECT_TYPE` | **Core done** — see backlog below |
| **8** | More page blocks + UI component library | Open |
| **9** | README clone workflow, checklist, Docker `DEPLOYMENT.md` | Ongoing |

---

## Phase 7 — what is implemented now

- **Slots:** `BookingSettings` global + `/api/booking/slots` (generated slots, blocked dates, existing bookings).
- **Data model:** `Services`, `Bookings`, `booking-transactions`, guest/customer fields, Stripe pay-at-book.
- **Frontend:** `/book`, payment confirm flow, `/bookings/[id]` invoice-style page, cancel flow, account bookings list.
- **7.4 Navigation:** Header and footer **primary links are derived from `PROJECT_TYPE`** in [`src/config/nav.ts`](../src/config/nav.ts). Optional extra links still come from Payload Header/Footer globals (deduped by URL). Cart is hidden when `ecommerce` is off. Shop, checkout, product PDP, find-order, and orders routes redirect when ecommerce is disabled.

---

## Backlog and improvements (mini todo)

Tick items off as you go; none of this blocks shipping a minimal booking or shop site.

### Phase 7 (booking)

- [x] **Per-weekday availability** — different open hours Mon–Sun (today: single `defaultStartHour` / `defaultEndHour`).
- [x] **First-class slot documents** — capacity, waitlist, or staff assignment (today: generated slots only).
- [x] **Hybrid UX** — deeper link between a product and a bookable service (beyond optional `product` on booking).
- [x] **Booking refunds** — mirror order refund pattern against `booking-transactions` + Stripe PI.
- [x] **PDF invoice for bookings** — optional; customer page already summarises the booking.
- [x] **E2E tests** — booking happy path + `PROJECT_TYPE` matrix.

### Phase 5 (stock)

- [x] Optional **email alert** when inventory crosses low-stock threshold.
- [x] **Reserve-on-cart** (TTL) if you need to prevent oversell under high concurrency.

### Phase 8 (blocks / UI)

- [ ] Additional **Lexical blocks** (FAQ, pricing table, testimonials, etc.).
- [ ] Short **component catalogue** in docs or Storybook-style index.

### Phase 9 (docs / ops)

- [ ] Keep **README** and **CHECKLIST** aligned with `push` vs migrations choice for Postgres.
- [ ] **CI** example: build image → registry → deploy on VPS.

### General / cross-cutting

- [ ] **Middleware** — single place for `redirectIfEcommerceDisabled` instead of per-layout/page (optional refactor).
- [ ] **Product `generateMetadata` in booking-only** — today the PDP redirects on request; crawlers hitting old URLs could still get metadata until redirect runs (low priority if URLs are not indexed).

---

## Related files

| Topic | Location |
| ----- | -------- |
| Project type & flags | [`src/config/site.ts`](../src/config/site.ts) |
| Derived nav | [`src/config/nav.ts`](../src/config/nav.ts) |
| Ecommerce-only route guard | [`src/utilities/requireEcommerce.ts`](../src/utilities/requireEcommerce.ts) |
| Deployment | [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) |
| Pre-deploy checklist | [`docs/CHECKLIST.md`](CHECKLIST.md) |

When you complete a backlog item, update this file (or your issue tracker) so the next clone knows the template’s current capabilities.
