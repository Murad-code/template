# New Project Setup (After Cloning This Template)

Use this when you clone this repo for a new client.

## 1) Rename project basics

- Update `SITE_NAME`, `COMPANY_NAME`, and URLs in `.env`
- Set `PROJECT_TYPE` to one of:
  - `ecommerce`
  - `booking`
  - `hybrid`
- Replace branding assets:
  - `public/favicon.ico`
  - `public/favicon.svg`
- Adjust theme values in `src/config/theme.ts` if needed

## 2) Configure environment values

Copy and edit:

```bash
cp .env.example .env
```

At minimum set:

- `PAYLOAD_SECRET` (32+ chars)
- `NEXT_PUBLIC_SERVER_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOKS_SIGNING_SECRET`
- email settings (`RESEND_API_KEY` or `SMTP_*`)

## 3) Local run and validation

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`, create your first admin, and validate key flows:

- storefront pages
- admin login/content editing
- checkout (if ecommerce/hybrid)
- booking flow (if booking/hybrid)

## 4) Prepare for production

Follow docs in this order:

1. [`docker.md`](./docker.md) to build/push image
2. [`vps-setup.md`](./vps-setup.md) for first-time server setup
3. [`deploy.md`](./deploy.md) for future releases

## 5) Recommended go-live checks

- DNS records point to VPS IP
- SSL cert issued and valid
- `curl -I https://your-domain` returns `200`
- `/admin` loads
- Stripe webhook endpoint configured:
  - `https://your-domain/api/payments/stripe/webhooks`

