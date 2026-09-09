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
assert.match(source,/\[detailed,setDetailed\]=useState\(true\)/,'Detailed roads and place names by default');
assert.match(source,/detectRetina:true,updateWhenIdle:true/,'High-DPI tiles; avoid requests during continuous panning');
assert.match(source,/if\(!ready\|\|!detailed\|\|!map.current\|\|!lib.current\)return/);
assert.match(source,/tiles\.off\(\);tiles\.remove\(\)/,'Detach listeners and tiles when disabled');
assert.match(source,/clearTimeout\(timer\)/);
assert(source.includes("setTileStatus('slow')")&&source.includes("setTileStatus('error')"));
assert(source.includes('Natural Earth')&&source.includes('OpenStreetMap'));
assert(!source.includes("tiles.on('tileload'"),'An individual successful tile must not clear other failures');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert(css.includes('.leaflet-tile-pane { filter:none; opacity:1; }'),'Do not wash out map detail with a decorative filter');
assert(css.includes('max-width:1480px'),'Bound the map and imagery on ultrawide screens');
assert(source.includes("color:'#fff',weight:12,opacity:1"));
assert(source.includes("color:'#164695',weight:9,opacity:1"));
assert(source.includes("color:'#2163d6',weight:6,opacity:1"));
assert(source.includes("color:'#8291a5',weight:6"));
assert(source.includes("pane:'scenic-corridor'")&&source.includes("scenicPane.style.zIndex='350'"),'Scenery must not obscure route strokes');
assert(source.includes('非实时路况'));
console.log('PASS: detailed high-DPI map by default, unfiltered labels, valid 6 KB fallback, slow/error feedback and layer cleanup source guards. Not browser QA.');
