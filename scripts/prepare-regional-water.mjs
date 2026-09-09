// Natural Earth 1:50m public-domain physical data. No tiles are downloaded.
// Run with paths to ne_50m_rivers_lake_centerlines.geojson and ne_50m_lakes.geojson.
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const [riverFile,lakeFile]=process.argv.slice(2);
assert(riverFile&&lakeFile,'Supply both official Natural Earth GeoJSON files');
const bbox=[115,42,128,52.5];
const inside=([x,y])=>x>=bbox[0]&&x<=bbox[2]&&y>=bbox[1]&&y<=bbox[3];
const rounded=p=>p.map(v=>Math.round(v*1e4)/1e4);
const features=[];
for(const feature of JSON.parse(readFileSync(riverFile,'utf8')).features){
  const lines=feature.geometry.type==='LineString'?[feature.geometry.coordinates]:feature.geometry.coordinates;
  for(const line of lines){
    let part=[];
    const flush=()=>{if(part.length>1)features.push({type:'Feature',properties:{kind:'river',name:feature.properties.name_en||feature.properties.name||''},geometry:{type:'LineString',coordinates:part}});part=[];};
    for(const point of line){if(inside(point))part.push(rounded(point));else flush();}
    flush();
  }
}
for(const feature of JSON.parse(readFileSync(lakeFile,'utf8')).features){
  const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
  for(const polygon of polygons){
    if(!polygon[0].some(inside))continue;
    features.push({type:'Feature',properties:{kind:'lake',name:feature.properties.name_zh||feature.properties.name_en||feature.properties.name||''},geometry:{type:'Polygon',coordinates:polygon.map(ring=>ring.map(rounded))}});
  }
}
assert(features.some(f=>f.properties.kind==='lake')&&features.some(f=>f.properties.kind==='river'));
const output=JSON.stringify({type:'FeatureCollection',source:'Natural Earth 1:50m · public domain · physical water only',bbox,features})+'\n';
writeFileSync(new URL('../app/regional-water.generated.json',import.meta.url),output);
console.log(`Regional water: ${features.length} features, ${Buffer.byteLength(output)} bytes. Generalized context, not navigation.`);
