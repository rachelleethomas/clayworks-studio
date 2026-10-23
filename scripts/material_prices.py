"""Prices for the glaze materials the app knows (its MATS list) and Mason stains, for the recipe page's Cost tab.

Sources (polite: 1 request/second per store, honest user agent, robots.txt allows product pages):
  - The Ceramic Shop: its sitemap lists every product; chemicals are sold by the pound (the page says "per pound"),
    so a match gives a $/lb with no bag size.
  - Alligator Clay: prices are already in the store scrape (catalog/sources); used when the link names the bag (…-50lbs).
Material names and their aliases are read from the app (MATS in app/clayworks.html), so both stay in step.

Writes catalog/material-prices.json: {"<MATS name>" | "Mason 6600": [{"store", "url", "lb", "price", "perPound"}]}.
embed_catalog.py inlines it as <script id="matPrices">. Usage: python3 scripts/material_prices.py  (resumable cache)
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import catalog_images as ci

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "material-prices.json")
CACHE = os.path.join(R, "catalog", ".material-prices-cache.json")
NOT_A_MATERIAL = re.compile(r"element|kiln|olympic|evenheat|skutt|paragon|silicate|sand|grog|glaze|underglaze|brush|tool|calcined|"
                            r"thermocouple|relay|switch|shelf|post|mold|bat|wheel|book|video|class|sponge|bucket|sieve|mask|apron|tile-6-georgia|"
                            r"pint|gallon|\d+-?oz|-dry\b|pour|spout|rib|throwing|seed|coyote|mayco|amaco|tpl-|terra-sig|texture|zinc-free|clear|wash")

def mats():
    app = open(os.path.join(R, "app", "clayworks.html"), encoding="utf-8").read()
    return [(n, re.compile(rx)) for n, rx in re.findall(r'\["([^"]+)",/(.*?)/,\{', app[app.index("const MATS=["):app.index("const EQUIV=")])]

def lbs_from(text):
    t = text.lower()
    f = re.search(r"\b1[-/ ]([248])[- ]?(lb|lbs|pound)", t)          # "1-4-lb", "1/4 lb" = a quarter pound
    if f: return 1 / int(f.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)\s*-?\s*(lb|lbs|pound)s?\b", t.replace("-", " "))
    return float(m.group(1)) if m else None

def main():
    M = mats(); print(len(M), "materials from the app", flush=True)
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    out = {}
    def add(key, offer):
        if not any(o["url"] == offer["url"] for o in out.setdefault(key, [])): out[key].append(offer)
    # The Ceramic Shop: match product slugs to materials / Mason stains, then read the per-pound price
    xml = ci.get("https://www.theceramicshop.com/sitemap.xml")
    urls = sorted(set(re.findall(r"<loc>(https://www\.theceramicshop\.com/product/\d+/[^<]+)</loc>", xml)))
    todo = []
    for u in urls:
        slug = u.rstrip("/").rsplit("/", 1)[-1]
        if NOT_A_MATERIAL.search(slug): continue
        words = slug.replace("-", " ")
        code = re.search(r"\b(6\d{3})\b", words)
        if code: todo.append(("Mason " + code.group(1), u)); continue   # Mason numbers, with or without "mason" in the name
        hit = next((n for n, rx in M if rx.search(words)), None)
        if hit == "Red Iron Oxide" and re.search(r"black|yellow|magnetite", words): hit = None  # other iron oxides
        if hit: todo.append((hit, u))
    print(len(todo), "Ceramic Shop pages match a material", flush=True)
    for i, (key, u) in enumerate(todo, 1):
        if u not in cache:
            try:
                html = ci.get(u); m = re.search(r'"price"\s*:\s*"?(\d+(?:\.\d+)?)', html)
                cache[u] = {"price": float(m.group(1)) if m else 0, "perPound": "per pound" in html.lower()}
            except Exception:
                cache[u] = {"price": 0, "perPound": False}
            if i % 25 == 0: json.dump(cache, open(CACHE, "w")); print(f"{i}/{len(todo)}", flush=True)
        c = cache[u]; slug = u.rstrip("/").rsplit("/", 1)[-1]
        lb = 1.0 if c["perPound"] else lbs_from(slug)
        if c["price"] and lb: add(key, {"store": "The Ceramic Shop", "url": u, "lb": lb, "price": c["price"], "perPound": c["perPound"]})
    json.dump(cache, open(CACHE, "w"))
    # Alligator Clay: scrape prices, when the link says the bag size
    for it in json.load(open(os.path.join(R, "catalog", "sources", "catalog-alligator.json"))):
        if it.get("kind") not in ("chemical", "stain") or not it.get("price") or not it.get("url"): continue
        words = (it.get("name", "") + " " + it["url"]).lower()
        if NOT_A_MATERIAL.search(it["url"]): continue
        code = re.search(r"\b(6\d{3})\b", words)
        key = "Mason " + code.group(1) if code and it.get("kind") == "stain" else next((n for n, rx in M if rx.search(words)), None)
        lb = lbs_from(it["url"]) or lbs_from(it.get("name", ""))
        pm = re.search(r"\d+(?:\.\d+)?", it["price"].replace(",", ""))
        if key and lb and pm: add(key, {"store": "Alligator Clay", "url": it["url"], "lb": lb, "price": float(pm.group()), "perPound": False})
    json.dump(out, open(OUT, "w"), separators=(",", ":"), sort_keys=True)
    have = [n for n, _ in M if n in out]
    print(f"done: {len(have)} of {len(M)} materials priced, {sum(1 for k in out if k.startswith('Mason'))} Mason stains", flush=True)
    print("missing:", ", ".join(n for n, _ in M if n not in out), flush=True)

if __name__ == "__main__":
    main()
