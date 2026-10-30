"""Re-embed catalog/catalog.json (and catalog/glazy.json) into app/clayworks.html (<script id="catalogData"> / id="glazyData").
Run after catalog/merge_catalog.py."""
import os, re
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
page = os.path.join(R, "app", "clayworks.html")
s = open(page).read()
import json
cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
ipath = os.path.join(R, "catalog", "catalog-images.json")  # scripts/catalog_images.py: product photo + sampled color
if os.path.exists(ipath):
    imgs = json.load(open(ipath)); hit = 0
    for it in cat:
        v = imgs.get(f'{it.get("url")}|{it.get("code") or ""}|{it.get("name")}')
        if v and v.get("img"): it["img"] = v["img"]; hit += 1
        if v and v.get("ph"): it["ph"] = v["ph"]
    print("attached photos to", hit, "products")
ppath = os.path.join(R, "catalog", "catalog-prices.json")  # scripts/catalog_prices.py: per-pound price, smallest bag
if os.path.exists(ppath):
    prices = json.load(open(ppath)); hit = 0
    for it in cat:
        v = prices.get(f'{it.get("url")}|{it.get("code") or ""}|{it.get("name")}')
        if v: it["perLb"] = v["perLb"]; it["size"] = v["size"]; it["sizes"] = v.get("sizes") or [[float(v["size"].split()[0]), v["price"]]]; hit += 1
    print("attached prices to", hit, "products")
# stores added from their sitemaps (scripts/ceramicshop_offers.py, scripts/bailey_offers.py): links + prices per glaze
for fname, store in (("catalog-ceramicshop.json", "The Ceramic Shop"), ("catalog-bailey.json", "Bailey Pottery")):
    spath = os.path.join(R, "catalog", fname)
    if not os.path.exists(spath): continue
    extra = json.load(open(spath)); hit = 0
    for it in cat:
        v = extra.get(f'{it["kind"]}|{it.get("brand","")}|{it.get("code","")}|{it["name"]}')
        if not v: continue
        offs = it.get("offers") or ([{"store": (it.get("source") or "").split(", ")[0], "url": it["url"]}] if it.get("url") else [])
        offs = [o for o in offs if o.get("store") != store]
        main = next((x for x in v if x["size"] == "Pint"), v[0])
        offs.append({"store": store, "url": main["url"], "sizes": [[x["size"], x["price"]] for x in sorted(v, key=lambda x: x["price"]) if x["price"]]})
        it["offers"] = offs; hit += 1
        if store not in (it.get("source") or ""): it["source"] = ", ".join(filter(None, [it.get("source"), store]))
        if not it.get("url"): it["url"] = main["url"]  # glazes only this store sells now have a link, so they show as Premade
    print(f"attached {store} to", hit, "glazes")
apath = os.path.join(R, "catalog", "sources", "catalog-ceramicshop-amaco.json")  # scripts/amaco_ceramicshop.py: size per page
if os.path.exists(apath):
    asz = {}
    for x in json.load(open(apath)):
        if x.get("price"): asz.setdefault(x["code"], []).append([x["size"], float(x["price"])])
    for it in cat:
        v = asz.get(it.get("code")) if it.get("brand") == "Amaco" else None
        if not v: continue
        it["offers"] = [o for o in (it.get("offers") or []) if o.get("store") != "The Ceramic Shop"] + \
            [{"store": "The Ceramic Shop", "url": it["url"], "sizes": sorted(v, key=lambda x: x[1])}]
gpath = os.path.join(R, "catalog", "catalog-glaze-prices.json")  # scripts/catalog_glaze_prices.py: sizes + prices per store
if os.path.exists(gpath):
    gp = json.load(open(gpath)); hit = 0
    for it in cat:
        if it.get("kind") not in ("glaze", "underglaze"): continue
        offs = it.get("offers") or ([{"store": (it.get("source") or "").split(", ")[0], "url": it["url"]}] if it.get("url") else [])
        for o in offs:
            v = gp.get(f'{o.get("url", "")}|{it.get("code") or ""}|{it.get("name")}')
            if v and not o.get("sizes"): o["sizes"] = v; hit += 1
        if offs: it["offers"] = offs
    print("attached glaze prices to", hit, "store offers")
data = json.dumps(cat, separators=(",", ":"), ensure_ascii=False).replace("</", "<\\/")
new, n = re.subn(r'(<script type="application/json" id="catalogData">)(.*?)(</script>)', lambda m: m.group(1) + data + m.group(3), s, count=1, flags=re.S)
assert n == 1, "catalogData block not found"
gpath = os.path.join(R, "catalog", "glazy.json")
if os.path.exists(gpath):  # Glazy library (scripts/glazy_subset.py), CC BY-NC-SA 4.0
    g = open(gpath, encoding="utf-8").read().replace("</", "<\\/")
    new, n = re.subn(r'(<script type="application/json" id="glazyData">)(.*?)(</script>)', lambda m: m.group(1) + g + m.group(3), new, count=1, flags=re.S)
    assert n == 1, "glazyData block not found"
    print("embedded glazy", len(g), "bytes")
mpath = os.path.join(R, "catalog", "material-prices.json")  # scripts/material_prices.py
if os.path.exists(mpath):
    mp = open(mpath, encoding="utf-8").read().replace("</", "<\\/")
    new, n = re.subn(r'(<script type="application/json" id="matPrices">)(.*?)(</script>)', lambda m: m.group(1) + mp + m.group(3), new, count=1, flags=re.S)
    assert n == 1, "matPrices block not found"; print("embedded material prices", len(mp), "bytes")
kpath = os.path.join(R, "catalog", "maker-combos.json")  # scripts/maker_combos.py: Amaco + Mayco combo tiles
if os.path.exists(kpath):
    mk = open(kpath, encoding="utf-8").read().replace("</", "<\\/")
    new, n = re.subn(r'(<script type="application/json" id="makerCombos">)(.*?)(</script>)', lambda m: m.group(1) + mk + m.group(3), new, count=1, flags=re.S)
    assert n == 1, "makerCombos block not found"; print("embedded maker combos", len(mk), "bytes")
open(page, "w").write(new); print("embedded", len(data), "bytes")
