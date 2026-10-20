# Clayworks Studio

Mason stain recipes from hex codes or inspiration photos, plus a studio inventory searchable across real supplier catalogs.

- `app/clayworks.html` — the app (also runs as a claude.ai artifact)
- `docs/` — GitHub Pages build (`python3 web/build.py <worker-url>`)
- `worker/` — Cloudflare Worker: logins, weekly spend caps, Claude proxy, shelf sync
- `catalog/` — supplier catalogs and merge script
- `tests/` — local mock backend + Playwright end-to-end test

See `CLAUDE.md` for architecture and decisions.
