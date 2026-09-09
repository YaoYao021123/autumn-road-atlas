import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const root=new URL('../',import.meta.url);
const content=JSON.parse(readFileSync(new URL('app/literary-scenes.json',root),'utf8'));
assert.equal(content.author,'迟子建');
assert.equal(content.quote,'我是雨和雪的老熟人了，我有九十岁了。');
assert.ok([...content.quote].length<=25,'Single short quotation budget');
assert.equal(new URL(content.quoteSource).hostname,'www.chinawriter.com.cn');
assert.equal(content.scenes.length,3);
assert.equal(new Set(content.scenes.map(scene=>scene.id)).size,3);
for(const scene of content.scenes){
  assert.match(scene.image,/^\/literary-[a-z]+\.webp$/);
  assert.ok(scene.alt.includes('原创文学氛围图'));
  assert.ok(Number.isInteger(scene.routeDay)&&scene.routeDay>=1&&scene.routeDay<=7);
  assert.equal(scene.lines.length,2);
  const optimized=readFileSync(new URL(`public${scene.image}`,root));
  assert.equal(optimized.toString('ascii',8,12),'WEBP');
  assert.ok(optimized.length<300000,'Literary web image budget');
  const bytes=readFileSync(new URL(`public${scene.image.replace('.webp','.png')}`,root));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),1536);
  assert.equal(bytes.readUInt32BE(20),1024);
}
const branch=readFileSync(new URL('public/timeline-birch.png',root));
assert.equal(branch.readUInt32BE(16),2172);
assert.equal(branch.readUInt32BE(20),724);
const component=readFileSync(new URL('app/literary-interlude.tsx',root),'utf8');
assert.ok(component.includes('原创旁白')&&component.includes('非沿途实景'));
assert.ok(!component.includes('TabsContent'),'Reading flow must not revert to the old boxed tab gallery');
assert.ok(component.includes('observer.disconnect()'));
for(const file of ['literary.css','birch-timeline.css']){
  const css=readFileSync(new URL(`app/${file}`,root),'utf8');
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(!/\binfinite\b/.test(css));
}
const works=JSON.parse(readFileSync(new URL('app/cultural-works.json',root),'utf8'));
assert.equal(Object.keys(works).length,5);
for(const work of Object.values(works)){
  for(const field of ['title','creator','year','medium','recognition','place','relationship','description','boundary'])assert.ok(work[field],`${work.title}: ${field}`);
  assert.ok(work.sources.length>0);
  for(const source of work.sources)assert.equal(new URL(source.url).protocol,'https:');
}
assert.equal(works.photography.displayPolicy,'source-only');
assert.ok(!works.photography.image&&!works.photography.routeDay,'Unlicensed photography stays source-only and must not add a route stop');
assert.match(works.photography.boundary,/根河不在本次路线/);
assert.match(works.grassland.boundary,/陈巴尔虎旗不是.*新巴尔虎/);
assert.match(works.film.boundary,/河北井陉/);
assert.match(works.film.relationship,/非取景地/);
assert.match(works.homecoming.boundary,/D7 只保留还车安排/);
for(const name of ['book','grassland','film'])assert.equal(works[name].routeDay,3);
assert.equal(works.homecoming.routeDay,7);

// Execute the real component and its existing Button primitive through TS transpilation.
// Only CSS is stubbed; this is a server-render content check, not browser UI QA.
const nativeRequire=createRequire(import.meta.url),cache=new Map(),base=fileURLToPath(root);
function loadModule(file){
  if(file.endsWith('.css'))return {};
  if(file.endsWith('.json'))return JSON.parse(readFileSync(file,'utf8'));
  const path=[file,`${file}.tsx`,`${file}.ts`].find(candidate=>existsSync(candidate));
  assert.ok(path,`Missing module: ${file}`);
  if(cache.has(path))return cache.get(path).exports;
  const result={exports:{}};cache.set(path,result);
  const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  vm.runInNewContext(code,{module:result,exports:result.exports,process,console,require:(name)=>name.startsWith('@/')?loadModule(resolve(base,name.slice(2))):name.startsWith('.')?loadModule(resolve(dirname(path),name)):nativeRequire(name)},{filename:path});
  return result.exports;
}
const {LiteraryInterlude}=loadModule(resolve(base,'app/literary-interlude.tsx'));
for(const motionEnabled of [true,false]){
  const html=renderToStaticMarkup(React.createElement(LiteraryInterlude,{motionEnabled,onRouteSelect:()=>{}}));
  const text=html.replace(/<[^>]+>/g,'');
  for(const work of Object.values(works))assert.ok(text.includes(work.title),`Rendered title: ${work.title}`);
  assert.equal(text.split(content.quote).length-1,1,'Only one occurrence of the short quotation');
  assert.ok(text.includes('原创旁白')&&text.includes('不是王伟摄影原作'));
  assert.ok(!/<(?:iframe|video)\b/.test(html),'Official media remains click-through without autoplay or hidden players');
  assert.ok(html.includes(`data-motion="${motionEnabled}"`));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,'Unique chapter and heading IDs');
  for(const target of ['culture-river','culture-grassland','culture-cinema','culture-homecoming'])assert.ok(html.includes(`href="#${target}"`)&&ids.includes(target));
  for(const tag of html.matchAll(/<a\b[^>]+>/g)){
    if(tag[0].includes('href="https:'))assert.ok(tag[0].includes('target="_blank"')&&tag[0].includes('noopener noreferrer'));
  }
  assert.equal([...html.matchAll(/<img\b/g)].length,4,'Two AI artworks, an official night landscape still, and one historical city image');
  assert.ok(html.includes(works.film.image)&&html.includes(works.film.imageSource));
  assert.ok(!html.includes('csm_201813696_23860'),'No old close-up film portrait');
  assert.match(works.film.imageAlt,/夜色山峦.*不是满洲里实景/);
  assert(readFileSync(new URL(`public${works.film.image}`,root)).length<50000);
  assert.ok(!html.includes('www.ad.tsinghua.edu.cn/_mediafile'),'Photography images must not be copied into the page');
}
const css=readFileSync(new URL('app/literary.css',root),'utf8');
assert.ok(css.includes('mask-image')&&css.includes('prefers-reduced-motion'));
assert.ok(!css.includes('.literary-tab'),'Old boxed gallery styles are removed');
console.log('PASS: 5 sourced works; 4 chapters; accurate region/filming/story boundaries; source-only photography; two real component renders; safe media links; one short quotation; preserved assets; reduced-motion/source checks.');
