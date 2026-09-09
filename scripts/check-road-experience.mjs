import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { decodeRoute } from '../app/route-codec.ts';

const read = async (path) => readFile(new URL(path, import.meta.url), 'utf8');
const data = JSON.parse(await read('../app/routes.generated.json'));
const definitions = JSON.parse(await read('../app/road-scenes.json'));
const tripSource = await read('../app/trip.ts');
const sceneSource = await read('../app/road-experience.ts');

function load(source, dependencies) {
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const result = { exports: {} };
  vm.runInNewContext(code, {
    exports: result.exports,
    module: result,
    URLSearchParams,
    require: (name) => {
      assert(Object.hasOwn(dependencies, name), `Unexpected runtime dependency: ${name}`);
      return dependencies[name];
    },
  });
  return result.exports;
}

const trip = load(tripSource, { './routes.compact.json':JSON.parse(await read('../app/routes.compact.json')), './route-codec':{decodeRoute} });
const api = load(sceneSource, { './road-scenes.json': definitions, './trip': trip });
const radians = Math.PI / 180;
function distanceKm(a, b) {
  const x = Math.sin((b[0] - a[0]) * radians / 2) ** 2
    + Math.cos(a[0] * radians) * Math.cos(b[0] * radians)
    * Math.sin((b[1] - a[1]) * radians / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, x)));
}
const key = (position) => position.join(',');
const original = JSON.stringify({ data, definitions });
assert.equal(definitions.length, 8);
assert.equal(new Set(definitions.map((scene) => scene.id)).size, 8);
assert.equal(definitions.filter((scene) => scene.kind === 'window').length, 6);
assert.equal(definitions.filter((scene) => scene.kind === 'parking').length, 1);
assert.equal(definitions.filter((scene) => scene.kind === 'transfer').length, 1);
assert.match(api.sceneKindLabels.window, /示意/);
for (const definition of definitions) {
  assert(definition.sources.length > 0);
  assert(definition.sources.every((source) => source.url !== 'https://mcp.map.baidu.com/'));
  assert.match(definition.provenance, /^定位：2026-09-09 百度/);
  assert.equal(definition.position.length, 2);
  assert.equal(definition.bd09.length, 2);
  assert(definition.position[0] > 40 && definition.position[0] < 55);
  assert(definition.position[1] > 110 && definition.position[1] < 130);
  for (const source of definition.sources) assert.equal(new URL(source.url).protocol, 'https:');
}

let maxSnapKm = 0;
const variantReport = [];
for (const endpoint of ['airport', 'west']) for (const overnight of [false, true]) {
  const days = trip.getDays(endpoint, overnight);
  const scenes = api.getRoadScenes(days);
  assert.equal(scenes.length, 8, `${endpoint}/${overnight}: a scene is missing or exceeds the 5 km route threshold`);
  const d6 = scenes.find((scene) => scene.id === 'g302-return-grassland');
  const expectedLeg = overnight ? 'arxan_songyuan' : endpoint === 'airport' ? 'arxan_longjia' : 'arxan_changchun_west';
  assert.equal(d6.legId, expectedLeg);
  variantReport.push(`${endpoint}/${overnight ? '松原' : '直返'} → ${d6.legId}`);
  for (const scene of scenes) {
    const day = days.find((candidate) => candidate.id === scene.day);
    assert(day.legs.includes(scene.legId));
    const leg = trip.segments[scene.legId];
    const definition = definitions.find((candidate) => candidate.id === scene.id);
    if (scene.kind === 'window') {
      assert.equal(Object.hasOwn(scene, 'navigationHref'), false, `${scene.id}: a window marker must not navigate to parking`);
      assert(leg.points.some((point) => key(point) === key(scene.position)), `${scene.id}: must snap to selected route`);
      const snapKm = distanceKm(definition.position, scene.position);
      assert(snapKm <= 5, `${scene.id}: source is ${snapKm.toFixed(3)} km from the selected route`);
      maxSnapKm = Math.max(maxSnapKm, snapKm);
      assert(scene.highlight.length >= 2, `${scene.id}: expected a useful corridor line`);
      const selectedIndex = leg.points.findIndex((point) => key(point) === key(scene.position));
      const startIndex = leg.points.findIndex((point) => key(point) === key(scene.highlight[0]));
      assert(startIndex >= 0 && startIndex <= selectedIndex);
      let before = 0;
      let after = 0;
      scene.highlight.forEach((point, index) => {
        assert.equal(key(point), key(leg.points[startIndex + index]), 'Highlight must follow a contiguous part of the actual selected leg');
        if (index === 0) return;
        const length = distanceKm(scene.highlight[index - 1], point);
        if (startIndex + index <= selectedIndex) before += length;
        else after += length;
      });
      assert(before <= 5.000001 && after <= 5.000001, `${scene.id}: highlight extends beyond the short corridor`);
      assert(before + after > 1, `${scene.id}: unexpectedly short highlight`);
    } else {
      assert.deepEqual(scene.position, leg.destination.position, `${scene.id}: parking must use its actual destination`);
      assert.deepEqual(scene.bd09, leg.destination.bd09);
      assert.deepEqual(definition.position, leg.destination.position, `${scene.id}: stored coordinates must preserve the validated anchor`);
      assert.equal(scene.navigationHref, trip.navigationUrl(leg));
      assert.equal(scene.highlight.length, 0);
      const url = new URL(scene.navigationHref);
      assert.equal(url.searchParams.get('coord_type'), 'bd09ll');
      assert(url.searchParams.get('destination').includes(`${leg.destination.bd09[1]},${leg.destination.bd09[0]}`));
    }
  }
  const parking = scenes.find((scene) => scene.kind === 'parking');
  const transfer = scenes.find((scene) => scene.kind === 'transfer');
  assert.equal(parking.legId, 'heishantou_186_parking');
  assert.equal(transfer.legId, 'iershi_park_parking');
  assert.notEqual(parking.navigationHref, transfer.navigationHref);
}

assert.equal(api.getRoadScenes([]).length, 0);
assert.equal(api.getRoadScenes(trip.getDays('airport', false).filter((day) => day.id === 5)).length, 2);
const offRoute = structuredClone(definitions);
offRoute[0].position = [0, 0];
const guarded = load(sceneSource, { './road-scenes.json': offRoute, './trip': trip });
assert.equal(guarded.getRoadScenes(trip.getDays('airport', false)).some((scene) => scene.id === offRoute[0].id), false,
  'An off-route point over 5 km away must be omitted, not fabricated on another road');
assert.equal(JSON.stringify({ data, definitions }), original, 'Pure lookup must not mutate source data or routes');
console.log(`PASS: 8 scenes, four route combinations, six non-navigable window markers, exact parking/transfer anchors, contiguous highlights ≤5 km each way; maximum source-to-route snap ${(maxSnapKm * 1000).toFixed(1)} m.`);
for (const variant of variantReport) console.log(`  ${variant}`);
console.log('PASS: off-route >5 km guard; empty/subset days; source provenance; no runtime gcoord dependency; no input mutation.');
