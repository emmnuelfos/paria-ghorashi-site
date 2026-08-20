import { chromium } from "playwright-core";
import fs from "fs";
const B=process.env.QA_BASE || "http://localhost:4321";
const src = fs.readFileSync("src/data/content.ts","utf8");
// Pull the SEO map's approved title/description pairs straight from the data file.
const seo = {};
const block = src.split("export const SEO")[1].split("\n};")[0];
for (const m of block.matchAll(/(\w+):\s*\{\s*title:\s*"([^"]+)",\s*description:\s*\n?\s*"([^"]+)",/g)) {
  seo[m[1]] = { title: m[2], description: m[3] };
}
const ROUTES = { home:"/", about:"/about/", workWithParia:"/work-with-paria/", consultation:"/consultation/",
  advisory:"/advisory/", partnerships:"/partnerships/", services:"/services/", speaking:"/speaking/",
  media:"/media/", ventures:"/ventures/", pgpm:"/pgpm/", contact:"/contact/" };
const b=await chromium.launch({channel:"msedge",headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const p=await (await b.newContext()).newPage();
let bad=0, n=0;
for (const [key,route] of Object.entries(ROUTES)) {
  const want = seo[key];
  if (!want) { console.log(`?? ${route} — no SEO entry named "${key}"`); bad++; continue; }
  await p.goto(B+route,{waitUntil:"domcontentloaded"});
  const gotT = await p.title();
  const gotD = await p.getAttribute('meta[name="description"]',"content") || "";
  n++;
  const tOK = gotT.trim() === want.title.trim();
  const dOK = gotD.trim() === want.description.trim();
  if (tOK && dOK) { console.log(`ok  ${route}`); }
  else {
    bad++;
    console.log(`**  ${route}`);
    if(!tOK){ console.log(`      title WANT: ${want.title}`); console.log(`      title GOT : ${gotT}`); }
    if(!dOK){ console.log(`      desc  WANT: ${want.description.slice(0,90)}`); console.log(`      desc  GOT : ${(gotD||"(absent)").slice(0,90)}`); }
  }
}
console.log(`\nHEAD METADATA: ${n-bad}/${n} pages correct`);
await b.close();
