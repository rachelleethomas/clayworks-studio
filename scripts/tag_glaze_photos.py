"""Have Claude read each premade glaze's product photo once: fired color, surface, effects, or "not a fired sample".

Writes catalog/catalog-looks.json: {"<url>|<code>|<name>": {"f":1,"h":"RRGGBB","b":"RRGGBB","s":"gloss|satin|matte|textured",
"o":"opaque|semi|transparent","e":["speckled",...],"d":"short description"}} or {"f":0} for jars, labels and logos.
scripts/embed_catalog.py attaches these as `look`; Find a premade and the Discover filters use them.

Goes through the Worker with your own login (Haiku), so it needs no API key here. It asks for your password in the terminal
and never stores it. The Worker's KV allows about 1,000 writes a day on the free plan, so calls are marked `batch` and the
run's total is added to your weekly spend once at the end (admin logins only). Photos are read once and not kept. Resumable; skips what's done.

Usage: python3 scripts/tag_glaze_photos.py [--limit N] [--api URL] [--user NAME]
"""
import argparse, base64, getpass, io, json, os, threading, time, urllib.error, urllib.parse, urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "catalog", "catalog-looks.json")
UA = "ClayworksStudio/1.0 (personal studio catalog; +https://rachelleethomas.github.io/clayworks-studio/)"
PROMPT = """This is a supplier's product photo for a ceramic glaze called "%s".
Say what the fired glaze looks like. If the photo shows no fired glaze (a jar, bag, label, logo, dry powder), set "fired" to false and leave the rest empty.
If it shows the glaze over or beside other glazes, describe only the main one if you can tell which it is.
Return JSON {"fired":true,"hex":"RRGGBB main fired color, ignoring background and highlights","break":"RRGGBB color where it breaks or pools, or empty","surface":"gloss|satin|matte|textured","opacity":"opaque|semi|transparent","effects":["any of: speckled, mottled, breaking, variegated, crystals, crawl, float, metallic, streaked"],"desc":"at most 10 plain words on how it looks"}"""

ap = argparse.ArgumentParser()
ap.add_argument("--api", default="https://clayworks-api.rachelleecampbell.workers.dev")
ap.add_argument("--user", default="rachel")
ap.add_argument("--limit", type=int, default=0)
a = ap.parse_args()

def post(path, body, token=None):
    req = urllib.request.Request(a.api + path, json.dumps(body).encode(), {"Content-Type": "application/json", "User-Agent": UA, **({"Authorization": "Bearer " + token} if token else {})})
    with urllib.request.urlopen(req, timeout=90) as r: return json.load(r)

token = post("/login", {"user": a.user, "password": getpass.getpass(f"Clayworks password for {a.user}: ")})["token"]
key = lambda it: f'{it.get("url")}|{it.get("code") or ""}|{it.get("name")}'
cat = json.load(open(os.path.join(R, "catalog", "catalog.json")))
imgs = json.load(open(os.path.join(R, "catalog", "catalog-images.json")))
done = json.load(open(OUT)) if os.path.exists(OUT) else {}
todo = [it for it in cat if it.get("kind") == "glaze" and imgs.get(key(it), {}).get("img") and key(it) not in done]
if a.limit: todo = todo[:a.limit]
print(len(todo), "glazes to read,", len(done), "already done")

locks, last, save, n, spent = defaultdict(threading.Lock), {}, threading.Lock(), [0], [0.0]
def photo(u):  # one request per second per site
    host = urllib.parse.urlparse(u).netloc
    with locks[host]:
        time.sleep(max(0, 1 - (time.time() - last.get(host, 0)))); last[host] = time.time()
    with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=30) as r: raw = r.read()
    im = Image.open(io.BytesIO(raw)).convert("RGBA"); bg = Image.new("RGBA", im.size, "white"); bg.alpha_composite(im); im = bg.convert("RGB"); im.thumbnail((384, 384))
    out = io.BytesIO(); im.save(out, "JPEG", quality=85); return base64.b64encode(out.getvalue()).decode()

def tag(it):
    k = key(it); name = " ".join(filter(None, [it.get("brand"), it.get("code"), it.get("name")]))
    try:
        res = post("/claude", {"prompt": PROMPT % name + "\n\nRespond with only the JSON, no other text.", "images": [{"type": "image/jpeg", "data": photo(imgs[k]["img"])}], "task": "default", "batch": True}, token)
        t = res["text"]; d = json.loads(t[t.index("{"): t.rindex("}") + 1]); spent[0] += res.get("cost") or 0
        hexes = lambda v: v.strip("# ").upper() if isinstance(v, str) and len(v.strip("# ")) == 6 else ""
        v = {"f": 1, "h": hexes(d.get("hex")), "b": hexes(d.get("break")), "s": str(d.get("surface") or ""), "o": str(d.get("opacity") or ""), "e": d.get("effects") or [], "d": str(d.get("desc") or "")[:90]} if d.get("fired") and hexes(d.get("hex")) else {"f": 0}
    except urllib.error.HTTPError as e:
        if e.code in (401, 403, 429): raise SystemExit(f"Stopped: {e.code} {e.read()[:200]!r}. Run again to pick up where it left off.")
        print("skip", name, e.code); return
    except Exception as e:
        print("skip", name, repr(e)[:120]); return
    with save:
        done[k] = v; n[0] += 1
        if n[0] % 25 == 0:
            json.dump(done, open(OUT, "w"), indent=0); print(n[0], "read, about $%.2f so far" % spent[0], flush=True)

try:
    with ThreadPoolExecutor(4) as ex: list(ex.map(tag, todo))
finally:
    json.dump(done, open(OUT, "w"), indent=0)
    try:
        if spent[0] and not post("/spend", {"cost": spent[0]}, token).get("ok"): print("Note: this run's cost couldn't be added to your weekly spend.")
    except Exception as e: print("Note: this run's cost couldn't be added to your weekly spend.", repr(e)[:100])
fired = sum(1 for v in done.values() if v.get("f"))
print(f"Done: {len(done)} read, {fired} show a fired glaze, about ${spent[0]:.2f} this run. Now run: python3 scripts/embed_catalog.py")
