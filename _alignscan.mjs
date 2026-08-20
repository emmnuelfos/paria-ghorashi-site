import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const ROUTES=["/","/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
let total=0;
for(const [vlabel,vp] of [["desktop",{width:1920,height:1000}],["laptop",{width:1440,height:900}]]){
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1});
  const p=await ctx.newPage();
  console.log(`\n===== ${vlabel} =====`);
  for(const r of ROUTES){
    await p.goto(B+r,{waitUntil:"load",timeout:45000});
    if(r==="/"){ await p.waitForFunction(()=>!!window.__introTL,{timeout:20000}); await p.evaluate(()=>{window.__introTL.progress(1);}); }
    await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}});
    await p.waitForTimeout(400);
    const bad=await p.evaluate(()=>{
      const vis=n=>{const c=getComputedStyle(n);const b=n.getBoundingClientRect();
        return c.display!=="none"&&c.visibility!=="hidden"&&b.width>1&&b.height>1;};
      const L=n=>Math.round(n.getBoundingClientRect().left);
      const isHead=n=>/^(H1|H2|H3)$/.test(n.tagName)||/about-text|pg-h1|pg-h2|projects-title|press-title/.test(n.className||"");
      const isBody=n=>((n.textContent||"").trim().length>40)&&
        (/^(P|DIV)$/.test(n.tagName))&&/about-sub|pg-body|manifesto-body|projects-body|press-intro|pg-hero-body/.test(n.className||"");
      const isBtnBox=n=>!!n.querySelector(":scope > a.pg-btn, :scope > button.pg-btn")||/pg-btn-row|about-cta|projects-cta|press-cta/.test(n.className||"");
      const out=[];
      // Only compare DIRECT SIBLINGS in one container — a two-column split puts
      // heading and body in different parents, and that is intentional.
      document.querySelectorAll("*").forEach(parent=>{
        const kids=[...parent.children].filter(vis);
        if(kids.length<2) return;
        const head=kids.find(isHead), body=kids.find(isBody), btn=kids.find(isBtnBox);
        if(!body) return;
        if(!head&&!btn) return;
        const bl=L(body), diffs=[];
        if(head&&Math.abs(L(head)-bl)>8) diffs.push(`heading ${L(head)} vs body ${bl} (${bl-L(head)>0?"+":""}${bl-L(head)})`);
        if(btn&&Math.abs(L(btn)-bl)>8) diffs.push(`body ${bl} vs button ${L(btn)} (${L(btn)-bl>0?"+":""}${L(btn)-bl})`);
        if(diffs.length){
          const tag=parent.id||(typeof parent.className==="string"&&parent.className.trim()?parent.className.trim().split(/\s+/)[0]:parent.tagName);
          out.push(`${tag} :: ${diffs.join("  |  ")}`);
        }
      });
      return [...new Set(out)];
    });
    if(bad.length){ total+=bad.length; console.log(`** ${r}`); bad.forEach(x=>console.log(`      ${x}`)); }
    else console.log(`ok ${r}`);
  }
  await ctx.close();
}
console.log(`\n${total} same-container misalignment(s)`);
await b.close();
