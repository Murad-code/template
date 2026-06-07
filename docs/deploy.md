# Deploying Updates

Use this doc after first-time server setup is complete.  
For initial provisioning, see [`vps-setup.md`](./vps-setup.md).

Use placeholders and replace values for each project:

- `REPLACE_PROJECT_SLUG` (example: `testing-template`, `client-portal`)
- `REPLACE_DEPLOY_DIR` (recommended: `/root/REPLACE_PROJECT_SLUG`)
- `REPLACE_DOMAIN`
- `REPLACE_DB_USER`, `REPLACE_DB_PASSWORD`, `REPLACE_DB_NAME`
- `REPLACE_LOCAL_DB_PORT`
- `REPLACE_DOCKER_IMAGE_TAG`

## Current runtime assumptions

- app stack lives at `REPLACE_DEPLOY_DIR`
- Journalism stack lives at `/root/app`
- Public Nginx is `app-nginx-1` in `/root/app` (ports `80/443`)
- app is proxied by shared Nginx to its configured host port

---

## Scenario A: code-only changes (no schema changes)

### Local

```bash
# bump image tag in .env (example)
# DOCKER_IMAGE=REPLACE_DOCKER_IMAGE_TAG
./scripts/docker-build-amd64.sh --push
```

### VPS

```bash
cd REPLACE_DEPLOY_DIR
docker compose pull
docker compose up -d
docker compose logs --tail=50 app
```

---

## Scenario B: schema changes (Payload collections/fields changed)

### Local: create + apply migration

```bash
pnpm payload migrate:create --name describe_change
DATABASE_URL='postgres://REPLACE_DB_USER:REPLACE_DB_PASSWORD@127.0.0.1:REPLACE_LOCAL_DB_PORT/REPLACE_DB_NAME' \
  PAYLOAD_CONFIG_PATH=src/payload.config.ts \
  pnpm payload migrate
pnpm generate:types
```

### Local: build and push new image

```bash
# bump DOCKER_IMAGE tag in .env
./scripts/docker-build-amd64.sh --push
```

### VPS: deploy and run migrations

```bash
cd REPLACE_DEPLOY_DIR
docker compose pull
docker compose up -d
docker compose logs --tail=50 app
```

If schema is still missing after startup, run:

```bash
docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate'
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt'
```

If you changed `POSTGRES_*` values on an existing server and now get auth errors, the current volume still has old credentials. Reinitialize this stack's Postgres volume:

```bash
docker compose down
docker volume rm REPLACE_PROJECT_SLUG_postgres_data
docker compose up -d
```

---

## Rollback

```bash
cd REPLACE_DEPLOY_DIR
nano .env   # set DOCKER_IMAGE back to previous tag
docker compose pull app
docker compose up -d app
```

---

## Health checks

```bash
docker compose -f REPLACE_DEPLOY_DIR/docker-compose.yml ps
docker compose -f REPLACE_DEPLOY_DIR/docker-compose.yml logs --tail=50 app
docker compose -f REPLACE_DEPLOY_DIR/docker-compose.yml exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt'

curl -I https://REPLACE_DOMAIN
curl -I https://REPLACE_DOMAIN/admin
```

---

## Backups

### Manual DB backup

```bash
docker compose -f REPLACE_DEPLOY_DIR/docker-compose.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > ~/backups/REPLACE_PROJECT_SLUG_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore DB backup

```bash
gunzip < ~/backups/REPLACE_PROJECT_SLUG_TIMESTAMP.sql.gz \
  | docker compose -f REPLACE_DEPLOY_DIR/docker-compose.yml exec -T postgres \
      psql -U "$POSTGRES_USER" "$POSTGRES_DB"
```

