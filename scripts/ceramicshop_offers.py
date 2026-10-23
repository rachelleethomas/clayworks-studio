"""Add The Ceramic Shop as a full store for premade glazes: product links + size prices.

The earlier scrape of theceramicshop.com got names only (their listings truncate and carry no links). Their sitemap
lists every product page as /product/<id>/<code>-<name>-<size>/, so we match our glazes by code + name, then fetch
each matched page's structured-data price. robots.txt only blocks /store/filtered/; 1 request/second; honest user agent.

Writes catalog/catalog-ceramicshop.json: {"<kind>|<brand>|<code>|<name>": [{"url", "size", "price"}]}
(keyed like the catalog item, not by URL, since we didn't have a Ceramic Shop URL before). embed_catalog.py merges it
into each item's offers. Usage: python3 scripts/ceramicshop_offers.py   (resumable: keeps fetched prices)
"""
import json, os, re, sys, time, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import catalog_images as ci

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "catalog-ceramicshop.json")
CACHE = os.path.join(R, "catalog", ".ceramicshop-prices.json")  # url -> price, so reruns don't refetch
SIZES = [("4-oz", "4 oz"), ("8-oz", "8 oz"), ("pint", "Pint"), ("quart", "Quart"), ("gallon", "Gallon"), ("1-lb", "1 lb"), ("5-lb", "5 lb"), ("dry", "Dry")]

def core(s):  # "CO-06 Supernova" / "co-6-supernova" -> "co6supernova"
    s = re.sub(r"[^a-z0-9]+", " ", (s or "").lower())
    s = re.sub(r"\b0+(\d)", r"\1", s)
    return s.replace(" ", "")

def item_key(it): return f'{it["kind"]}|{it.get("brand","")}|{it.get("code","")}|{it["name"]}'

def main():
    xml = ci.get("https://www.theceramicshop.com/sitemap.xml")
    urls = sorted(set(re.findall(r"<loc>(https://www\.theceramicshop\.com/product/\d+/[^<]+)</loc>", xml)))
    pages = {}  # core(code+name) -> [(url, size)]
    for u in urls:
        slug = u.rstrip("/").split("/")[-1]
        size = ""
        for suf, lab in SIZES:
            if slug.endswith("-" + suf): slug, size = slug[: -len(suf) - 1], lab; break
        pages.setdefault(core(slug), []).append((u, size))
    cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
    matches = {}
    for it in cat:
        if it["kind"] not in ("glaze", "underglaze"): continue
        keys = [core(f'{it.get("code","")} {it["name"]}')] if it.get("code") else []
        keys.append(core(f'{it.get("brand","")} {it["name"]}'))
        for k in keys:
            if k in pages: matches[item_key(it)] = pages[k]; break
    print(f"{len(urls)} product pages; matched {len(matches)} of our glazes", flush=True)
    prices = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    todo = sorted({u for v in matches.values() for u, _ in v if u not in prices})
    print(f"{len(todo)} pages to price", flush=True)
    for i, u in enumerate(todo, 1):
        try:
            m = re.search(r'"price"\s*:\s*"?(\d+(?:\.\d+)?)', ci.get(u))
            prices[u] = float(m.group(1)) if m else 0
        except Exception:
            prices[u] = 0
        if i % 50 == 0:
            json.dump(prices, open(CACHE, "w")); print(f"{i}/{len(todo)}", flush=True)
    json.dump(prices, open(CACHE, "w"))
    out = {k: [{"url": u, "size": s or "Each", "price": prices.get(u, 0)} for u, s in v] for k, v in matches.items()}
    json.dump(out, open(OUT, "w"), separators=(",", ":"), sort_keys=True)
    print(f"done: {len(out)} glazes with Ceramic Shop links, {sum(1 for v in out.values() if any(x['price'] for x in v))} priced", flush=True)

if __name__ == "__main__":
    main()
