import { chromium } from "playwright-core";

/**
 * Detects text whose glyphs physically overlap an image or another text block.
 *
 * Added after the S4 headline was found running across the portrait at 1600,
 * 1440, 1280 and 1024 — every common desktop width except the 1920 I happened
 * to test. Nothing in QA looked for collisions, only for heights and contrast.
 *
 * Uses Range client rects (the actual glyph boxes) rather than element boxes,
 * so a wide block with short lines is not reported as overlapping.
 */
const B = process.env.QA_BASE || "http://localhost:4321";
const ROUTES = [
  "/", "/about/", "/work-with-paria/", "/consultation/", "/advisory/",
  "/partnerships/", "/services/", "/speaking/", "/media/", "/ventures/",
  "/pgpm/", "/contact/", "/privacy/", "/terms/",
];
const VIEWPORTS = [
  ["1920", { width: 1920, height: 1000 }, false],
  ["1600", { width: 1600, height: 900 }, false],
  ["1440", { width: 1440, height: 900 }, false],
  ["1280", { width: 1280, height: 800 }, false],
  ["1024", { width: 1024, height: 800 }, false],
  ["390", { width: 390, height: 844 }, true],
];

const b = await chromium.launch({
  channel: "msedge", headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

let total = 0;
for (const [label, vp, mob] of VIEWPORTS) {
  const ctx = await b.newContext({
    viewport: vp, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob,
    ...(mob ? {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    } : {}),
  });
  if (mob) await ctx.addInitScript(() => Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 }));
  const p = await ctx.newPage();
  const hits = [];
  for (const r of ROUTES) {
    await p.goto(B + r, { waitUntil: "load", timeout: 60000 });
    if (r === "/") {
      await p.waitForFunction(() => !!window.__introTL, { timeout: 20000 });
      await p.evaluate(() => { window.__introTL.progress(1); });
      await p.waitForTimeout(1800);
    }
    const H = await p.evaluate(() => document.body.scrollHeight);
    await p.evaluate(() => {
      document.querySelectorAll(".pg-reveal").forEach((n) => {
        n.classList.add("is-in"); n.style.opacity = "1"; n.style.transform = "none";
      });
    });

    // Check at each scroll position in VIEWPORT coordinates. A single pass in
    // document coordinates does not work on this site: the homepage animates
    // opacity and position on scroll, so after scrolling back to the top the
    // portrait and headline are invisible again and nothing is ever detected —
    // an earlier version of this scan reported the About page clean while the
    // headline was demonstrably sitting across the portrait.
    const found = [];
    const seenKeys = new Set();
    for (let y = 0; y < H; y += Math.round(vp.height * 0.6)) {
      await p.evaluate((y) => window.scrollTo(0, y), y);
      await p.waitForTimeout(260);
      const hitsHere = await p.evaluate(() => {
        const vis = (n) => {
          const c = getComputedStyle(n);
          return c.display !== "none" && c.visibility !== "hidden" && parseFloat(c.opacity) > 0.15;
        };
        const pinned = (n) => {
          for (let e = n; e && e !== document.documentElement; e = e.parentElement) {
            const pos = getComputedStyle(e).position;
            if (pos === "fixed" || pos === "sticky") return true;
            if (e.classList && (e.classList.contains("pg-cookie") ||
                e.classList.contains("proj-preview") ||
                e.classList.contains("pg-menu") ||
                // decorative backdrop, intentionally behind footer content
                e.classList.contains("footer-ascii-wrap") ||
                e.classList.contains("footer-ascii"))) return true;
          }
          return false;
        };
        const onScreen = (r) => r.bottom > 0 && r.top < window.innerHeight && r.width > 0;

        const media = [];
        document.querySelectorAll("img").forEach((n) => {
          if (!vis(n) || pinned(n)) return;
          const r = n.getBoundingClientRect();
          if (r.width < 40 || r.height < 40 || !onScreen(r)) return;
          if (r.width >= window.innerWidth * 0.95) return;
          media.push({ r, src: (n.currentSrc || n.src || "").split("/").pop().slice(0, 26) });
        });
        if (!media.length) return [];

        const out = [];
        document.querySelectorAll("h1,h2,h3,p,span,li,blockquote,a,div").forEach((n) => {
          if (!vis(n) || pinned(n)) return;
          const t = (n.textContent || "").trim();
          if (t.length < 8) return;
          if (n.querySelector("h1,h2,h3,p,li,blockquote,div,img,section")) return;
          const rg = document.createRange();
          rg.selectNodeContents(n);
          for (const r of rg.getClientRects()) {
            if (r.width < 12 || r.height < 6 || !onScreen(r)) continue;
            for (const m of media) {
              const ox = Math.min(r.right, m.r.right) - Math.max(r.left, m.r.left);
              const oy = Math.min(r.bottom, m.r.bottom) - Math.max(r.top, m.r.top);
              if (ox > 10 && oy > 6) {
                out.push({ txt: t.slice(0, 34), cls: (n.className || n.tagName).toString().slice(0, 22),
                           img: m.src, ox: Math.round(ox), oy: Math.round(oy) });
              }
            }
          }
        });
        return out;
      });
      for (const h of hitsHere) {
        const k = h.txt + "|" + h.img;
        if (seenKeys.has(k)) continue;
        seenKeys.add(k);
        found.push(h);
      }
    }

    if (found.length) {
      hits.push({ route: r, found });
      total += found.length;
    }
  }
  console.log(`\n=== ${label}px ===`);
  if (!hits.length) console.log("  no text/image collisions");
  for (const h of hits) {
    console.log(`  ** ${h.route}`);
    for (const f of h.found.slice(0, 4)) {
      console.log(`       "${f.txt}" (${f.cls}) over ${f.img}  overlap ${f.ox}x${f.oy}px`);
    }
  }
  await ctx.close();
}
await b.close();
console.log(total ? `\nCOLLISIONS: ${total}` : "\nCOLLISIONS: none");
process.exit(total ? 1 : 0);
