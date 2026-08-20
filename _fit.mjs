import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for (const [label,vp,mob] of [["2560",{width:2560,height:1300},false],["1920",{width:1920,height:1000},false],["1440",{width:1440,height:900},false],["768",{width:768,height:1024},false],["390",{width:390,height:844},true]]) {
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
    ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.waitForTimeout(1400);
  const d=await p.evaluate(()=>{
    const tag=document.querySelector(".hero-tagline");
    const head=[...tag.children].find(n=>!n.className);
    const hs=getComputedStyle(head);
    const lines=Math.round(head.getBoundingClientRect().height/parseFloat(hs.lineHeight));
    const tr=tag.getBoundingClientRect();
    const ctas=document.querySelector(".hero-ctas");
    const cr=ctas?ctas.getBoundingClientRect():null;
    return {
      vw:innerWidth, vh:innerHeight,
      colW:Math.round(tr.width), colPct:Math.round(tr.width/innerWidth*100),
      blockTop:Math.round(tr.y), blockBottom:Math.round(tr.bottom),
      headFs:Math.round(parseFloat(hs.fontSize)*10)/10, headLines:lines,
      ctaBottom:cr?Math.round(cr.bottom):null,
      overflowsViewport: cr? cr.bottom>innerHeight : null,
    };
  });
  console.log(`${label.padStart(5)}px  col=${String(d.colW).padStart(4)}px (${String(d.colPct).padStart(2)}% of vw)  headline=${String(d.headFs).padStart(5)}px in ${d.headLines} lines  block ${d.blockTop}→${d.blockBottom}  CTA bottom=${d.ctaBottom}/${d.vh}${d.overflowsViewport?"  ** OVERFLOWS":""}`);
  await ctx.close();
}
await b.close();
