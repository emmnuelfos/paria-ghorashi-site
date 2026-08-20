import { chromium } from "playwright-core";
import fs from "fs";
const B=process.env.QA_BASE||"http://localhost:4321";
const ROUTES=["/","/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const manifest={};
for(const [lab,vp,mob] of [["d",{width:1440,height:900},false],["m",{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
   ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  for(const r of ROUTES){
    const name=(r.replace(/\//g,"")||"home");
    await p.goto(B+r,{waitUntil:"load",timeout:60000});
    if(r==="/"){ await p.waitForFunction(()=>!!window.__introTL,{timeout:20000}); await p.evaluate(()=>{window.__introTL.progress(1);}); await p.waitForTimeout(2000); }
    await p.waitForTimeout(500);
    await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}});
    await p.evaluate(()=>{
      document.querySelectorAll(".pg-reveal").forEach(n=>{n.classList.add("is-in");n.style.opacity="1";n.style.transform="none";});
      const c=document.querySelector(".pg-cookie"); if(c) c.classList.add("pg-cookie--hidden");
    });
    const H=await p.evaluate(()=>document.body.scrollHeight);
    const step=vp.height;
    const tiles=Math.min(Math.ceil(H/step), 14);
    const files=[];
    for(let i=0;i<tiles;i++){
      const y=Math.min(i*step, H-step);
      await p.evaluate((y)=>window.scrollTo(0,y), y);
      await p.waitForTimeout(360);
      const f=`_vqa/${lab}_${name}_${String(i).padStart(2,"0")}.png`;
      await p.screenshot({path:f});
      files.push(f);
    }
    manifest[`${lab}:${name}`]=files;
    console.log(`${lab} ${name.padEnd(18)} ${H}px -> ${tiles} tiles`);
  }
  await ctx.close();
}
fs.writeFileSync("_vqa/manifest.json",JSON.stringify(manifest,null,1));
await b.close();
