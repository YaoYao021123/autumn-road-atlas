import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
const out=process.argv[2];
assert(out,'Supply the prepared GitHub Pages output directory');
const base='/autumn-road-atlas/';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const assets=walk('public').filter(p=>/\.(webp|png|svg|woff2)$/.test(p)).map(p=>relative('public',p));
const bad=new RegExp('(?<![\\w/-])/(?:_next/|fonts/|'+assets.map(escape).join('|')+')');
for(const asset of assets)assert(existsSync(join(out,asset)),`Missing asset: ${asset}`);
let combined='';
for(const file of walk(out).filter(p=>/\.(html|rsc|js|css|json)$/.test(p))){
  const text=readFileSync(file,'utf8');
  assert(!bad.test(text),`Unprefixed asset URL: ${file}`);
  assert(!text.includes(base+base.slice(1)),`Repeated prefix: ${file}`);
  for(const m of text.matchAll(/["'`](_next\/static\/[^"'`]+)["'`]/g))assert(existsSync(join(out,m[1])),`Missing chunk: ${m[1]}`);
  combined+=text;
}
for(const file of ['elephant-night-v1.webp','day04-grassland-v1.webp','forest-drive.webp','fonts/autumn-brush.woff2'])assert(combined.includes(base+file),`Asset not referenced: ${file}`);
assert(combined.includes('return`'+base+'`+e}'),'Dynamic preload helper base missing');
assert(existsSync(join(out,'.nojekyll')));
console.log('PASS: Pages asset paths, font, image references, chunk dependencies, preload helper, no duplicate base, .nojekyll.');
