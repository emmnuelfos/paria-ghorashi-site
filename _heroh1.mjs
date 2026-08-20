import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const ROUTES=["/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for(const [lab,vp,mob] of [["DESKTOP 1920",{width:1920,height:1000},false],["MOBILE 390",{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
   ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  console.log(`\n=== ${lab} ===`);
  for(const r of ROUTES){
    await p.goto(B+r,{waitUntil:"load",timeout:45000});
    await p.waitForTimeout(300);
    const d=await p.evaluate(()=>{
      const h=document.querySelector(".pg-hero .pg-h1")||document.querySelector(".pg-h1");
      if(!h) return null;
      const c=getComputedStyle(h), r=h.getBoundingClientRect();
      const fs=parseFloat(c.fontSize), lh=parseFloat(c.lineHeight);
      const txt=(h.textContent||"").trim();
      return {chars:txt.length, fs:Math.round(fs), lines:Math.round(r.height/lh), h:Math.round(r.height),
        vhPct:Math.round(r.height/innerHeight*100), maxW:c.maxWidth, w:Math.round(r.width), t:txt.slice(0,30)};
    });
    if(!d){console.log(`  ${r} — no h1`);continue;}
    const flag=d.vhPct>70?" **":"";
    console.log(`  ${r.padEnd(19)} ${String(d.chars).padStart(3)}ch  ${String(d.fs).padStart(3)}px  ${String(d.lines).padStart(2)} lines  ${String(d.h).padStart(4)}px = ${String(d.vhPct).padStart(3)}% of viewport${flag}`);
  }
  await ctx.close();
}
await b.close();
