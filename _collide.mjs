import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const VPS=[["2560x1300",{width:2560,height:1300},false],["1920x1000",{width:1920,height:1000},false],
["1440x900",{width:1440,height:900},false],["1366x768",{width:1366,height:768},false],
["1280x800",{width:1280,height:800},false],["768x1024",{width:768,height:1024},false],["390x844",{width:390,height:844},true]];
let bad=0;
for (const [label,vp,mob] of VPS) {
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
    ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.waitForTimeout(1400);
  const d=await p.evaluate(()=>{
    const q=s=>document.querySelector(s);
    const tag=q(".hero-tagline"), ctas=q(".hero-ctas"), line=q("#hero-line"), bar=q("#hero-bar");
    // The wordmark is a fixed full-viewport layer; only its glyph spans have
    // meaningful bounds, so take their union.
    const glyphs=[...document.querySelectorAll("#name-layer .char")].filter(n=>n.getBoundingClientRect().height>8);
    const gb=glyphs.map(n=>n.getBoundingClientRect());
    const word = gb.length ? {
      top: Math.min(...gb.map(r=>r.top)), bottom: Math.max(...gb.map(r=>r.bottom)),
      getBoundingClientRect(){ return this; }
    } : null;
    const R=n=>n?n.getBoundingClientRect():null;
    const t=R(tag), c=R(ctas), w=R(word), l=R(line);
    const blockBottom = c? c.bottom : (t? t.bottom : 0);
    return {
      vh:innerHeight,
      blockBottom: Math.round(blockBottom),
      wordTop: w?Math.round(w.top):null, wordBottom: w?Math.round(w.bottom):null,
      wordFs: glyphs.length?Math.round(parseFloat(getComputedStyle(glyphs[0]).fontSize)):null,
      lineTop: l?Math.round(l.top):null,
      clearance: w? Math.round(w.top-blockBottom) : null,
      ruleGap: (w&&l)? Math.round(l.top-w.bottom) : null,
    };
  });
  const col = d.clearance!==null && d.clearance<0;
  const ruleCol = d.ruleGap!==null && d.ruleGap<0;
  if(col||ruleCol) bad++;
  console.log(`${label.padEnd(10)} block↓${String(d.blockBottom).padStart(4)}  wordmark ${String(d.wordTop).padStart(4)}→${String(d.wordBottom).padStart(4)} (${d.wordFs}px)  clearance=${String(d.clearance).padStart(5)}${col?" ** OVERLAP":""}  word→rule=${String(d.ruleGap).padStart(4)}${ruleCol?" ** CROSSES":""}`);
  await ctx.close();
}
console.log(bad? `\n${bad} viewport(s) with collisions` : "\nno collisions");
await b.close();
