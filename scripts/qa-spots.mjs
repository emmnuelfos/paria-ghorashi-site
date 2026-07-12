/**
 * Spot-check captures: hero at rest + footer end state.
 */
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => console.log('PAGE-ERROR:', String(e).slice(0, 200)));

await page.goto('http://localhost:3010/', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(7000);
await page.screenshot({ path: 'docs/design-references/paria-spot-hero.png' });

const total = await page.evaluate(() => document.body.scrollHeight);
await page.evaluate((y) => window.scrollTo(0, y), total);
await page.waitForTimeout(2500);
await page.screenshot({ path: 'docs/design-references/paria-spot-footer.png' });

await browser.close();
console.log('DONE', total);
