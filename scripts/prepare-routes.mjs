import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import gcoord from 'gcoord';

// Derived public route data only: no MCP configuration, credentials or raw POI records.
const input = new URL('../../data/baidu_snapshots/', import.meta.url);
const names = {
  longjia_qiqihar:['龙嘉机场 T2','齐齐哈尔'], changchun_west_qiqihar:['长春西站','齐齐哈尔'],
  qiqihar_hailaer:['齐齐哈尔','海拉尔'], hailaer_erguna:['海拉尔','额尔古纳'],
  erguna_heishantou:['额尔古纳','黑山头'], heishantou_186_parking:['黑山头','186 彩带河停车入口'],
  '186_parking_manzhouli':['186 彩带河停车入口','满洲里'],
  manzhouli_right_banner:['满洲里','新巴尔虎右旗'], right_left_banner:['新巴尔虎右旗','新巴尔虎左旗'],
  left_banner_iershi:['新巴尔虎左旗','伊尔施'], iershi_park_parking:['伊尔施','公园游客中心停车入口'],
  park_parking_city:['公园游客中心停车入口','阿尔山市区'],
  arxan_longjia:['阿尔山市区','龙嘉机场 T2'], arxan_changchun_west:['阿尔山市区','长春西站'],
  arxan_songyuan:['阿尔山市区','松原'], songyuan_longjia:['松原','龙嘉机场 T2'],
  songyuan_changchun_west:['松原','长春西站'],
};
const convert = ([lng,lat]) => {
  const result=gcoord.transform([lng,lat],gcoord.BD09,gcoord.WGS84);
  return [Number(result[1].toFixed(6)),Number(result[0].toFixed(6))];
};
const point = (name,p) => ({name,bd09:[p.lng,p.lat],position:convert([p.lng,p.lat])});
const segments={};
for (const [id,labels] of Object.entries(names)) {
  const snapshot=JSON.parse(await readFile(new URL(id+'.json',input),'utf8'));
  if(snapshot.response.status!==0)throw new Error('Invalid snapshot: '+id);
  const body=snapshot.response.result, route=body.routes[0];
  let points=[];
  for(const step of route.steps) {
    const pairs=step.path.split(';').filter(Boolean).map(p=>p.split(',').map(Number));
    for(let i=0;i<pairs.length;i++) {
      const p=pairs[i],last=points.at(-1);
      if(p.length!==2||!p.every(Number.isFinite))throw new Error('Invalid point: '+id);
      // Keep every step endpoint and enough intermediate detail for a travel-scale map.
      if(!last||i===pairs.length-1||Math.hypot(p[0]-last[0],p[1]-last[1])>0.00045)points.push(p);
    }
  }
  if(points.length<2)throw new Error('Missing driving geometry: '+id);
  segments[id]={id,origin:point(labels[0],body.origin),destination:point(labels[1],body.destination),
    km:route.distance/1000,minutes:route.duration/60,points:points.map(convert)};
}
const output=new URL('../app/routes.generated.json',import.meta.url);
await mkdir(new URL('../app/',import.meta.url),{recursive:true});
await writeFile(output,JSON.stringify({source:'Baidu Maps MCP',queriedAt:'2026-09-09',displayCoordinates:'WGS84 (converted from BD09 with gcoord)',navigationCoordinates:'BD09',segments}));
console.log(`Prepared ${Object.keys(segments).length} credential-free route segments → ${fileURLToPath(output)}`);
