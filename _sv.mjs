import { chromium } from "playwright-core";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,
 userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"});
await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
const p=await ctx.newPage();
await p.goto("http://localhost:4321/",{waitUntil:"load"});
await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
await p.evaluate(()=>{window.__introTL.progress(1);});
const H=await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<H;y+=500){
  await p.evaluate(y=>window.scrollTo(0,y),y);
  await p.waitForTimeout(120);
  const d=await p.evaluate(()=>{
    const v=document.querySelector(".about-version"), img=document.querySelector(".about-photo");
    if(!v||!img) return null;
    const vr=v.getBoundingClientRect(), ir=img.getBoundingClientRect();
    if(vr.bottom<0||vr.top>innerHeight) return null;
    const c=getComputedStyle(v);
    const rg=document.createRange(); rg.selectNodeContents(v);
    const rects=[...rg.getClientRects()].filter(r=>r.width>4);
    const ink=rects.length?{l:Math.round(Math.min(...rects.map(r=>r.left))),r:Math.round(Math.max(...rects.map(r=>r.right)))}:null;
    return {align:c.textAlign, maxW:c.maxWidth, box:`${Math.round(vr.left)}→${Math.round(vr.right)}`,
      ink: ink?`${ink.l}→${ink.r}`:"none", img:`${Math.round(ir.left)}→${Math.round(ir.right)}`, imgY:`${Math.round(ir.top)}→${Math.round(ir.bottom)}`};
  });
  if(d){ console.log(JSON.stringify(d)); break; }
}
await b.close();
