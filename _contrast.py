
import json, numpy as np
from PIL import Image

def lin(c):
    c = c / 255.0
    return np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def lum(a):
    a = a.astype(float)
    return 0.2126 * lin(a[..., 0]) + 0.7152 * lin(a[..., 1]) + 0.0722 * lin(a[..., 2])

def ratio(a, b):
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)

jobs = json.load(open("_contrast_jobs.json"))
print(f"{'viewport':9} {'element':9} {'measured':>9}  {'AA 4.5':>7}  note")
worst = {}
for j in jobs:
    on = np.array(Image.open(j["on"]).convert("RGB"))
    off = np.array(Image.open(j["off"]).convert("RGB"))
    if on.shape != off.shape:
        continue
    Lon, Loff = lum(on), lum(off)
    # Glyph pixels are where hiding the text changed the frame most.
    diff = np.abs(Lon - Loff)
    if diff.max() < 0.002:
        print(f"{j['label']:9} {j['name']:9} {'--':>9}  {'--':>7}  no glyph pixels detected")
        continue
    mask = diff > (diff.max() * 0.45)          # solid glyph cores, not antialiased edges
    if mask.sum() < 12:
        mask = diff > (diff.max() * 0.25)
    text_l = float(np.median(Lon[mask]))       # the colour the glyphs actually render
    bg_l = float(np.median(Loff[mask]))        # the backdrop directly under them
    r = ratio(text_l, bg_l)
    ok = "PASS" if r >= 4.5 else ("large-text ok" if r >= 3.0 else "FAIL")
    print(f"{j['label']:9} {j['name']:9} {r:9.2f}  {'>=4.5':>7}  {ok}")
    worst[j["name"]] = min(worst.get(j["name"], 99), r)
print()
for k, v in worst.items():
    print(f"worst {k}: {v:.2f}")
