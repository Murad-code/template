# Deployment (Docker on VPS/VM)

This template is intended to run as a **long-lived container on a VPS or VM** (e.g. DigitalOcean, Linode, Hetzner, EC2). Deploying as a Docker container avoids serverless cold starts and keeps the runtime identical across environments.

## Prerequisites

- Docker and Docker Compose on the server (or use a registry and pull the image)
- Node 18+ if building locally
- Required env vars (see below)

## Build the image

From the project root:

```bash
docker build -t myapp .
```

Or use CI to build and push to a registry (e.g. GitHub Container Registry, Docker Hub):

```bash
docker build -t ghcr.io/your-org/myapp:latest .
docker push ghcr.io/your-org/myapp:latest
```

## Run with Docker Compose (single server)

The included `docker-compose.yml` runs the app and a Postgres database. On the server:

1. Copy `.env.example` to `.env` and set at least:
   - `PAYLOAD_SECRET` (strong random string)
   - `DATABASE_URL` (if not using the compose Postgres: set to your external DB)
   - `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL` to your public URL (e.g. `https://yourdomain.com`)
   - Stripe keys and (optional) SMTP if you use payments and email
2. If using the compose Postgres, leave `DATABASE_URL` unset in `.env` or let the compose `environment` override it to `postgresql://payload:payload@db:5432/payload`.
3. Start the stack. This template defaults to **schema push** in non-production (`push: true` in `payload.config.ts`), so you usually **do not** need `payload migrate` unless you have committed migrations.

```bash
docker compose up -d db
# Wait for DB to be healthy, then run migrations (one-off)
docker compose run --rm app node node_modules/.bin/payload migrate
# Or if your start command runs migrate: just bring up app
docker compose up -d
```

4. Open `https://yourdomain.com` and create the first admin user.

## Run with Docker only (external database)

If you use a managed Postgres (e.g. DigitalOcean Managed Database, Supabase):

1. Set `DATABASE_URL` in `.env` to your database URL.
2. Build and run the app container (no `db` service):

```bash
docker build -t myapp .
docker run -d --env-file .env -p 3000:3000 --name myapp myapp
```

Run migrations before or after start (e.g. in CI or a one-off job):

```bash
docker run --rm --env-file .env myapp node node_modules/.bin/payload migrate
```

## Required environment variables

- `PAYLOAD_SECRET` – secret for Payload (generate a strong random string)
- `DATABASE_URL` – PostgreSQL connection string
- `NEXT_PUBLIC_SERVER_URL` – public URL of the app (e.g. `https://yourdomain.com`)
- `PAYLOAD_PUBLIC_SERVER_URL` – same as above (for admin and webhooks)

Optional but recommended for production: Stripe keys, SMTP vars, `SITE_NAME`, `COMPANY_NAME`. See `.env.example`.

## Reverse proxy and SSL

Put a reverse proxy (Caddy, nginx, or Traefik) in front of the app and terminate SSL there. Example with Caddy:

- Point a domain at the server.
- Caddyfile: `yourdomain.com { reverse_proxy localhost:3000 }`
- Caddy will obtain and renew TLS automatically.

## Stripe webhooks

Point your Stripe webhook endpoint to `https://yourdomain.com/api/payments/stripe/webhooks` and set `STRIPE_WEBHOOKS_SIGNING_SECRET` in `.env` to the signing secret from the Stripe dashboard.

## Continuous deployment

Typical CI/CD flow:

1. On push to `main` (or release), build the Docker image and push to a registry.
2. On the VPS/VM: pull the new image and restart the container.

Example (after building and pushing the image):

```bash
ssh user@your-server "cd /opt/myapp && docker compose pull && docker compose up -d"
```

Or use a tool like Coolify, CapRover, or a platform that runs Docker (e.g. Railway, Render) with a similar pull-and-restart flow.

## Why not serverless?

This template is designed for **long-running containers**, not serverless (e.g. Vercel serverless functions). Reasons:

- **Cold starts** – Serverless can introduce latency on the first request after idle; a container stays warm.
- **Predictable runtime** – Same Node process and memory across requests; no per-request isolation limits.
- **Migrations and background work** – Easier to run Payload migrations and any cron-style jobs in the same environment.

If you still want to deploy to Vercel, use the Vercel Postgres adapter and see the main README for Vercel-specific notes; the recommended path for this template remains Docker on a VPS/VM.
