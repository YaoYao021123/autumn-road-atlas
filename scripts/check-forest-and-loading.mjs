import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const base=fileURLToPath(new URL('../',import.meta.url)),nativeRequire=createRequire(import.meta.url),cache=new Map();
const read=path=>readFileSync(resolve(base,path),'utf8');
// A minimal DOM-node model tests popup data construction, not browser layout.
class TestNode {
  constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.textContent='';}
  appendChild(child){this.children.push(child);return child;}
  setAttribute(key,value){this.attributes[key]=value;}
}
const document={createElement:tag=>new TestNode(tag),createElementNS:(_ns,tag)=>new TestNode(tag)};
function load(file){
  if(file.endsWith('.css'))return {};
  if(file.endsWith('.json'))return JSON.parse(readFileSync(file,'utf8'));
  const path=[file,`${file}.tsx`,`${file}.ts`].find(existsSync);assert.ok(path);
  if(cache.has(path))return cache.get(path).exports;
  const loaded={exports:{}};cache.set(path,loaded);
  const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  vm.runInNewContext(code,{module:loaded,exports:loaded.exports,process,console,document,URL,URLSearchParams,require:name=>name.startsWith('@/')?load(resolve(base,name.slice(2))):name.startsWith('.')?load(resolve(dirname(path),name)):nativeRequire(name)},{filename:path});
  return loaded.exports;
}

const {ForestDrive}=load(resolve(base,'app/forest-drive.tsx'));
{
  const html=renderToStaticMarkup(React.createElement(ForestDrive,{onRouteSelect:()=>{}}));
  assert.ok(html.includes('把秋天，')&&html.includes('原创 AI 秋林意象'));
  assert.ok(html.includes('loading="lazy"')&&html.includes('fetchPriority="low"'));
  assert.ok(!html.includes('<video')&&!html.includes('<iframe')&&!html.includes('<svg class="forest-drive-art"'));
  assert.ok(html.includes('srcSet="/forest-drive-960.webp"'));
  assert.ok(!html.includes('forest-car')&&!html.includes('type="range"')&&!html.includes('18 s'));
  assert.ok(!html.includes('驶入秋林')&&!html.includes('forest-drive-controls'));
  assert.equal([...html.matchAll(/<img\b/g)].length,1,'One quiet background image, no vehicle layer');
}
const source=read('app/forest-drive.tsx');
assert.ok(!source.includes('requestAnimationFrame')&&!source.includes('forest-path'));
assert.ok(!existsSync(resolve(base,'app/forest-path.ts')));
assert.ok(!/\binfinite\b/.test(read('app/forest-drive.css')));
assert.match(read('app/page.tsx'),/\[dayId,setDayId\]=useState\(1\)/);
assert.ok(!read('app/map-canvas.tsx').includes('react-dom/server'));
assert.ok(read('app/map-canvas.tsx').includes('if(overview)allLegs.forEach'));
assert.ok(read('app/map-canvas.tsx').includes('setReady(version=>version+1)'),'HMR map generation redraw guard');
assert.ok(!/#(?:[0-9a-f]{5}|[0-9a-f]{7})(?![0-9a-f])/i.test(read('app/literary.css')),'Valid CSS mask colors');
assert.ok(read('app/literary.css').includes('gap:clamp(20px,4vw,70px)'));
assert.ok(read('app/editorial-type.css').includes('font-display:swap'));
const font=readFileSync(resolve(base,'public/fonts/autumn-brush.woff2'));
assert.equal(font.toString('ascii',0,4),'wOF2');assert.ok(font.length<50000);
assert.ok(read('public/fonts/OFL-MaShanZheng.txt').includes('SIL OPEN FONT LICENSE'));
for(const [file,budget] of [['literary-river.webp',150000],['literary-forest.webp',280000],['forest-drive.webp',350000],['forest-drive-960.webp',180000],['forest-car.webp',10000],['autumn-birch-384.webp',18000],['timeline-birch.webp',50000]]){
  const bytes=readFileSync(resolve(base,`public/${file}`));assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length<budget,`${file} budget`);
}

const {getDays}=load(resolve(base,'app/trip.ts')),{getRoadScenes}=load(resolve(base,'app/road-experience.ts'));
const {sceneryPopup,scenerySymbol,carSymbol}=load(resolve(base,'app/map-markup.ts'));
const scenes=getRoadScenes(getDays('airport',false));
function descendants(node){return [node,...node.children.flatMap(descendants)];}
for(const scene of scenes){
  const popup=sceneryPopup(scene),nodes=descendants(popup);
  assert.ok(nodes.some(node=>node.tag==='h3'&&node.textContent===scene.title));
  for(const a of nodes.filter(node=>node.tag==='a'))assert.ok(a.href.startsWith('https:')&&a.target==='_blank'&&a.rel==='noopener noreferrer');
  if(scene.kind==='window')assert.ok(!nodes.some(node=>node.className==='scenery-popup-navigation'));
}
const hostile={...scenes[0],title:'<img src=x onerror=alert(1)>'};
assert.equal(descendants(sceneryPopup(hostile)).find(node=>node.tag==='h3').textContent,hostile.title);
assert.ok(!descendants(sceneryPopup(hostile)).some(node=>node.tag==='img'));
assert.equal(scenerySymbol(false,1).children[0].textContent,'P');
assert.equal(scenerySymbol(true,2).children[1].textContent,'02');
assert.equal(carSymbol().children[0].tag,'svg');
assert.throws(()=>sceneryPopup({...scenes[0],navigationHref:'javascript:alert(1)'}));

const before=['literary-river.png','literary-forest.png','autumn-birch-384.png','timeline-birch.png'].reduce((n,file)=>n+statSync(resolve(base,`public/${file}`)).size,0);
const after=['literary-river.webp','literary-forest.webp','autumn-birch-384.webp','timeline-birch.webp'].reduce((n,file)=>n+statSync(resolve(base,`public/${file}`)).size,0);
console.log(`PASS: D1 default; real static-forest SSR render; no vehicle/playback code; lazy responsive background; HMR map generation; 8 DOM popup data tests; font/license/image budgets. Existing rendered local artwork: ${before} → ${after} bytes (${(100-after/before*100).toFixed(1)}% reduction). No browser UI QA performed.`);
