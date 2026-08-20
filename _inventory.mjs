import { chromium } from "playwright-core";
const B=process.env.QA_BASE||"http://localhost:4321";
const ROUTES=["/about/","/work-with-paria/","/consultation/","/advisory/","/partnerships/",
"/services/","/speaking/","/media/","/ventures/","/pgpm/","/contact/","/privacy/","/terms/"];
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const agg=new Map();
for (const [label,vp,mob] of [["desk",{width:1920,height:1000},false],["mob",{width:390,height:844},true]]) {
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob,
    ...(mob?{userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"}:{})});
  if(mob) await ctx.addInitScript(()=>Object.defineProperty(navigator,"maxTouchPoints",{get:()=>5}));
  const p=await ctx.newPage();
  for(const r of ROUTES){
    await p.goto(B+r,{waitUntil:"load",timeout:45000});
    await p.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}});
    await p.waitForTimeout(250);
    const rows=await p.evaluate(()=>{
      const out={};
      document.querySelectorAll("p,li,span,dd,dt,label,figcaption,blockquote,a,button,summary,td,th").forEach(n=>{
        const txt=(n.textContent||"").trim();
        if(txt.length<12) return;                       // ignore labels/among chrome
        if(!n.className || typeof n.className!=="string") return;
        const cls=n.className.trim().split(/\s+/)[0];
        if(!cls.startsWith("pg-")) return;              // inner-page system only
        const c=getComputedStyle(n);
        const fs=Math.round(parseFloat(c.fontSize)*10)/10;
        const key=`${cls}|${fs}|${c.fontWeight}|${c.color}`;
        out[key]=(out[key]||0)+1;
      });
      return out;
    });
    for(const [k,v] of Object.entries(rows)){
      const kk=label+"|"+k;
      agg.set(kk,(agg.get(kk)||0)+v);
    }
  }
  await ctx.close();
}
await b.close();
const byClass={};
for(const [k,count] of agg){
  const [vp,cls,fs,fw,color]=k.split("|");
  byClass[cls]=byClass[cls]||{};
  byClass[cls][vp]=byClass[cls][vp]||[];
  byClass[cls][vp].push({fs:+fs,fw,color,count});
}
console.log("INNER-PAGE TEXT INVENTORY (classes carrying real copy)\n");
for(const cls of Object.keys(byClass).sort()){
  const d=byClass[cls];
  const f=(arr)=>arr?arr.sort((a,b)=>b.count-a.count).slice(0,1).map(x=>`${x.fs}px/${x.fw}`).join(""):"—";
  const col=(d.mob||d.desk||[]).sort((a,b)=>b.count-a.count)[0];
  const n=(d.desk||[]).reduce((s,x)=>s+x.count,0);
  console.log(`  ${cls.padEnd(20)} mob ${String(f(d.mob)).padStart(10)}   desk ${String(f(d.desk)).padStart(10)}   ${col?col.color:""}  (${n} nodes)`);
}
