# Clayworks Studio

Mason stain and glaze recipes from hex codes or inspiration photos, saved recipes with test notes, a library of tested Glazy recipes, and a studio inventory searchable across real supplier catalogs.

- `app/clayworks.html` — the app (also runs as a claude.ai artifact)
- `docs/` — GitHub Pages build (`python3 web/build.py <worker-url>`)
- `worker/` — Cloudflare Worker: logins, weekly spend caps, Claude proxy, shelf sync
- `catalog/` — supplier catalogs and merge script; `glazy.json` = cone 5–6 Production glazes from Glazy, **CC BY-NC-SA 4.0** (see `catalog/GLAZY-LICENSE.md`)
- `tests/` — local mock backend + Playwright end-to-end test

See `CLAUDE.md` for architecture and decisions.
