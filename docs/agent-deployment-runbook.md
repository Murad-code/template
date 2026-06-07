# Agent Deployment Runbook

Use this file as the source of truth when asking a future agent to deploy a new client project cloned from this template.

This runbook is written to reduce copy/paste mistakes and make deployment repeatable.

## Goal

Given a cloned project, the agent should help you:

1. set project-specific env/config values
2. build and push a `linux/amd64` Docker image
3. deploy on VPS with Postgres + app stack
4. verify `/` and `/admin`
5. recover quickly from common failures

## Required Inputs (Project-Specific)

Before asking an agent to deploy, collect answers for all required fields below.
If any value is unknown, the agent should pause and ask before proceeding.

Preferred source of truth:

- Fill `docs/DEPLOYMENT_VALUES.md` from `docs/DEPLOYMENT_VALUES.template.md`
- Agent reads `docs/DEPLOYMENT_VALUES.md` first, then asks only for missing values

### A) Core project identity (required)

- `PROJECT_TYPE` (`ecommerce` | `booking` | `hybrid`)
- `SITE_NAME`
- `COMPANY_NAME`
- `PROJECT_SLUG` (example: `client-portal`)
- `DEPLOY_DIR` (recommended: `/root/PROJECT_SLUG`)

### B) Domain and app URLs (required)

- `DOMAIN` (example: `clientdomain.com`)
- `WWW_DOMAIN` (example: `www.clientdomain.com`)
- `NEXT_PUBLIC_SERVER_URL` (normally `https://DOMAIN`)
- `PAYLOAD_PUBLIC_SERVER_URL` (normally `https://DOMAIN`)

### C) Docker + registry (required)

- `DOCKER_IMAGE` (example: `yourdockerhub/client-portal:1.0.0`)
- confirm Docker Hub/registry auth is available for push/pull
- `APP_HOST_PORT` (example: `3001`)
- `LOCAL_DB_PORT` (example: `5433`)

### D) Database (required)

- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `POSTGRES_HOST_PORT` for local dev/build if needed (often same as `LOCAL_DB_PORT`)

### E) Security secrets (required)

- `PAYLOAD_SECRET` (32+ chars)
- `PREVIEW_SECRET`
- `CRON_SECRET`

### F) Email provider (required for production email flows)

- choose one primary path:
  - `RESEND_API_KEY`, or
  - SMTP settings: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- always set:
  - `SMTP_FROM_EMAIL`
  - `SMTP_FROM_NAME`

### G) Stripe payments (required for `ecommerce` and `hybrid`)

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOKS_SIGNING_SECRET`

### H) Alerts and optional operations (recommended)

- `ENABLE_LOW_STOCK_ALERTS` (`true`/`false`)
- `LOW_STOCK_ALERT_TO` (required if alerts enabled)
- `ENABLE_INVOICES` (`true`/`false`, defaults to enabled unless set to `false`)

### I) Runtime behavior checks (required)

- should agent initialize a fresh DB volume if credentials changed? (`yes`/`no`)
- should agent run migrations explicitly post-deploy even if entrypoint does it? (`yes`/`no`, default `yes`)

### J) Safety notes

- Never commit real secrets to git.
- Keep production secrets in the VPS `.env` only (or a dedicated secret manager).
- If secrets were pasted into chat or committed accidentally, rotate them.

## Agent Discovery Questionnaire (must ask user before execution)

At the start of a deployment workflow, the agent should ask these questions in chat:

1. What `PROJECT_TYPE` is this deployment (`ecommerce`, `booking`, or `hybrid`)?
2. What are `SITE_NAME` and `COMPANY_NAME`?
3. What are `DOMAIN` and `WWW_DOMAIN`?
4. What Docker image tag should be built and deployed (`DOCKER_IMAGE`)?
5. What DB values should be used (`DB_USER`, `DB_PASSWORD`, `DB_NAME`)?
6. What ports should be used (`LOCAL_DB_PORT`, `APP_HOST_PORT`)?
7. What are the required app secrets (`PAYLOAD_SECRET`, `PREVIEW_SECRET`, `CRON_SECRET`)?
8. Which email provider is used (Resend vs SMTP), and what are the exact env values?
9. Are Stripe keys required for this project type, and if so what are they?
10. Should low-stock alerts be enabled, and what recipient should be used?
11. Is this a fresh DB initialization or an existing volume that must be preserved?
12. Should the agent do step-by-step confirmation after every command block? (default: yes)

## Canonical Docs Order

Agents should follow these in order:

1. `docs/new-project.md`
2. `docs/docker.md`
3. `docs/vps-setup.md`
4. `docs/deploy.md`
5. `docs/DEPLOYMENT_VALUES.md` (if present)

## Hard Rules (Do Not Skip)

- Never treat example values in docs as global defaults.
- Always replace `REPLACE_*` placeholders before execution.
- Keep DB credentials consistent across `.env`, compose, and runtime `DATABASE_URL`.
- Remember: `POSTGRES_*` vars only apply on first init of an empty Postgres volume.
- For Payload migrations in container runtime, use:
  - `PAYLOAD_CONFIG_PATH=src/payload.config.ts`
- After schema-affecting deploys, verify tables exist with `\dt`.

## Standard Validation Checks

After deployment, confirm:

- `docker compose ps` shows healthy services
- app logs have no DB auth errors
- app logs have no `relation "users" does not exist` errors
- `curl -I https://DOMAIN`
- `curl -I https://DOMAIN/admin`

