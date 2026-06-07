# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.js file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
#
# Build needs a Postgres that already has Payload migrations applied (next build queries the DB).
# Start compose Postgres, run `pnpm payload migrate` against 127.0.0.1:${POSTGRES_HOST_PORT:-5433}, then build.
# BuildKit does not support --network=container:…. For docker buildx / --platform, use Postgres on the
# host-mapped port (e.g. 5433) and DATABASE_URL=...@host.docker.internal:5433/... (see docs/docker.md).
# Alternative: DOCKER_BUILDKIT=0 docker build --network=container:$(docker compose ps -q postgres) \
#   --build-arg DATABASE_URL=postgres://USER:PASS@127.0.0.1:5432/DB ...

FROM node:22.17.0-alpine AS base
RUN npm install -g pnpm

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next build runs Payload/DB during SSG (generateStaticParams). Pass DATABASE_URL
# (e.g. docker compose build with build.network: service:postgres → use 127.0.0.1).
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG PAYLOAD_SECRET=docker-build-only-placeholder-not-used-at-runtime-min-32chars
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ARG NEXT_PUBLIC_SERVER_URL=http://localhost
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}

# Production DB path: skip dev schema push; run prod migrations during next build.
ENV NODE_ENV=production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# If the build DB has a dev-push row (payload_migrations.batch = -1), Payload prompts to
# continue; Docker has no TTY. A single "y" on stdin accepts (see docs/docker.md to remove -1 rows instead).
RUN printf 'y\n' | ( \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi \
  )

# Production image, run migrations then serve app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app /app
COPY --chown=nextjs:nodejs ./scripts/docker-entrypoint.sh /app/scripts/docker-entrypoint.sh
RUN chmod +x /app/scripts/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["/app/scripts/docker-entrypoint.sh"]
