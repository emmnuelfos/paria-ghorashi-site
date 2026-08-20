import { chromium } from "playwright-core";
import { execFileSync } from "child_process";
import fs from "fs";

/**
 * Measures the ACTUAL rendered contrast of the hero copy against the live video
 * frame behind it, rather than trusting the declared CSS colour.
 *
 * The hero paints onto a WebGL canvas and the copy carries mix-blend-mode, so
 * neither the computed colour nor a canvas readback tells the truth. The only
 * honest measurement is pixels: shoot each text block twice — once normally and
 * once with the copy hidden — then compare the glyph pixels against the exact
 * backdrop they sit on.
 */
const B = process.env.QA_BASE || "http://localhost:4321";
const VIEWPORTS = [
  ["desktop", { width: 1920, height: 1000 }, false],
  ["laptop", { width: 1440, height: 900 }, false],
  ["mobile", { width: 390, height: 844 }, true],
];
const TARGETS = [
  ["eyebrow", ".hero-eyebrow"],
  ["headline", "#hero-tagline > span:nth-of-type(2)"],
  ["body", ".hero-support"],
];

const b = await chromium.launch({
  channel: "msedge",
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

const jobs = [];
for (const [label, vp, mob] of VIEWPORTS) {
  const ctx = await b.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: mob,
    hasTouch: mob,
    ...(mob
      ? {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        }
      : {}),
  });
  if (mob) await ctx.addInitScript(() => Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 }));
  const p = await ctx.newPage();
  await p.goto(B + "/", { waitUntil: "load" });
  await p.waitForFunction(() => !!window.__introTL, { timeout: 20000 });
  await p.evaluate(() => {
    window.__introTL.progress(1);
  });
  await p.waitForTimeout(1800);
  await p.evaluate(() => {
    const c = document.querySelector(".pg-cookie");
    if (c) c.remove();
    // Freeze the backdrop so the "with text" and "without text" frames match.
    document.querySelectorAll("video").forEach((v) => v.pause());
    if (window.gsap) window.gsap.ticker.sleep();
  });
  await p.waitForTimeout(300);

  for (const [name, sel] of TARGETS) {
    const box = await p.evaluate((s) => {
      const n = document.querySelector(s);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
    }, sel);
    if (!box) {
      console.log(`  ${label}/${name}: element not found`);
      continue;
    }
    const clip = {
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: Math.max(2, Math.round(box.width)),
      height: Math.max(2, Math.round(box.height)),
    };
    const on = `_c_${label}_${name}_on.png`;
    const off = `_c_${label}_${name}_off.png`;
    await p.screenshot({ path: on, clip });
    await p.evaluate((s) => {
      const n = document.querySelector(s);
      if (n) n.style.visibility = "hidden";
    }, sel);
    await p.waitForTimeout(120);
    await p.screenshot({ path: off, clip });
    await p.evaluate((s) => {
      const n = document.querySelector(s);
      if (n) n.style.visibility = "";
    }, sel);
    await p.waitForTimeout(120);
    jobs.push({ label, name, on, off });
  }
  await ctx.close();
}
await b.close();

fs.writeFileSync("_contrast_jobs.json", JSON.stringify(jobs));
const py = `
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
`;
fs.writeFileSync("_contrast.py", py);
console.log(execFileSync("python", ["_contrast.py"], { encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } }));
