import { chromium } from "playwright-core";

/**
 * Hero SECTION height against the viewport.
 *
 * This check did not exist, which is how /work-with-paria/ shipped at 222% of
 * the screen: QA measured the hero HEADING (8-25%, fine) and never the section
 * around it. An uncapped portrait rendered 547x1658 and set the height itself.
 *
 * Desktop should essentially fit one screen. The phone stacks headline, copy
 * and portrait into one column, so it cannot — that cap exists to catch the
 * uncapped-image class of regression, not to enforce a design ideal.
 */
const B = process.env.QA_BASE || "http://localhost:4321";
const ROUTES = [
  "/about/", "/work-with-paria/", "/consultation/", "/advisory/",
  "/partnerships/", "/services/", "/speaking/", "/media/", "/ventures/",
  "/pgpm/", "/contact/", "/privacy/", "/terms/",
];
const VIEWPORTS = [
  ["DESKTOP 1440x900", { width: 1440, height: 900 }, false, 115],
  ["MOBILE 390x844", { width: 390, height: 844 }, true, 170],
];

const b = await chromium.launch({
  channel: "msedge", headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

let fails = 0;
for (const [label, vp, mob, cap] of VIEWPORTS) {
  const ctx = await b.newContext({
    viewport: vp, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob,
    ...(mob ? {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    } : {}),
  });
  if (mob) await ctx.addInitScript(() => Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 }));
  const p = await ctx.newPage();
  console.log(`\n=== ${label} — hero section vs viewport (cap ${cap}%) ===`);
  for (const r of ROUTES) {
    await p.goto(B + r, { waitUntil: "load", timeout: 45000 });
    await p.waitForTimeout(500);
    const d = await p.evaluate(() => {
      const h = document.querySelector(".pg-hero");
      if (!h) return null;
      const fig = h.querySelector(".pg-hero-figure img");
      return {
        hh: Math.round(h.getBoundingClientRect().height),
        vh: window.innerHeight,
        img: fig ? Math.round(fig.getBoundingClientRect().height) : null,
        imgW: fig ? Math.round(fig.getBoundingClientRect().width) : null,
      };
    });
    if (!d) { console.log(`  ${r} — no .pg-hero`); continue; }
    const pct = Math.round((d.hh / d.vh) * 100);
    const over = pct > cap;
    if (over) fails++;
    console.log(
      `  ${r.padEnd(19)} ${String(d.hh).padStart(5)}px = ${String(pct).padStart(3)}%` +
      `${over ? "  ** OVER CAP" : ""}   img ${d.imgW || "-"}x${d.img || "-"}`,
    );
  }
  await ctx.close();
}
await b.close();
console.log(fails ? `\nHERO HEIGHT: ${fails} page(s) over cap` : "\nHERO HEIGHT: all pages within cap");
process.exit(fails ? 1 : 0);
