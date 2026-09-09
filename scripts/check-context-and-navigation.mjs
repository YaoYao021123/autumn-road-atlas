import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve,dirname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import gcoord from 'gcoord';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require=createRequire(import.meta.url),root=resolve(import.meta.dirname,'..');
function loader(overrides={},globals={}){
  const cache=new Map();
  function load(file){
    if(cache.has(file))return cache.get(file).exports;
    const loaded={exports:{}};cache.set(file,loaded);
    const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    vm.runInNewContext(code,{module:loaded,exports:loaded.exports,URLSearchParams,...globals,require(name){
      if(Object.hasOwn(overrides,name))return overrides[name];
      if(name.endsWith('.json'))return JSON.parse(readFileSync(resolve(dirname(file),name),'utf8'));
      if(name.startsWith('.'))return load(resolve(dirname(file),name+'.ts'));
      return require(name);
    }},{filename:file});return loaded.exports;
  }return load;
}
const load=loader(),nav=load(resolve(root,'app/navigation-links.ts'));
const trip=load(resolve(root,'app/trip.ts'));
assert.equal(nav.navigationPlatform('Mozilla iPhone'), 'ios');
assert.equal(nav.navigationPlatform('Macintosh',5),'ios');
assert.equal(nav.navigationPlatform('Macintosh',0),'desktop');
assert.equal(nav.navigationPlatform('Android 16'),'android');
for(const segment of Object.values(trip.segments))for(const platform of ['ios','android','desktop']){
  const links=nav.routeNavigationLinks(segment,platform);
  const baiduWeb=new URL(links.baidu.web),baiduApp=new URL(links.baidu.app);
  assert.equal(baiduWeb.protocol,'https:');assert.equal(baiduWeb.searchParams.get('output'),'html');
  assert.equal(baiduApp.protocol,platform==='ios'?'baidumap:':'bdapp:');
  assert.equal(baiduApp.searchParams.get('coord_type'),'bd09ll');
  for(const key of ['origin','destination']){
    const stop=segment[key];
    assert.equal(baiduApp.searchParams.get(key),`name:${stop.name}|latlng:${stop.bd09[1]},${stop.bd09[0]}`);
    const expected=gcoord.transform([...stop.bd09],gcoord.BD09,gcoord.GCJ02);
    const amap=new URL(links.amap.app),parts=amap.searchParams.get(key==='origin'?'from':'to').split(',');
    assert.equal(parts.slice(2).join(','),stop.name);
    assert(Math.abs(Number(parts[0])-expected[0])<0.000001);
    assert(Math.abs(Number(parts[1])-expected[1])<0.000001);
  }
  for(const [mode,flag] of [['app','1'],['web','0']]){
    const url=new URL(links.amap[mode]);assert.equal(url.host,'uri.amap.com');
    assert.equal(url.searchParams.get('callnative'),flag);assert.equal(url.searchParams.get('mode'),'car');
    assert.equal(url.searchParams.get('coordinate'),'gaode');
  }
}
// Render the actual links for both platforms, without launching external apps.
for(const platform of ['desktop','ios','android']){
  const {RouteNavigation}=loader({react:{...React,useSyncExternalStore:()=>platform}})(resolve(root,'app/route-navigation.tsx'));
  const legs=trip.getDays('airport',false)[3].legs.map(id=>trip.segments[id]);
  const html=renderToStaticMarkup(React.createElement(RouteNavigation,{legs}));
  assert.equal((html.match(/class="navigation-leg"/g)||[]).length,3);
  assert.equal((html.match(/class="navigation-provider"/g)||[]).length,6);
  assert.equal((html.match(/class="navigation-web"/g)||[]).length,platform==='desktop'?0:6);
  assert(html.includes('新巴尔虎右旗')&&html.includes('新巴尔虎左旗'));
  assert(html.includes('App 会按实时路况重新算路'));
}

// Exercise the actual effect with a small event/geometry harness, not browser QA.
class Node {
  constructor(parent=null,kind=null){this.parent=parent;this.kind=kind;this.control=false;}
  closest(selector){
    if(selector==='[data-foliage]')return this.kind?this:this.parent?.closest(selector)??null;
    if(selector==='.atlas')return atlas;
    if(selector.includes('button')||selector==='.leaflet-container')return this.control?this:null;
    return null;
  }
  getAttribute(){return this.kind;}
  getBoundingClientRect(){return {left:900,right:2380,width:1480,top:0,bottom:1000};}
}
const atlas=new Node(),events=new Map(),timers=new Map(),pool=Array.from({length:5},()=>({dataset:{},style:{setProperty(){}},offsetWidth:0}));
let effect,hit=new Node(null,'birch'),lastPoint,clock=500,timer=0;
atlas.querySelectorAll=()=>[hit];
const document={hidden:false,querySelector:()=>atlas,elementFromPoint(x,y){lastPoint={x,y};return hit;}};
const window={innerWidth:3820,innerHeight:900,matchMedia:()=>({matches:false}),addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name),setTimeout(fn){timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)};
const atmosphere=loader({react:{useRef:()=>({current:pool}),useEffect:fn=>{effect=fn;}}},{window,document,Element:Node,performance:{now:()=>clock+=300}})(resolve(root,'app/autumn-atmosphere.tsx'));
atmosphere.AutumnAtmosphere({enabled:true,day:1});const cleanup=effect();
const latest=()=>pool.toSorted((a,b)=>Number(b.dataset.leafToken??0)-Number(a.dataset.leafToken??0))[0];
for(const kind of ['birch','grass','larch','poplar']){
  const target=new Node(new Node(null,kind));
  events.get('click')({target,detail:1,clientX:1000,clientY:150});assert.equal(latest().dataset.foliage,kind);
  hit=new Node(null,kind);events.get('scroll')({target:document});
  for(const fn of timers.values())fn();timers.clear();
  assert.equal(latest().dataset.foliage,kind);assert(lastPoint.x>900&&lastPoint.x<2380,'Ultra-wide leaves stay inside atlas');
}
const token=latest().dataset.leafToken,control=new Node(null,'grass');control.control=true;
events.get('click')({target:control,detail:1,clientX:1000,clientY:150});assert.equal(latest().dataset.leafToken,token);
events.get('click')({target:new Node(null,'constructor'),detail:1,clientX:1000,clientY:150});assert.equal(latest().dataset.foliage,'poplar','Unknown context cannot supply an image URL');
cleanup();assert.equal(events.size,0);assert(pool.every(leaf=>leaf.dataset.active==='false'));
const literary=readFileSync(resolve(root,'app/literary-interlude.tsx'),'utf8');
for(const [id,kind] of [['river','birch'],['grassland','grass'],['cinema','grass'],['homecoming','poplar']])assert(new RegExp(`id="culture-${id}"[^>]+data-foliage="${kind}"`).test(literary));
console.log('PASS: 17 route links × 3 platforms; BD09/GCJ02 conversion; actual mobile/desktop markup; chapter click/scroll foliage; wide-screen bounds; controls excluded; cleanup.');
