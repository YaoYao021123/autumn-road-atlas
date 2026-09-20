import {readFileSync,writeFileSync} from 'node:fs';
import gcoord from 'gcoord';
const data=JSON.parse(readFileSync(new URL('../data/hotel-routes.json',import.meta.url),'utf8'));
const path=new URL('../app/routes.generated.json',import.meta.url);
const output=JSON.parse(readFileSync(path,'utf8'));
const convert=([lng,lat])=>{const p=gcoord.transform([lng,lat],gcoord.BD09,gcoord.WGS84);return [Number(p[1].toFixed(6)),Number(p[0].toFixed(6))];};
const stop=(name,p)=>({name,bd09:[p.lng,p.lat],position:convert([p.lng,p.lat])});
for(const r of data.routes){
  const points=[];
  for(const s of r.steps){const pairs=s.path.split(';').filter(Boolean).map(p=>p.split(',').map(Number));for(let i=0;i<pairs.length;i++){const p=pairs[i],last=points.at(-1);if(p.length!==2||!p.every(Number.isFinite))throw new Error(r.id);if(!last||i===pairs.length-1||Math.hypot(p[0]-last[0],p[1]-last[1])>0.00045)points.push(p);}}
  if(points.length<2)throw new Error('Missing route '+r.id);
  output.segments[r.id]={id:r.id,origin:stop(r.originName,r.origin),destination:stop(r.destinationName,r.destination),km:r.distance/1000,minutes:r.duration/60,points:points.map(convert),queriedAt:data.queriedAt};
}
output.hotelRoutesQueriedAt=data.queriedAt;
writeFileSync(path,JSON.stringify(output));
console.log('Prepared '+data.routes.length+' hotel route segments; previous scenic corridor data retained.');
