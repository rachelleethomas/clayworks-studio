"""Re-embed catalog/catalog.json into app/clayworks.html (the <script id="catalogData"> block).
Run after catalog/merge_catalog.py."""
import os, re
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
page = os.path.join(R, "app", "clayworks.html")
s = open(page).read()
data = open(os.path.join(R, "catalog", "catalog.json")).read().replace("</", "<\\/")
new, n = re.subn(r'(<script type="application/json" id="catalogData">)(.*?)(</script>)', lambda m: m.group(1) + data + m.group(3), s, count=1, flags=re.S)
assert n == 1, "catalogData block not found"
open(page, "w").write(new); print("embedded", len(data), "bytes")