## Preflight Checklist (must run before build/deploy)

Run these checks first:

```bash
docker --version
docker compose version
pnpm -v
```

If deploying to VPS, also verify:

```bash
getent hosts DOMAIN
docker login
```

Notes:

- `getent hosts DOMAIN` should resolve to expected VPS IP.
- `docker login` should succeed locally (push) and on VPS (pull).

## Failure Playbook

### 1) DB auth failure (`password authentication failed`)

Meaning: app credentials do not match initialized DB volume credentials.

Action:

- fix `.env` values and keep them consistent, or
- if fresh start is acceptable, reinitialize this stack's DB volume:
  - `docker compose down`
  - `docker volume rm PROJECT_SLUG_postgres_data`
  - `docker compose up -d`

### 2) Missing tables (`relation "users" does not exist`)

Meaning: migrations were not applied.

Action:

- run:
  - `docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate'`
- verify:
  - `docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt'`

## First Admin Bootstrap (fresh projects)

After first successful deploy and migration:

1. Open `https://DOMAIN/admin`
2. Create the first admin user
3. Confirm admin login works
4. Validate at least one content write in admin
5. Re-check app logs for errors after login/write

## Prompt Template For Future Agent

Copy and paste this when starting a new deployment chat:

```text
Deploy this cloned project to my VPS using the repo deployment docs.

Project values:
- PROJECT_TYPE=...
- SITE_NAME=...
- COMPANY_NAME=...
- PROJECT_SLUG=...
- DEPLOY_DIR=...
- DOMAIN=...
- WWW_DOMAIN=...
- NEXT_PUBLIC_SERVER_URL=...
- PAYLOAD_PUBLIC_SERVER_URL=...
- DOCKER_IMAGE=...
- DB_USER=...
- DB_PASSWORD=...
- DB_NAME=...
- LOCAL_DB_PORT=...
- APP_HOST_PORT=...
- PAYLOAD_SECRET=...
- PREVIEW_SECRET=...
- CRON_SECRET=...
- RESEND_API_KEY=... (or SMTP_HOST/SMTP_PORT/SMTP_SECURE/SMTP_USER/SMTP_PASS)
- SMTP_FROM_EMAIL=...
- SMTP_FROM_NAME=...
- STRIPE_SECRET_KEY=... (required for ecommerce/hybrid)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=... (required for ecommerce/hybrid)
- STRIPE_WEBHOOKS_SIGNING_SECRET=... (required for ecommerce/hybrid)
- ENABLE_LOW_STOCK_ALERTS=...
- LOW_STOCK_ALERT_TO=...
- ENABLE_INVOICES=...

Execution requirements:
1) Read docs/new-project.md, docs/docker.md, docs/vps-setup.md, docs/deploy.md, docs/agent-deployment-runbook.md, and docs/DEPLOYMENT_VALUES.md (if present) first.
2) Ask me for any missing required values before executing commands.
3) Use placeholder-safe values (do not assume testing-template defaults).
4) Give me one step at a time and wait for my output before next step.
5) Run preflight checks before build/deploy.
6) Include validation commands after each phase.
7) Include first-admin bootstrap steps for fresh projects.
8) If anything fails, diagnose and provide the minimum fix with exact commands.
```

## Operator Note

Some VPS actions require your direct terminal execution (SSH, certbot, and any command that needs your credentials). The agent should still orchestrate the sequence and validate outputs.
