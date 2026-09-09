import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const content=JSON.parse(readFileSync(new URL('app/literary-scenes.json',root),'utf8'));
assert.equal(content.author,'迟子建');
assert.equal(content.quote,'我是雨和雪的老熟人了，我有九十岁了。');
assert.ok([...content.quote].length<=25,'Single short quotation budget');
assert.equal(new URL(content.quoteSource).hostname,'www.chinawriter.com.cn');
assert.equal(content.scenes.length,3);
assert.equal(new Set(content.scenes.map(scene=>scene.id)).size,3);
for(const scene of content.scenes){
  assert.match(scene.image,/^\/literary-[a-z]+\.png$/);
  assert.ok(scene.alt.includes('原创文学氛围图'));
  assert.ok(Number.isInteger(scene.routeDay)&&scene.routeDay>=1&&scene.routeDay<=7);
  assert.equal(scene.lines.length,2);
  const bytes=readFileSync(new URL(`public${scene.image}`,root));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),1536);
  assert.equal(bytes.readUInt32BE(20),1024);
}
const branch=readFileSync(new URL('public/timeline-birch.png',root));
assert.equal(branch.readUInt32BE(16),2172);
assert.equal(branch.readUInt32BE(20),724);
const component=readFileSync(new URL('app/literary-interlude.tsx',root),'utf8');
assert.ok(component.includes('原创旁白')&&component.includes('非沿途实景'));
assert.ok(component.includes('TabsContent')&&component.includes('onRouteSelect(scene.routeDay)'));
assert.ok(component.includes('observer.disconnect()'));
for(const file of ['literary.css','birch-timeline.css']){
  const css=readFileSync(new URL(`app/${file}`,root),'utf8');
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(!/\binfinite\b/.test(css));
}
console.log('PASS: sourced short quotation; 3 scene PNGs; birch connector; route targets; disclosure and reduced-motion source checks.');
