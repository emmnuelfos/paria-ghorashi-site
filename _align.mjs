import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for(const [label,vp] of [["1920",{width:1920,height:1000}],["1440",{width:1440,height:900}]]){
  const p=await (await b.newContext({viewport:vp,deviceScaleFactor:1})).newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}});
  await p.waitForTimeout(500);
  const d=await p.evaluate(()=>{
    const rows=[];
    const add=(name,sel)=>{
      const n=document.querySelector(sel); if(!n) return rows.push([name,"missing"]);
      const r=n.getBoundingClientRect(), c=getComputedStyle(n);
      rows.push([name, Math.round(r.left), Math.round(r.right), Math.round(r.width), c.marginLeft, c.width]);
    };
    add("about-text",".about-text");
    add("about-sub 1",".about-sub");
    add("about-sub 3",".about-sub--third");
    add("about-btn",".about-btn");
    return rows;
  });
  console.log(`\n=== ${label} ===`);
  d.forEach(r=>console.log(`  ${String(r[0]).padEnd(12)} left=${String(r[1]).padStart(4)} right=${String(r[2]).padStart(4)} w=${String(r[3]).padStart(4)}  ml=${r[4]} cssW=${r[5]}`));
  await p.context().close();
}
await b.close();
