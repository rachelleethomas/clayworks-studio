"""Amaco lines our other stores don't carry (Dipping & Layering DL, Crawl CR, Liquid Underglaze LUG), from The Ceramic
Shop -> catalog/sources/catalog-ceramicshop-amaco.json. They show up in Amaco's layering combos.

  python3 scripts/amaco_ceramicshop.py && python3 catalog/merge_catalog.py && python3 scripts/catalog_images.py && python3 scripts/embed_catalog.py

Product pages come from the sitemap (/product/<id>/<code>-<name>-<size>/); each page gives the name (og:title) and
price (structured data). robots.txt only blocks /store/filtered/; 1 request/second."""
import html, json, os, re, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import catalog_images as ci

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "sources", "catalog-ceramicshop-amaco.json")
LINES = {"dl": ("glaze", "Dipping & Layering", "^5-6"), "cr": ("glaze", "Crawl", "^5-6"), "lug": ("underglaze", "Liquid Underglaze", "^05-10")}


def main():
    xml = ci.get("https://www.theceramicshop.com/sitemap.xml")
    urls = sorted(set(re.findall(r"<loc>(https://www\.theceramicshop\.com/product/\d+/(?:dl|cr|lug)-\d+-[^<]+)</loc>", xml)))
    items = []
    for u in urls:
        slug = u.rstrip("/").split("/")[-1]
        m = re.match(r"(dl|cr|lug)-0*(\d+)-", slug)
        kind, line, cone = LINES[m.group(1)]
        code = f"{m.group(1).upper()}-{int(m.group(2)):02d}"
        try: page = ci.get(u)
        except Exception as e: print("skip", u, e); continue
        t = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)', page)
        name = html.unescape(t.group(1) if t else slug).split("|")[0]
        name = re.sub(r"(?i)^\s*(amaco\s*)?(dl|cr|lug)[\s-]*\d+\s*", "", name)
        name = re.sub(r"(?i)\s*(-\s*)?(\d+\s*lbs?\.?\s*dry|\d+\s*oz\.?|pint|underglaze)\b.*$", "", name).strip(" -,")
        name = re.sub(r"(?i)\s+crawl$", "", name)
        if re.fullmatch(r"(?i)(speckled\s+)?flux", name): name += " Crawl"
        size = "10 lb dry" if m.group(1) == "dl" else "2 oz" if slug.endswith("2oz") else "Pint"
        pr = re.search(r'"price"\s*:\s*"?(\d+(?:\.\d+)?)', page)
        items.append({"kind": kind, "brand": "Amaco", "line": line, "code": code, "name": name, "cone": cone, "url": u, "size": size,
                      **({"price": pr.group(1)} if pr else {})})
        print(code, name, size, pr and pr.group(1), flush=True)
        time.sleep(1)
    json.dump(items, open(OUT, "w"), indent=0)
    print(len(items), "Amaco DL/CR/LUG ->", OUT)


if __name__ == "__main__":
    main()
