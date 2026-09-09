// Original botanical motifs, not species-identification plates, city emblems,
// field observations or forecasts. A day represents the landscape along its road.
export const foliage={
  poplar:{kind:'poplar',label:'杨叶',image:'/leaf-poplar-v1.webp',landscape:'平原与城中的杨树'},
  birch:{kind:'birch',label:'白桦叶',image:'/autumn-birch-384.webp',landscape:'林区与河谷的白桦'},
  grass:{kind:'grass',label:'草原秋草',image:'/leaf-grass-v1.webp',landscape:'呼伦贝尔的细草与草穗'},
  larch:{kind:'larch',label:'落叶松针',image:'/leaf-larch-v1.webp',landscape:'阿尔山的落叶松林'},
} as const;
const days:Record<number,keyof typeof foliage>={1:'poplar',2:'birch',3:'grass',4:'birch',5:'larch',6:'larch',7:'poplar'};
export const foliageForDay=(day:number)=>foliage[days[day]??'poplar'];
export function foliageForPlace(name:string,day:number){
  if(/额尔古纳/.test(name))return foliage.birch;
  if(/伊尔施|阿尔山|森林公园/.test(name))return foliage.larch;
  if(/海拉尔|满洲里|新巴尔虎|黑山头/.test(name))return foliage.grass;
  if(/长春|龙嘉|松原|齐齐哈尔/.test(name))return foliage.poplar;
  return foliageForDay(day);
}
