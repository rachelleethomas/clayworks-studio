"""Mayco Stoneware (SW-) glazes from Mayco's own shop -> catalog/sources/catalog-mayco.json.

  python3 scripts/mayco_catalog.py && python3 catalog/merge_catalog.py && python3 scripts/catalog_images.py && python3 scripts/embed_catalog.py

Reads the public WooCommerce Store API (/wp-json/wc/store/v1/products, robots allows it), 1 request/s.
Price = the smallest size listed (pint)."""
import json, os, re, time, urllib.request

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(R, "catalog", "sources", "catalog-mayco.json")
UA = "Mozilla/5.0 (Macintosh) ClayworksStudio/1.0 (personal studio tool)"
API = "https://www.maycocolors.com/wp-json/wc/store/v1/products?per_page=100&page=%d"


def main():
    items, page = [], 1
    while True:
        req = urllib.request.Request(API % page, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            batch = json.load(r); pages = int(r.headers.get("X-WP-TotalPages") or 1)
        for p in batch:
            sku = (p.get("sku") or "").strip().upper()
            if not re.fullmatch(r"SW-\d+", sku): continue
            name = re.sub(r"<[^>]+>", "", p.get("name") or "").replace("&#8217;", "'").replace("&amp;", "&").strip()
            pr = (p.get("prices") or {}).get("price")
            items.append({"kind": "glaze", "brand": "Mayco", "line": "Stoneware", "code": sku, "name": name, "cone": "^5-6",
                          "url": p["permalink"], **({"price": f"{int(pr) / 100:.2f}"} if pr else {})})
        if page >= pages: break
        page += 1; time.sleep(1)
    items.sort(key=lambda x: int(x["code"][3:]))
    json.dump(items, open(OUT, "w"), indent=0)
    print(len(items), "Mayco Stoneware glazes ->", OUT)


if __name__ == "__main__":
    main()
