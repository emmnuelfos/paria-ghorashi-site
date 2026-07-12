/**
 * QA sweep — scroll-through screenshots of the CLONE (same method as recon.mjs)
 * Usage: node scripts/qa-sweep.mjs [url] [tag] [width] [height]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:3010/';
const tag = process.argv[3] ?? 'clone-1440';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);

const DR = 'docs/design-references';
mkdirSync(DR, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width, height } });
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE-ERROR:', m.text().slice(0, 300));
});
page.on('pageerror', (e) => console.log('PAGE-ERROR:', String(e).slice(0, 300)));

await page.goto(url, { waitUntil: 'load', timeout: 60000 });
// let intro play out
await page.waitForTimeout(7000);

const total = await page.evaluate(() => document.body.scrollHeight);
console.log(tag, 'scrollHeight', total);

const steps = Math.ceil(total / height);
for (let i = 0; i <= steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * height * 0.92);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${DR}/${tag}-s${String(i).padStart(2, '0')}.png` });
}
await browser.close();
console.log('DONE');
