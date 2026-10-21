"""Build catalog/glazy.json from the official Glazy export.

Source: https://github.com/derekphilipau/glazy-data (glazy_YYYYMMDD.yaml.gz, see LATEST there).
Glazy data is CC BY-NC-SA 4.0: keep attribution (author + glazy.org link) on every recipe shown.
Glazy's robots.txt blocks AI agents and /api/, /export/ on glazy.org, so only use the GitHub export.

    python3 -I scripts/glazy_subset.py <path/to/glazy_YYYYMMDD.yaml.gz>

Keeps: Type Recipe, State Production, Subtype "Glaze...", cone within 5-6 (e.g. "6", "5 - 6").
Output (compact, to keep the page small):
    {"version", "license", "materials": [names], "recipes": [
        {"i": id, "n": name, "a": author, "c": cone, "s": surface, "t": transparency,
         "m": atmospheres, "k": subtype, "d": short description,
         "g": [[material_index, pct], ...]        # base
         "x": [[material_index, pct], ...]}]}     # additions (only if any)
"""
import gzip, json, os, re, sys

KEEP_STATES = {"Production"}
DESC_MAX = 180

def unq(v):
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] == "'":
        return v[1:-1].replace("''", "'")
    if len(v) >= 2 and v[0] == v[-1] == '"':
        return v[1:-1]
    return v

def parse(path):
    """Line-based reader for the export's fixed YAML layout (no PyYAML needed)."""
    rec = ing = None
    section = None
    with gzip.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if line == "-":
                if rec: yield rec
                rec, ing, section = {}, None, None
                continue
            if rec is None: continue
            m = re.match(r"^  ([A-Z][A-Za-z ]*):(?: (.*))?$", line)
            if m:
                key, val = m.group(1), m.group(2)
                section = key if val is None else None
                if val is not None: rec[key] = unq(val)
                if key == "Ingredients": rec["Ingredients"] = []
                continue
            if section == "Created By":
                m = re.match(r"^    Name: (.*)$", line)
                if m: rec["Author"] = unq(m.group(1))
            elif section == "Ingredients":
                if line == "    -":
                    ing = {}; rec["Ingredients"].append(ing)
                    continue
                m = re.match(r"^      (ID|Name|Percentage|Additional): (.*)$", line)
                if m and ing is not None: ing[m.group(1)] = unq(m.group(2))
    if rec: yield rec

def cone_5_6(c):
    parts = [p.strip() for p in re.split(r"\s+-\s+", c or "") if p.strip()]
    try: nums = [float(p) for p in parts if not p.startswith("0")]
    except ValueError: return False
    return bool(nums) and len(nums) == len(parts) and min(nums) >= 5 and max(nums) <= 6

def atmospheres(v):
    return [unq(x) for x in re.findall(r"'[^']*'|[A-Za-z]+", (v or "").strip("[]"))]

def main(src, out):
    mats, mat_ix, recipes = [], {}, []
    def mi(name):
        if name not in mat_ix: mat_ix[name] = len(mats); mats.append(name)
        return mat_ix[name]
    for r in parse(src):
        if r.get("Type") != "Recipe" or r.get("State") not in KEEP_STATES: continue
        if not r.get("Subtype", "").startswith("Glaze") or not cone_5_6(r.get("Cone")): continue
        base, adds = [], []
        for g in r.get("Ingredients") or []:
            try: pct = round(float(g.get("Percentage", "")), 3)
            except ValueError: continue
            if pct <= 0 or not g.get("Name"): continue
            (adds if g.get("Additional") == "true" else base).append([mi(g["Name"]), pct])
        if not base: continue
        d = re.sub(r"\s+", " ", r.get("Description", "")).strip()
        item = {"i": int(r["ID"]), "n": r.get("Name", "").strip(), "a": r.get("Author", ""), "c": r.get("Cone", ""),
                "s": r.get("Surface", ""), "t": r.get("Transparency", ""), "m": atmospheres(r.get("Atmospheres")),
                "k": r.get("Subtype", ""), "d": d[:DESC_MAX] + ("…" if len(d) > DESC_MAX else ""), "g": base}
        if adds: item["x"] = adds
        recipes.append({k: v for k, v in item.items() if v not in ("", [])})
    recipes.sort(key=lambda x: x.get("n", "").lower())
    version = re.search(r"(\d{8})", os.path.basename(src))
    data = {"version": version.group(1) if version else "", "license": "CC BY-NC-SA 4.0, Glazy (glazy.org) contributors",
            "materials": mats, "recipes": recipes}
    s = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    open(out, "w", encoding="utf-8").write(s)
    print(f"{len(recipes)} recipes, {len(mats)} materials, {len(s):,} bytes -> {out}")

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, "catalog", "glazy.json"))
