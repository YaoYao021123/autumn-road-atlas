import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { foliage,foliageForDay,foliageForPlace } from '../app/regional-foliage.ts';
assert.equal(Object.keys(foliage).length,4);
assert.deepEqual([1,2,3,4,5,6,7].map(day=>foliageForDay(day).kind),['poplar','birch','grass','birch','larch','larch','poplar']);
assert.equal(foliageForPlace('额尔古纳',3).kind,'birch');
assert.equal(foliageForPlace('满洲里',3).kind,'grass');
assert.equal(foliageForPlace('新巴尔虎左旗',4).kind,'grass');
assert.equal(foliageForPlace('伊尔施',4).kind,'larch');
assert.equal(foliageForPlace('长春西站',7).kind,'poplar');
assert.equal(foliageForDay(99).kind,'poplar');
let bytes=0;
for(const motif of Object.values(foliage)){
 const image=readFileSync(new URL(`../public${motif.image}`,import.meta.url));
 assert.equal(image.toString('ascii',8,12),'WEBP');assert(image.length<50000);bytes+=image.length;
 assert.equal(image.toString('ascii',12,16),'VP8X');assert(image[20]&0x10,'Retain alpha');
}
const read=path=>readFileSync(new URL('../app/'+path,import.meta.url),'utf8');
assert(read('page.tsx').includes('foliageForPlace(stop.name,dayId).image'));
assert(read('page.tsx').includes('foliageForDay(d.id).image'));
assert(read('page.tsx').includes('leaf-day-species'));
assert(read('map-canvas.tsx').includes('scenerySymbol(isWindow,ordinal,scene.day)'));
assert(read('road-scenery.tsx').includes('foliageForDay(scene.day).image'));
assert(read('autumn-atmosphere.tsx').includes('[enabled,day]'));
assert(!/\binfinite\b/.test(read('autumn.css')));
console.log(`PASS: 4 transparent regional motifs (${bytes} bytes); 7 day assignments, place-specific stops, map/list/ambient linkage, no continuous falling.`);
