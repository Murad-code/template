# First-Time VPS Setup (Current Model)

This guide reflects the live architecture used in production:

- one public Nginx container in `/root/app` (journalism stack)
- one template stack in `/root/template` (app + postgres)
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

---

## 2) Create template deploy directory

```bash
mkdir -p /root/template
```

---

## 3) Create `/root/template/docker-compose.yml`

```bash
cat > /root/template/docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-payload}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-payload}
      POSTGRES_DB: ${POSTGRES_DB:-template}
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
      DATABASE_URL: postgres://${POSTGRES_USER:-payload}:${POSTGRES_PASSWORD:-payload}@postgres:5432/${POSTGRES_DB:-template}
      NODE_ENV: production
      NEXT_PUBLIC_SERVER_URL: https://muradsprojects.co.uk
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

## 4) Create `/root/template/.env`

```bash
cat > /root/template/.env << 'EOF'
PAYLOAD_SECRET=REPLACE_WITH_32_PLUS_CHARS
PREVIEW_SECRET=REPLACE_ME
CRON_SECRET=REPLACE_ME

POSTGRES_USER=payload
POSTGRES_PASSWORD=payload
POSTGRES_DB=template

DOCKER_IMAGE=muradkamali/template:1.0.0
NEXT_PUBLIC_SERVER_URL=https://muradsprojects.co.uk

STRIPE_SECRET_KEY=REPLACE_IF_USED
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=REPLACE_IF_USED
STRIPE_WEBHOOKS_SIGNING_SECRET=REPLACE_IF_USED

RESEND_API_KEY=REPLACE_IF_USED
SMTP_FROM_EMAIL=noreply@muradsprojects.co.uk
SMTP_FROM_NAME=Murad's Projects
EOF
```

---

## 5) Start template services

```bash
cd /root/template
docker login
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=50 app
```

---

## 6) Issue SSL certificate for template domain

```bash
docker compose -f /root/app/docker-compose.yml stop nginx

certbot certonly --standalone \
  -d muradsprojects.co.uk \
  -d www.muradsprojects.co.uk

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
    server_name sadiasinsights.co.uk www.sadiasinsights.co.uk;
    return 301 https://sadiasinsights.co.uk$request_uri;
}

server {
    listen 443 ssl;
    server_name sadiasinsights.co.uk www.sadiasinsights.co.uk;

    ssl_certificate     /etc/letsencrypt/live/sadiasinsights.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sadiasinsights.co.uk/privkey.pem;

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
    server_name muradsprojects.co.uk www.muradsprojects.co.uk;
    return 301 https://muradsprojects.co.uk$request_uri;
}

server {
    listen 443 ssl;
    server_name muradsprojects.co.uk www.muradsprojects.co.uk;

    ssl_certificate     /etc/letsencrypt/live/muradsprojects.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/muradsprojects.co.uk/privkey.pem;

    location / {
        proxy_pass http://host.docker.internal:3001;
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

Also ensure `/root/app/docker-compose.yml` has:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

under the `nginx` service.

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
curl -I https://sadiasinsights.co.uk
curl -I https://muradsprojects.co.uk
curl -I https://muradsprojects.co.uk/admin
```

All should return valid responses from Nginx/Next.js (not Vercel or DNS parking).

