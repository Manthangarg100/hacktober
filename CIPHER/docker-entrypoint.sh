#!/bin/sh
set -eu

export PORT="${PORT:-10000}"
export HOSTNAME="0.0.0.0"
export OSIRIS_INTERNAL_PORT="${OSIRIS_INTERNAL_PORT:-3001}"
export OSIRIS_INTERNAL_URL="${OSIRIS_INTERNAL_URL:-http://127.0.0.1:${OSIRIS_INTERNAL_PORT}}"
export NODE_ENV="production"

# OSIRIS is an internal rendering/API process. It is intentionally bound only
# to loopback; browsers access it through CIPHER's same-origin /osiris proxy.
if [ -f /app/osiris/server.js ]; then
  PORT="${OSIRIS_INTERNAL_PORT}" HOSTNAME="127.0.0.1" node /app/osiris/server.js > /tmp/osiris.log 2>&1 &
  OSIRIS_PID=$!
else
  echo "[CIPHER] OSIRIS production bundle is missing." >&2
  exit 1
fi

cleanup() {
  kill "${OSIRIS_PID}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Give Next a short warm-up window. CIPHER itself remains the public service.
for i in $(seq 1 30); do
  if wget -q -O /dev/null "${OSIRIS_INTERNAL_URL}/" 2>/dev/null; then
    break
  fi
  sleep 1
done

exec uvicorn app:app --host 0.0.0.0 --port "${PORT}"
