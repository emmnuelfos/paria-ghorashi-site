import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for(const w of [1920,1600,1440,1280,1024]){
  const p=await (await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1})).newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}});
  await p.waitForTimeout(500);
  const d=await p.evaluate(()=>{
    const t=document.querySelector(".about-text"), ph=document.querySelector(".about-photo, .about-figure, .about img");
    if(!t||!ph) return null;
    const tr=t.getBoundingClientRect(), pr=ph.getBoundingClientRect();
    // right edge of the actual last glyph line, not the block box
    const r=document.createRange(); r.selectNodeContents(t);
    const rects=[...r.getClientRects()];
    const inkRight=rects.length?Math.max(...rects.map(x=>x.right)):tr.right;
    return {textRight:Math.round(inkRight), boxRight:Math.round(tr.right), photoLeft:Math.round(pr.left)};
  });
  if(!d){ console.log(`${w}: elements not found`); await p.context().close(); continue; }
  const gap=d.photoLeft-d.textRight;
  console.log(`${String(w).padStart(5)}px  headline ink ends ${String(d.textRight).padStart(4)}  photo starts ${String(d.photoLeft).padStart(4)}  gap ${String(gap).padStart(5)}${gap<8?"  ** OVERLAPS PHOTO":""}`);
  await p.context().close();
}
await b.close();
