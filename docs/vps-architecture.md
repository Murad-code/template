# VPS Runtime Architecture (Current Live Setup)

This document describes how the VPS is currently running both projects at the same time:

- `journalism` on `sadiasinsights.co.uk`
- `testing-template` on `muradsprojects.co.uk`

It is a practical snapshot of the deployed state so future you can quickly understand the topology.

---

## High-level layout

There are two separate Docker Compose projects on the same VPS:

- `/root/app` -> journalism stack
- `/root/testing-template` -> testing-template stack

Each project has its own application container and its own Postgres container.

Only the journalism stack runs Nginx on host ports `80/443`. That Nginx instance acts as the shared internet entry point for both domains.

---

## Running containers and responsibilities

### Journalism compose project (`/root/app`)

- `app-app-1` (`muradkamali/journalism:1.0.0`)
  - Journalism Next.js + Payload app
  - Internal container port `3000`
- `app-postgres-1` (`postgres:16-alpine`)
  - Journalism database volume
- `app-nginx-1` (`nginx:1.27-alpine`)
  - Public reverse proxy
  - Binds host ports:
    - `80:80`
    - `443:443`
  - Terminates TLS for both domains
  - Routes traffic by `Host` header

### testing-template compose project (`/root/testing-template`)

- `testing-template-app-1` (`muradkamali/testing-template:1.0.0`)
  - Template Next.js + Payload app
  - Published on host as `3001:3000`
- `testing-template-postgres-1` (`postgres:16-alpine`)
  - Template database volume

---

## Request routing

Traffic flow is:

1. Internet request hits VPS on `80/443`
2. `app-nginx-1` receives request
3. Nginx chooses upstream based on domain:
   - `sadiasinsights.co.uk` -> journalism upstream (`http://app:3000` inside `/root/app` compose network)
   - `muradsprojects.co.uk` -> testing-template upstream (`http://host.docker.internal:3001`)
4. App responds through Nginx

So there is one public Nginx, two backend apps.

---

## TLS / certificates

Let's Encrypt certs live on host under:

- `/etc/letsencrypt/live/sadiasinsights.co.uk/`
- `/etc/letsencrypt/live/muradsprojects.co.uk/`

Nginx mounts `/etc/letsencrypt` read-only and serves HTTPS for both domains.

---

## DNS notes

- Authoritative DNS is managed in Cloudflare.
- Required records:
  - `A @ -> 77.68.54.239`
  - `A www -> 77.68.54.239` (or CNAME to `@`)
- During migration from old DNS providers, stale recursive DNS may still resolve old Vercel IPs temporarily.

The VPS resolver was updated to prefer public DNS to avoid stale upstream answers:

- Netplan nameservers include `1.1.1.1` and `8.8.8.8`

---

## Deployment model (current)

### Journalism deploy

- Update image tag in `/root/app/docker-compose.yml` (or pull latest tag)
- `docker compose -f /root/app/docker-compose.yml pull app`
- `docker compose -f /root/app/docker-compose.yml up -d`

### testing-template deploy

- Build/push image locally (amd64), e.g. `muradkamali/testing-template:1.0.0`
- Update `/root/testing-template/.env` (`DOCKER_IMAGE=...`) if needed
- `docker compose -f /root/testing-template/docker-compose.yml pull app`
- `docker compose -f /root/testing-template/docker-compose.yml up -d`

---

## Data separation

Each project has a separate Postgres container and volume:

- journalism data in `/root/app` compose volumes
- testing-template data in `/root/testing-template` compose volumes

This keeps schemas and content isolated.

---

## Current security/ops caveat

Template currently publishes host port `3001`.

- This was used to let journalism Nginx proxy to template app.
- It works and is live.
- A stronger follow-up is to place both stacks on a shared Docker network and remove host `3001` exposure.

---

## Quick health checks

```bash
# Journalism
docker compose -f /root/app/docker-compose.yml ps
docker compose -f /root/app/docker-compose.yml logs app --tail=50

# testing-template
docker compose -f /root/testing-template/docker-compose.yml ps
docker compose -f /root/testing-template/docker-compose.yml logs app --tail=50

# Public endpoints
curl -I https://sadiasinsights.co.uk
curl -I https://muradsprojects.co.uk
curl -I https://muradsprojects.co.uk/admin
```

