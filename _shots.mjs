import { chromium } from "playwright-core";
const B="http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,
  userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"});
await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
const p=await ctx.newPage();
await p.goto(B+"/",{waitUntil:"load"});
await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
await p.evaluate(()=>{window.__introTL.progress(1);});
await p.waitForTimeout(1500);
// walk the page so ScrollTriggers fire
await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.waitForTimeout(600);
const targets=[["manifesto",".manifesto-body"],["about",".about-sub"],["s8head",".projects-head"],["s10head",".press-head"]];
for(const [name,sel] of targets){
  const el=await p.$(sel);
  if(!el){console.log(`MISSING ELEMENT ${name} (${sel})`);continue;}
  await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
  const box=await el.boundingBox();
  const st=await el.evaluate(n=>{const c=getComputedStyle(n);return {fs:c.fontSize,lh:c.lineHeight,color:c.color,op:c.opacity};});
  console.log(`${name.padEnd(10)} fs=${st.fs} lh=${st.lh} opacity=${st.op} h=${box?Math.round(box.height):"?"}`);
  await p.screenshot({path:`_qa_${name}.png`});
}
await b.close();
