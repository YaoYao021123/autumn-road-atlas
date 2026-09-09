import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { encodeRoute, decodeRoute } from '../app/route-codec.ts';
const input=new URL('../app/routes.generated.json',import.meta.url);
const source=JSON.parse(readFileSync(input,'utf8'));
const segments=Object.fromEntries(Object.entries(source.segments).map(([id,segment])=>{
  const {points,...metadata}=segment;
  const path=encodeRoute(points);
  assert.deepEqual(decodeRoute(path),points,`${id}: compact encoding must preserve every point`);
  return [id,{...metadata,path}];
}));
const output=JSON.stringify({...source,encoding:'polyline6',segments})+'\n';
writeFileSync(new URL('../app/routes.compact.json',import.meta.url),output);
console.log(`Route payload: ${readFileSync(input).length} → ${Buffer.byteLength(output)} bytes; all original points preserved.`);
