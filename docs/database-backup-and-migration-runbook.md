# Database Backup and Migration Runbook

Use this runbook to preserve and move a client project's data between local, staging, and VPS environments.

This is written for agent-led execution and repeatable operations.

## Goal

Maintain full recoverability and portability of a deployed project by backing up and restoring:

1. Postgres database
2. media uploads volume
3. production environment configuration (stored securely, never committed)

With these artifacts, you can move a client site to another VPS and restore it with full data continuity.

## Scope and assumptions

- Project slug: `black-oak-coffee`
- VPS deploy directory: `/root/black-oak-coffee`
- VPS stack uses Docker Compose with services `app` and `postgres`
- Local DB access is available on `127.0.0.1:5434`

Replace placeholders where needed:

- `REPLACE_VPS_HOST` (for example `root@77.68.54.239`)
- `REPLACE_PROJECT_SLUG`
- `REPLACE_DEPLOY_DIR`
- `REPLACE_LOCAL_DB_PORT`
- `REPLACE_DB_USER`, `REPLACE_DB_NAME`

## Hard rules

- Never commit real secrets or production dumps to git.
- Always verify dump integrity before deleting old backups.
- Treat production restores as destructive unless restoring into a fresh database.
- Back up both DB and media before any risky migration.

## Backup artifacts to preserve

For each backup point, preserve:

1. DB dump (`pg_dump` custom format `.dump`)
2. media tarball (`.tar.gz`) from docker volume
3. encrypted copy of production `.env` in your secret manager
4. deployment metadata (image tag, date, commit SHA if available)

## One-off backup commands (VPS)

Run on VPS:

```bash
cd /root/black-oak-coffee
mkdir -p /root/backups/black-oak-coffee

# DB backup (custom format, best for restore)
docker compose exec -T postgres sh -lc \
'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
> /root/backups/black-oak-coffee/db_$(date +%Y%m%d_%H%M%S).dump

# Media backup
docker run --rm \
  -v black-oak-coffee_media_uploads:/data \
  -v /root/backups/black-oak-coffee:/backup \
  alpine sh -lc 'tar czf /backup/media_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .'
```

Quick integrity checks:

```bash
ls -lh /root/backups/black-oak-coffee
pg_restore -l /root/backups/black-oak-coffee/db_YYYYMMDD_HHMMSS.dump | head
tar -tzf /root/backups/black-oak-coffee/media_YYYYMMDD_HHMMSS.tar.gz | head
```

## Automated backup script (VPS)

Create script:

```bash
cat > /usr/local/bin/black-oak-backup.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

PROJECT_SLUG="black-oak-coffee"
DEPLOY_DIR="/root/black-oak-coffee"
BACKUP_DIR="/root/backups/${PROJECT_SLUG}"
KEEP_DAYS=14

timestamp="$(date +%Y%m%d_%H%M%S)"
db_file="${BACKUP_DIR}/db_${timestamp}.dump"
media_file="${BACKUP_DIR}/media_${timestamp}.tar.gz"
manifest_file="${BACKUP_DIR}/manifest_${timestamp}.txt"

mkdir -p "${BACKUP_DIR}"

cd "${DEPLOY_DIR}"

echo "[backup] creating database dump: ${db_file}"
docker compose exec -T postgres sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "${db_file}"

echo "[backup] creating media archive: ${media_file}"
docker run --rm \
  -v ${PROJECT_SLUG}_media_uploads:/data \
  -v "${BACKUP_DIR}":/backup \
  alpine sh -lc "tar czf /backup/$(basename "${media_file}") -C /data ."

echo "[backup] writing manifest: ${manifest_file}"
{
  echo "timestamp=${timestamp}"
  echo "project_slug=${PROJECT_SLUG}"
  echo "deploy_dir=${DEPLOY_DIR}"
  echo "db_file=$(basename "${db_file}")"
  echo "media_file=$(basename "${media_file}")"
  echo "docker_image=$(grep '^DOCKER_IMAGE=' .env | cut -d= -f2- || true)"
} > "${manifest_file}"

echo "[backup] retention: deleting files older than ${KEEP_DAYS} days"
find "${BACKUP_DIR}" -type f -name 'db_*.dump' -mtime +${KEEP_DAYS} -delete
find "${BACKUP_DIR}" -type f -name 'media_*.tar.gz' -mtime +${KEEP_DAYS} -delete
find "${BACKUP_DIR}" -type f -name 'manifest_*.txt' -mtime +${KEEP_DAYS} -delete

echo "[backup] completed successfully"
EOF

chmod +x /usr/local/bin/black-oak-backup.sh
```

