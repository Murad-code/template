# Docker Build and Push (Local)

This guide is for building and pushing the production image from your local machine.

> `next build` queries Postgres in this project, so your local DB must be up and migrated before building.

For VPS setup, see [`vps-setup.md`](./vps-setup.md).  
For future updates, see [`deploy.md`](./deploy.md).

Use placeholders and replace values for each project:

- `REPLACE_PROJECT_SLUG` (example: `testing-template`, `client-portal`)
- `REPLACE_DB_USER`, `REPLACE_DB_PASSWORD`, `REPLACE_DB_NAME`
- `REPLACE_LOCAL_DB_PORT` (host port mapped to local Postgres container)
- `REPLACE_DOCKER_IMAGE_TAG`

Current project example mapping (this repository):

- `REPLACE_PROJECT_SLUG` -> `testing-template`
- `REPLACE_DB_USER` -> `payload`
- `REPLACE_DB_PASSWORD` -> `payload`
- `REPLACE_DB_NAME` -> `testing-template`
- `REPLACE_LOCAL_DB_PORT` -> `5433`

---

## Prerequisites

- Docker + Docker Compose
- `pnpm`
- `.env` configured (especially `DOCKER_IMAGE`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`)

---

## 1) Start local Postgres

```bash
docker compose up -d postgres
docker compose ps
```

---

## 2) Run local migrations

```bash
DATABASE_URL='postgres://REPLACE_DB_USER:REPLACE_DB_PASSWORD@127.0.0.1:REPLACE_LOCAL_DB_PORT/REPLACE_DB_NAME' \
  PAYLOAD_CONFIG_PATH=src/payload.config.ts \
  pnpm payload migrate
```

If you changed schema, create a migration first:

```bash
pnpm payload migrate:create --name describe_change
DATABASE_URL='postgres://REPLACE_DB_USER:REPLACE_DB_PASSWORD@127.0.0.1:REPLACE_LOCAL_DB_PORT/REPLACE_DB_NAME' \
  PAYLOAD_CONFIG_PATH=src/payload.config.ts \
  pnpm payload migrate
pnpm generate:types
```

---

## 3) Build amd64 image

```bash
chmod +x scripts/docker-build-amd64.sh
./scripts/docker-build-amd64.sh
```

Or build and push in one step:

```bash
./scripts/docker-build-amd64.sh --push
```

---

## 4) Push image (if you used `--load`)

```bash
docker login
docker push REPLACE_DOCKER_IMAGE_TAG
```

Use your actual `DOCKER_IMAGE` tag.

---

## Notes

- Build target platform is `linux/amd64` for VPS compatibility.
- `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` must match the Postgres volume that is actually initialized.
- Changing those vars later does **not** reconfigure an existing volume; for a fresh DB init use:

```bash
docker compose down
docker volume rm REPLACE_PROJECT_SLUG_postgres_data
docker compose up -d postgres
```

- If build fails with missing DB tables, run migrations again and rebuild.
- If Docker fails at `RUN ... pnpm run build` with only a generic `exit code: 1`, run a local type check to reveal the real cause:

```bash
pnpm tsc --noEmit
```

- A common culprit is strict type mismatches in collection/plugin overrides (for example, `ordersCollectionOverride` field mapping).
- If build hangs due to dev-push markers, clear them:

```bash
docker compose exec -T postgres psql -U REPLACE_DB_USER -d REPLACE_DB_NAME -c "DELETE FROM payload_migrations WHERE batch = -1;"
```
