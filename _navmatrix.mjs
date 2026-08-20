import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"https://emmnuelfos.github.io/paria-ghorashi-site";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const PAIRS=[["/","/work-with-paria/"],["/","/about/"],["/about/","/work-with-paria/"],
["/services/","/media/"],["/contact/","/about/"],["/about/","/"]];
for(const [from,to] of PAIRS){
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  const errs=[];
  p.on("pageerror",e=>errs.push(String(e).split(":")[0]+": "+String(e).slice(0,90)));
  await p.goto(B+from,{waitUntil:"load"});
  if(from==="/"){ await p.waitForFunction(()=>!!window.__introTL,{timeout:20000}); await p.evaluate(()=>{window.__introTL.progress(1);}); await p.waitForTimeout(1800); }
  else await p.waitForTimeout(900);
  await p.evaluate(()=>{const c=document.querySelector(".pg-cookie");if(c)c.classList.add("pg-cookie--hidden");});
  const burger=await p.$(".pg-burger, .pg-header button, [aria-label*='enu']");
  if(burger){ await burger.click(); await p.waitForTimeout(800); }
  const slug=to.replace(/\//g,"")||"home";
  const sel = to==="/" ? ".pg-menu a[href$='paria-ghorashi-site/']" : `.pg-menu a[href*='${slug}']`;
  const link=await p.$(sel);
  if(!link){ console.log(`${from} -> ${to}   NO LINK (${sel})`); await ctx.close(); continue; }
  await link.click().catch(()=>{});
  await p.waitForTimeout(3000);
  const ok=await p.evaluate(()=>{
    const h=(document.querySelector("h1")?.textContent||"").trim();
    return {broken:/couldn.t load/i.test(h)||document.body.innerText.length<200, len:document.body.innerText.length, h:h.slice(0,32)};
  }).catch(()=>({broken:true,len:0,h:"EVAL FAILED"}));
  console.log(`${from.padEnd(12)} -> ${to.padEnd(20)} ${ok.broken?"** BROKEN":"ok       "}  bodyLen=${String(ok.len).padStart(5)}  h1="${ok.h}"  errs=${errs.length}`);
  if(errs.length) console.log(`      first: ${errs[0].slice(0,120)}`);
  await ctx.close();
}
await b.close();
