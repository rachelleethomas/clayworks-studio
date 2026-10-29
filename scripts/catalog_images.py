"""Find a product photo for each premade glaze/underglaze in catalog/catalog.json and sample its glaze color.

Writes catalog/catalog-images.json: {"<url>|<code>|<name>": {"img": photo URL, "ph": "RRGGBB" or ""}}.
scripts/embed_catalog.py attaches these to the catalog as `img` / `ph`.

Polite: one request per second per site, honest user agent, robots.txt allows /products pages on every
site used (checked Oct 22 2026). Photos are linked (hotlinked), not copied into the repo.
  - Shopify stores (Sheffield, Laguna): /products/<handle>.json; on range pages ("PC-38 to PC-71")
    each color variant points at its own image, matched by product code.
  - Pasler (WooCommerce, no og:image): the public Store API's product images, matched by permalink.
  - Everything else (Alligator Clay, Bailey): the page's og:image.
  - No photo at the product's own URL: try its other store offers (e.g. a Laguna dry glaze → the pint page).
Color: shrink the photo, estimate the background from its border, drop background pixels,
take the biggest remaining color cluster. Rough, since photos show pots and tiles, but far
closer than guessing from the product name.

Usage: python3 -I scripts/catalog_images.py [--limit N]   (resumable; skips keys already done)
"""
import io, json, os, re, sys, threading, time, urllib.parse, urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "catalog-images.json")
UA = "ClayworksStudio/1.0 (personal studio catalog; +https://rachelleethomas.github.io/clayworks-studio/)"
SHOPIFY = {"www.sheffield-pottery.com", "www.lagunaclay.com"}

def key(it): return f'{it["url"]}|{it.get("code") or ""}|{it["name"]}'

_last = defaultdict(float); _lock = defaultdict(threading.Lock)
def get(url, binary=False):
    host = urllib.parse.urlparse(url).netloc
    if not host.endswith(("shopify.com", "cloudfront.net")):  # rate-limit the stores, not their CDNs
        with _lock[host]:
            wait = 1.0 - (time.time() - _last[host])
            if wait > 0: time.sleep(wait)
            _last[host] = time.time()
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=25) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")

_pages = {}; _plock = threading.Lock()
def page(url):
    """Cache per URL: range pages are shared by many products."""
    with _plock:
        if url in _pages: return _pages[url]
        _pages[url] = ev = threading.Event(), None
    host = urllib.parse.urlparse(url).netloc
    try:
        if host == "pasler-art.com":
            api = json.loads(get("https://pasler-art.com/wp-json/wc/store/v1/products?per_page=100"))
            hit = next((x for x in api if x.get("permalink", "").rstrip("/") == url.rstrip("/")), None)
            res = {"kind": "og", "first": hit["images"][0]["src"] if hit and hit.get("images") else ""}
        elif host in SHOPIFY:
            p = json.loads(get(url.split("?")[0] + ".json"))["product"]
            imgs = {i["id"]: i["src"] for i in p.get("images", [])}
            res = {"kind": "shopify", "first": p["images"][0]["src"] if p.get("images") else "",
                   "variants": [(v.get("title") or "", imgs.get(v.get("image_id"))) for v in p.get("variants", [])], "n": len(p.get("variants", []))}
        else:
            html = get(url)
            m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', html) or \
                re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image', html)
            res = {"kind": "og", "first": m.group(1) if m else ""}
    except Exception as e:
        res = {"kind": "error", "first": "", "err": str(e)[:80]}
    with _plock: _pages[url] = (ev[0], res)
    ev[0].set(); return res

def wait_page(url):
    with _plock: v = _pages.get(url)
    if v and v[1] is not None: return v[1]
    if v: v[0].wait(60); return _pages[url][1]
    return page(url)

def norm(s): return re.sub(r"[^a-z0-9]", "", (s or "").lower())

def pick(it, pg, shared):
    if not pg or not pg.get("first"): return ""
    if pg["kind"] == "shopify" and pg["n"] > 1:
        code, name = norm(it.get("code")), norm(it["name"])
        for title, src in pg["variants"]:
            t = norm(title.split("/")[0])
            if src and ((code and t.startswith(code)) or (name and name in t)): return src
        return "" if shared else pg["first"]
    return "" if shared else pg["first"]

def sized(src, w=360):
    if "cdn.shopify.com" in src: return src + ("&" if "?" in src else "?") + f"width={w}"
    return src

def color(img_bytes):
    im = Image.open(io.BytesIO(img_bytes)).convert("RGBA"); im.thumbnail((120, 120))
    W, H = im.size; px = im.load()
    border = [px[x, y] for x in range(W) for y in (0, 1, H - 2, H - 1)] + [px[x, y] for y in range(H) for x in (0, 1, W - 2, W - 1)]
    border = [p[:3] for p in border if p[3] > 200]
    bg = tuple(sorted(c[i] for c in border)[len(border) // 2] for i in range(3)) if border else (255, 255, 255)
    keep = []
    for y in range(int(H * .1), int(H * .9)):
        for x in range(int(W * .1), int(W * .9)):
            r, g, b, a = px[x, y]
            if a < 200: continue
            if sum((c - d) ** 2 for c, d in zip((r, g, b), bg)) < 34 ** 2: continue
            keep.append((r, g, b))
    if len(keep) < 0.08 * W * H: return ""
    q = Image.new("RGB", (len(keep), 1)); q.putdata(keep)
    q = q.quantize(colors=5, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette(); counts = sorted(q.getcolors(), reverse=True)
    n, idx = counts[0]
    r, g, b = pal[idx * 3:idx * 3 + 3]
    return f"{r:02X}{g:02X}{b:02X}"

def main():
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
    cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
    items = [x for x in cat if x["kind"] in ("glaze", "underglaze") and x.get("url")]
    uses = defaultdict(int)
    for x in items: uses[x["url"]] += 1
    done = json.load(open(OUT)) if os.path.exists(OUT) else {}
    todo = [x for x in items if key(x) not in done][:limit]
    print(f"{len(items)} products, {len(done)} done, {len(todo)} to go", flush=True)
    lock = threading.Lock(); n = [0]
    def work(it):
        urls = [it["url"]] + [o["url"] for o in it.get("offers", []) if o.get("url") and o["url"] != it["url"]]
        src = ""
        for u in urls:
            src = pick(it, wait_page(u), uses[u] > 1 if u == it["url"] else True)
            if src: break
        hexv = ""
        if src:
            try: hexv = color(get(sized(src, 240), binary=True))
            except Exception: hexv = ""
        with lock:
            done[key(it)] = {"img": sized(src) if src else "", "ph": hexv}
            n[0] += 1
            if n[0] % 50 == 0:
                json.dump(done, open(OUT, "w"), separators=(",", ":"))
                print(f"{n[0]}/{len(todo)}", flush=True)
    # group by host so each site is crawled at its own polite pace, in parallel with the others
    with ThreadPoolExecutor(max_workers=6) as ex: list(ex.map(work, todo))
    json.dump(done, open(OUT, "w"), separators=(",", ":"), sort_keys=True)
    have = sum(1 for v in done.values() if v["img"]); col = sum(1 for v in done.values() if v["ph"])
    print(f"done: {len(done)} products, {have} with a photo, {col} with a sampled color", flush=True)

if __name__ == "__main__":
    main()
