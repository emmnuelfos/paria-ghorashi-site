import { chromium } from "playwright-core";
const B="http://localhost:4321";
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for (const [label,vp,mob] of [["DESKTOP",{width:1920,height:1000},false],["LAPTOP",{width:1440,height:900},false],["MOBILE",{width:390,height:844},true]]) {
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:2,isMobile:mob,hasTouch:mob,
    ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  await p.goto(B+"/",{waitUntil:"load"});
  await p.waitForFunction(()=>!!window.__introTL,{timeout:20000});
  await p.evaluate(()=>{window.__introTL.progress(1);});
  await p.waitForTimeout(1500);
  const d=await p.evaluate(()=>{
    const out=[];
    const add=(name,n)=>{
      if(!n) return out.push(name+": MISSING");
      const c=getComputedStyle(n), r=n.getBoundingClientRect();
      const fs=parseFloat(c.fontSize);
      out.push(`${name.padEnd(14)} ${String(Math.round(fs*10)/10+"px").padStart(8)}  lh=${String(Math.round(parseFloat(c.lineHeight)*10)/10).padStart(6)}  w=${String(Math.round(r.width)).padStart(4)}  ~${Math.round(r.width/(fs*0.5))}ch  ${c.color}  ls=${c.letterSpacing}`);
    };
    const tag=document.querySelector(".hero-tagline");
    add("container",tag);
    add("eyebrow",document.querySelector(".hero-eyebrow"));
    add("HEADLINE",[...tag.children].find(n=>!n.className));
    document.querySelectorAll(".hero-support").forEach((n,i)=>add(`body p${i+1}`,n));
    add("cta primary",document.querySelector(".hero-cta"));
    add("wordmark",document.querySelector(".hero-line, .brand-word, [class*=word]"));
    return {out, vw:innerWidth, tagW:Math.round(tag.getBoundingClientRect().width)};
  });
  console.log(`\n=== ${label} (${d.vw}px) — hero text column ${d.tagW}px ===`);
  d.out.forEach(l=>console.log("  "+l));
  await ctx.close();
}
await b.close();