Test it:

```bash
/usr/local/bin/black-oak-backup.sh
ls -lh /root/backups/black-oak-coffee | tail -n 10
```

## Cron automation (VPS)

Set nightly backup at 02:30 server time:

```bash
cat > /etc/cron.d/black-oak-backup << 'EOF'
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

30 2 * * * root /usr/local/bin/black-oak-backup.sh >> /var/log/black-oak-backup.log 2>&1
EOF

chmod 644 /etc/cron.d/black-oak-backup
service cron reload || systemctl reload cron || true
```

Verify cron registration:

```bash
cat /etc/cron.d/black-oak-backup
tail -n 100 /var/log/black-oak-backup.log || true
```

## Restore workflows

### A) Restore VPS backup to local

From local machine:

```bash
scp REPLACE_VPS_HOST:/root/backups/black-oak-coffee/db_YYYYMMDD_HHMMSS.dump .
```

Restore locally:

```bash
dropdb --if-exists -h 127.0.0.1 -p 5434 -U postgres black-oak-coffee
createdb -h 127.0.0.1 -p 5434 -U postgres black-oak-coffee
pg_restore -h 127.0.0.1 -p 5434 -U postgres -d black-oak-coffee --clean --if-exists db_YYYYMMDD_HHMMSS.dump
```

### B) Restore local dump to VPS

Create local dump:

```bash
pg_dump -h 127.0.0.1 -p 5434 -U postgres -d black-oak-coffee -Fc > local_latest.dump
scp local_latest.dump REPLACE_VPS_HOST:/root/backups/black-oak-coffee/
```

Restore on VPS:

```bash
cd /root/black-oak-coffee
docker compose exec -T postgres sh -lc 'dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB" && createdb -U "$POSTGRES_USER" "$POSTGRES_DB"'
docker compose exec -T postgres sh -lc 'cat > /tmp/restore.dump' < /root/backups/black-oak-coffee/local_latest.dump
docker compose exec -T postgres sh -lc 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists /tmp/restore.dump'
```

### C) Restore media archive on VPS

```bash
docker run --rm \
  -v black-oak-coffee_media_uploads:/data \
  -v /root/backups/black-oak-coffee:/backup \
  alpine sh -lc 'tar xzf /backup/media_YYYYMMDD_HHMMSS.tar.gz -C /data'
```

## Move to a new VPS (disaster recovery / migration)

Minimum migration bundle:

1. latest image tag (`DOCKER_IMAGE`)
2. latest DB dump (`db_*.dump`)
3. latest media archive (`media_*.tar.gz`)
4. production `.env` values (from secure storage)
5. `docker-compose.yml` for project stack

Migration sequence:

1. Provision new VPS and install Docker/Compose
2. Create deploy dir and copy compose + `.env`
3. `docker login`, `docker compose pull`, `docker compose up -d`
4. Restore DB dump
5. Restore media archive
6. Run migration check:
   - `docker compose exec -T app sh -lc 'PAYLOAD_CONFIG_PATH=src/payload.config.ts pnpm payload migrate'`
   - `docker compose exec -T postgres sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt"'`
7. Verify URLs:
   - `curl -I https://DOMAIN`
   - `curl -I https://DOMAIN/admin`

## Optional hardening improvements

- Add offsite sync (for example, S3/B2) for `/root/backups/black-oak-coffee`.
- Encrypt backup files at rest (`age` or `gpg`) before transfer.
- Add periodic restore drill (monthly) to prove backups are usable.
- Use a staging DB with anonymized customer data when required.

## Agent prompt template (future)

Use this in a new chat when you want an agent to run backup/restore/migration workflows:

```text
Run the database backup and migration workflow for this project using docs/database-backup-and-migration-runbook.md.

Requirements:
1) Read the runbook first and use its command order.
2) Ask for missing values (VPS host, exact backup filename, direction: local->VPS or VPS->local).
3) For destructive restores, require explicit confirmation before drop/recreate.
4) After each phase, run verification checks and summarize pass/fail.
5) If any command fails, provide the minimum safe fix with exact commands.
6) Do not commit secrets or backup artifacts to git.
```
