import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const text=readFileSync(new URL('../app/regional-water.generated.json',import.meta.url),'utf8');
const data=JSON.parse(text);
assert(Buffer.byteLength(text)<10000,'Local context must remain tiny');
assert.equal(data.type,'FeatureCollection');
assert.equal(data.bbox.length,4);
assert(data.features.length>0);
for(const feature of data.features){
  assert.equal(feature.type,'Feature');
  assert(['lake','river'].includes(feature.properties.kind),'Physical features only, no invented administrative boundaries');
  const rings=feature.geometry.type==='LineString'?[feature.geometry.coordinates]:feature.geometry.coordinates;
  assert(['Polygon','LineString'].includes(feature.geometry.type));
  for(const ring of rings){
    assert(ring.length>=2);
    for(const [lng,lat] of ring){assert(Number.isFinite(lng)&&Number.isFinite(lat));assert(lng>110&&lng<135&&lat>40&&lat<55);}
    if(feature.geometry.type==='Polygon')assert.deepEqual(ring[0],ring.at(-1),'Closed lake polygon');
  }
}
const source=readFileSync(new URL('../app/map-canvas.tsx',import.meta.url),'utf8');
assert.match(source,/\[detailed,setDetailed\]=useState\(false\)/,'No external tiles on initial load');
assert.match(source,/if\(!ready\|\|!detailed\|\|!map.current\|\|!lib.current\)return/);
assert.match(source,/tiles\.off\(\);tiles\.remove\(\)/,'Detach listeners and tiles when disabled');
assert.match(source,/clearTimeout\(timer\)/);
assert(source.includes("setTileStatus('slow')")&&source.includes("setTileStatus('error')"));
assert(source.includes('Natural Earth')&&source.includes('OpenStreetMap'));
assert(!source.includes("tiles.on('tileload'"),'An individual successful tile must not clear other failures');
console.log('PASS: 6 KB local physical context, valid lake/rivers, default no external tiles, detail opt-in, slow/error feedback and cleanup source guards. Not browser QA.');
