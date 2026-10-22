"""Collect per-pound prices for chemicals and stains in catalog/catalog.json (for the recipe page's Cost tab).

Writes catalog/catalog-prices.json: {"<url>|<code>|<name>": {"perLb", "size", "price", "bulkPerLb", "sizes": [[lb, price], ...]}}.
Only Shopify stores (Sheffield Pottery, Laguna), whose product JSON lists each bag size with its price; the size
comes from the variant title ("1 Pound", "5 Pounds", "Quarter Pound") because their weight field isn't reliable.
Alligator Clay's prices depend on a size option that isn't machine-readable, so it's skipped rather than guessed.
Same politeness as catalog_images.py: 1 request/second per store, honest user agent, robots.txt allows /products.

Usage: python3 scripts/catalog_prices.py      (resumable)
"""
import json, os, re, sys, threading
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import catalog_images as ci  # polite fetch + per-URL page cache

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "catalog-prices.json")
FRAC = {"1/4": .25, "1/2": .5, "quarter": .25, "half": .5}
UNIT = {"lb": 1, "lbs": 1, "pound": 1, "pounds": 1, "oz": 1 / 16, "ounce": 1 / 16, "ounces": 1 / 16, "kg": 2.2046, "g": 0.0022046, "gal": None, "gallon": None, "pint": None}

def pounds(text):
    t = (text or "").lower().replace("-", " ")
    m = re.search(r"(\d+(?:\.\d+)?|1/4|1/2|quarter|half)\s*(lbs?|pounds?|oz|ounces?|kg|g|gal|gallon|pint)\b", t)
    if not m: return None
    q, u = m.group(1), m.group(2)
    if UNIT.get(u) is None: return None
    q = FRAC.get(q, None) or float(q)
    return q * UNIT[u]

def product(url):
    p = json.loads(ci.get(url.split("?")[0] + ".json"))["product"]
    out = []
    for v in p.get("variants", []):
        lbs = pounds(v.get("title")) if v.get("title") not in (None, "Default Title") else pounds(p.get("title")) or pounds(url)
        price = float(v.get("price") or 0)
        if lbs and price and v.get("available", True) is not False: out.append((lbs, price, v.get("title") or p.get("title")))
    return out

def main():
    cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
    items = [x for x in cat if x["kind"] in ("chemical", "stain") and x.get("url") and any(h in x["url"] for h in ci.SHOPIFY)]
    done = json.load(open(OUT)) if os.path.exists(OUT) else {}
    todo = [x for x in items if ci.key(x) not in done]
    print(f"{len(items)} priced-store products, {len(done)} done, {len(todo)} to go", flush=True)
    cache, lock, n = {}, threading.Lock(), [0]
    def work(it):
        url = it["url"]
        try:
            with lock: hit = cache.get(url)
            if hit is None:
                hit = product(url)
                with lock: cache[url] = hit
        except Exception:
            hit = []
        rec = {}
        if hit:
            small = min(hit, key=lambda x: x[0])               # smallest bag: what a test batch costs
            bulk = min(hit, key=lambda x: x[1] / x[0])         # best price per pound
            sizes = sorted({(round(lb, 3), round(pr, 2)) for lb, pr, _ in hit})
            rec = {"perLb": round(small[1] / small[0], 2), "size": f"{small[0]:g} lb", "price": small[1], "bulkPerLb": round(bulk[1] / bulk[0], 2),
                   "sizes": [[lb, pr] for lb, pr in sizes]}  # every bag: the app prices by the smallest bag that covers the batch
        with lock:
            done[ci.key(it)] = rec; n[0] += 1
            if n[0] % 50 == 0:
                json.dump(done, open(OUT, "w"), separators=(",", ":")); print(f"{n[0]}/{len(todo)}", flush=True)
    with ThreadPoolExecutor(max_workers=4) as ex: list(ex.map(work, todo))
    json.dump(done, open(OUT, "w"), separators=(",", ":"), sort_keys=True)
    print(f"done: {len(done)} products, {sum(1 for v in done.values() if v)} with a price", flush=True)

if __name__ == "__main__":
    main()
