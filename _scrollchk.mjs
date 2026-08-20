import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const p=await (await b.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1})).newPage();
await p.goto(B+"/",{waitUntil:"load"});
await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
await p.evaluate(()=>{window.__introTL.progress(1);});
await p.waitForTimeout(1800);
// what sections actually exist, in document order
const ids=await p.evaluate(()=>{
  const want=["hero","section-after","manifesto","skills","about","circle-gallery","metrics","clients","projects",
    "consultation-feature","awards","press","contact","footer"];
  return want.map(id=>{const n=document.getElementById(id);
    if(!n) return null;
    const r=n.getBoundingClientRect();
    return {id, top:Math.round(r.top+window.scrollY), h:Math.round(n.offsetHeight)};
  }).filter(Boolean).sort((a,b)=>a.top-b.top);
});
console.log("SECTIONS IN DOCUMENT ORDER:");
ids.forEach(s=>console.log(`   ${s.id.padEnd(22)} top=${String(s.top).padStart(6)} h=${s.h}`));

console.log("\nSCROLL WALK — indicator label vs section actually at viewport centre:");
const H=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
let wrong=0, checked=0;
for(let i=1;i<=24;i++){
  const y=Math.round(H*i/25);
  await p.evaluate(async(y)=>{ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); },y);
  await p.waitForTimeout(260);
  const d=await p.evaluate((known)=>{
    const label=(document.querySelector("#st-label")?.textContent||"").trim();
    const vis=getComputedStyle(document.querySelector("#scroll-timeline")).opacity;
    const mid=innerHeight/2;
    let actual="—";
    for(const id of known){
      const n=document.getElementById(id); if(!n) continue;
      const r=n.getBoundingClientRect();
      if(r.top<=mid&&r.bottom>=mid) actual=id;
    }
    return {label, actual, pct:(document.querySelector("#scroll-pct")?.textContent||"").trim(), vis};
  }, ids.map(s=>s.id));
  checked++;
  console.log(`   y=${String(y).padStart(6)}  centre=${d.actual.padEnd(22)} label="${d.label}"  ${d.pct}  op=${d.vis}`);
}
await b.close();
