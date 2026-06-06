# Deploying Updates

Use this doc after first-time server setup is complete.  
For initial provisioning, see [`vps-setup.md`](./vps-setup.md).

## Current runtime assumptions

- Template stack lives at `/root/template`
- Journalism stack lives at `/root/app`
- Public Nginx is `app-nginx-1` in `/root/app` (ports `80/443`)
- Template app is proxied by that Nginx to host port `3001`

---

## Scenario A: code-only changes (no schema changes)

### Local

```bash
# bump image tag in .env (example)
# DOCKER_IMAGE=muradkamali/template:1.0.1
./scripts/docker-build-amd64.sh --push
```

### VPS

```bash
cd /root/template
docker compose pull app
docker compose up -d app
docker compose logs --tail=50 app
```

---

## Scenario B: schema changes (Payload collections/fields changed)

Schema migrations must be applied before the new app version runs in production.

### Local: create + apply migration

```bash
pnpm payload migrate:create --name describe_change
DATABASE_URL='postgres://payload:payload@127.0.0.1:5433/template' pnpm payload migrate
pnpm generate:types
```

### Local: build and push new image

```bash
# bump DOCKER_IMAGE tag in .env
./scripts/docker-build-amd64.sh --push
```

### Production DB migration via SSH tunnel

#### On VPS (temporary postgres host bind)

Add temporarily under `postgres` in `/root/template/docker-compose.yml`:

```yaml
ports:
  - '127.0.0.1:5433:5432'
```

Then:

```bash
cd /root/template
docker compose restart postgres
```

#### On local machine (terminal 1)

```bash
ssh -L 15432:127.0.0.1:5433 root@YOUR_VPS_IP -N
```

#### On local machine (terminal 2)

```bash
cd /path/to/template
DATABASE_URL='postgres://payload:payload@127.0.0.1:15432/template' pnpm payload migrate
```

#### On VPS (cleanup temporary port)

Remove the `ports` block, then:

```bash
docker compose -f /root/template/docker-compose.yml restart postgres
```

### Deploy image

```bash
cd /root/template
docker compose pull app
docker compose up -d app
docker compose logs --tail=50 app
```

---

## Rollback

```bash
cd /root/template
nano .env   # set DOCKER_IMAGE back to previous tag
docker compose pull app
docker compose up -d app
```

---

## Health checks

```bash
docker compose -f /root/template/docker-compose.yml ps
docker compose -f /root/template/docker-compose.yml logs --tail=50 app

curl -I https://muradsprojects.co.uk
curl -I https://muradsprojects.co.uk/admin
```

---

## Backups

### Manual DB backup

```bash
docker compose -f /root/template/docker-compose.yml exec -T postgres pg_dump -U payload template \
  | gzip > ~/backups/template_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore DB backup

```bash
gunzip < ~/backups/template_TIMESTAMP.sql.gz \
  | docker compose -f /root/template/docker-compose.yml exec -T postgres psql -U payload template
```

