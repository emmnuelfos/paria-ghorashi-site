import { chromium } from "playwright-core";
const B=process.env.QA_BASE || "http://localhost:4321";
const ROUTES=["/","/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,
  userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"});
await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
const p=await ctx.newPage();
const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,90)));
let fail=0;
for(const r of ROUTES){
  errs.length=0;
  const resp=await p.goto(B+r,{waitUntil:"load",timeout:45000});
  if(r==="/"){ await p.waitForFunction(()=>!!window.__introTL,{timeout:20000}); await p.evaluate(()=>{window.__introTL.progress(1);}); await p.waitForTimeout(1000); }
  await p.evaluate(()=>{const c=document.querySelector(".pg-cookie");if(c)c.classList.add("pg-cookie--hidden");});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0);});
  await p.waitForTimeout(400);
  const d=await p.evaluate(()=>{
    const sw=document.documentElement.scrollWidth;
    const small=[...document.querySelectorAll("a,button")].filter(n=>{
      const r=n.getBoundingClientRect(); const c=getComputedStyle(n);
      return r.width>0 && c.visibility!=="hidden" && c.display!=="none" && (r.height<44||r.width<24);
    }).map(n=>(n.textContent||"").trim().slice(0,26)||n.className);
    const empty=[...document.querySelectorAll("a[href]")].filter(a=>{
      const h=a.getAttribute("href"); return !h||h==="#"||h==="undefined";
    }).length;
    const imgs=[...document.querySelectorAll("img")].filter(i=>!i.hasAttribute("alt")).length;
    const h1=document.querySelectorAll("h1").length;
    // Hero height vs the viewport. This check did not exist, which is how a
    // hero at 222% of the screen passed QA: only the HEADING was measured.
    const heroEl=document.querySelector(".pg-hero");
    const heroPct=heroEl?Math.round(heroEl.getBoundingClientRect().height/innerHeight*100):null;
    return {sw,small:[...new Set(small)],empty,imgs,h1,heroPct};
  });
  const bad=[];
  if(resp.status()!==200) bad.push(`HTTP ${resp.status()}`);
  if(d.sw>391) bad.push(`h-scroll ${d.sw}px`);
  if(d.small.length) bad.push(`${d.small.length} tap<44px: ${d.small.slice(0,3).join(", ")}`);
  if(d.empty) bad.push(`${d.empty} dead href`);
  if(d.imgs) bad.push(`${d.imgs} img no alt`);
  if(d.h1!==1) bad.push(`h1 count=${d.h1}`);
  // Desktop should essentially fit one screen; the phone stacks, so it cannot.
  const heroCap = 175;
  if(d.heroPct!==null && d.heroPct>heroCap) bad.push(`hero ${d.heroPct}% of viewport (>${heroCap})`);
  if(errs.length) bad.push(`JS: ${errs[0]}`);
  if(bad.length){fail++;console.log(`** ${r.padEnd(20)} ${bad.join(" | ")}`);}
  else console.log(`ok ${r}`);
}
console.log(`\nMOBILE QA: ${ROUTES.length-fail}/${ROUTES.length} pages clean`);
await b.close();
