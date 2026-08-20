import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const ROUTES=["/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,
 userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"});
await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
const p=await ctx.newPage();
const worst=new Map();
for(const r of ROUTES){
  await p.goto(B+r,{waitUntil:"load",timeout:45000});
  await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}});
  await p.waitForTimeout(200);
  const rows=await p.evaluate(()=>{
    const px=s=>(s.match(/[\d.]+/g)||[]).map(Number);
    const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
    const L=([r,g,b])=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
    const ratio=(a,z)=>{const x=L(a),y=L(z);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
    // walk up for the first opaque background
    const bgOf=n=>{let e=n;while(e&&e!==document.documentElement){const c=getComputedStyle(e).backgroundColor;const v=px(c);if(v.length>=3&&(v[3]===undefined||v[3]>0.95))return v.slice(0,3);e=e.parentElement;}return [0,0,0];};
    const out=[];
    document.querySelectorAll("p,li,span,dd,dt,label,figcaption,blockquote,a,button,summary").forEach(n=>{
      const t=(n.textContent||"").trim(); if(t.length<12) return;
      if(!n.className||typeof n.className!=="string") return;
      const cls=n.className.trim().split(/\s+/)[0]; if(!cls.startsWith("pg-")) return;
      const c=getComputedStyle(n);
      if(c.visibility==="hidden"||c.display==="none") return;
      if(parseFloat(c.opacity)<0.5) return;                  // mid-reveal
      const col=px(c.color); const a=col[3]===undefined?1:col[3];
      const bg=bgOf(n);
      const eff=col.slice(0,3).map((v,i)=>v*a+bg[i]*(1-a));
      const fs=parseFloat(c.fontSize), bold=parseInt(c.fontWeight)>=700;
      const large=fs>=24||(fs>=18.66&&bold);
      out.push({cls, r:+ratio(eff,bg).toFixed(2), fs:Math.round(fs*10)/10, need:large?3:4.5});
    });
    return out;
  });
  for(const x of rows){
    const cur=worst.get(x.cls);
    if(!cur||x.r<cur.r) worst.set(x.cls,{...x, route:r});
  }
}
await b.close();
console.log("INNER-PAGE CONTRAST (worst instance per class, mobile)\n");
let fails=0;
[...worst.entries()].sort((a,b)=>a[1].r-b[1].r).forEach(([cls,x])=>{
  const ok=x.r>=x.need;
  if(!ok) fails++;
  console.log(`  ${ok?"ok  ":"FAIL"} ${cls.padEnd(20)} ${String(x.r).padStart(6)}:1  (needs ${x.need})  ${x.fs}px  ${x.route}`);
});
console.log(fails? `\n${fails} class(es) below the floor` : "\nall classes pass");
