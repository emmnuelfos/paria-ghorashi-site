import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const ROUTES=["/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
for(const [lab,vp,mob] of [["d",{width:1440,height:900},false],["m",{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
   ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  for(const r of ROUTES){
    const name=(r.replace(/\//g,"")||"home");
    await p.goto(B+r,{waitUntil:"load",timeout:45000});
    await p.waitForTimeout(600);
    // walk so ScrollTriggers fire, then force every reveal to its settled state
    await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}window.scrollTo(0,0);});
    await p.evaluate(()=>{
      document.querySelectorAll(".pg-reveal").forEach(n=>{n.classList.add("is-in");n.style.opacity="1";n.style.transform="none";});
      const c=document.querySelector(".pg-cookie"); if(c) c.classList.add("pg-cookie--hidden");
    });
    await p.waitForTimeout(700);
    const h=await p.evaluate(()=>document.body.scrollHeight);
    await p.screenshot({path:`_vqa/${lab}_${name}.png`,fullPage:true});
    console.log(`${lab} ${name.padEnd(18)} ${h}px tall`);
  }
  await ctx.close();
}
await b.close();
