"""Embed self-hosted fonts into app/clayworks.html as base64 @font-face rules.

The claude.ai artifact can only load stylesheets from Google Fonts, so fonts that
aren't on Google Fonts (Geist Pixel, OFL, from @fontsource/geist-pixel) are inlined.
Source files and licenses live in fonts/. Re-run after changing a font file.
"""
import base64, os, re

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = [  # (family, weight, file, unicode-range)
    ("Geist Pixel", 400, "fonts/geist-pixel/geist-pixel-latin-400-normal.woff2",
     "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"),
]
rules = []
for fam, w, path, rng in FONTS:
    b64 = base64.b64encode(open(os.path.join(R, path), "rb").read()).decode()
    rules.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:swap;"
                 f"src:url(data:font/woff2;base64,{b64}) format('woff2');unicode-range:{rng}}}")
block = "/* @fonts:start (scripts/embed_fonts.py; licenses in fonts/) */\n" + "\n".join(rules) + "\n/* @fonts:end */"
page = os.path.join(R, "app", "clayworks.html")
s = open(page, encoding="utf-8").read()
if "/* @fonts:start" in s:
    s = re.sub(r"/\* @fonts:start.*?/\* @fonts:end \*/", lambda m: block, s, count=1, flags=re.S)
else:
    s = s.replace("<style>\n", "<style>\n" + block + "\n", 1)
open(page, "w", encoding="utf-8").write(s)
print(f"embedded {len(FONTS)} font(s), {sum(len(r) for r in rules):,} chars")
