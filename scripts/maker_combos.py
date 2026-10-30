"""Glaze combos published by the makers -> catalog/maker-combos.json (embedded as <script id="makerCombos"> by embed_catalog.py).

  python3 scripts/maker_combos.py [amaco-layering.json]

Mayco: every combo page and its photo are listed in the public Yoast sitemaps (glazecombo-sitemap*.xml), so no page is crawled.
Amaco: amaco.com sits behind a browser check (and asks for 30 s between requests), so its Layering list is read in a real
browser tab, one list page per 30 s (/resources/layering/api?page=N; .card-combination title, link, photo), and saved as
JSON rows [title, url, img]; pass that file here. Without it the previous Amaco rows are kept.
Photos stay hotlinked with a link back to the maker's page. Kept: combos with at least one cone 5-6 layer.

Output: {"glazes": [[brand, code, name]], "combos": [[maker, top, base, img, url]]} where top/base index glazes and
img/url drop the maker's common prefix (PREFIX below; the app adds it back)."""
import json, os, re, sys, time, urllib.request

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(R, "catalog", "maker-combos.json")
UA = "Mozilla/5.0 (Macintosh) ClayworksStudio/1.0 (personal studio tool)"
PREFIX = {"Mayco": ("https://www.maycocolors.com/wp-content/uploads/", "https://www.maycocolors.com/glaze-combos/"),
          "Amaco": ("https://amaco.com/asset/", "https://amaco.com/resources/layering/")}
# lines that fire at cone 5-6 (a combo needs one of these to be kept)
MID = {"Mayco": {"SW", "SSW", "S", "SC"}, "Amaco": {"PC", "C", "HF", "SM", "DL", "PF", "PG", "TX", "CR", "V", "LUG", "SH", "A", "AR", "OC"}}


def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60).read().decode("utf-8", "replace")


def catalog_names():
    cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
    out = {}
    for it in cat:
        if it.get("brand") in PREFIX and it.get("code"):
            out[(it["brand"], norm_code(it["code"]))] = it["name"]
    return out


def norm_code(c):
    m = re.match(r"([A-Za-z]+)[\s-]*0*(\d+)", c.strip())
    return f"{m.group(1).upper()}-{int(m.group(2)):02d}" if m else c.upper()


CODE = re.compile(r"\b(ssw|sw|cg|el|sc|sp|sg|fn|eg|s|pc|c|hf|sm|dl|pf|pg|tx|cr|v|lug|lg|o|f|ug|sh|a|ar|oc|ht|gl|tp)[\s_-]?(\d{1,4})\b", re.I)


def parse(title):
    """'SW-171 Enchanted Forest over SW-251 Pink Opal' (or a slug) -> [(code, name) top..base], or None."""
    t = re.sub(r"[-_]+", " ", title)
    t = re.sub(r"(?i)\s+on\s+.*$", "", t)            # "... on EG002 Speckled Buff Engobe" (the clay, not a layer)
    t = re.sub(r"\s+\d$", "", t.strip())              # slug "-2" duplicates
    under = re.search(r"(?i)\bunder\s*(?=[a-z]+\s?\d)", t)
    ms = list(CODE.finditer(t))
    if len(ms) < 2: return None
    layers = []
    for i, m in enumerate(ms):
        end = ms[i + 1].start() if i + 1 < len(ms) else len(t)
        name = re.sub(r"(?i)\s*(over|under)\s*$", "", t[m.end():end]).strip(" ,")
        name = re.sub(r"(?i)over$", "", name).strip()
        layers.append((norm_code(m.group(1) + "-" + m.group(2)), name))
    return layers[::-1] if under else layers


def mayco():
    rows, i = [], 1
    while True:
        u = "https://www.maycocolors.com/glazecombo-sitemap%s.xml" % ("" if i == 1 else i)
        try: s = get(u)
        except Exception: break
        found = re.findall(r"<url>(.*?)</url>", s, re.S)
        if not found: break
        for x in found:
            loc = re.search(r"<loc>([^<]+)", x).group(1); im = re.search(r"<image:loc>([^<]+)", x)
            rows.append([loc.rstrip("/").split("/")[-1], loc, im.group(1) if im else ""])
        i += 1; time.sleep(1)
    return rows


def main():
    names = catalog_names()
    prev = json.load(open(OUT)) if os.path.exists(OUT) else {"glazes": [], "combos": []}
    src = {"Mayco": mayco()}
    if len(sys.argv) > 1:
        src["Amaco"] = [[t, u, im] for t, u, im in json.load(open(sys.argv[1]))]
    glazes, gi, combos, seen, skipped = [], {}, [], set(), 0

    def gid(brand, code, name):
        k = (brand, code)
        if k not in gi:
            nm = names.get(k) or " ".join(w.capitalize() if w.islower() else w for w in name.split())
            gi[k] = len(glazes); glazes.append([brand, code, nm])
        return gi[k]

    for maker, rows in src.items():
        ip, up = PREFIX[maker]
        for title, url, img in rows:
            ls = parse(title)
            if not ls or len(ls) != 2 or not any(c.split("-")[0] in MID[maker] for c, _ in ls): skipped += 1; continue
            top, base = (gid(maker, c, n) for c, n in ls)
            if (maker, top, base) in seen: continue
            seen.add((maker, top, base))
            img = re.sub(r"\?.*$", "", img or "")
            combos.append([maker, top, base, img[len(ip):] if img.startswith(ip) else img, url[len(up):] if url.startswith(up) else url])
    # keep earlier rows from makers not refreshed this run
    for m, t, b, img, url in prev["combos"]:
        if m in src: continue
        bt, bb = prev["glazes"][t], prev["glazes"][b]
        combos.append([m, gid(*bt), gid(*bb), img, url])
    json.dump({"glazes": glazes, "combos": combos}, open(OUT, "w"), separators=(",", ":"))
    by = {}
    for c in combos: by[c[0]] = by.get(c[0], 0) + 1
    print(by, "combos,", len(glazes), "glazes,", skipped, "skipped ->", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
