import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'msedge', headless: true,
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e=>console.log('PAGEERR', String(e).slice(0,160)));
page.on('console', m=>{ if(m.type()==='error') console.log('CONSOLE-ERR', m.text().slice(0,160)); });
await page.goto('http://localhost:3010/', { waitUntil:'load', timeout:60000 });
await page.waitForTimeout(7500); // intro
const vh = 900;
const shots = [ ['a', 1.6*vh], ['b', 2.8*vh], ['c', 3.9*vh] ];
for (const [tag,y] of shots){
  await page.evaluate((yy)=>window.scrollTo(0,yy), y);
  await page.waitForTimeout(1600);
  await page.screenshot({ path:`docs/design-references/reveal_${tag}.png` });
  console.log('shot', tag, 'y=',Math.round(y));
}
await browser.close(); console.log('DONE');
