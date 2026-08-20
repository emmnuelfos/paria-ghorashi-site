import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});

async function trial(name, from, prep){
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,60)));
  await p.goto(B+from,{waitUntil:"load"});
  await p.waitForTimeout(1300);
  const removed = await p.evaluate(prep);
  const bg=await p.$(".pg-burger, .pg-header button, [aria-label*='enu']");
  if(bg){ await bg.click(); await p.waitForTimeout(800); }
  const l=await p.$(".pg-menu a[href*='media']");
  if(l) await l.click().catch(()=>{});
  await p.waitForTimeout(2800);
  const s=await p.evaluate(()=>({len:document.body.innerText.length,h:(document.querySelector("h1")?.textContent||"").trim().slice(0,24),url:location.pathname}))
    .catch(()=>({len:0,h:"EVAL FAILED",url:"?"}));
  const broken=s.len<200||/couldn.t load/i.test(s.h);
  console.log(`${name.padEnd(48)} ${broken?"** BROKEN":"ok       "} len=${String(s.len).padStart(5)} errs=${errs.length} prep=${removed}`);
  await ctx.close();
}

// Exactly what a consent-blocker extension does.
const killBanner = () => { const c=document.querySelector(".pg-cookie"); if(c){ c.remove(); return "banner removed"; } return "banner NOT FOUND"; };
const killRoot   = () => { const c=document.querySelector("[data-pg-consent-root]"); if(c){ c.remove(); return "root removed"; } return "root NOT FOUND"; };
const noop       = () => "untouched";

await trial("extension removes .pg-cookie -> navigate","/services/", killBanner);
await trial("extension removes consent root -> navigate","/services/", killRoot);
await trial("nothing removed -> navigate","/services/", noop);
await trial("extension removes banner on HOME -> navigate","/", killBanner);
await b.close();
