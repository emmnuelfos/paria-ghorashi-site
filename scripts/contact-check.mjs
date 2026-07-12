import { chromium } from 'playwright-core';
const b=await chromium.launch({channel:'msedge',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:3010/',{waitUntil:'load',timeout:60000});
await p.waitForTimeout(7500);
const cy=await p.evaluate(()=>Math.round(document.getElementById('contact').getBoundingClientRect().top+window.scrollY));
const offs=[-780,-560,-340,-120,100];
for(let i=0;i<offs.length;i++){ await p.evaluate(y=>window.scrollTo(0,Math.max(0,y)), cy+offs[i]); await p.waitForTimeout(1500); await p.screenshot({path:`docs/design-references/cf_${i}.png`}); }
await b.close(); console.log('cy',cy);
