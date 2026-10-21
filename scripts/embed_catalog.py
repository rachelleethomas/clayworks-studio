"""Re-embed catalog/catalog.json (and catalog/glazy.json) into app/clayworks.html (<script id="catalogData"> / id="glazyData").
Run after catalog/merge_catalog.py."""
import os, re
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
page = os.path.join(R, "app", "clayworks.html")
s = open(page).read()
data = open(os.path.join(R, "catalog", "catalog.json")).read().replace("</", "<\\/")
new, n = re.subn(r'(<script type="application/json" id="catalogData">)(.*?)(</script>)', lambda m: m.group(1) + data + m.group(3), s, count=1, flags=re.S)
assert n == 1, "catalogData block not found"
gpath = os.path.join(R, "catalog", "glazy.json")
if os.path.exists(gpath):  # Glazy library (scripts/glazy_subset.py), CC BY-NC-SA 4.0
    g = open(gpath, encoding="utf-8").read().replace("</", "<\\/")
    new, n = re.subn(r'(<script type="application/json" id="glazyData">)(.*?)(</script>)', lambda m: m.group(1) + g + m.group(3), new, count=1, flags=re.S)
    assert n == 1, "glazyData block not found"
    print("embedded glazy", len(g), "bytes")
open(page, "w").write(new); print("embedded", len(data), "bytes")
