import { chromium } from "playwright-core";
import fs from "fs";
const BASE=process.env.AUDIT_BASE || "https://emmnuelfos.github.io/paria-ghorashi-site";
const doc = JSON.parse(fs.readFileSync("doc_copy.json","utf8"));
const norm=(x)=>x.toLowerCase()
  .replace(/[‘’]/g,"'").replace(/[“”]/g,'"')
  .replace(/[·–—]/g," ").replace(/\s+/g," ").trim();
const b = await chromium.launch({ channel:"msedge", headless:true, args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
const report={};
for(const [path, strings] of Object.entries(doc)){
  await p.goto(BASE+path,{waitUntil:"load",timeout:45000});
  if(path==="/"){ await p.waitForFunction(()=>!!window.__introTL,{timeout:20000}); await p.evaluate(()=>{window.__introTL.progress(1);}); await p.waitForTimeout(1200); }
  await p.evaluate(async()=>{const H=document.body.scrollHeight; for(let y=0;y<H;y+=700){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,35));}});
  await p.waitForTimeout(700);
  const raw = await p.evaluate(()=>document.body.textContent.replace(/\s+/g," "));
  const hay = norm(raw)+" ||| "+norm(raw.replace(/(\w)\1/g,"$1"));
  const missing = strings.filter(s=>!hay.includes(norm(s)));
  report[path]={total:strings.length, missing};
}
let totalMiss=0, totalAll=0;
console.log("VERBATIM FIDELITY vs Website Copy Master\n");
for(const [path,r] of Object.entries(report)){
  totalMiss+=r.missing.length; totalAll+=r.total;
  const flag = r.missing.length? "**" : "ok";
  console.log(`${flag} ${path.padEnd(20)} ${r.total-r.missing.length}/${r.total}`);
  r.missing.slice(0,6).forEach(m=>console.log(`      MISSING: ${m.slice(0,96)}`));
  if(r.missing.length>6) console.log(`      ...and ${r.missing.length-6} more`);
}
console.log(`\nTOTAL: ${totalAll-totalMiss}/${totalAll} verbatim | MISSING ${totalMiss}`);
fs.writeFileSync("verbatim_report.json", JSON.stringify(report,null,1));
await b.close();
