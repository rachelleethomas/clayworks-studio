"""Collect Glazy photo paths from Print Recipes pages Rachel saved in her browser.

On glazy.org: filter (cone 5-6, Production, Has Photo), select up to 50 recipes, Print Recipes,
then File > Save Page As into a folder. This script never contacts Glazy; it only reads those files.

    python3 -I scripts/glazy_photos.py ~/Desktop/glazy [more folders or .html files]

Photo URLs look like https://cdn.glazy.org/public/uploads/recipes/06/l_906.6ad6e8ce631ef.jpg:
bin = last 2 digits of the id, size prefix (p/s/m/l), then <id>.<uniqid>.<ext>. The uniqid can't be
derived, so it has to come from Glazy's pages. Only ids linked as recipes on the page are kept
(material/ingredient photos use the same path).

Accumulates into catalog/glazy-photos.json ({"<id>": "06/906.6ad6e8ce631ef.jpg"}), then adds "p"
to matching recipes in catalog/glazy.json. Run scripts/embed_catalog.py afterwards.
"""
import glob, json, os, re, sys

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(R, "catalog", "glazy-photos.json")
LIB = os.path.join(R, "catalog", "glazy.json")
IMG = re.compile(r"uploads/recipes/(\d{2})/[a-z]_(\d+)\.([0-9a-f]{8,})\.(jpe?g|png|gif|webp)", re.I)
LINK = re.compile(r'href="(?:https://glazy\.org)?/recipes/(\d+)')

def pages(args):
    for a in args:
        a = os.path.expanduser(a)
        yield from (sorted(glob.glob(os.path.join(a, "*.htm*"))) if os.path.isdir(a) else [a])

def main(args):
    photos = json.load(open(PHOTOS)) if os.path.exists(PHOTOS) else {}
    before = len(photos)
    for path in pages(args):
        s = open(path, encoding="utf-8", errors="replace").read()
        recipes = {int(x) for x in LINK.findall(s)}
        found = 0
        for b, i, code, ext in IMG.findall(s):
            if int(i) in recipes and str(int(i))[-2:].zfill(2) == b:
                photos[str(int(i))] = f"{b}/{int(i)}.{code}.{ext.lower()}"; found += 1
        print(f"{os.path.basename(path)}: {len(recipes)} recipes linked, {found} photo refs")
    json.dump(dict(sorted(photos.items(), key=lambda kv: int(kv[0]))), open(PHOTOS, "w"), indent=0)
    lib = json.load(open(LIB, encoding="utf-8"))
    n = 0
    for r in lib["recipes"]:
        p = photos.get(str(r["i"]))
        if p: r["p"] = p; n += 1
    open(LIB, "w", encoding="utf-8").write(json.dumps(lib, ensure_ascii=False, separators=(",", ":")))
    print(f"photos known: {len(photos)} (+{len(photos) - before}); library recipes with a photo: {n} of {len(lib['recipes'])}")

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1:])
