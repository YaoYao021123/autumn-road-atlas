import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { encodeRoute, decodeRoute } from '../app/route-codec.ts';

const data=JSON.parse(await readFile(new URL('../app/routes.generated.json',import.meta.url),'utf8'));
const compactText=await readFile(new URL('../app/routes.compact.json',import.meta.url),'utf8');
const compact=JSON.parse(compactText);
assert(Buffer.byteLength(compactText)<140000,'Compact route payload budget');
for(const [id,segment] of Object.entries(data.segments)){
  assert.deepEqual(decodeRoute(compact.segments[id].path),segment.points,`${id}: preserve every coordinate`);
  const {path,...metadata}=compact.segments[id];
  const {points,...originalMetadata}=segment;
  assert.deepEqual(metadata,originalMetadata,`${id}: preserve navigation and all route metadata`);
  assert.equal(encodeRoute(points),path,'Reproducible encoding');
}
assert.deepEqual(decodeRoute(''),[]);
assert.throws(()=>decodeRoute('_'));
assert.throws(()=>decodeRoute('!!'));
const source=await readFile(new URL('../app/trip.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const result={exports:{}};
vm.runInNewContext(code,{exports:result.exports,module:result,URLSearchParams,require:(name)=>{if(name==='./route-codec')return {decodeRoute};assert.equal(name,'./routes.compact.json');return compact;}});
const api=result.exports;
assert.equal(Object.keys(api.segments).length,17);
assert.equal(api.segments.park_city,undefined,'Misresolved hot-spring snapshot must stay excluded');
for(const segment of Object.values(api.segments)) {
  assert(segment.points.length>=2);
  assert(segment.km>0&&segment.minutes>0);
  for(const [lat,lng] of segment.points){assert(lat>40&&lat<55);assert(lng>110&&lng<130);}
  const url=new URL(api.navigationUrl(segment));
  assert.equal(url.origin,'https://api.map.baidu.com');
  assert.equal(url.searchParams.get('coord_type'),'bd09ll');
  assert.equal(url.searchParams.get('mode'),'driving');
  assert.equal(url.searchParams.has('ak'),false);
  assert(url.searchParams.get('origin').includes(`${segment.origin.bd09[1]},${segment.origin.bd09[0]}`));
  const geometry=api.routeGeometry([segment]);
  const start=api.routePosition(geometry,0),end=api.routePosition(geometry,1);
  assert(Math.hypot(start.position[0]-segment.points[0][0],start.position[1]-segment.points[0][1])<1e-8);
  assert(Math.hypot(end.position[0]-segment.points.at(-1)[0],end.position[1]-segment.points.at(-1)[1])<1e-8);
}
for(const endpoint of ['airport','west'])for(const overnight of [false,true]) {
  const days=api.getDays(endpoint,overnight);
  assert.equal(days.length,7);
  for(const day of days)for(const leg of day.legs)assert(api.segments[leg]);
  assert.equal(days[6].legs.length,overnight?1:0);
  assert.equal(days[5].legs[0],overnight?'arxan_songyuan':endpoint==='airport'?'arxan_longjia':'arxan_changchun_west');
  const d4=days[3].legs.reduce((sum,id)=>sum+api.segments[id].km,0);
  assert(Math.abs(d4-426.285)<0.001);
  assert(days[3].legs.includes('right_left_banner'));
  assert.equal(days[4].legs[1],'park_parking_city');
}
assert.equal(api.routePosition(api.routeGeometry([]),0),null);
console.log('PASS: 17 segments; four route variants; BD09 navigation links; coordinate bounds; animation endpoints; park-origin correction.');
