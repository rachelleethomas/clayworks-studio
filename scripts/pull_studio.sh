#!/bin/bash
# Copy Rachel's prod studio (Worker KV studio:rachel) into private/studio-rachel.json (gitignored) for local dev.
# The mock worker (tests/mock-server.mjs) loads it at startup; this restarts the mock so it takes effect.
# Usage: bash scripts/pull_studio.sh [user]   then reload http://localhost:8765
set -e
cd "$(dirname "$0")/.."
U="${1:-rachel}"
(cd worker && npx wrangler kv key get "studio:$U" --binding USAGE --remote) > "private/studio-$U.json"
echo "saved private/studio-$U.json ($(wc -c < "private/studio-$U.json") bytes)"
PID=$(lsof -ti tcp:8787 -sTCP:LISTEN || true); [ -n "$PID" ] && kill $PID && sleep 1
nohup node tests/mock-server.mjs > /dev/null 2>&1 &
echo "mock worker restarted on :8787"
