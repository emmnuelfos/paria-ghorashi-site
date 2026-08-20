import { chromium } from "playwright-core";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for(const [lab,vp] of [["1920",{width:1920,height:1000}],["1440",{width:1440,height:900}],["1200",{width:1200,height:900}],["1024",{width:1024,height:800}]]){
  const p=await (await b.newContext({viewport:vp,deviceScaleFactor:1})).newPage();
  await p.goto("http://localhost:4321/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}});
  await p.waitForTimeout(500);
  const d=await p.evaluate(()=>{
    const R=s=>{const n=document.querySelector(s);if(!n)return null;const r=n.getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right),w:Math.round(r.width)};};
    const photo=R(".about-photo")||R(".about-figure")||R(".about img")||R("#about img");
    const subs=[...document.querySelectorAll(".about-sub")].map(n=>{const r=n.getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right)};});
    return {photo, subs, vw:innerWidth};
  });
  const pl=d.photo?d.photo.l:null;
  console.log(`${lab}: photo left=${pl}  paragraphs: ${d.subs.map(s=>`${s.l}→${s.r}`).join("  ")}   ${d.subs.some(s=>pl!==null&&s.r>pl-16)?"** RUNS UNDER PHOTO":"clear"}`);
  await p.context().close();
}
await b.close();
