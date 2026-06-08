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
- `pnpm payload migrate` showing "Done" is not sufficient by itself; always validate `/admin` and scan logs for `column ... does not exist` errors.
- When writing `.env` with heredoc, ensure the file closes with `EOF` on its own line and no accidental pasted text.
- Always build with `PROJECT_TYPE` exported in local `.env` before `docker-build-amd64.sh --push` so prerendered frontend nav matches expected mode (`ecommerce`/`booking`/`hybrid`).

## Standard Validation Checks

After deployment, confirm:

- `docker compose ps` shows healthy services
- app logs have no DB auth errors
- app logs have no `relation "users" does not exist` errors
- `curl -I https://DOMAIN`
- `curl -I https://DOMAIN/admin`
- `curl -I https://DOMAIN/_next/static/chunks/main-app-*.js` (or a chunk URL extracted from page HTML)

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

## Fast Path (existing production project)

Use this when VPS setup is already complete and you are deploying code updates to an existing project.

### Preconditions (do not skip)

- local `.env` has correct `PROJECT_TYPE`, `DOCKER_IMAGE` (new tag), and build-time env values
- VPS `DEPLOY_DIR/.env` has production secrets and matching runtime values
- you are **not** changing DB credentials (if changing, use full flow + volume strategy)

### 1) Local build + push

```bash
# in repo root
./scripts/docker-build-amd64.sh --push
```

### 2) VPS pull + recreate app

```bash
cd DEPLOY_DIR
docker compose pull app
docker compose up -d --force-recreate app
docker compose logs --tail=100 app
```

### 3) Migration check (safe default)

```bash
docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate'
docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate:status'
docker compose exec -T postgres sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt"'
docker compose logs --tail=200 app | grep -En 'column .* does not exist|relation .* does not exist|Failed query' || true
```

If logs contain a missing-column error, immediately verify the expected relation columns exist before continuing:

```bash
docker compose exec -T postgres sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\d payload_locked_documents_rels"'
```

If the app expects a column (example: `theme_palettes_id`) that is missing, treat this as **missing migration coverage** (not a transient deploy issue).

Do not run `/next/seed` (or admin seed actions) until migration checks are clean and `/admin` returns `200`.

### 4) Endpoint + asset verification

```bash
curl -I https://DOMAIN
curl -I https://DOMAIN/admin
curl -s https://DOMAIN | tr '"' '\n' | grep '^/_next/static/' | head -n 1
```

### 5) Browser verification

- open `/` and `/admin` once in an incognito window
- if browser shows stale chunk/css 404s but server checks are healthy, hard refresh / clear site cache once

### 6) Optional automated smoke check

Create and run a temporary smoke-check script on VPS for deterministic pass/fail:

```bash
cat > /tmp/deploy-smoke-check.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:?Usage: deploy-smoke-check.sh <domain> <project_type>}"
PROJECT_TYPE="${2:?Usage: deploy-smoke-check.sh <domain> <project_type>}"

echo "== Basic endpoints =="
curl -fsSI "https://${DOMAIN}" >/dev/null
curl -fsSI "https://${DOMAIN}/admin" >/dev/null

echo "== Extract and verify one static asset =="
ASSET_PATH="$(curl -fsS "https://${DOMAIN}" | tr '"' '\n' | grep '^/_next/static/' | head -n 1 || true)"
if [ -z "${ASSET_PATH}" ]; then
  echo "Smoke check failed: no _next/static asset path found in homepage HTML" >&2
  exit 1
fi
curl -fsSI "https://${DOMAIN}${ASSET_PATH}" >/dev/null

if [ "${PROJECT_TYPE}" = "hybrid" ] || [ "${PROJECT_TYPE}" = "booking" ]; then
  echo "== Booking route check =="
  curl -fsSI "https://${DOMAIN}/book" >/dev/null
fi

echo "Smoke check passed for ${DOMAIN} (${PROJECT_TYPE})"
EOF

chmod +x /tmp/deploy-smoke-check.sh
/tmp/deploy-smoke-check.sh DOMAIN PROJECT_TYPE
```

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

