# Glazy data

`catalog/glazy.json` (and the copy embedded in `app/clayworks.html` / `docs/index.html` as `<script id="glazyData">`)
is derived from the public Glazy export, https://github.com/derekphilipau/glazy-data (`glazy_20260531.yaml.gz`):
cone 5–6 glaze recipes whose makers marked them **Production**.

Glazy data is licensed under **Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**,
https://creativecommons.org/licenses/by-nc-sa/4.0/. This derived file is shared under the same license.
Credit: the Glazy contributors (each recipe lists its author and links to its page on glazy.org).
Clayworks Studio uses it non-commercially.

Regenerate: download the latest export (see `LATEST` in that repo), then
`python3 -I scripts/glazy_subset.py <path/to/glazy_YYYYMMDD.yaml.gz>` and `python3 scripts/embed_catalog.py`.
Do not scrape glazy.org itself: its robots.txt blocks AI agents and `/api/`, `/export/`.
