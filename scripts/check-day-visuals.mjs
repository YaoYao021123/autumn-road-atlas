import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
const scenes=JSON.parse(await readFile(new URL('app/day-scenes.json',root),'utf8'));
assert.equal(scenes.length,7);
assert.equal(new Set(scenes.map(s=>s.image)).size,7,'Each day must have a distinct image');
for(let i=0;i<7;i++){
  const scene=scenes[i];
  assert.equal(scene.day,i+1);
  assert.equal(new URL(scene.image).protocol,'https:');
  assert.equal(new URL(scene.source).protocol,'https:');
  for(const field of ['title','alt','credit','dateLabel'])assert.ok(scene[field]);
  assert.match(scene.alt,/历史/);
}
assert.match(scenes[5].title,/阿尔山/,'Return day represents its departure, not an unconfirmed Songyuan waypoint');
assert.ok(scenes[3].licenseUrl&&scenes[3].author);
const source=await readFile(new URL('app/season-palette.ts',root),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const result={exports:{}};vm.runInNewContext(code,{exports:result.exports,module:result});
const {seasonPalette,leafVariables}=result.exports;
assert.equal(Object.keys(seasonPalette).length,7);
assert.equal(new Set(Object.values(seasonPalette).map(s=>s.hue)).size,7);
for(let day=1;day<=7;day++){
  assert.equal(leafVariables(day)['--leaf-hue'],`${seasonPalette[day].hue}deg`);
  assert.ok(seasonPalette[day].saturation>0&&seasonPalette[day].brightness>0);
  assert.ok(seasonPalette[day].hue<=10,'Keep the gold leaf texture out of green-shifted hues');
}
assert.ok(seasonPalette[6].hue>seasonPalette[5].hue,'Return geography must not imply ever-deepening autumn');
const page=await readFile(new URL('app/page.tsx',root),'utf8');
assert.ok(page.includes('DayLandscape key={dayScene.image} scene={dayScene}'));
assert.ok(!page.includes('imageFailed'));
assert.ok(page.includes('style={leafVariables(d.id) as CSSProperties}'));
assert.ok(page.includes('叶色为地域氛围示意，非今年实况'));
console.log('PASS: 7 distinct day photos with sources; keyed image-error isolation; 7 regional leaf tones; no unconfirmed return waypoint; clear historical/seasonal labels.');