### 3) Frontend renders but `_next/static/*` assets return `404`

Meaning: Next standalone server is running, but static assets are not served from expected runtime path.

Action:

- ensure container startup links static directory for standalone runtime (entrypoint fix in this repo)
- redeploy with a fresh image tag:
  - update `DOCKER_IMAGE` to a new tag (for example `:1.0.2`)
  - rebuild/push locally
  - `docker compose pull app && docker compose up -d --force-recreate app`
- verify a known chunk path:
  - `curl -I https://DOMAIN/_next/static/chunks/<known-chunk>.js`

### 4) Home page missing `Book` link but admin shows booking collections

Meaning: `PROJECT_TYPE` mismatch at image build time (prerendered frontend baked as `ecommerce`).

Action:

- set `PROJECT_TYPE=hybrid` (or intended value) in local `.env`
- rebuild image with new tag using `./scripts/docker-build-amd64.sh --push`
- redeploy VPS app with new tag
- verify nav includes expected links on `/`

### 5) Transient `502 Bad Gateway` right after deploy

Meaning: shared Nginx proxied to app before Next finished startup or while app restarted.

Action:

- check app readiness:
  - `docker compose logs --tail=100 app`
- recheck after startup:
  - `curl -I https://DOMAIN`
  - `curl -I https://DOMAIN/admin`
- if browser still shows old errors, do hard refresh / clear site cache once.

### 6) Admin `500` with missing column after migrate (`column ... does not exist`)

Meaning: running image expects schema changes that are not represented in applied migrations (or migration files are missing from image/source).

Action:

- verify current relation table shape:
  - `docker compose exec -T postgres sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\d payload_locked_documents_rels"'`
- check migration files in running container:
  - `docker compose exec -T app sh -lc 'ls -la src/migrations'`
- if column is missing and no migration adds it:
  - create and commit a proper Payload migration in repo (`pnpm payload migrate:create`)
  - build/push a **new image tag**
  - redeploy app and rerun migrate
- emergency-only hotfix (to restore admin quickly): apply targeted `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`, then follow up with a real migration commit so future environments are consistent.

### 7) Seed endpoint fails with missing table/column (`relation ... does not exist` / `column ... does not exist`)

Meaning: app code + seed logic moved ahead of DB schema (migration drift). Seeding is surfacing drift that also risks runtime failures.

Action (required order):

1. Confirm drift signals:
   - `docker compose logs --tail=200 app | grep -En 'column .* does not exist|relation .* does not exist|Failed query'`
   - `docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate:status'`
   - if latest migration shows `Ran = No`, do **not** run seed; fix migration execution first
2. In repo (local), generate and commit a catch-up migration:
   - `pnpm payload migrate:create`
   - verify generated SQL includes missing objects from logs
   - commit `src/migrations/*` and `src/migrations/index.ts`
3. Build/push a new image tag and redeploy app.
4. On VPS, run:
   - `docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate'`
   - `docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate:status'`
   - if migrate fails, copy exact SQL error and patch migration for idempotency (`IF NOT EXISTS` / guarded constraints), then rebuild and redeploy
5. Validate before seed:
   - `curl -I https://DOMAIN/admin`
   - app logs show no schema errors
6. Only then run seed (if required).

Emergency-only workaround:

- Apply targeted SQL (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`) to restore service quickly.
- Still create and deploy a real migration commit immediately after; do not leave manual SQL as the only fix.

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
9) For fast-path updates, run `pnpm payload migrate:status` on VPS after migrate and block seed/admin checks until no schema drift errors appear in logs.
```

## Operator Note

Some VPS actions require your direct terminal execution (SSH, certbot, and any command that needs your credentials). The agent should still orchestrate the sequence and validate outputs.
