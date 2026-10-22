#!/bin/bash
# Local dev: builds a localhost copy into .local-site/ (never docs/), then runs the mock worker (:8787)
# and serves the site (:8765). The localhost build logs in automatically, no password.
cd "$(dirname "$0")/.."
python3 web/build.py http://localhost:8787 .local-site >/dev/null || exit 1
lsof -ti tcp:8787 >/dev/null 2>&1 || node tests/mock-server.mjs &
trap 'kill $(jobs -p) 2>/dev/null' EXIT
python3 -m http.server 8765 -d .local-site
