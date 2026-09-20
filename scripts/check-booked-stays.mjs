import assert from 'node:assert/strict';
import {stays,stayUrl,accommodationTotal} from '../app/stays.ts';
assert.equal(stays.length,7);
assert.deepEqual(stays.map(s=>s.date),['09.26','09.27','09.28','09.29','09.30','10.01','10.02']);
assert.deepEqual(stays.map(s=>s.amount),[634,816,898,876,700,976,1304]);
assert.equal(accommodationTotal,6204);
assert.equal((accommodationTotal+4927)/4,2782.75);
for(const stay of stays){
  const url=new URL(stayUrl(stay));
  assert.equal(url.hostname,'m.ctrip.com');
  assert.equal(url.searchParams.get('hotelid'),String(stay.hotelId));
  assert.equal(url.searchParams.get('atime'),'2026'+stay.date.replace('.',''));
  assert.equal(url.searchParams.get('days'),'1');
  assert.equal([...url.searchParams].length,3,'No user tracking or booking identifiers');
  assert.equal(stay.breakfast,stay.id==='linyuan'?'无早':'每间双早');
}
assert.match(stays[4].note,/积分抵扣 ¥12，现金支付 ¥688/);
console.log('PASS: seven confirmed hotel dates, per-night two-room totals, four-person budget, breakfast exception, clean date-correct Ctrip links and separate points accounting.');
