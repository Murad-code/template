# Docker Build and Push (Local)

This guide is for building and pushing the production image from your local machine.

> `next build` queries Postgres in this project, so your local DB must be up and migrated before building.

For VPS setup, see [`vps-setup.md`](./vps-setup.md).  
For future updates, see [`deploy.md`](./deploy.md).

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
DATABASE_URL='postgres://payload:payload@127.0.0.1:5433/template' pnpm payload migrate
```

If you changed schema, create a migration first:

```bash
pnpm payload migrate:create --name describe_change
DATABASE_URL='postgres://payload:payload@127.0.0.1:5433/template' pnpm payload migrate
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
docker push muradkamali/template:1.0.0
```

Use your actual `DOCKER_IMAGE` tag.

---

## Notes

- Build target platform is `linux/amd64` for VPS compatibility.
- If build fails with missing DB tables, run migrations again and rebuild.
- If build hangs due to dev-push markers, clear them:

```bash
docker compose exec -T postgres psql -U payload -d template -c "DELETE FROM payload_migrations WHERE batch = -1;"
```
