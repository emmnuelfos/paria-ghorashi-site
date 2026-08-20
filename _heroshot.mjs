import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const TAG=process.env.SHOT_TAG||"before";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for (const [label,vp,mob] of [["desktop",{width:1920,height:1000},false],["laptop",{width:1440,height:900},false],["mobile",{width:390,height:844},true]]) {
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:mob?3:1,isMobile:mob,hasTouch:mob,
    ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.waitForTimeout(1800);
  await p.evaluate(()=>{const c=document.querySelector(".pg-cookie");if(c)c.classList.add("pg-cookie--hidden");});
  await p.screenshot({path:`_hero_${TAG}_${label}.png`});
  await ctx.close();
}
await b.close();
console.log("shots:", TAG);
