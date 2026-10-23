"""Collect size + price for premade glazes/underglazes at each store that lists them (for the premade detail page).

Writes catalog/catalog-glaze-prices.json: {"<url>|<code>|<name>": [["Pint", 19.95], ["Gallon", 89.0]]}, one entry per store offer.
  - Sheffield Pottery, Laguna (Shopify): /products/<handle>.json; on range pages ("PC-38 to PC-71") only the variants
    whose title starts with this product's code; the size comes from the variant title.
  - Bailey Pottery: the page's structured-data price (one size, labeled "Each").
  - Alligator Clay: already in the store scrape (catalog/sources), so not fetched here.
Polite like the other crawlers: 1 request/second per store, honest user agent, robots.txt allows /products.

Usage: python3 scripts/catalog_glaze_prices.py     (resumable)
"""
import json, os, re, sys, threading
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import catalog_images as ci

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "catalog-glaze-prices.json")
SIZE = [(r"\bgal(lon)?s?\b", "Gallon"), (r"\bquarts?\b|\bqt\b", "Quart"), (r"\bpints?\b|\bpt\b", "Pint"),
        (r"(\d+(?:\.\d+)?)\s*(fl\.?\s*)?oz\b", None), (r"(\d+(?:\.\d+)?)\s*(lb|lbs|pound|pounds)\b", None), (r"\bdry\b", "Dry")]

def size_label(t):
    t = (t or "").lower()
    for pat, lab in SIZE:
        m = re.search(pat, t)
        if m: return lab or (m.group(1) + (" oz" if "oz" in m.group(0) else " lb"))
    return ""

norm = lambda s: re.sub(r"[^a-z0-9]", "", (s or "").lower())
_cache, _lock = {}, threading.Lock()
def fetch(url, kind):
    with _lock:
        if url in _cache: return _cache[url]
    try:
        if kind == "shopify":
            p = json.loads(ci.get(url.split("?")[0] + ".json"))["product"]
            res = [(v.get("title") or "", float(v.get("price") or 0)) for v in p.get("variants", [])]
        else:
            html = ci.get(url); m = re.search(r'"price"\s*:\s*"?(\d+(?:\.\d+)?)', html)
            res = [("Each", float(m.group(1)))] if m else []
    except Exception:
        res = None
    with _lock: _cache[url] = res
    return res

def offers_for(it, url, kind):
    rows = fetch(url, kind)
    if not rows: return []
    if kind == "shopify":
        code = norm(it.get("code"))
        first = lambda t: norm((t.split("/")[0].split() or [""])[0])          # "PC-2 ..." → "pc2", so PC-2 never matches PC-20
        mine = [r for r in rows if code and first(r[0]) == code] if len(rows) > 3 else rows
        if not mine and len(rows) > 3: return []
        out = {}
        for title, price in mine:
            lab = size_label(title.split("/")[-1]) or size_label(title) or ("Each" if len(mine) == 1 else "")
            if lab and price and lab not in out: out[lab] = price
        return sorted(out.items(), key=lambda x: x[1])
    return rows

def main():
    cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
    todo, done = [], json.load(open(OUT)) if os.path.exists(OUT) else {}
    for it in cat:
        if it["kind"] not in ("glaze", "underglaze"): continue
        for o in it.get("offers") or [{"store": it.get("source", ""), "url": it.get("url")}]:
            u = o.get("url") or ""
            kind = "shopify" if any(h in u for h in ci.SHOPIFY) else "html" if "baileypottery.com" in u else None
            k = f'{u}|{it.get("code") or ""}|{it["name"]}'
            if kind and k not in done: todo.append((k, it, u, kind))
    print(f"{len(todo)} store offers to price, {len(done)} done", flush=True)
    lock, n = threading.Lock(), [0]
    def work(t):
        k, it, u, kind = t
        res = offers_for(it, u, kind)
        with lock:
            done[k] = [[a, b] for a, b in res]; n[0] += 1
            if n[0] % 100 == 0: json.dump(done, open(OUT, "w"), separators=(",", ":")); print(f"{n[0]}/{len(todo)}", flush=True)
    with ThreadPoolExecutor(max_workers=6) as ex: list(ex.map(work, todo))
    json.dump(done, open(OUT, "w"), separators=(",", ":"), sort_keys=True)
    print(f"done: {len(done)} offers, {sum(1 for v in done.values() if v)} with prices", flush=True)

if __name__ == "__main__":
    main()
