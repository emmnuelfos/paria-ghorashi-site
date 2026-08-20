import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for (const [label,vp,mob] of [["DESKTOP 1920",{width:1920,height:1000},false],["MOBILE 390",{width:390,height:844},true]]) {
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
    ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.waitForTimeout(1200);
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}});
  await p.waitForTimeout(500);
  const rows=await p.evaluate(()=>{
    const sels=[["S1 hero body",".hero-support"],["S2 manifesto",".manifesto-body"],
      ["S3 skills intro",".skills-intro"],["S3 skills text",".skills-text"],
      ["S4 about body",".about-sub"],["S5 industries",".cg-industries li"],
      ["S7 clients","#clients .pg-body"],["S8 collab body",".projects-body"],
      ["S9 consult body",".home-consult-body, .home-consult .pg-body"],
      ["S10 press intro",".press-intro"],["S11 final body",".contact-final-body, .contact-final p"]];
    const out=[];
    for(const [name,s] of sels){
      const n=document.querySelector(s);
      if(!n){out.push([name,"—","—","not found"]);continue;}
      const c=getComputedStyle(n);
      out.push([name, Math.round(parseFloat(c.fontSize)*10)/10+"px", c.fontWeight, c.color]);
    }
    return out;
  });
  console.log(`\n=== ${label} ===`);
  rows.forEach(r=>console.log(`  ${r[0].padEnd(17)} ${String(r[1]).padStart(7)}  w=${String(r[2]).padStart(3)}  ${r[3]}`));
  await ctx.close();
}
await b.close();
