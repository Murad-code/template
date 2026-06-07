# First-Time VPS Setup (Current Model)

This guide reflects the live architecture used in production:

- one public Nginx container in `/root/app` (journalism stack)
- one `testing-template` stack in `/root/testing-template` (app + postgres)
- domain-based routing from shared Nginx:
  - `sadiasinsights.co.uk` -> journalism
  - `muradsprojects.co.uk` -> template

For day-to-day releases after setup, use [`deploy.md`](./deploy.md).
For architecture context, use [`vps-architecture.md`](./vps-architecture.md).

---

## 1) Prerequisites

- VPS already running journalism at `/root/app`
- DNS for `muradsprojects.co.uk` and `www.muradsprojects.co.uk` points to VPS IP
- Template image already pushed (see [`docker.md`](./docker.md))

Use `REPLACE_*` placeholders in the snippets below. Replace each value before running.
In this repository, `testing-template` is the current project slug, but treat that as an example value, not a global default.

Use these placeholders consistently:

- `REPLACE_PROJECT_SLUG`: short lowercase slug for this specific app deployment (example: `testing-template`, `client-portal`)
- `REPLACE_DEPLOY_DIR`: absolute VPS path for this app stack (recommended: `/root/REPLACE_PROJECT_SLUG`)
- `REPLACE_DB_*`, `REPLACE_TEMPLATE_DOMAIN`, `REPLACE_DOCKER_IMAGE_TAG`, etc. with project-specific values

Current project example mapping (for this repository):

- `REPLACE_PROJECT_SLUG` -> `testing-template`
- `REPLACE_DEPLOY_DIR` -> `/root/testing-template`
- `REPLACE_TEMPLATE_DOMAIN` -> `muradsprojects.co.uk`

---

## 2) Create deploy directory

```bash
mkdir -p REPLACE_DEPLOY_DIR
```

---

## 3) Create `REPLACE_DEPLOY_DIR/docker-compose.yml`

```bash
cat > REPLACE_DEPLOY_DIR/docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-payload}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-payload}
      POSTGRES_DB: ${POSTGRES_DB:-testing-template}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"']
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    image: ${DOCKER_IMAGE}
    platform: linux/amd64
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER:-payload}:${POSTGRES_PASSWORD:-payload}@postgres:5432/${POSTGRES_DB:-testing-template}
      NODE_ENV: production
      NEXT_PUBLIC_SERVER_URL: ${NEXT_PUBLIC_SERVER_URL}
    volumes:
      - media_uploads:/app/public/media
    ports:
      - '3001:3000'

volumes:
  postgres_data:
  media_uploads:
EOF
```

---

## 4) Create `REPLACE_DEPLOY_DIR/.env`

Do **not** copy this block as-is. Replace all placeholders (`REPLACE_*`) and set
project-specific values (`DOCKER_IMAGE`, DB credentials, URLs) before starting containers.

```bash
cat > REPLACE_DEPLOY_DIR/.env << 'EOF'
PAYLOAD_SECRET=REPLACE_WITH_32_PLUS_CHARS
PREVIEW_SECRET=REPLACE_ME
CRON_SECRET=REPLACE_ME

POSTGRES_USER=REPLACE_DB_USER
POSTGRES_PASSWORD=REPLACE_DB_PASSWORD
POSTGRES_DB=REPLACE_DB_NAME

DOCKER_IMAGE=REPLACE_DOCKER_IMAGE_TAG
NEXT_PUBLIC_SERVER_URL=https://REPLACE_TEMPLATE_DOMAIN

STRIPE_SECRET_KEY=REPLACE_IF_USED
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=REPLACE_IF_USED
STRIPE_WEBHOOKS_SIGNING_SECRET=REPLACE_IF_USED

RESEND_API_KEY=REPLACE_IF_USED
SMTP_FROM_EMAIL=REPLACE_SMTP_FROM_EMAIL
SMTP_FROM_NAME=REPLACE_SMTP_FROM_NAME
EOF
```

Important:

- You can use `payload`, `postgres`, or any other DB username/password, but values must be consistent.
- The app uses these vars to build `DATABASE_URL` at runtime, so mismatches cause auth errors.
- Postgres only applies `POSTGRES_*` vars on first initialization of an empty volume.

---

## 5) Start template services

```bash
cd REPLACE_DEPLOY_DIR
docker login
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=50 app
```

If the app keeps restarting, check the app error immediately:

```bash
docker compose logs --tail=200 app
```

`Restarting (127)` usually indicates an image/entrypoint command issue (for example a stale or incorrect `DOCKER_IMAGE` tag), not an Nginx config problem.

If logs show table errors (for example `relation "users" does not exist`), run migrations explicitly:

```bash
docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate'
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt'
```

If logs show auth errors after changing `POSTGRES_*`, reinitialize this stack's Postgres volume:

```bash
docker compose down
docker volume rm REPLACE_PROJECT_SLUG_postgres_data
docker compose up -d
```

---

## 6) Issue SSL certificate for template domain

```bash
docker compose -f /root/app/docker-compose.yml stop nginx

certbot certonly --standalone \
  -d REPLACE_TEMPLATE_DOMAIN \
  -d www.REPLACE_TEMPLATE_DOMAIN

docker compose -f /root/app/docker-compose.yml start nginx
```

---

## 7) Update shared Nginx config (`/root/app/nginx/default.conf`)

```bash
cat > /root/app/nginx/default.conf << 'EOF'
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

# Journalism
server {
    listen 80;
    server_name REPLACE_JOURNALISM_DOMAIN www.REPLACE_JOURNALISM_DOMAIN;
    return 301 https://REPLACE_JOURNALISM_DOMAIN$request_uri;
}

server {
    listen 443 ssl;
    server_name REPLACE_JOURNALISM_DOMAIN www.REPLACE_JOURNALISM_DOMAIN;

    ssl_certificate     /etc/letsencrypt/live/REPLACE_JOURNALISM_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/REPLACE_JOURNALISM_DOMAIN/privkey.pem;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}

# Template
server {
    listen 80;
    server_name REPLACE_TEMPLATE_DOMAIN www.REPLACE_TEMPLATE_DOMAIN;
    return 301 https://REPLACE_TEMPLATE_DOMAIN$request_uri;
}

server {
    listen 443 ssl;
    server_name REPLACE_TEMPLATE_DOMAIN www.REPLACE_TEMPLATE_DOMAIN;

    ssl_certificate     /etc/letsencrypt/live/REPLACE_TEMPLATE_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/REPLACE_TEMPLATE_DOMAIN/privkey.pem;

    location / {
        proxy_pass http://host.docker.internal:REPLACE_TEMPLATE_HOST_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
EOF
```

Also ensure `/root/app/docker-compose.yml` (the existing journalism/shared-Nginx stack, **not** `REPLACE_DEPLOY_DIR/docker-compose.yml`) has `extra_hosts` under `nginx`:

```yaml
services:
  nginx:
    # keep existing nginx fields and add:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

---

## 8) Reload Nginx safely

```bash
docker compose -f /root/app/docker-compose.yml up -d nginx
docker compose -f /root/app/docker-compose.yml exec nginx nginx -t
docker compose -f /root/app/docker-compose.yml exec nginx nginx -s reload
```

---

## 9) Final verification

```bash
curl -I https://REPLACE_JOURNALISM_DOMAIN
curl -I https://REPLACE_TEMPLATE_DOMAIN
curl -I https://REPLACE_TEMPLATE_DOMAIN/admin
```

All should return valid responses from Nginx/Next.js (not Vercel or DNS parking).

