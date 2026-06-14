# Deployment Values Template

Copy this file to `docs/DEPLOYMENT_VALUES.md`, fill all fields, and keep it out of git if it contains real secrets.

Suggested workflow:

1. `cp docs/DEPLOYMENT_VALUES.template.md docs/DEPLOYMENT_VALUES.md`
2. Fill every `REPLACE_*` value
3. Start a deployment chat and tell the agent to read `docs/DEPLOYMENT_VALUES.md` + `docs/agent-deployment-runbook.md` first

## Core Project

- `PROJECT_TYPE`: `REPLACE_PROJECT_TYPE` (`ecommerce` | `booking` | `hybrid`)
- `PROJECT_SLUG`: `REPLACE_PROJECT_SLUG`
- `SITE_NAME`: `REPLACE_SITE_NAME`
- `COMPANY_NAME`: `REPLACE_COMPANY_NAME`

## Domains and URLs

- `DOMAIN`: `REPLACE_DOMAIN`
- `WWW_DOMAIN`: `REPLACE_WWW_DOMAIN`
- `NEXT_PUBLIC_SERVER_URL`: `https://REPLACE_DOMAIN`
- `PAYLOAD_PUBLIC_SERVER_URL`: `https://REPLACE_DOMAIN`

## Deployment Paths and Ports

- `DEPLOY_DIR`: `/root/REPLACE_PROJECT_SLUG`
- `APP_HOST_PORT`: `REPLACE_APP_HOST_PORT` (example: `3001`)
- `LOCAL_DB_PORT`: `REPLACE_LOCAL_DB_PORT` (example: `5433`)
- `POSTGRES_HOST_PORT`: `REPLACE_POSTGRES_HOST_PORT` (usually same as `LOCAL_DB_PORT`)

## Docker / Registry

- `DOCKER_IMAGE`: `REPLACE_DOCKER_IMAGE_TAG` (example: `org/project:1.0.0`)
- Registry login ready on local machine: `REPLACE_YES_OR_NO`
- Registry pull access ready on VPS: `REPLACE_YES_OR_NO`

## Database

- `DB_USER`: `REPLACE_DB_USER`
- `DB_PASSWORD`: `REPLACE_DB_PASSWORD`
- `DB_NAME`: `REPLACE_DB_NAME`
- Preserve existing VPS DB volume? (`yes`/`no`): `REPLACE_YES_OR_NO`

## App Secrets

- `PAYLOAD_SECRET` (32+ chars): `REPLACE_PAYLOAD_SECRET`
- `PREVIEW_SECRET`: `REPLACE_PREVIEW_SECRET`
- `CRON_SECRET`: `REPLACE_CRON_SECRET`
- `ROOT_EMAIL`: `REPLACE_ROOT_EMAIL`
- `ROOT_PASSWORD`: `REPLACE_ROOT_PASSWORD`
- `ROOT_NAME` (optional): `REPLACE_ROOT_NAME`

## Email

- Provider: `REPLACE_EMAIL_PROVIDER` (`resend` | `smtp`)
- `RESEND_API_KEY`: `REPLACE_OR_NA`
- `SMTP_HOST`: `REPLACE_OR_NA`
- `SMTP_PORT`: `REPLACE_OR_NA`
- `SMTP_SECURE`: `REPLACE_OR_NA`
- `SMTP_USER`: `REPLACE_OR_NA`
- `SMTP_PASS`: `REPLACE_OR_NA`
- `SMTP_FROM_EMAIL`: `REPLACE_SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`: `REPLACE_SMTP_FROM_NAME`

## Stripe (required for ecommerce/hybrid)

- `STRIPE_SECRET_KEY`: `REPLACE_OR_NA`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: `REPLACE_OR_NA`
- `STRIPE_WEBHOOKS_SIGNING_SECRET`: `REPLACE_OR_NA`

## Optional Ops Flags

- `ENABLE_LOW_STOCK_ALERTS`: `REPLACE_TRUE_OR_FALSE`
- `LOW_STOCK_ALERT_TO`: `REPLACE_OR_NA`
- `ENABLE_INVOICES`: `REPLACE_TRUE_OR_FALSE`

## Execution Preferences

- Step-by-step confirmation after each command block? (`yes`/`no`): `yes`
- Run explicit post-deploy migration check even if entrypoint migrates? (`yes`/`no`): `yes`
- Create root immediately after deploy and then a non-root admin? (`yes`/`no`): `yes`
