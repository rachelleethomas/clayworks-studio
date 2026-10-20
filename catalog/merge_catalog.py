import json, glob, os, re, sys
D = os.path.dirname(os.path.abspath(__file__)); SRCDIR = os.path.join(D, "sources")
SRC = {"laguna": "Laguna Clay", "alligator": "Alligator Clay", "sheffield": "Sheffield Pottery",
       "ceramicshop": "The Ceramic Shop", "bailey": "Bailey Pottery", "dogwood": "Dogwood Ceramics", "pasler": "Pasler"}
KINDS = {"clay", "glaze", "underglaze", "stain", "chemical"}
def clean(v): return re.sub(r"\s+", " ", str(v or "")).strip()
def key(it):
    code = re.sub(r"[^a-z0-9]", "", it.get("code", "").lower())
    brand = it.get("brand", "").lower()
    if code: return f"{it['kind']}|{brand}|{code}"
    return f"{it['kind']}|{brand}|{it.get('line','').lower()}|{re.sub(r'[^a-z0-9]','',it['name'].lower())}"
out, idx, counts = [], {}, {}
for f in sorted(glob.glob(os.path.join(SRCDIR, "catalog-*.json"))):
    tag = os.path.basename(f)[8:-5]
    try: data = json.load(open(f))
    except Exception as e: print("skip", f, e); continue
    src = SRC.get(tag, tag); counts[src] = 0
    for raw in data if isinstance(data, list) else []:
        if not isinstance(raw, dict): continue
        it = {k: clean(raw.get(k)) for k in ("kind","brand","line","code","name","cone","url")}
        it["kind"] = it["kind"].lower()
        if it["kind"] not in KINDS or not it["name"]: continue
        if it["url"] and not it["url"].startswith("https://"): it["url"] = ""
        ALIAS={"standard ceramic supply":"Standard","standard ceramic":"Standard","amaco/brent":"Amaco","american art clay":"Amaco"}
        it["brand"]=ALIAS.get(it["brand"].lower(),it["brand"])
        if it["kind"]=="stain" and ("mason" in (it["brand"]+" "+it["line"]).lower() or re.fullmatch(r"6\d{3}",it["code"])):
            it["brand"], it["line"] = "Mason", ""
            m = re.search(r"\b(6\d{3})\b", it["code"] + " " + it["name"])
            if m: it["code"] = m.group(1)
            it["name"] = re.sub(r"^(mason\s+)?(stain\s+)?#?\d{4}\s*", "", it["name"], flags=re.I).strip() or it["name"]
        it = {k: v for k, v in it.items() if v}
        it["source"] = src; counts[src] += 1
        k = key(it)
        if k in idx:
            ex = idx[k]
            if src not in ex["source"].split(", "): ex["source"] += ", " + src
            for f2 in ("line", "cone", "url"):
                if f2 not in ex and f2 in it: ex[f2] = it[f2]
        else:
            idx[k] = it; out.append(it)
json.dump(out, open(os.path.join(D, "catalog.json"), "w"), separators=(",", ":"))
by = {}
for it in out: by[it["kind"]] = by.get(it["kind"], 0) + 1
print("per store:", counts); print("unique:", len(out), by)
print("bytes:", os.path.getsize(os.path.join(D, "catalog.json")))
