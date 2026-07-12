import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel:'msedge', headless:true,
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport:{ width:1440, height:900 } });
page.on('pageerror',e=>console.log('ERR',String(e).slice(0,140)));
await page.goto('http://localhost:3010/',{waitUntil:'load',timeout:60000});
await page.waitForTimeout(7500);
// find absolute Y of #about-photo-wrap and #projects
const pos = await page.evaluate(()=>{
  const y=id=>{const el=document.getElementById(id);const r=el?.getBoundingClientRect();return el?Math.round(r.top+window.scrollY):null;};
  return { photo:y('about-photo-wrap'), projects:y('projects'), doc:document.body.scrollHeight };
});
console.log(JSON.stringify(pos));
const shots=[];
// about photo entering (top just in view) and settled
shots.push(['about_enter', pos.photo - 780]);
shots.push(['about_mid',   pos.photo - 300]);
// projects previews at several depths
for (let i=0;i<4;i++) shots.push([`proj_${i}`, pos.projects + 300 + i*520]);
for (const [tag,y] of shots){
  await page.evaluate(yy=>window.scrollTo(0,yy), Math.max(0,y));
  await page.waitForTimeout(1400);
  await page.screenshot({ path:`docs/design-references/fix_${tag}.png` });
  console.log('shot',tag,Math.round(y));
}
await browser.close(); console.log('DONE');
