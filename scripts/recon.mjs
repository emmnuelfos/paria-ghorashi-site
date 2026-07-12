/**
 * Reconnaissance script — lukebaffait.fr
 * Drives system Edge via playwright-core: scroll-through screenshots,
 * global extraction (fonts, colors, libs, assets), saved to docs/.
 */
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const DR = 'docs/design-references';
const RS = 'docs/research';
mkdirSync(DR, { recursive: true });
mkdirSync(RS, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function sweep(width, height, tag) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('https://lukebaffait.fr/', { waitUntil: 'networkidle', timeout: 60000 });
  // let preloader play out
  await page.waitForTimeout(6500);

  // total scroll height
  const total = await page.evaluate(() => document.body.scrollHeight);
  console.log(tag, 'scrollHeight', total);

  // scroll through slowly to trigger all reveals, screenshot each viewport step
  const steps = Math.ceil(total / height);
  for (let i = 0; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * height * 0.92);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${DR}/${tag}-s${String(i).padStart(2, '0')}.png` });
  }
  return page;
}

// Desktop sweep + global extraction on the same page
const page = await sweep(1440, 900, 'orig-1440');

// ---- global extraction (run at end of scroll, everything revealed) ----
const globals = await page.evaluate(() => {
  const fonts = {};
  ['h1','h2','h3','h4','p','a','button','span','li','body'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      const cs = getComputedStyle(el);
      const key = cs.fontFamily;
      fonts[key] = fonts[key] || { sizes: new Set(), weights: new Set(), els: new Set() };
      fonts[key].sizes.add(cs.fontSize);
      fonts[key].weights.add(cs.fontWeight);
      fonts[key].els.add(sel);
    });
  });
  const fontsOut = {};
  Object.entries(fonts).forEach(([k, v]) => {
    fontsOut[k] = { sizes: [...v.sizes].slice(0, 12), weights: [...v.weights], els: [...v.els] };
  });

  const colors = {};
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    [cs.color, cs.backgroundColor, cs.borderColor].forEach(c => {
      if (c && c !== 'rgba(0, 0, 0, 0)') colors[c] = (colors[c] || 0) + 1;
    });
  });
  const topColors = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 24);

  const links = [...document.querySelectorAll('link')].map(l => ({ rel: l.rel, href: l.href, as: l.as || null })).filter(l => /font|icon|manifest|preload|stylesheet/.test(l.rel + (l.as || '')));

  const images = [...document.querySelectorAll('img')].map(img => ({
    src: img.currentSrc || img.src, alt: img.alt, w: img.naturalWidth, h: img.naturalHeight,
    cls: (img.className || '').toString().slice(0, 80),
    parent: img.parentElement ? img.parentElement.tagName + '.' + (img.parentElement.className || '').toString().split(' ')[0] : null
  }));

  const videos = [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src, poster: v.poster, autoplay: v.autoplay, loop: v.loop, muted: v.muted, cls: (v.className || '').toString().slice(0, 80)
  }));

  const bgImgs = [];
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none' && bg.includes('url')) bgImgs.push({ bg: bg.slice(0, 300), el: el.tagName + '.' + (el.className || '').toString().split(' ')[0] });
  });

  const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);
  const libs = {
    gsap: !!window.gsap, ScrollTrigger: !!(window.gsap && window.ScrollTrigger), lenis: !!(window.Lenis || document.querySelector('.lenis, [class*="lenis"]')),
    barba: !!window.barba, three: !!window.THREE,
    lenisClasses: document.documentElement.className,
    canvases: [...document.querySelectorAll('canvas')].map(c => ({ w: c.width, h: c.height, cls: (c.className||'').toString(), parent: c.parentElement ? c.parentElement.tagName + '.' + (c.parentElement.className||'').toString().split(' ')[0] : null }))
  };

  const sections = [...document.querySelectorAll('body > *, main > *, .main > *, #main > *, section, header, footer, nav')].slice(0, 60).map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { tag: el.tagName, id: el.id || null, cls: (el.className || '').toString().slice(0, 100), top: Math.round(r.top + window.scrollY), h: Math.round(r.height), pos: cs.position, z: cs.zIndex, display: cs.display };
  }).filter(s => s.h > 0 || s.pos === 'fixed');

  return { fontsOut, topColors, links, images, videos, bgImgs, scripts, libs, sections, title: document.title, bodyClass: document.body.className, htmlClass: document.documentElement.className };
});

writeFileSync(`${RS}/globals.json`, JSON.stringify(globals, null, 2));
console.log('globals saved. libs:', JSON.stringify(globals.libs).slice(0, 400));
console.log('scripts:', globals.scripts.join('\n'));

await page.close();

// Mobile sweep
const mp = await sweep(390, 844, 'orig-390');
await mp.close();

await browser.close();
console.log('DONE');
