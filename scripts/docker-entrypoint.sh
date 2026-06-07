#!/bin/sh
set -eu

# Run DB migrations before serving traffic.
PAYLOAD_CONFIG_PATH=src/payload.config.ts node ./node_modules/payload/dist/bin/index.js migrate

# Next standalone serves static assets from ".next/standalone/.next/static".
# Ensure that path exists by linking to the built static directory.
if [ -d "/app/.next/static" ] && [ ! -e "/app/.next/standalone/.next/static" ]; then
  mkdir -p "/app/.next/standalone/.next"
  ln -s "/app/.next/static" "/app/.next/standalone/.next/static"
fi

# Start Next.js standalone server.
exec env HOSTNAME="0.0.0.0" node ./.next/standalone/server.js
