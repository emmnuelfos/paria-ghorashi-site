/**
 * Download all lukebaffait.fr assets to public/ preserving structure.
 * Batched parallel downloads (6 at a time) with error handling.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BASE = 'https://lukebaffait.fr/';
const OUT = 'public';

const staticAssets = [
  'assets/favicon/favicon.ico',
  'assets/fonts/Breton.woff2',
  'assets/fonts/Machine.otf',
  'assets/fonts/Zirena.woff2',
  'assets/images/art/Untitled1.png',
  'assets/images/art/Untitled2.png',
  'assets/images/cover/cover.jpg',
  'assets/images/profile/me.avif',
  'assets/images/projects/Covers/Anima.avif',
  'assets/images/projects/Covers/ChromaBlock.avif',
  'assets/images/projects/Covers/CyberDiag.avif',
  'assets/images/projects/Covers/Echo.avif',
  'assets/images/projects/Covers/Portfolio.avif',
  'assets/images/projects/Covers/SkymcDB.avif',
  'assets/images/projects/Covers/Symphony.avif',
  'assets/images/projects/Covers/Zenith.avif',
  'assets/images/projects/Covers/cyberDiag_web.avif',
];

// hero sequence: 0001..0341 .jpg
const frames = Array.from({ length: 341 }, (_, i) =>
  `assets/images/hero sequence/${String(i + 1).padStart(4, '0')}.jpg`);

const all = [...staticAssets, ...frames];

let ok = 0, fail = [];
async function grab(path) {
  const url = BASE + encodeURI(path).replace(/#/g, '%23');
  const dest = join(OUT, path);
  if (existsSync(dest)) { ok++; return; }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    ok++;
  } catch (e) {
    fail.push(path + ' -> ' + e.message);
  }
}

for (let i = 0; i < all.length; i += 6) {
  await Promise.all(all.slice(i, i + 6).map(grab));
  if (i % 60 === 0) console.log(`progress ${i}/${all.length}`);
}
console.log(`DONE ok=${ok} fail=${fail.length}`);
fail.slice(0, 10).forEach(f => console.log('FAIL', f));
