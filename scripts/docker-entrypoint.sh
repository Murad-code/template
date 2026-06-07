#!/bin/sh
set -eu

# Run DB migrations before serving traffic.
PAYLOAD_CONFIG_PATH=src/payload.config.ts node ./node_modules/payload/dist/bin/index.js migrate

# Start Next.js standalone server.
exec env HOSTNAME="0.0.0.0" node ./.next/standalone/server.js
