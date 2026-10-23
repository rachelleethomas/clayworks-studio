"""Add Bailey Pottery as a full store for premade glazes: product links + listed price.

The earlier Bailey scrape stopped at ~200 products (Magento navigation buries them). Their sitemap lists every product page
(e.g. supernova-co-6.html, c-054-pc-20.html, georgies-vanilla-cream-matte-glw39.html), so we match our glazes by product
code (plus name when the page names it), then read each page's product:price:amount tag (the first "price" in the page
can be a different product). robots.txt allows product pages; 1 request/second; honest user agent.

Writes catalog/catalog-bailey.json: {"<kind>|<brand>|<code>|<name>": [{"url", "size", "price"}]}; embed_catalog.py merges it.
Usage: python3 scripts/bailey_offers.py   (resumable: keeps fetched prices in catalog/.bailey-prices.json)
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import catalog_images as ci
from ceramicshop_offers import core, item_key

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "catalog-bailey.json")
CACHE = os.path.join(R, "catalog", ".bailey-prices.json")
SIZE = [("gallon", "Gallon"), ("pint", "Pint"), ("4-oz", "4 oz"), ("8-oz", "8 oz")]

def main():
    xml = ci.get("https://baileypottery.com/sitemap.xml")
    urls = sorted(set(re.findall(r"<loc>(https://baileypottery\.com/[^<]+\.html)</loc>", xml)))
    slugs = []
    for u in urls:
        s = u.rsplit("/", 1)[-1][:-5]
        s = re.sub(r"^c-\d+-", "", s)                       # Bailey's own catalog prefix
        size = next((lab for suf, lab in SIZE if s.endswith("-" + suf)), "")
        if size: s = s[: s.rfind("-" + [x for x, l in SIZE if l == size][0])]
        slugs.append((core(s), u, size))
    cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
    matches = {}
    for it in cat:
        if it["kind"] not in ("glaze", "underglaze") or not it.get("code"): continue
        cc, nm = core(it["code"]), core(it["name"])
        if len(cc) < 3: continue
        hits = []
        for sc, u, size in slugs:
            if sc == cc or sc == cc + nm or sc == nm + cc: hits.append((u, size))
            elif (sc.startswith(cc) or sc.endswith(cc)) and nm and nm in sc: hits.append((u, size))
        if hits: matches[item_key(it)] = hits
    print(f"{len(urls)} pages; matched {len(matches)} of our glazes", flush=True)
    prices = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    todo = sorted({u for v in matches.values() for u, _ in v if u not in prices})
    print(f"{len(todo)} pages to price", flush=True)
    for i, u in enumerate(todo, 1):
        try:
            m = re.search(r'product:price:amount"\s+content="(\d+(?:\.\d+)?)', ci.get(u))
            prices[u] = float(m.group(1)) if m else 0
        except Exception:
            prices[u] = 0
        if i % 50 == 0: json.dump(prices, open(CACHE, "w")); print(f"{i}/{len(todo)}", flush=True)
    json.dump(prices, open(CACHE, "w"))
    out = {k: [{"url": u, "size": s or "Listed", "price": prices.get(u, 0)} for u, s in v] for k, v in matches.items()}
    json.dump(out, open(OUT, "w"), separators=(",", ":"), sort_keys=True)
    print(f"done: {len(out)} glazes with Bailey links, {sum(1 for v in out.values() if any(x['price'] for x in v))} priced", flush=True)

if __name__ == "__main__":
    main()
