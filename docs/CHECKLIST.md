# Pre-launch checklist

Use this before going live with a new client project cloned from this template.

## Environment

- [ ] Copy `.env.example` to `.env` and set every required variable
- [ ] `PAYLOAD_SECRET` – strong random string (e.g. `openssl rand -base64 32`)
- [ ] `DATABASE_URL` – production Postgres URL
- [ ] `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL` – final public URL (e.g. `https://clientdomain.com`)
- [ ] Stripe keys (live) and `STRIPE_WEBHOOKS_SIGNING_SECRET` – webhook URL: `https://yourdomain.com/api/payments/stripe/webhooks`
- [ ] SMTP vars if using order emails / form emails / invoices
- [ ] `SITE_NAME`, `COMPANY_NAME` (and optional `COMPANY_ADDRESS` for invoices)
- [ ] `PROJECT_TYPE` (`ecommerce` | `booking` | `hybrid`) for shop vs booking vs both

## Branding and theme

- [ ] Replace `public/favicon.ico` and `public/favicon.svg` with client assets
- [ ] Update logo in header if not using default (or set via global when available)
- [ ] Adjust theme in `src/config/theme.ts` (or env) if client has brand colours/fonts

## Payload admin

- [ ] Create first admin user after first deploy
- [ ] Configure Globals: Header, Footer (nav), Blocked dates (if using booking), Booking settings (if using booking)
- [ ] If using booking: add Services in Admin → Services and configure Booking settings
- [ ] Run seed only if you need demo content (seed is destructive)

## Deployment

- [ ] Build and run with Docker (see [DEPLOYMENT.md](./DEPLOYMENT.md))
- [ ] Run Payload migrations: `payload migrate` (or `docker compose run app node node_modules/.bin/payload migrate`)
- [ ] Point DNS at the server and confirm SSL (reverse proxy)
- [ ] Test admin login, frontend, checkout (if `ecommerce` or `hybrid`), and booking (if `booking` or `hybrid`)

## E2E (Playwright)

Run against a dev server on `http://localhost:3000` (Playwright `webServer` can reuse an existing server). Use separate commands so `PROJECT_TYPE` matches what you are testing:

- `pnpm test:e2e:shop` — `PROJECT_TYPE=ecommerce`, shop/cart tests (`tests/e2e/frontend.e2e.spec.ts`)
- `pnpm test:e2e:booking` — `PROJECT_TYPE=booking`, booking happy path (`tests/e2e/booking.e2e.spec.ts`)
- `pnpm test:e2e:hybrid` — `PROJECT_TYPE=hybrid`, smoke for `/shop` + `/book` (`tests/e2e/hybrid.e2e.spec.ts`)

## Post-launch

- [ ] Confirm Stripe webhook is receiving events (Stripe Dashboard)
- [ ] Send a test order access email (Find order flow) if using email
- [ ] Optionally: low-stock threshold and blocked dates for the first week
