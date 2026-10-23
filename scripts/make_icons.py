"""Draw the home-screen icon and iPhone launch screens for the installable (GitHub) build.

The mark is the app's purple clay blob (.brand .mark: rounder on top, flatter below) on the cream background.
Writes web/icons/: icon-180.png (Apple touch icon), icon-192.png, icon-512.png, icon-maskable-512.png (Android safe zone)
and launch-<w>x<h>.png for common iPhones. web/build.py copies them next to index.html.
Usage: python3 scripts/make_icons.py
"""
import math, os
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, "web", "icons"); os.makedirs(OUT, exist_ok=True)
CREAM, PURPLE = (252, 249, 245), (113, 75, 208)
# iPhone launch screens (portrait, device pixels) and their CSS sizes + pixel ratio, for <link media>
LAUNCH = [(1290, 2796, 430, 932, 3), (1179, 2556, 393, 852, 3), (1284, 2778, 428, 926, 3), (1170, 2532, 390, 844, 3),
          (1125, 2436, 375, 812, 3), (1242, 2688, 414, 896, 3), (828, 1792, 414, 896, 2), (750, 1334, 375, 667, 2)]

def blob(draw, cx, cy, w, h):
    """CSS border-radius 50% 50% 46% 46% / 60% 60% 40% 40%: top half is taller and rounder than the bottom."""
    pts = []
    for i in range(360):
        a = math.radians(i)
        x, y = math.cos(a), math.sin(a)
        ry = h * (0.60 if y < 0 else 0.40)          # vertical radius above / below the widest line
        oy = cy - h / 2 + h * 0.60                  # widest line sits 60% down
        pts.append((cx + x * w / 2, oy + y * ry))
    draw.polygon(pts, fill=PURPLE)

def icon(size, mark=0.56, bg=CREAM):
    s = 4  # supersample, then shrink for smooth edges
    im = Image.new("RGB", (size * s, size * s), bg); d = ImageDraw.Draw(im)
    w = size * s * mark
    blob(d, size * s / 2, size * s / 2 + w * 0.02, w, w * 0.94)
    return im.resize((size, size), Image.LANCZOS)

icon(180).save(os.path.join(OUT, "icon-180.png"))
icon(192).save(os.path.join(OUT, "icon-192.png"))
icon(512).save(os.path.join(OUT, "icon-512.png"))
icon(512, mark=0.42).save(os.path.join(OUT, "icon-maskable-512.png"))  # inside Android's 80% safe circle
for w, h, *_ in LAUNCH:
    im = Image.new("RGB", (w, h), CREAM); m = icon(int(w * 0.28))
    im.paste(m, ((w - m.width) // 2, int(h * 0.42 - m.height / 2)))
    im.save(os.path.join(OUT, f"launch-{w}x{h}.png"), optimize=True)
print("wrote", len(os.listdir(OUT)), "files to web/icons/")
